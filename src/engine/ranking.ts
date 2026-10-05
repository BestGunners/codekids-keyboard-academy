import type { Stage } from '@/types/course'
import type { ChildProfile } from '@/store/childStore'
import type { ChildProgress } from '@/store/progressStore'
// 这两个模块保持「相对路径 + 扩展名」的写法，使 Node 可以直接执行本文件做自测
import { getTotalStars } from './progress.ts'
import { levelFromXp, xpFromStars } from './rewards.ts'

export type RankingMetric = 'xp' | 'speed' | 'streak'

export interface RankEntry {
  childId: string
  nickname: string
  avatarId: string
  stars: number
  xp: number
  level: number
  /** 个人最快速度（跨全部关卡取最好成绩） */
  bestWpm: number
  streakDays: number
}

/** 把本机所有小朋友的进度整理成可排序的榜单数据。 */
export function buildRankEntries(
  children: ChildProfile[],
  progressByChild: Record<string, ChildProgress>,
  stages: Stage[],
): RankEntry[] {
  return children.map((child) => {
    const progress = progressByChild[child.id]
    const lessons = progress?.lessons ?? {}
    const stars = getTotalStars(stages, lessons)
    const xp = xpFromStars(stars)
    const bestWpm = Object.values(lessons).reduce(
      (max, item) => Math.max(max, item.bestWpm ?? 0),
      0,
    )

    return {
      childId: child.id,
      nickname: child.nickname,
      avatarId: child.avatarId,
      stars,
      xp,
      level: levelFromXp(xp),
      bestWpm: Math.round(bestWpm),
      streakDays: progress?.streak.current ?? 0,
    }
  })
}

export function metricOf(entry: RankEntry, metric: RankingMetric): number {
  if (metric === 'speed') return entry.bestWpm
  if (metric === 'streak') return entry.streakDays
  return entry.xp
}

/** 按指定维度降序排序；同分时按昵称稳定排序，避免名次来回跳动。 */
export function rankBy(entries: RankEntry[], metric: RankingMetric): RankEntry[] {
  return [...entries].sort((a, b) => {
    const diff = metricOf(b, metric) - metricOf(a, metric)
    if (diff !== 0) return diff
    return a.nickname.localeCompare(b.nickname, 'zh-Hans-CN')
  })
}

export function medalFor(index: number): string | null {
  return ['🥇', '🥈', '🥉'][index] ?? null
}
