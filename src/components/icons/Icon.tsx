import type { ReactNode } from 'react'

/**
 * 界面图标：统一的线性图标，取代界面上的 emoji。
 * emoji 只保留在「内容」里（头像、图案密码、徽章、岛屿、舞台演出），
 * 界面骨架一律用这套线性图标，看起来更简洁、更科技。
 */
export type IconName =
  | 'map'
  | 'award'
  | 'gear'
  | 'sound'
  | 'mute'
  | 'star'
  | 'flame'
  | 'lock'
  | 'check'
  | 'play'
  | 'pause'
  | 'run'
  | 'step'
  | 'back'
  | 'refresh'
  | 'target'
  | 'bolt'
  | 'keyboard'
  | 'code'
  | 'gamepad'
  | 'key'
  | 'clock'
  | 'close'
  | 'plus'
  | 'trash'
  | 'chevronRight'
  | 'chevronLeft'
  | 'lightbulb'
  | 'crown'
  | 'sparkle'
  | 'book'
  | 'user'

const PATHS: Record<IconName, ReactNode> = {
  map: (
    <>
      <path d="M9 4 3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4Z" />
      <path d="M9 4v13M15 6.5v13" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="8.5" r="5" />
      <path d="m8.6 13-1.6 8 5-2.8 5 2.8-1.6-8" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 2.6v2.6M12 18.8v2.6M4.6 4.6l1.9 1.9M17.5 17.5l1.9 1.9M2.6 12h2.6M18.8 12h2.6M4.6 19.4l1.9-1.9M17.5 6.5l1.9-1.9" />
    </>
  ),
  sound: (
    <>
      <path d="M4 10v4h3l4 3.5v-11L7 10H4Z" />
      <path d="M15 9a4.5 4.5 0 0 1 0 6" />
      <path d="M17.8 6.5a8 8 0 0 1 0 11" />
    </>
  ),
  mute: (
    <>
      <path d="M4 10v4h3l4 3.5v-11L7 10H4Z" />
      <path d="m15.5 9.5 5 5M20.5 9.5l-5 5" />
    </>
  ),
  star: <path d="m12 3.4 2.6 5.3 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.5l5.9-.8L12 3.4Z" />,
  flame: (
    <path d="M12 21.5c3.7 0 5.8-2.3 5.8-5.7 0-3.3-2.9-5.2-3.9-8.5-1.4 1.9-1.4 3.8-2.9 4.7-.9-.9-1.4-1.9-1.4-3.3-1.4 2-2.5 3.9-2.5 7.1 0 3.4 2.1 5.7 5 5.7Z" />
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="10" rx="2.4" />
      <path d="M8.2 10V7.4a3.8 3.8 0 0 1 7.6 0V10" />
    </>
  ),
  check: <path d="m5.5 12.6 4.2 4.2L18.8 7" />,
  play: <path d="M7.5 4.6v14.8L19.5 12 7.5 4.6Z" />,
  pause: <path d="M9 5v14M15 5v14" />,
  run: (
    <>
      <path d="m7 8.5 3.5 3.5L7 15.5" />
      <path d="M13.5 15.5H18" />
    </>
  ),
  step: (
    <>
      <path d="M6 5.5v13L14 12 6 5.5Z" />
      <path d="M17.5 5.5v13" />
    </>
  ),
  back: (
    <>
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 1 1-2.4-5.7" />
      <path d="M20 4.5V9h-4.5" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  bolt: <path d="M13.4 2.5 4.8 13.6h5.6l-.8 7.9 8.6-11.1h-5.6l.8-7.9Z" />,
  keyboard: (
    <>
      <rect x="2.4" y="6" width="19.2" height="12" rx="2.4" />
      <path d="M6 10h.01M9 10h.01M12 10h.01M15 10h.01M18 10h.01M7.5 14h9" />
    </>
  ),
  code: (
    <>
      <path d="m9 8-4 4 4 4" />
      <path d="m15 8 4 4-4 4" />
    </>
  ),
  gamepad: (
    <>
      <rect x="2.4" y="7.5" width="19.2" height="10" rx="5" />
      <path d="M7.6 11v3M6.1 12.5h3M15.8 11.6h.01M18 13.4h.01" />
    </>
  ),
  key: (
    <>
      <circle cx="8.4" cy="14.4" r="3.6" />
      <path d="M11.2 11.6 20 2.8M17.4 3.6l2.9 2.9M14.6 6.4l2.9 2.9" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 7.2V12l3.2 2" />
    </>
  ),
  close: <path d="m6.4 6.4 11.2 11.2M17.6 6.4 6.4 17.6" />,
  plus: <path d="M12 5.2v13.6M5.2 12h13.6" />,
  trash: (
    <>
      <path d="M4.5 7h15" />
      <path d="M9.5 7V4.8h5V7" />
      <path d="m6.5 7 1 13h9l1-13" />
    </>
  ),
  chevronRight: <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />,
  chevronLeft: <path d="M14.5 5.5 8 12l6.5 6.5" />,
  lightbulb: (
    <>
      <path d="M12 3.2a6 6 0 0 0-3.6 10.8v2.2h7.2v-2.2A6 6 0 0 0 12 3.2Z" />
      <path d="M9.6 19.2h4.8M10.4 21.4h3.2" />
    </>
  ),
  crown: <path d="M3.5 17.5 2.6 7.2l4.9 4 4.5-6.6 4.5 6.6 4.9-4-.9 10.3H3.5Z" />,
  sparkle: <path d="m12 2.8 1.8 5.4 5.4 1.8-5.4 1.8L12 17.2l-1.8-5.4L4.8 10l5.4-1.8L12 2.8Z" />,
  book: (
    <>
      <path d="M3.4 5.6A2.2 2.2 0 0 1 5.6 3.4H20v15.2H5.6a2.2 2.2 0 0 0-2.2 2.2V5.6Z" />
      <path d="M3.4 18.6a2.2 2.2 0 0 1 2.2-2.2H20" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.4" r="3.9" />
      <path d="M5 20.2c0-3.2 3.1-5.8 7-5.8s7 2.6 7 5.8" />
    </>
  ),
}

export interface IconProps {
  name: IconName
  size?: number
  /** 实心（用于星星这类需要填充的图标） */
  filled?: boolean
  className?: string
}

export function Icon({ name, size = 20, filled = false, className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {PATHS[name]}
    </svg>
  )
}
