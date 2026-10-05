import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useCurrentChild } from '@/store/selectors'

/** 未登录时跳转到儿童登录页，保证学习页永远有学习主体。 */
export function RequireChild({ children }: { children: ReactNode }) {
  const child = useCurrentChild()
  if (!child) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default RequireChild
