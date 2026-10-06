import { cn } from '@/utils/cn'

export interface SwitchProps {
  checked: boolean
  onChange: (next: boolean) => void
  /** 开关旁边的文字，同时也是给读屏软件的名字 */
  label: string
  className?: string
}

/** 儿童向滑动开关：轨道 + 圆点，点一下切换，和按钮一样有全局点击音效。 */
export function Switch({ checked, onChange, label, className }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'inline-flex select-none items-center gap-2 rounded-full border px-2.5 py-1.5 text-xs font-extrabold transition',
        checked
          ? 'border-brand-300 bg-brand-50 text-brand-700'
          : 'border-surface-line bg-white text-ink-soft',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'relative h-4 w-8 shrink-0 rounded-full transition-colors',
          checked ? 'bg-brand-500' : 'bg-brand-100',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-all',
            checked ? 'left-[1.125rem]' : 'left-0.5',
          )}
        />
      </span>
      {label}
    </button>
  )
}
