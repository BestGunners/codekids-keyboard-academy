import { cn } from '@/utils/cn'

export interface LogoProps {
  size?: number
  showWordmark?: boolean
  animated?: boolean
  className?: string
}

/** 站点标识：小刺猬 + 站名。图片本身带透明通道，可以直接放在任何背景上。 */
export function Logo({ size = 44, showWordmark = true, animated = false, className }: LogoProps) {
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <img
        src="/hedgehog.png"
        alt="键盘小侠"
        width={size}
        height={size}
        className={cn('shrink-0 object-contain drop-shadow-sm', animated && 'anim-float')}
        style={{ width: size, height: size }}
      />
      {showWordmark ? (
        <span className="leading-tight">
          <span className="block text-lg font-extrabold text-brand-700">键盘小侠</span>
          <span className="block text-[10px] font-bold uppercase tracking-wide text-ink-soft">
            CodeKids Keyboard Academy
          </span>
        </span>
      ) : null}
    </span>
  )
}