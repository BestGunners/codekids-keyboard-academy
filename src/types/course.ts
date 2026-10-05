import type { FingerId } from '@/types/typing'

/** 关卡类型：MVP 只实现打字类，其余类型预留，便于后续扩展课程系统。 */
export type LessonKind = 'intro' | 'letters' | 'words' | 'symbols' | 'code' | 'game'

/** 练习模式：抄写 / 补全 / 组装（阶段 4 使用，MVP 只用 copy）。 */
export type DrillMode = 'copy' | 'fill' | 'assemble'

export interface Drill {
  id: string
  text: string
  hint?: string
  mode: DrillMode
}

export interface Lesson {
  id: string
  stageId: number
  order: number
  title: string
  subtitle: string
  kind: LessonKind
  /** 本关目标字符，用于提示、弱键复习与教学内容校验 */
  focusChars: string[]
  /** 三星所需的 WPM 基准 */
  targetWpm: number
  /** 关卡内容是否已经做好：还没做的关卡在地图上保持锁定，避免点进空关卡 */
  ready: boolean
  /** 小 boss 关，需要 2 星才解锁下一区块 */
  boss?: boolean
  drills: Drill[]
}

export interface Stage {
  id: number
  code: string
  title: string
  subtitle: string
  emoji: string
  /** Tailwind 渐变类名，控制地图岛屿配色 */
  gradient: string
  /** MVP 阶段：只有阶段 1 开放，其余显示为"即将开放" */
  available: boolean
  lessons: Lesson[]
}

export interface LessonProgress {
  stars: number
  bestWpm: number
  bestAccuracy: number
  attempts: number
  completedAt: string
}

export interface Badge {
  id: string
  title: string
  description: string
  emoji: string
  /** 徽章类别：技能 / 坚持 / 突破 / 创造 */
  category: 'skill' | 'habit' | 'breakthrough' | 'create'
}

/** 键盘按键的定义，供虚拟键盘渲染与提示使用。 */
export interface KeyCap {
  id: string
  /** 未按 Shift 时的基础字符；特殊键为占位字符 */
  base: string
  /** 按住 Shift 时的字符 */
  shift?: string
  /** 特殊键显示文案（Tab / Shift / 空格 等） */
  label?: string
  /** 键宽，1 为标准键宽 */
  width?: number
  finger: FingerId
  special?: boolean
}
