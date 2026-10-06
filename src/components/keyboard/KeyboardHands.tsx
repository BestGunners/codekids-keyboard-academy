import { FINGERS, describeChar } from '@/engine/keyMap'
import type { FingerId, Hand } from '@/types/typing'
import { cn } from '@/utils/cn'

/** 每只手上从外到内的四根手指（和键盘上 A S D F / J K L ; 的顺序一致） */
const HAND_FINGERS: Record<Hand, FingerId[]> = {
  left: ['left-pinky', 'left-ring', 'left-middle', 'left-index'],
  right: ['right-index', 'right-middle', 'right-ring', 'right-pinky'],
}

/** 手指长短：中间两根最长，看起来更像一只手 */
const FINGER_HEIGHT = ['h-7', 'h-10', 'h-11', 'h-10']

export interface KeyboardHandsProps {
  /** 当前要打的字符：对应的手指会亮起来 */
  targetChar?: string | null
  className?: string
}

/**
 * 键盘上的一双手：两只手摆在虚拟键盘上方，该用的那根手指会亮起颜色并轻轻点一下。
 * 配上虚拟键盘上被点亮的按键，孩子一眼就知道「这个键要用哪根手指按」。
 */
export function KeyboardHands({ targetChar = null, className }: KeyboardHandsProps) {
  const info = targetChar ? describeChar(targetChar) : null
  const activeFinger = info?.finger?.id ?? null
  const isThumb = activeFinger === 'thumb'

  return (
    <div className={cn('rounded-xl bg-gradient-to-b from-brand-50/80 to-white px-3 py-1.5', className)}>
      <div className="mb-0.5 text-center text-[11px] font-extrabold">
        {info?.finger ? (
          <span style={{ color: info.finger.color }}>
            {info.finger.label} · 按 {info.keyLabel}
          </span>
        ) : (
          <span className="text-ink-soft">双手放在基准行上，准备出发</span>
        )}
      </div>

      <div className="flex items-end justify-center gap-6">
        {(['left', 'right'] as Hand[]).map((hand) => (
          <div key={hand} className="flex flex-col items-center gap-0.5">
            <div className="flex items-end gap-1.5">
              {HAND_FINGERS[hand].map((finger, index) => {
                const meta = FINGERS[finger]
                const on = activeFinger === finger
                return (
                  <span
                    key={finger}
                    className={cn(
                      'w-4 rounded-full border-2 transition-all duration-150 sm:w-5',
                      FINGER_HEIGHT[index],
                      on ? 'anim-key-bop border-transparent' : 'border-brand-200 bg-white',
                    )}
                    style={on ? { backgroundColor: meta.color } : undefined}
                    title={meta.label}
                  />
                )
              })}
            </div>
            <div
              className={cn(
                'mt-0.5 flex h-5 w-16 items-center justify-center rounded-full text-[10px] font-extrabold transition',
                isThumb && hand === 'right' ? 'text-white' : 'bg-brand-50 text-ink-soft',
              )}
              style={
                isThumb && hand === 'right' ? { backgroundColor: FINGERS.thumb.color } : undefined
              }
            >
              {isThumb && hand === 'right' ? '拇指按空格' : hand === 'left' ? '左手' : '右手'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
