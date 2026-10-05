import { StarRating } from '@/components/common/StarRating'
import { Icon } from '@/components/icons/Icon'
import type { LessonStatus } from '@/engine/progress'
import type { Lesson } from '@/types/course'
import { cn } from '@/utils/cn'

export interface LessonNodeProps {
  lesson: Lesson
  status: LessonStatus
  stars: number
  isNext?: boolean
  onSelect?: () => void
}

/** 关卡节点：状态用颜色和图标表达，不堆文字。 */
export function LessonNode({ lesson, status, stars, isNext = false, onSelect }: LessonNodeProps) {
  const locked = status === 'locked'
  const done = status === 'completed'

  return (
    <button
      type="button"
      disabled={locked}
      onClick={onSelect}
      aria-label={`第 ${lesson.order} 关 ${lesson.title}`}
      className={cn(
        'relative flex w-full flex-col items-center gap-1.5 rounded-kid border bg-white px-2 py-3 transition',
        locked
          ? 'cursor-not-allowed border-surface-line opacity-65'
          : 'border-surface-line hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-pop',
        isNext && 'anim-float border-brand-400 shadow-glow',
      )}
    >
      <span
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-xl border font-mono text-lg font-extrabold',
          locked && 'border-surface-line bg-surface-muted text-ink-faint',
          !locked && !done && 'border-brand-200 bg-brand-50 text-brand-700',
          done && 'border-mint-300 bg-mint-50 text-mint-600',
        )}
      >
        {locked ? (
          <Icon name="lock" size={18} />
        ) : lesson.boss ? (
          <Icon name="crown" size={20} className="text-ember-500" />
        ) : (
          lesson.order
        )}
      </span>

      <span className="w-full truncate text-center text-xs font-extrabold text-ink-soft">
        {lesson.title}
      </span>

      {locked ? (
        lesson.ready ? (
          <span className="text-[10px] font-bold text-ink-faint">完成前一关解锁</span>
        ) : (
          <span className="text-[10px] font-bold text-ink-faint">马上就来</span>
        )
      ) : (
        <StarRating stars={stars} size="sm" />
      )}
    </button>
  )
}