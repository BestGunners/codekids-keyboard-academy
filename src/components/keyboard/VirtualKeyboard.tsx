import { useEffect, useState } from 'react'
import type { LastStroke } from '@/hooks/useTypingSession'
import { FINGERS, KEYBOARD_ROWS, getKeyHighlightId, getShiftSide } from '@/engine/keyMap'
import type { KeyCap } from '@/types/course'
import { cn } from '@/utils/cn'

export interface VirtualKeyboardProps {
  targetChar?: string | null
  lastStroke?: LastStroke | null
  showFingerColors?: boolean
  /** sm 为默认的紧凑尺寸，md 用于更大的展示场景 */
  size?: 'sm' | 'md'
}

const SIZE = {
  sm: { key: 2.7, height: 'h-9', text: 'text-xs', shiftText: 'text-[8px]', dot: 'w-4' },
  md: { key: 3.6, height: 'h-14', text: 'text-sm', shiftText: 'text-[10px]', dot: 'w-6' },
} as const

interface KeyCapViewProps {
  cap: KeyCap
  highlighted: boolean
  shiftHint: boolean
  flash: 'correct' | 'wrong' | null
  showFingerColors: boolean
  size: 'sm' | 'md'
}

function KeyCapView({ cap, highlighted, shiftHint, flash, showFingerColors, size }: KeyCapViewProps) {
  const config = SIZE[size]
  const finger = FINGERS[cap.finger]
  const label = cap.label ?? cap.base.toUpperCase()

  return (
    <div
      style={{ width: `${(cap.width ?? 1) * config.key}rem` }}
      className={cn(
        'relative flex select-none flex-col items-center justify-center rounded-lg border font-bold transition-all duration-100',
        config.height,
        config.text,
        'border-surface-line bg-white text-ink-soft shadow-[0_1px_0_rgba(18,32,58,0.06)]',
        flash === 'correct' && 'border-mint-500 bg-mint-50 text-mint-600',
        flash === 'wrong' && 'animate-shake border-[#e0455f] bg-[#ffe9ee] text-[#c2334c]',
        !flash &&
          highlighted &&
          'z-10 scale-105 border-transparent bg-ember-500 text-white shadow-[0_0_0_4px_rgba(255,159,67,0.28)]',
        !flash &&
          !highlighted &&
          shiftHint &&
          'border-brand-300 bg-brand-100 text-brand-700',
      )}
    >
      {cap.shift ? (
        <span className={cn('absolute left-1 top-0 font-bold text-ink-faint/70', config.shiftText)}>
          {cap.shift}
        </span>
      ) : null}
      <span className={cn(cap.base.length > 1 && 'text-[9px] leading-none')}>{label}</span>
      {showFingerColors ? (
        <span
          className={cn('absolute bottom-0.5 h-0.5 rounded-full', config.dot)}
          style={{ backgroundColor: highlighted ? 'transparent' : finger.color }}
        />
      ) : null}
    </div>
  )
}

/** 虚拟键盘：目标键用琥珀色点亮，需要按住的 Shift 用淡蓝提示。 */
export function VirtualKeyboard({
  targetChar = null,
  lastStroke = null,
  showFingerColors = true,
  size = 'sm',
}: VirtualKeyboardProps) {
  const [flash, setFlash] = useState<{ keyId: string; kind: 'correct' | 'wrong' } | null>(null)

  useEffect(() => {
    if (!lastStroke) return undefined
    const keyId = getKeyHighlightId(lastStroke.char)
    if (!keyId) return undefined
    setFlash({ keyId, kind: lastStroke.correct ? 'correct' : 'wrong' })
    const timer = window.setTimeout(() => setFlash(null), 220)
    return () => window.clearTimeout(timer)
  }, [lastStroke])

  const targetKeyId = targetChar ? getKeyHighlightId(targetChar) : null
  const shiftSide = targetChar ? getShiftSide(targetChar) : null
  const shiftKeyId =
    shiftSide === 'left' ? 'key-ShiftLeft' : shiftSide === 'right' ? 'key-ShiftRight' : null

  return (
    <div className="no-scrollbar overflow-x-auto pb-1">
      <div className="mx-auto flex w-max flex-col items-center gap-1">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {row.map((cap) => (
              <KeyCapView
                key={cap.id}
                cap={cap}
                highlighted={cap.id === targetKeyId}
                shiftHint={cap.id === shiftKeyId}
                flash={flash && flash.keyId === cap.id ? flash.kind : null}
                showFingerColors={showFingerColors}
                size={size}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}