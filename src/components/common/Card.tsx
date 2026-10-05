import type { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

export function Card({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-kid border border-surface-line bg-white p-6 shadow-[0_1px_2px_rgba(18,32,58,0.04),0_12px_26px_-22px_rgba(18,32,58,0.4)]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}