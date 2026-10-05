import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'success' | 'candy'
export type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'bg-brand-500 text-white shadow-kid hover:bg-brand-600',
  secondary:
    'border border-surface-line bg-white text-brand-700 hover:border-brand-300 hover:bg-brand-50',
  ghost: 'text-ink-soft hover:bg-surface-muted',
  success: 'bg-mint-500 text-white shadow-kid hover:bg-mint-600',
  candy: 'bg-candy-pink text-white shadow-kid hover:brightness-105',
}

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-6 py-3.5 text-lg',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-kid font-bold transition',
        'active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-45 disabled:active:translate-y-0',
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}