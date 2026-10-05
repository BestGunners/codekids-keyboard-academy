/** 手指标识：8 根手指 + 拇指，是键盘配色、提示动画、错误统计的统一口径。 */
export type FingerId =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky'
  | 'thumb'

export type Hand = 'left' | 'right'

/** 单个字符在某一次练习中的状态。 */
export type CharStatus = 'pending' | 'correct' | 'error' | 'skipped'

export interface KeystrokeResult {
  expected: string
  actual: string
  correct: boolean
  at: number
}

export interface TypingStats {
  /** 每分钟单词数（5 个字符 = 1 个单词） */
  wpm: number
  /** 每分钟字符数，低龄组展示更直观 */
  cpm: number
  /** 首次输入口径的正确率（0-1） */
  accuracy: number
  firstTryAccuracy: number
  elapsedMs: number
  correctKeystrokes: number
  totalKeystrokes: number
  errorCount: number
  streak: number
  bestStreak: number
  progressRatio: number
  completed: boolean
}

export interface WeakKeyStat {
  char: string
  count: number
}

export interface ConfusionStat {
  expected: string
  actual: string
  count: number
}

/** 一关练习结束后的汇总结果，用于星级判定、结算页与家长端上报。 */
export interface AttemptSummary {
  wpm: number
  cpm: number
  accuracy: number
  firstTryAccuracy: number
  errorCount: number
  durationMs: number
  stars: number
  weakKeys: WeakKeyStat[]
  confusions: ConfusionStat[]
}
