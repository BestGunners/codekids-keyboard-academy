import type { Lesson, LessonProgress, Stage } from '@/types/course'

export type LessonStatus = 'locked' | 'unlocked' | 'completed'

/** 每个岛的前 3 关直接开放，孩子可以任意顺序开始 */
export const FREE_START_LESSONS = 3

/**
 * 岛屿的显示编号：按它在课程列表里的先后从 1 数。
 * 内部 id 只是稳定标识（例如新板块用 id 7 排在最前面），不参与编号。
 */
export function stageNumber(stages: Stage[], stageId: number): number {
  const index = stages.findIndex((stage) => stage.id === stageId)
  return index >= 0 ? index + 1 : stageId
}


export function countCompletedLessons(
  stage: Stage,
  progress: Record<string, LessonProgress>,
): number {
  return stage.lessons.filter((lesson) => (progress[lesson.id]?.stars ?? 0) > 0).length
}


/** 这个岛是否已经全部通关 */
export function isStageCompleted(stage: Stage, progress: Record<string, LessonProgress>): boolean {
  return stage.lessons.every((lesson) => (progress[lesson.id]?.stars ?? 0) > 0)
}

/**
 * 解锁规则：
 * 1. 每个岛一开始只开放前 3 关，孩子可以自己挑着玩；
 * 2. 通过前 3 关后，第 4 关开启；
 * 3. 之后每通过一关，就开启下一关（严格按顺序）。
 * 注意：内容还没做好的关卡（ready 为 false）始终保持锁定。
 */
export function getLessonStatus(
  stage: Stage,
  lessonIndex: number,
  progress: Record<string, LessonProgress>,
): LessonStatus {
  if (!stage.available) return 'locked'

  const lesson = stage.lessons[lessonIndex]
  if (!lesson) return 'locked'

  const record = progress[lesson.id]
  if (record && record.stars > 0) return 'completed'

  if (!lesson.ready) return 'locked'

  // 每个岛的前 3 关直接开放
  if (lessonIndex < FREE_START_LESSONS) return 'unlocked'

  // 第 4 关起：每过一关就开下一关
  const previous = stage.lessons[lessonIndex - 1]
  return (progress[previous.id]?.stars ?? 0) > 0 ? 'unlocked' : 'locked'
}

export function getStageStats(stage: Stage, progress: Record<string, LessonProgress>) {
  const totalStars = stage.lessons.reduce(
    (sum, lesson) => sum + (progress[lesson.id]?.stars ?? 0),
    0,
  )
  const completed = countCompletedLessons(stage, progress)

  return {
    totalStars,
    maxStars: stage.lessons.length * 3,
    completed,
    total: stage.lessons.length,
    ratio: stage.lessons.length === 0 ? 0 : completed / stage.lessons.length,
    allDone: completed === stage.lessons.length && stage.lessons.length > 0,
  }
}

/** 总星星数：用于首页、地图头部与排行榜。 */
export function getTotalStars(stages: Stage[], progress: Record<string, LessonProgress>): number {
  return stages.reduce((sum, stage) => sum + getStageStats(stage, progress).totalStars, 0)
}

interface LessonLocation {
  stageIndex: number
  lessonIndex: number
}

export function findLessonLocation(stages: Stage[], lessonId: string): LessonLocation | null {
  for (let stageIndex = 0; stageIndex < stages.length; stageIndex += 1) {
    const lessonIndex = stages[stageIndex].lessons.findIndex((lesson) => lesson.id === lessonId)
    if (lessonIndex >= 0) return { stageIndex, lessonIndex }
  }
  return null
}

/**
 * 「继续闯关」的推荐关卡：全局最早一个「已解锁但还没通关」的关卡。
 * 用于地图页与首页的大按钮。
 */
export function getNextLesson(
  stages: Stage[],
  progress: Record<string, LessonProgress>,
): Lesson | null {
  for (const stage of stages) {
    if (!stage.available) continue
    for (let index = 0; index < stage.lessons.length; index += 1) {
      if (getLessonStatus(stage, index, progress) === 'unlocked') {
        return stage.lessons[index] ?? null
      }
    }
  }
  return null
}

/**
 * 「下一关」的关卡：始终跟着当前关卡往后走，而不是回到最早没通关的第一关。
 * - 同岛有下一关，并且已经解锁 → 就是它；
 * - 这已经是本岛最后一关且本岛全部通关 → 去下一个岛的第一关；
 * - 否则返回 null（按钮隐藏，避免把孩子弹回很早的关卡）。
 */
export function getLessonAfter(
  stages: Stage[],
  lessonId: string,
  progress: Record<string, LessonProgress>,
): Lesson | null {
  const location = findLessonLocation(stages, lessonId)
  if (!location) return null

  const stage = stages[location.stageIndex]
  const nextIndex = location.lessonIndex + 1
  const next = stage.lessons[nextIndex]

  if (next && getLessonStatus(stage, nextIndex, progress) !== 'locked') return next

  if (isStageCompleted(stage, progress)) {
    for (let stageIndex = location.stageIndex + 1; stageIndex < stages.length; stageIndex += 1) {
      const candidate = stages[stageIndex]
      if (getLessonStatus(candidate, 0, progress) !== 'locked') {
        return candidate.lessons[0] ?? null
      }
    }
  }

  return null
}

export function findLesson(stages: Stage[], lessonId: string): Lesson | null {
  for (const stage of stages) {
    const found = stage.lessons.find((lesson) => lesson.id === lessonId)
    if (found) return found
  }
  return null
}