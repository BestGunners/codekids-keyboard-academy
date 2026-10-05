import type { CSSProperties } from 'react'
import { useMemo } from 'react'

export interface SparklesProps {
  burstKey: number
  color?: string
}

/** 敲对时从字符位置迸出的小火花——最轻量、最即时的奖励反馈。 */
export function Sparkles({ burstKey, color = '#ffd95c' }: SparklesProps) {
  const sparks = useMemo(
    () =>
      Array.from({ length: 6 }, () => ({
        x: (Math.random() - 0.5) * 46,
        y: -18 - Math.random() * 34,
        size: 4 + Math.random() * 5,
        delay: Math.random() * 0.06,
      })),
    [burstKey],
  )

  return (
    <span
      key={burstKey}
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      aria-hidden
    >
      {sparks.map((spark, index) => (
        <span
          key={index}
          className="spark"
          style={
            {
              '--spark-x': `${spark.x}px`,
              '--spark-y': `${spark.y}px`,
              width: spark.size,
              height: spark.size,
              backgroundColor: color,
              animationDelay: `${spark.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </span>
  )
}
