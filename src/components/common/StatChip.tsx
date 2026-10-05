import { cn } from '@/utils/cn'

export interface StatChipProps {
  label: string
  value: string | number
  unit?: string
  tone?: 'brand' | 'green' | 'orange' | 'purple'
  className?: string
}

const TONE_VALUE: Record<NonNullable<StatChipProps['tone']>, string> = {
  brand: 'text-brand-600',
  green: 'text-mint-600',
  orange: 'text-ember-600',
  purple: 'text-[#7c5cf0]',
}

/** 数据读数：标签用中文小字，数字用等宽字体，像一块仪表。 */
export function StatChip({ label, value, unit, tone = 'brand', className }: StatChipProps) {
  return (
    <div className={cn('rounded-xl border border-surface-line bg-white px-3 py-2', className)}>
      <div className="text-[10px] font-bold tracking-wide text-ink-faint">{label}</div>
      <div
        className={cn(
          'font-mono text-xl font-extrabold leading-tight tabular-nums',
          TONE_VALUE[tone],
        )}
      >
        {value}
        {unit ? <span className="ml-0.5 text-[10px] font-bold text-ink-faint">{unit}</span> : null}
      </div>
    </div>
  )
}