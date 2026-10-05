import type { ReactNode } from 'react'
import { Icon, type IconName } from '@/components/icons/Icon'
import { cn } from '@/utils/cn'

export interface WarningBannerProps {
  icon: IconName
  title: string
  children?: ReactNode
  tone?: 'warn' | 'info'
}

/** 浮动提示条：不占布局，所以不会顶动下面的键盘。 */
export function WarningBanner({ icon, title, children, tone = 'warn' }: WarningBannerProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-kid border bg-white/95 px-4 py-3 text-sm font-semibold shadow-pop backdrop-blur',
        tone === 'warn' ? 'border-ember-300' : 'border-brand-200',
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
          tone === 'warn' ? 'bg-ember-50 text-ember-600' : 'bg-brand-50 text-brand-600',
        )}
      >
        <Icon name={icon} size={16} />
      </span>
      <div className="space-y-0.5">
        <div className="font-extrabold text-ink">{title}</div>
        {children ? <div className="font-medium text-ink-soft">{children}</div> : null}
      </div>
    </div>
  )
}