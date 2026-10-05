import type { SessionState } from '@/engine/typingEngine'
import { computeStars, topConfusions, topWeakKeys } from '@/engine/typingEngine'
import type { AttemptSummary } from '@/types/typing'

/**
 * 一关通常包含多道练习题，结算需要跨题汇总。
 * 这里独立成一个模块，方便未来扩展到代码关、游戏关的结算口径。
 */
export interface AttemptAccumulator {
  correctKeystrokes: number
  totalKeystrokes: number
  errorCount: number
  firstTryCorrectCount: number
  charCount: number
  errorMap: Record<string, number>
  confusionMap: Record<string, number>
  startedAt: number
  finishedAt: number | null
}

export function createAccumulator(startedAt: number): AttemptAccumulator {
  return {
    correctKeystrokes: 0,
    totalKeystrokes: 0,
    errorCount: 0,
    firstTryCorrectCount: 0,
    charCount: 0,
    errorMap: {},
    confusionMap: {},
    startedAt,
    finishedAt: null,
  }
}

function mergeCounts(target: Record<string, number>, source: Record<string, number>) {
  const next = { ...target }
  for (const [key, value] of Object.entries(source)) {
    next[key] = (next[key] ?? 0) + value
  }
  return next
}

export function addDrillResult(
  accumulator: AttemptAccumulator,
  state: SessionState,
  finishedAt: number,
): AttemptAccumulator {
  return {
    correctKeystrokes: accumulator.correctKeystrokes + state.correctKeystrokes,
    totalKeystrokes: accumulator.totalKeystrokes + state.totalKeystrokes,
    errorCount: accumulator.errorCount + state.errorCount,
    firstTryCorrectCount: accumulator.firstTryCorrectCount + state.firstTryCorrectCount,
    charCount: accumulator.charCount + state.statuses.filter((status) => status !== 'skipped').length,
    errorMap: mergeCounts(accumulator.errorMap, state.errorMap),
    confusionMap: mergeCounts(accumulator.confusionMap, state.confusionMap),
    startedAt: accumulator.startedAt,
    finishedAt,
  }
}

function safeDivide(a: number, b: number): number {
  return b <= 0 ? 0 : a / b
}

export function finalizeAttempt(accumulator: AttemptAccumulator, targetWpm: number): AttemptSummary {
  const end = accumulator.finishedAt ?? Date.now()
  const minutes = Math.max(end - accumulator.startedAt, 1000) / 60_000
  const wpm = Math.round(safeDivide(accumulator.correctKeystrokes / 5, minutes))
  const cpm = Math.round(safeDivide(accumulator.correctKeystrokes, minutes))
  const accuracy = safeDivide(accumulator.correctKeystrokes, accumulator.totalKeystrokes)
  const firstTryAccuracy = safeDivide(accumulator.firstTryCorrectCount, Math.max(accumulator.charCount, 1))

  return {
    wpm,
    cpm,
    accuracy,
    firstTryAccuracy,
    errorCount: accumulator.errorCount,
    durationMs: end - accumulator.startedAt,
    stars: computeStars({
      accuracy,
      wpm,
      targetWpm,
      completed: accumulator.charCount > 0,
    }),
    weakKeys: topWeakKeys(accumulator.errorMap),
    confusions: topConfusions(accumulator.confusionMap),
  }
}
