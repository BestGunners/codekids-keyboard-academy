import { useChildStore, type ChildProfile } from '@/store/childStore'
import { useProgressStore, type ChildProgress } from '@/store/progressStore'
import type { LessonProgress } from '@/types/course'

const EMPTY_LESSONS: Record<string, LessonProgress> = {}

const EMPTY_CHILD_PROGRESS: ChildProgress = {
  lessons: EMPTY_LESSONS,
  streak: { current: 0, longest: 0, lastActiveDate: null },
  badges: [],
}

/** 当前登录的孩子档案 */
export function useCurrentChild(): ChildProfile | null {
  return useChildStore((state) => {
    if (!state.currentChildId) return null
    return state.profiles.find((profile) => profile.id === state.currentChildId) ?? null
  })
}

/** 当前孩子的学习进度（稳定引用，避免无数据时反复重渲染） */
export function useCurrentProgress(): ChildProgress {
  const child = useCurrentChild()
  return useProgressStore((state) =>
    child ? (state.byChild[child.id] ?? EMPTY_CHILD_PROGRESS) : EMPTY_CHILD_PROGRESS,
  )
}

/** 当前孩子的关卡记录 */
export function useLessonProgress(): Record<string, LessonProgress> {
  return useCurrentProgress().lessons
}
