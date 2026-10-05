import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STAGES } from '@/data/courses'
import { getTotalStars } from '@/engine/progress'
import type { LessonProgress } from '@/types/course'
import type { AttemptSummary } from '@/types/typing'

export interface StreakRecord {
  current: number
  longest: number
  lastActiveDate: string | null
}

export interface ChildProgress {
  lessons: Record<string, LessonProgress>
  streak: StreakRecord
  badges: string[]
}

interface ProgressState {
  byChild: Record<string, ChildProgress>
  recordAttempt: (
    childId: string,
    lessonId: string,
    summary: AttemptSummary,
  ) => { newBadges: string[]; progress: LessonProgress }
  getChildProgress: (childId: string) => ChildProgress
  resetChild: (childId: string) => void
}

function todayKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function diffInDays(fromKey: string, toKey: string): number {
  const from = new Date(`${fromKey}T00:00:00`)
  const to = new Date(`${toKey}T00:00:00`)
  return Math.round((to.getTime() - from.getTime()) / 86_400_000)
}

function emptyProgress(): ChildProgress {
  return {
    lessons: {},
    streak: { current: 0, longest: 0, lastActiveDate: null },
    badges: [],
  }
}

function nextStreak(streak: StreakRecord, today: string): StreakRecord {
  if (streak.lastActiveDate === today) return streak

  if (!streak.lastActiveDate) {
    return { current: 1, longest: Math.max(streak.longest, 1), lastActiveDate: today }
  }

  const gap = diffInDays(streak.lastActiveDate, today)
  // 断签保护：隔一天仍算连续（儿童产品最重要的留存保护）
  const current = gap <= 2 ? streak.current + 1 : 1

  return {
    current,
    longest: Math.max(streak.longest, current),
    lastActiveDate: today,
  }
}

/** 根据当前进度评估可以颁发的徽章（纯规则，后续可改为数据驱动）。 */
function evaluateBadges(params: {
  progress: Record<string, LessonProgress>
  streak: StreakRecord
  summary: AttemptSummary
  attemptsForLesson: number
}): string[] {
  const { progress, streak, summary, attemptsForLesson } = params
  const totalStars = getTotalStars(STAGES, progress)
  const earned: string[] = []

  earned.push('first-star')

  const stageOne = STAGES[0]
  const stageOneDone = stageOne.lessons.filter((lesson) => (progress[lesson.id]?.stars ?? 0) > 0).length
  if (stageOneDone >= 6) earned.push('home-row')
  if (stageOneDone === stageOne.lessons.length) earned.push('stage-1-clear')

  if (summary.errorCount === 0 && summary.accuracy >= 0.99) earned.push('perfect-clear')
  if (summary.wpm >= 10) earned.push('speed-10')
  if (summary.wpm >= 20) earned.push('speed-20')
  if (totalStars >= 10) earned.push('ten-stars')
  if (totalStars >= 30) earned.push('thirty-stars')
  if (streak.current >= 3) earned.push('streak-3')
  if (streak.current >= 7) earned.push('streak-7')
  if (attemptsForLesson >= 3) earned.push('never-give-up')

  return earned
}

/**
 * 学习进度（MVP 本地版）：
 * 记录星级、最佳成绩、连续天数与徽章；后续接入后端时替换持久化层即可。
 */
export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      byChild: {},
      getChildProgress: (childId) => get().byChild[childId] ?? emptyProgress(),
      resetChild: (childId) =>
        set((state) => ({
          byChild: { ...state.byChild, [childId]: emptyProgress() },
        })),
      recordAttempt: (childId, lessonId, summary) => {
        const current = get().byChild[childId] ?? emptyProgress()
        const previous = current.lessons[lessonId]
        const today = todayKey()

        const nextLessonProgress: LessonProgress = {
          stars: Math.max(previous?.stars ?? 0, summary.stars),
          bestWpm: Math.max(previous?.bestWpm ?? 0, summary.wpm),
          bestAccuracy: Math.max(previous?.bestAccuracy ?? 0, summary.accuracy),
          attempts: (previous?.attempts ?? 0) + 1,
          completedAt: today,
        }

        const lessons = { ...current.lessons, [lessonId]: nextLessonProgress }
        const streak = nextStreak(current.streak, today)
        const candidates = evaluateBadges({
          progress: lessons,
          streak,
          summary,
          attemptsForLesson: nextLessonProgress.attempts,
        })
        const newBadges = candidates.filter((badge) => !current.badges.includes(badge))

        set((state) => ({
          byChild: {
            ...state.byChild,
            [childId]: {
              lessons,
              streak,
              badges: [...current.badges, ...newBadges],
            },
          },
        }))

        return { newBadges, progress: nextLessonProgress }
      },
    }),
    { name: 'codekids.progress' },
  ),
)
