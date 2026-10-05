import { cn } from '@/utils/cn'

export type MascotMood = 'idle' | 'happy' | 'oops' | 'cheer' | 'think'

const MOOD_STYLE: Record<MascotMood, { animation: string; badge?: string }> = {
  idle: { animation: 'anim-float' },
  happy: { animation: 'anim-bounce-soft' },
  oops: { animation: 'anim-wiggle', badge: '😅' },
  cheer: { animation: 'anim-jump', badge: '🎉' },
  think: { animation: 'anim-float', badge: '💭' },
}

export interface MascotProps {
  mood?: MascotMood
  size?: number
  className?: string
}

/**
 * 小刺猬：站点形象角色。
 * 图形本身是同一张 logo 图，靠动作和角标表情表达心情，
 * 敲对时开心、敲错时歪一歪、过关时跳起来。
 */
export function Mascot({ mood = 'idle', size = 96, className }: MascotProps) {
  const style = MOOD_STYLE[mood]

  return (
    <span
      className={cn('relative inline-flex shrink-0 items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <img
        src="/hedgehog.png"
        alt="小刺猬"
        width={size}
        height={size}
        className={cn('h-full w-full object-contain drop-shadow-sm', style.animation)}
      />
      {style.badge ? (
        <span
          className="anim-pop-in absolute -right-1 -top-1 text-base sm:text-lg"
          aria-hidden
        >
          {style.badge}
        </span>
      ) : null}
    </span>
  )
}