import { Icon } from '@/components/icons/Icon'
import { cn } from '@/utils/cn'

export interface StarRatingProps {
  stars: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_PX = { sm: 14, md: 18, lg: 30 } as const

export function StarRating({ stars, max = 3, size = 'md', className }: StarRatingProps) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} aria-label={`${stars} 星`}>
      {Array.from({ length: max }, (_, index) => (
        <Icon
          key={index}
          name="star"
          size={SIZE_PX[size]}
          filled={index < stars}
          className={index < stars ? 'text-ember-500' : 'text-surface-line'}
        />
      ))}
    </span>
  )
}