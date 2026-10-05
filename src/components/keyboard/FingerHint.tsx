import { HandGuide } from '@/components/keyboard/HandGuide'
import { describeChar } from '@/engine/keyMap'
import { cn } from '@/utils/cn'

export interface FingerHintProps {
  char: string | null
  level: 0 | 1 | 2 | 3 | 4
  onSkip?: () => void
  className?: string
}

/**
 * 手指提示（紧凑版）：一行放下键帽、手指颜色、双手示意图和跳过按钮。
 * 提示强度随连续错误自动升级，连续错 5 次时让孩子先跳过这个键。
 */
export function FingerHint({ char, level, onSkip, className }: FingerHintProps) {
  const info = char ? describeChar(char) : null
  const color = info?.finger?.color ?? '#cbd5e1'

  return (
    <div
      className={cn(
        'flex h-[62px] flex-nowrap items-center gap-2 overflow-hidden rounded-kid border border-surface-line bg-white px-3 py-2 shadow-[0_1px_2px_rgba(18,32,58,0.04)]',
        className,
      )}
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 font-mono text-xl font-extrabold"
        style={{ borderColor: color, color }}
      >
        {char === ' ' ? '␣' : (char ?? '·')}
      </span>

      {info ? (
        <>
          <span
            className="flex items-center gap-1.5 rounded-xl px-2 py-1 text-xs font-extrabold"
            style={{ backgroundColor: `${color}22` }}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            {info.finger?.label}
          </span>

          {info.requiresShift ? (
            <span className="rounded-md bg-brand-500 px-1.5 py-0.5 text-[11px] font-extrabold text-white">
              + Shift
            </span>
          ) : null}

          {level >= 2 ? (
            <HandGuide fingerId={info.finger?.id ?? null} className="origin-left scale-[0.62]" />
          ) : null}

          {level >= 4 && onSkip ? (
            <button
              type="button"
              onClick={onSkip}
              className="anim-pop-in rounded-xl bg-brand-100 px-3 py-1.5 text-xs font-extrabold text-brand-700"
            >
              先跳过 →
            </button>
          ) : null}
        </>
      ) : (
        <span className="text-xs font-extrabold text-ink-soft">准备好了就开始吧</span>
      )}
    </div>
  )
}