import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

export interface AppShellProps {
  children: ReactNode
  header?: ReactNode
  className?: string
}

export function AppShell({ children, header, className }: AppShellProps) {
  return (
    <div className="min-h-screen">
      <div className={cn('mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6', className)}>
        {header}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
