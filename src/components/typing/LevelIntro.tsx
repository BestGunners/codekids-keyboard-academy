import { useEffect, useState } from 'react'
import { Icon } from '@/components/icons/Icon'
import { Mascot } from '@/components/mascot/Mascot'
import { getCharKeyInfo } from '@/engine/keyMap'
import { sfx } from '@/engine/sfx'
import type { Lesson } from '@/types/course'

export interface LevelIntroProps {
  lesson: Lesson
  onStart: () => void
  onBack: () => void
}

/** 关卡开场：本关重点按键 + 返回入口 + 3 秒倒计时。 */
export function LevelIntro({ lesson, onStart, onBack }: LevelIntroProps) {
  const [count, setCount] = useState<number | null>(null)
  const starting = count !== null

  useEffect(() => {
    if (!starting) return undefined
    if (count === 0) {
      onStart()
      return undefined
    }
    sfx.tick()
    const timer = window.setTimeout(
      () => setCount((value) => (value === null ? null : value - 1)),
      1000,
    )
    return () => window.clearTimeout(timer)
  }, [count, starting, onStart])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        sfx.tap()
        onBack()
        return
      }
      if (event.key !== ' ' && event.key !== 'Enter') return
      event.preventDefault()
      if (starting) return
      sfx.unlock()
      setCount(3)
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [starting, onBack])

  const focusKeys = lesson.focusChars.filter((char) => getCharKeyInfo(char)).slice(0, 6)

  return (
    <div className="flex flex-col items-center gap-6 rounded-kid border border-surface-line bg-white px-6 py-10 text-center shadow-[0_1px_2px_rgba(18,32,58,0.04),0_18px_36px_-28px_rgba(18,32,58,0.5)]">
      <Mascot mood="cheer" size={96} />

      <div className="space-y-1">
        <div className="font-mono text-xs font-bold tracking-wide text-ink-faint">
          第 {lesson.stageId} 岛 · 第 {lesson.order} 关
        </div>
        <h1 className="font-display text-3xl font-extrabold">{lesson.title}</h1>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {focusKeys.map((char) => (
          <span
            key={char}
            className="flex h-11 min-w-[2.75rem] items-center justify-center rounded-lg border border-surface-line bg-white px-3 font-mono text-xl font-extrabold text-brand-700 shadow-[0_2px_0_rgba(18,32,58,0.06)]"
          >
            {char === ' ' ? '空格' : char}
          </span>
        ))}
      </div>

      {starting ? (
        <div className="flex h-20 items-center justify-center">
          <span key={count} className="anim-pop-in font-mono text-6xl font-extrabold text-brand-600">
            {count === 0 ? '开始' : count}
          </span>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            sfx.unlock()
            setCount(3)
          }}
          className="anim-float inline-flex items-center gap-2 rounded-kid bg-brand-500 px-7 py-3.5 text-xl font-extrabold text-white shadow-kid active:translate-y-[1px]"
        >
          <Icon name="play" size={20} filled />
          按空格开始
        </button>
      )}

      <button
        type="button"
        onClick={() => {
          onBack()
        }}
        className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-extrabold text-ink-soft transition hover:bg-surface-muted"
      >
        <Icon name="back" size={16} />
        返回地图
      </button>
    </div>
  )
}
