import type { KeyCap } from '@/types/course'
import type { FingerId, Hand } from '@/types/typing'

export interface FingerMeta {
  id: FingerId
  label: string
  hand: Hand
  /** 低饱和度儿童向配色，键盘分区与提示动画共用 */
  color: string
  emoji: string
}

export const FINGERS: Record<FingerId, FingerMeta> = {
  'left-pinky': { id: 'left-pinky', label: '左手小指', hand: 'left', color: '#f97362', emoji: '🤙' },
  'left-ring': { id: 'left-ring', label: '左手无名指', hand: 'left', color: '#f9a826', emoji: '💛' },
  'left-middle': { id: 'left-middle', label: '左手中指', hand: 'left', color: '#f2d544', emoji: '💚' },
  'left-index': { id: 'left-index', label: '左手食指', hand: 'left', color: '#5cc98a', emoji: '🤞' },
  'right-index': { id: 'right-index', label: '右手食指', hand: 'right', color: '#46c9c0', emoji: '🤞' },
  'right-middle': { id: 'right-middle', label: '右手中指', hand: 'right', color: '#4f9cf9', emoji: '💙' },
  'right-ring': { id: 'right-ring', label: '右手无名指', hand: 'right', color: '#9a7bf0', emoji: '💜' },
  'right-pinky': { id: 'right-pinky', label: '右手小指', hand: 'right', color: '#ef7bc0', emoji: '🤙' },
  thumb: { id: 'thumb', label: '拇指', hand: 'right', color: '#94a3b8', emoji: '👍' },
}

const key = (
  base: string,
  finger: FingerId,
  options: Partial<Pick<KeyCap, 'shift' | 'label' | 'width' | 'special'>> = {},
): KeyCap => ({
  id: `key-${base === ' ' ? 'space' : base}`,
  base,
  finger,
  ...options,
})

/**
 * 标准 US 键盘布局。
 * 这是整个产品"键位 → 手指"的唯一事实来源：
 * 虚拟键盘配色、手指提示、错误热力图都由它推导，避免多处硬编码不一致。
 */
export const KEYBOARD_ROWS: KeyCap[][] = [
  [
    key('`', 'left-pinky', { shift: '~' }),
    key('1', 'left-pinky', { shift: '!' }),
    key('2', 'left-ring', { shift: '@' }),
    key('3', 'left-middle', { shift: '#' }),
    key('4', 'left-index', { shift: '$' }),
    key('5', 'left-index', { shift: '%' }),
    key('6', 'right-index', { shift: '^' }),
    key('7', 'right-index', { shift: '&' }),
    key('8', 'right-middle', { shift: '*' }),
    key('9', 'right-ring', { shift: '(' }),
    key('0', 'right-pinky', { shift: ')' }),
    key('-', 'right-pinky', { shift: '_' }),
    key('=', 'right-pinky', { shift: '+' }),
    key('Backspace', 'right-pinky', { label: '退格', width: 2, special: true }),
  ],
  [
    key('Tab', 'left-pinky', { label: 'Tab', width: 1.5, special: true }),
    key('q', 'left-pinky', { shift: 'Q' }),
    key('w', 'left-ring', { shift: 'W' }),
    key('e', 'left-middle', { shift: 'E' }),
    key('r', 'left-index', { shift: 'R' }),
    key('t', 'left-index', { shift: 'T' }),
    key('y', 'right-index', { shift: 'Y' }),
    key('u', 'right-index', { shift: 'U' }),
    key('i', 'right-middle', { shift: 'I' }),
    key('o', 'right-ring', { shift: 'O' }),
    key('p', 'right-pinky', { shift: 'P' }),
    key('[', 'right-pinky', { shift: '{' }),
    key(']', 'right-pinky', { shift: '}' }),
    key('\\', 'right-pinky', { shift: '|', width: 1.5 }),
  ],
  [
    key('CapsLock', 'left-pinky', { label: 'Caps', width: 1.75, special: true }),
    key('a', 'left-pinky', { shift: 'A' }),
    key('s', 'left-ring', { shift: 'S' }),
    key('d', 'left-middle', { shift: 'D' }),
    key('f', 'left-index', { shift: 'F' }),
    key('g', 'left-index', { shift: 'G' }),
    key('h', 'right-index', { shift: 'H' }),
    key('j', 'right-index', { shift: 'J' }),
    key('k', 'right-middle', { shift: 'K' }),
    key('l', 'right-ring', { shift: 'L' }),
    key(';', 'right-pinky', { shift: ':' }),
    key("'", 'right-pinky', { shift: '"' }),
    key('Enter', 'right-pinky', { label: '回车', width: 2.25, special: true }),
  ],
  [
    key('ShiftLeft', 'left-pinky', { label: 'Shift', width: 2.25, special: true }),
    key('z', 'left-pinky', { shift: 'Z' }),
    key('x', 'left-ring', { shift: 'X' }),
    key('c', 'left-middle', { shift: 'C' }),
    key('v', 'left-index', { shift: 'V' }),
    key('b', 'left-index', { shift: 'B' }),
    key('n', 'right-index', { shift: 'N' }),
    key('m', 'right-index', { shift: 'M' }),
    key(',', 'right-middle', { shift: '<' }),
    key('.', 'right-ring', { shift: '>' }),
    key('/', 'right-pinky', { shift: '?' }),
    key('ShiftRight', 'right-pinky', { label: 'Shift', width: 2.75, special: true }),
  ],
  [key(' ', 'thumb', { label: '空格', width: 9, special: false })],
]

