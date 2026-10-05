import { useEffect, useState } from 'react'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { ProgressBar } from '@/components/common/ProgressBar'
import { Icon } from '@/components/icons/Icon'
import { Confetti } from '@/components/fx/Confetti'
import { Mascot } from '@/components/mascot/Mascot'
import { getBadge } from '@/data/badges'
import { sfx } from '@/engine/sfx'
import type { Lesson } from '@/types/course'
import type { AttemptSummary } from '@/types/typing'
import { cn } from '@/utils/cn'

export interface TypingResultProps {
  open: boolean
  lesson: Lesson
  summary: AttemptSummary
  newBadgeIds: string[]
  level: number
  xpRatio: number
  nextLesson?: { id: string; title: string } | null
  onNextLevel?: () => void
  onRetry: () => void
  onBackToMap: () => void
  /** 编程关的程序是否跑对 */
  codePassed?: boolean
}

/**
 * 过关结算：礼花 + 星星逐个点亮 + 能量条增长，全部是鼓励，没有一句批评。
 * 快捷键：空格 / 回车 / N 直接进入下一关，Esc 回地图（弹出 0.7 秒后才生效，避免手上还按着键）。
 */
export function TypingResult({
  open,
  lesson,
  summary,
  newBadgeIds,
  level,
  xpRatio,
  nextLesson,
  onNextLevel,
  onRetry,
  onBackToMap,
  codePassed = false,
}: TypingResultProps) {
  const [visibleStars, setVisibleStars] = useState(0)
  const [confetti, setConfetti] = useState(false)
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    if (!open) {
      setVisibleStars(0)
      setConfetti(false)
      return undefined
    }

    sfx.fanfare()
    setConfetti(true)

    const timers = Array.from({ length: Math.max(summary.stars, 1) }, (_, index) =>
      window.setTimeout(() => {
        setVisibleStars(index + 1)
        sfx.star(index)
      }, 420 + index * 360),
    )
    const hideConfetti = window.setTimeout(() => setConfetti(false), 2800)

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      window.clearTimeout(hideConfetti)
    }
  }, [open, summary.stars])

  // 稍等一下再接受快捷键，避免刚敲完最后一键就立刻跳走
  useEffect(() => {
    if (!open) {
      setArmed(false)
      return undefined
    }
    const timer = window.setTimeout(() => setArmed(true), 700)
    return () => window.clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!open || !armed) return undefined

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        sfx.tap()
        onBackToMap()
        return
      }

      const isNextKey =
        event.key === ' ' || event.key === 'Enter' || event.key === 'n' || event.key === 'N'
      if (!isNextKey) return

      event.preventDefault()
      sfx.tap()
      if (nextLesson && onNextLevel) {
        onNextLevel()
      } else {
        onBackToMap()
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, armed, nextLesson, onNextLevel, onBackToMap])

  const cheer = summary.stars >= 3 ? '完美通关！' : summary.stars === 2 ? '好棒！' : '过关啦！'

  return (
    <>
      <Confetti active={confetti} />
      <Modal open={open}>
        <div className="space-y-5 text-center">
          <Mascot mood="cheer" size={92} className="mx-auto" />

          <div className="space-y-1">
            <div className="text-xs font-extrabold text-ink-soft">
              第 {lesson.stageId} 岛 · 第 {lesson.order} 关
            </div>
            <div className="font-display text-2xl font-extrabold text-brand-700">{cheer}</div>
            <div className="flex justify-center gap-2 pt-1">
              {[0, 1, 2].map((index) => (
                <Icon
                  key={index}
                  name="star"
                  size={44}
                  filled={index < visibleStars}
                  className={cn(
                    index < visibleStars ? 'anim-star-pop text-ember-500' : 'text-surface-line',
                  )}
                />
              ))}
            </div>
          </div>

          {codePassed ? (
            <div className="anim-pop-in inline-flex items-center gap-2 rounded-xl bg-mint-50 px-4 py-2 text-sm font-extrabold text-mint-600">
              <Icon name="check" size={16} /> 程序也运行通过啦
            </div>
          ) : null}

          <div className="flex items-center justify-center gap-3">
            <div className="rounded-2xl bg-brand-50 px-4 py-2">
              <div className="text-[11px] font-bold text-ink-soft">速度</div>
              <div className="text-xl font-extrabold text-brand-700">
                {summary.wpm}
                <span className="ml-0.5 text-xs">词/分</span>
              </div>
            </div>
            <div className="rounded-2xl bg-[#e8f8ee] px-4 py-2">
              <div className="text-[11px] font-bold text-ink-soft">准确</div>
              <div className="text-xl font-extrabold text-[#2f9d63]">
                {Math.round(summary.accuracy * 100)}%
              </div>
            </div>
            <div className="rounded-2xl bg-[#fff3e2] px-4 py-2">
              <div className="text-[11px] font-bold text-ink-soft">能量</div>
              <div className="flex items-center justify-center gap-1 font-mono text-xl font-extrabold text-ember-600">
                <Icon name="sparkle" size={14} />+{summary.stars * 10}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-extrabold text-ink-soft">
              <span>等级{level}</span>
              <span>{Math.round(xpRatio * 100)}%</span>
            </div>
            <ProgressBar value={xpRatio} barClassName="anim-progress-shine bg-[#ffd95c]" />
          </div>

          {newBadgeIds.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-2">
              {newBadgeIds.map((id) => {
                const badge = getBadge(id)
                if (!badge) return null
                return (
                  <span
                    key={id}
                    className="anim-pop-in flex items-center gap-2 rounded-2xl bg-[#f2edff] px-3 py-1.5 text-sm font-extrabold text-[#5b45a8]"
                  >
                    <span className="text-xl">{badge.emoji}</span>
                    {badge.title}
                  </span>
                )
              })}
            </div>
          ) : null}

          {summary.weakKeys.length > 0 ? (
            <div className="space-y-1 rounded-2xl bg-brand-50 px-4 py-3">
              <div className="text-xs font-extrabold text-ink-soft">下次可以再练练</div>
              <div className="flex flex-wrap justify-center gap-2">
                {summary.weakKeys.slice(0, 4).map((item) => (
                  <span
                    key={item.char}
                    className="rounded-xl bg-white px-3 py-1 font-mono text-base font-extrabold text-brand-700"
                  >
                    {item.char === ' ' ? '空格' : item.char}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#e8f8ee] px-4 py-2 text-sm font-extrabold text-[#2f9d63]">
              一个键都没错，太厉害啦！
            </div>
          )}

          <div className="space-y-3">
            <div className="flex flex-wrap justify-center gap-3">
              {nextLesson && onNextLevel ? (
                <Button
                  size="lg"
                  onClick={() => {
                    onNextLevel()
                  }}
                >
                  下一关 <Icon name="chevronRight" size={16} /><span className="ml-1 rounded-lg border-2 border-white/70 bg-white/25 px-2 py-0.5 text-sm font-extrabold">空格</span>
                </Button>
              ) : null}
              <Button
                variant="secondary"
                onClick={() => {
                  onRetry()
                }}
              >
                <Icon name="refresh" size={16} /> 再练一次
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  onBackToMap()
                }}
              >
                回地图<span className="ml-1 rounded-lg border-2 border-brand-200 bg-white px-2 py-0.5 text-[11px] font-extrabold text-ink-soft">Esc</span>
              </Button>
            </div>

            <p className="text-xs font-bold text-ink-soft">
              {nextLesson ? '按空格继续下一关 · Esc 回地图' : '按空格或 Esc 回地图'}
            </p>
          </div>
        </div>
      </Modal>
    </>
  )
}
