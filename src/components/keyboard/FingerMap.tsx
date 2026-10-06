import { FINGERS, KEYBOARD_ROWS, describeChar } from '@/engine/keyMap'
import type { FingerId, Hand } from '@/types/typing'
import { cn } from '@/utils/cn'

/** 每根手指负责的键：直接从键盘布局推导，和虚拟键盘永远保持一致 */
const FINGER_ORDER: FingerId[] = [
  'left-pinky',
  'left-ring',
  'left-middle',
  'left-index',
  'right-index',
  'right-middle',
  'right-ring',
  'right-pinky',
]

const KEYS_BY_FINGER = (() => {
  const map = new Map<FingerId, string[]>()
  KEYBOARD_ROWS.flat().forEach((cap) => {
    // 特殊键（Shift / 回车 / 退格）不属于"字母练习"的重点，空格单独说明
    if (cap.special || cap.base === ' ') return
    const list = map.get(cap.finger) ?? []
    const label = cap.base.toUpperCase()
    if (!list.includes(label)) list.push(label)
    map.set(cap.finger, list)
  })
  return map
})()

export interface FingerMapProps {
  /** 当前要打的字符：它对应的手指会亮起来 */
  targetChar?: string | null
  className?: string
}

/** 手指分工表：一行一根手指，写着它负责的键；当前该用的那行会高亮。 */
export function FingerMap({ targetChar = null, className }: FingerMapProps) {
  const active = targetChar ? describeChar(targetChar).finger?.id ?? null : null

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="grid grid-cols-2 gap-2">
        {(['left', 'right'] as Hand[]).map((hand) => (
          <div key={hand} className="space-y-1">
            <div className="text-[10px] font-extrabold text-ink-faint">
              {hand === 'left' ? '左手' : '右手'}
            </div>
            {FINGER_ORDER.filter((finger) => FINGERS[finger].hand === hand).map((finger) => {
              const meta = FINGERS[finger]
              const isActive = active === finger

              return (
                <div
                  key={finger}
                  className={cn(
                    'flex items-center gap-1 rounded-lg px-1.5 py-1 transition',
                    isActive ? 'bg-brand-50 ring-1 ring-brand-300' : 'bg-white',
                  )}
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                  <span className="w-12 shrink-0 text-[10px] font-extrabold text-ink-soft">
                    {meta.label.replace('左手', '').replace('右手', '')}
                  </span>
                  <span className="flex flex-wrap gap-0.5">
                    {(KEYS_BY_FINGER.get(finger) ?? []).map((key) => (
                      <kbd
                        key={key}
                        className="rounded border border-surface-line bg-surface-muted px-0.5 font-mono text-[9px] font-bold leading-4 text-ink-soft"
                      >
                        {key}
                      </kbd>
                    ))}
                  </span>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div
        className={cn(
          'flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-[10px] font-extrabold transition',
          active === 'thumb' ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-300' : 'text-ink-soft',
        )}
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: FINGERS.thumb.color }}
        />
        大拇指 → 空格键
      </div>
    </div>
  )
}