export interface CharKeyInfo {
  key: KeyCap
  requiresShift: boolean
  finger: FingerMeta
}

const charIndex = new Map<string, CharKeyInfo>()

for (const row of KEYBOARD_ROWS) {
  for (const cap of row) {
    if (cap.special && cap.base !== ' ') continue
    charIndex.set(cap.base, { key: cap, requiresShift: false, finger: FINGERS[cap.finger] })
    if (cap.shift) {
      charIndex.set(cap.shift, { key: cap, requiresShift: true, finger: FINGERS[cap.finger] })
    }
  }
}

/** 查询某个字符对应的键位、手指与是否需要 Shift。 */
export function getCharKeyInfo(char: string): CharKeyInfo | null {
  return charIndex.get(char) ?? null
}

/** 生成给孩子的指法提示文案，例如「右手小指 · 按住 Shift + ;」。 */
export function describeChar(char: string): {
  finger: FingerMeta | null
  keyLabel: string
  requiresShift: boolean
  text: string
} {
  if (char === ' ') {
    return { finger: FINGERS.thumb, keyLabel: '空格', requiresShift: false, text: '用拇指轻敲空格键' }
  }

  const info = getCharKeyInfo(char)

  if (!info) {
    return { finger: null, keyLabel: char, requiresShift: false, text: `找到「${char}」这个键` }
  }

  const baseLabel = info.key.base.length === 1 ? info.key.base.toUpperCase() : info.key.base
  const needsShift = info.requiresShift || /[A-Z]/.test(char)
  const shiftText = needsShift ? '按住 Shift，再敲' : '敲'
  const keyText = info.key.base.length === 1 ? info.key.base : info.key.base

  return {
    finger: info.finger,
    keyLabel: baseLabel,
    requiresShift: needsShift,
    text: `${info.finger.label} ${shiftText}「${keyText}」键`,
  }
}

/** 虚拟键盘中需要高亮的键 id。 */
export function getKeyHighlightId(char: string): string | null {
  if (char === ' ') return 'key-space'
  return getCharKeyInfo(char)?.key.id ?? null
}

/** 键盘是否需要用 Shift 高亮（用于提示孩子另一只手按住 Shift）。 */
export function getShiftSide(char: string): Hand | null {
  const info = getCharKeyInfo(char)
  if (!info) return null
  const needsShift = info.requiresShift || /[A-Z]/.test(char)
  if (!needsShift) return null
  // Shift 用另一只手按：左手字符用右手 Shift，右手字符用左手 Shift
  return info.finger.hand === 'left' ? 'right' : 'left'
}
