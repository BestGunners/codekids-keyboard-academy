import { useMemo } from 'react'
import { cn } from '@/utils/cn'

const COLORS = ['#ff8fb1', '#ffd95c', '#57d6c4', '#a78bfa', '#6fd08c', '#59a4ff']

export interface ConfettiProps {
  active: boolean
  count?: number
  className?: string
}

/** 过关庆祝礼花：纯 CSS 动画，不引入动画库。 */
export function Confetti({ active, count = 44, className }: ConfettiProps) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1.6 + Math.random() * 1.3,
        size: 7 + Math.random() * 9,
        color: COLORS[index % COLORS.length],
      })),
    [count],
  )

  if (!active) return null

  return (
    <div
      className={cn('pointer-events-none fixed inset-0 z-[60] overflow-hidden', className)}
      aria-hidden
    >
      {pieces.map((piece, index) => (
        <span
          key={index}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size * 0.62,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        />
      ))}
    </div>
  )
}
