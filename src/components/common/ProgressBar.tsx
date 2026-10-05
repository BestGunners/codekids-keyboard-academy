import { cn } from '@/utils/cn'

export interface ProgressBarProps {
  value: number
  className?: string
  barClassName?: string
}

export function ProgressBar({ value, className, barClassName }: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(1, value))
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-surface-muted', className)}>
      <div
        className={cn(
          'h-full rounded-full bg-gradient-to-r from-brand-500 to-mint-500 transition-all duration-500',
          barClassName,
        )}
        style={{ width: `${safeValue * 100}%` }}
      />
    </div>
  )
}