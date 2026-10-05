import { FINGERS } from '@/engine/keyMap'
import type { FingerId, Hand } from '@/types/typing'
import { cn } from '@/utils/cn'

const HAND_FINGERS: Record<Hand, FingerId[]> = {
  left: ['left-pinky', 'left-ring', 'left-middle', 'left-index'],
  right: ['right-index', 'right-middle', 'right-ring', 'right-pinky'],
}

const FINGER_HEIGHT = ['h-6', 'h-9', 'h-11', 'h-9']

export interface HandGuideProps {
  fingerId?: FingerId | null
  className?: string
}

/** 双手示意图：高亮当前应该使用的手指，把「用哪个手指」变成看得见的图像。 */
export function HandGuide({ fingerId, className }: HandGuideProps) {
  return (
    <div className={cn('flex items-end justify-center gap-6', className)}>
      {(['left', 'right'] as const).map((hand) => (
        <div key={hand} className="flex flex-col items-center gap-1">
          <div className="flex items-end gap-1">
            {HAND_FINGERS[hand].map((finger, index) => {
              const meta = FINGERS[finger]
              const active = fingerId === finger
              return (
                <div
                  key={finger}
                  className={cn(
                    'w-4 rounded-full border-2 transition-all',
                    FINGER_HEIGHT[index],
                    active ? 'scale-y-110 border-transparent' : 'border-brand-200 bg-white',
                  )}
                  style={active ? { backgroundColor: meta.color } : undefined}
                  title={meta.label}
                />
              )
            })}
          </div>
          <div
            className={cn(
              'mt-1 flex h-7 w-20 items-center justify-center rounded-2xl text-xs font-bold',
              fingerId === 'thumb' && hand === 'right' ? 'text-white' : 'bg-brand-100/70 text-ink-soft',
            )}
            style={
              fingerId === 'thumb' && hand === 'right'
                ? { backgroundColor: FINGERS.thumb.color }
                : undefined
            }
          >
            {hand === 'left' ? '左手' : '右手'}
          </div>
        </div>
      ))}
    </div>
  )
}
