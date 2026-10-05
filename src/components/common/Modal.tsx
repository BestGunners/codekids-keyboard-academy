import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export interface ModalProps {
  open: boolean
  children: ReactNode
  className?: string
}

export function Modal({ open, children, className }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
      <div
        className={cn(
          'w-full max-w-2xl animate-pop rounded-kid border border-white/70 bg-white p-8 shadow-pop',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
