import { Icon } from '@/components/icons/Icon'
import { cn } from '@/utils/cn'

export interface ComboMeterProps {
  streak: number
  milestone: boolean
}

/** 连击计数：达到里程碑时点亮。 */
export function ComboMeter({ streak, milestone }: ComboMeterProps) {
  // 连击没到 3 也占着位置（只是看不见），
  // 这样它出现的时候不会把下面的手指提示和键盘顶下去
  const visible = streak >= 3

  return (
    <div
      className={cn(
        'pointer-events-none flex items-center gap-1.5 rounded-xl border px-2.5 py-1 font-mono font-extrabold tabular-nums transition',
        !visible && 'invisible',
        milestone
          ? 'anim-jump border-transparent bg-ember-500 text-white'
          : 'border-surface-line bg-white text-ember-600',
      )}
    >
      <Icon name="flame" size={14} className={milestone ? 'text-white' : 'text-ember-500'} />
      <span className="inline-block min-w-[2.4rem] text-right text-lg leading-none tabular-nums">
        ×{streak}
      </span>
    </div>
  )
}