import { Card } from '@/components/common/Card'
import { ProgressBar } from '@/components/common/ProgressBar'
import { Icon } from '@/components/icons/Icon'
import { LessonNode } from '@/components/map/LessonNode'
import { getLessonStatus, getNextLesson, getStageStats } from '@/engine/progress'
import type { LessonProgress, Stage } from '@/types/course'
import { cn } from '@/utils/cn'

export interface StageIslandProps {
  stage: Stage
  progress: Record<string, LessonProgress>
  onSelectLesson?: (lessonId: string) => void
}

/** 阶段岛屿：已开放的阶段显示关卡按钮，未开放的阶段只用一行占位，减少视觉噪音。 */
export function StageIsland({ stage, progress, onSelectLesson }: StageIslandProps) {
  const stats = getStageStats(stage, progress)

  if (!stage.available) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-kid border-2 border-dashed border-brand-200 bg-white/50 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl grayscale">{stage.emoji}</span>
          <span className="text-lg font-extrabold text-ink-soft">
            第 {stage.id} 岛 · {stage.title}
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-faint"><Icon name="lock" size={14} /> 还没开放</span>
      </div>
    )
  }

  const nextLesson = getNextLesson([stage], progress)

  return (
    <Card className="space-y-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-kid bg-gradient-to-br text-3xl',
              stage.gradient,
            )}
          >
            {stage.emoji}
          </span>
          <div className="leading-tight">
            <div className="font-display text-xl font-extrabold">
              第 {stage.id} 岛 · {stage.title}
            </div>
            <div className="text-sm font-bold text-ink-soft">
              已通关 {stats.completed}/{stats.total}
            </div>
          </div>
        </div>

        <div className="min-w-[140px] space-y-1">
          <div className="flex items-center justify-end gap-1.5 text-sm font-extrabold text-ember-600"><Icon name="star" size={14} filled /> <span className="font-mono tabular-nums">{stats.totalStars}</span></div>
          <ProgressBar value={stats.ratio} barClassName={cn('bg-gradient-to-r', stage.gradient)} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {stage.lessons.map((lesson, index) => (
          <LessonNode
            key={lesson.id}
            lesson={lesson}
            status={getLessonStatus(stage, index, progress)}
            stars={progress[lesson.id]?.stars ?? 0}
            isNext={nextLesson?.id === lesson.id}
            onSelect={onSelectLesson ? () => onSelectLesson(lesson.id) : undefined}
          />
        ))}
      </div>
    </Card>
  )
}