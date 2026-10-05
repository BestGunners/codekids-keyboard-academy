import {
  CHINESE_PUNCTUATION_KEY,
  PINYIN_BY_CHAR,
  findPinyinSegments,
  isChineseChar,
  type PinyinSegment,
} from '../data/pinyin.ts'
import type { AttemptSummary, CharStatus, ConfusionStat, WeakKeyStat } from '@/types/typing'

export interface SessionState {
  text: string
  cursor: number
  statuses: CharStatus[]
  correctKeystrokes: number
  totalKeystrokes: number
  errorCount: number
  firstTryCorrectCount: number
  consecutiveErrors: number
  errorChar: string | null
  streak: number
  bestStreak: number
  errorMap: Record<string, number>
  confusionMap: Record<string, number>
  /** 一句话里的中文段落（要让孩子用拼音打出来） */
  segments: PinyinSegment[]
  /** 当前这段中文已经打出来的拼音 */
  pinyinTyped: string
  /** 这一段拼音里有没有敲错过 */
  segmentError: boolean
  startedAt: number
  completedAt: number | null
}

export type SessionAction =
  | { type: 'reset'; text: string; at: number }
  | { type: 'keystroke'; char: string; at: number }
  | { type: 'skip'; at: number }

export function createSession(text: string, at: number): SessionState {
  return {
    text,
    cursor: 0,
    statuses: Array.from({ length: text.length }, () => 'pending' as CharStatus),
    correctKeystrokes: 0,
    totalKeystrokes: 0,
    errorCount: 0,
    firstTryCorrectCount: 0,
    consecutiveErrors: 0,
    errorChar: null,
    streak: 0,
    bestStreak: 0,
    errorMap: {},
    confusionMap: {},
    segments: findPinyinSegments(text),
    pinyinTyped: '',
    segmentError: false,
    startedAt: at,
    completedAt: null,
  }
}

/** 光标是不是落在某段中文里 */
export function getCurrentPinyinSegment(state: SessionState): PinyinSegment | null {
  return (
    state.segments.find(
      (segment) => state.cursor >= segment.start && state.cursor < segment.start + segment.length,
    ) ?? null
  )
}

/**
 * 当前应该按哪个键：
 * 普通字符就是它自己；中文段落里返回还没敲的拼音字母，拼音敲完返回空格（确认候选字）。
 */
export function getExpectedKey(state: SessionState): string | null {
  if (state.cursor >= state.text.length) return null

  const segment = getCurrentPinyinSegment(state)
  if (!segment) {
    // 中文标点用英文键盘上对应的键敲出来，例如「，」按逗号键
    const plain = state.text[state.cursor]
    return CHINESE_PUNCTUATION_KEY[plain] ?? plain
  }

  const char = segment.text[state.cursor - segment.start] ?? ''
  const pinyin = PINYIN_BY_CHAR[char] ?? ''
  return pinyin[state.pinyinTyped.length] ?? ''
}

/**
 * 这一次击键算不算敲对。
 * 中文要按拼音字母判定、中文标点要按对应的英文键判定，
 * 不能直接拿目标汉字跟按下的键比，否则打中文会一路被判成敲错。
 */
export function isKeystrokeCorrect(state: SessionState, char: string): boolean {
  const expected = getExpectedKey(state)
  return expected !== null && expected === char
}

export interface PinyinTask {
  /** 正在打的那段中文 */
  segment: PinyinSegment
  /** 打到这段里的第几个字（从 0 开始） */
  charIndex: number
  /** 这个字本身 */
  char: string
  /** 这个字的拼音 */
  pinyin: string
  /** 已经敲出来的拼音 */
  typed: string
  /** 后面还没打的字，例如「好 hao」 */
  upcoming: string
}

/** 当前的中文打字任务（给界面显示拼音提示条） */
export function getPinyinTask(state: SessionState): PinyinTask | null {
  const segment = getCurrentPinyinSegment(state)
  if (!segment) return null

  const charIndex = state.cursor - segment.start
  const char = segment.text[charIndex] ?? ''
  const pinyin = PINYIN_BY_CHAR[char] ?? ''
  const upcoming = [...segment.text.slice(charIndex + 1)]
    .map((next) => `${next} ${PINYIN_BY_CHAR[next] ?? ''}`)
    .join('   ')

  return { segment, charIndex, char, pinyin, typed: state.pinyinTyped, upcoming }
}

/**
 * 这一次击键是不是刚好打出了一个汉字（拼音最后一个字母敲完的那一刻）。
 * 打字界面用它决定放哪一声：打字母是清脆的小音符，打出一个汉字换成更饱满的「叮」。
 * 返回刚打出的那个字，没打出汉字就返回 null。
 */
export function landedChineseChar(state: SessionState): string | null {
  const landed = state.text[state.cursor - 1] ?? ''
  return isChineseChar(landed) ? landed : null
}

/**
 * 现在是不是正在敲某段中文的拼音（光标停在中文段落里）。
 * 打拼音的中间字母不出声，等一个汉字打完才响一声，避免嘟嘟嘟和铃声打架。
 */
export function isTypingPinyin(state: SessionState): boolean {
  return getCurrentPinyinSegment(state) !== null
}

/** 一次击键该配的声音：打出一个汉字 / 拼音中间 / 普通字符 / 敲错 */
export type StrokeSound = 'chinese' | 'pinyin' | 'correct' | 'wrong'

/**
 * 这一次击键该放什么声音。必须在按键的当下算，而且要比较「按键前后光标有没有往前走」：
 * 拼音中间的字母不会移动光标，若只看按键后的 text[cursor-1]，就会把上一个汉字
 * 误当成「刚打出来的字」，于是每敲一个字母都响一次铃声。
 */
export function strokeSound(state: SessionState, char: string): StrokeSound {
  if (!isKeystrokeCorrect(state, char)) return 'wrong'

  // 不在中文段落里：普通字母、代码符号、中文标点，都是清脆的一声
  if (!isTypingPinyin(state)) return 'correct'

  // 光标往后走了，说明这个汉字真的打出来了；没走就是拼音还没敲完
  const next = typingReducer(state, { type: 'keystroke', char, at: 0 })
  return next.cursor > state.cursor ? 'chinese' : 'pinyin'
}

function registerError(
  state: SessionState,
  expected: string,
  actual: string,
  inPinyinSegment: boolean,
): SessionState {
  const statuses = [...state.statuses]
  statuses[state.cursor] = 'error'
  const expectedKey = expected === ' ' ? '空格' : expected
  const actualKey = actual === ' ' ? '空格' : actual
  const confusionKey = `${expectedKey}>${actualKey}`

  return {
    ...state,
    statuses,
    totalKeystrokes: state.totalKeystrokes + 1,
    errorCount: state.errorCount + 1,
    consecutiveErrors: state.consecutiveErrors + 1,
    errorChar: expected,
    streak: 0,
    segmentError: inPinyinSegment ? true : state.segmentError,
    errorMap: { ...state.errorMap, [expectedKey]: (state.errorMap[expectedKey] ?? 0) + 1 },
    confusionMap: {
      ...state.confusionMap,
      [confusionKey]: (state.confusionMap[confusionKey] ?? 0) + 1,
    },
  }
}

/**
 * 打字会话状态机（纯函数，便于用「击键脚本回放」做单元测试）。
 *
 * 规则来自产品设计：
 * - 敲错不前进，必须敲对才继续（不允许带错前进）
 * - 正确率按首次输入口径统计
 * - 连续错误累计，用于提示阶梯与 L4 跳过
 * - 遇到中文：先敲拼音，拼音敲完按空格确认候选字
 */
export function typingReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'reset':
      return createSession(action.text, action.at)

    case 'skip': {
      if (state.cursor >= state.text.length) return state

      const statuses = [...state.statuses]
      const segment = getCurrentPinyinSegment(state)
      let cursor = state.cursor

      if (segment) {
        for (let index = segment.start; index < segment.start + segment.length; index += 1) {
          statuses[index] = 'skipped'
        }
        cursor = segment.start + segment.length
      } else {
        statuses[state.cursor] = 'skipped'
        cursor = state.cursor + 1
      }

      return {
        ...state,
        statuses,
        cursor,
        pinyinTyped: '',
        segmentError: false,
        consecutiveErrors: 0,
        errorChar: null,
        streak: 0,
        completedAt: cursor >= state.text.length ? action.at : state.completedAt,
      }
    }

    case 'keystroke': {
      if (state.cursor >= state.text.length) return state

      const segment = getCurrentPinyinSegment(state)

      // ---- 中文段落：一个字一个字用拼音打出来 ----
      if (segment) {
        const char = segment.text[state.cursor - segment.start] ?? ''
        const pinyin = PINYIN_BY_CHAR[char]

        // 拼音表里没有这个字（正常不会发生，内容自测会拦住）
        if (!pinyin) {
          const statuses = [...state.statuses]
          statuses[state.cursor] = 'skipped'
          const cursor = state.cursor + 1
          return {
            ...state,
            statuses,
            cursor,
            pinyinTyped: '',
            completedAt: cursor >= state.text.length ? action.at : state.completedAt,
          }
        }

        const expected = pinyin[state.pinyinTyped.length] ?? ''

        if (!expected || action.char !== expected) {
          return registerError(state, expected, action.char, true)
        }

        const streak = state.streak + 1
        const charDone = state.pinyinTyped.length + 1 >= pinyin.length

        // 这个字还没打完 → 继续敲拼音
        if (!charDone) {
          return {
            ...state,
            pinyinTyped: state.pinyinTyped + action.char,
            totalKeystrokes: state.totalKeystrokes + 1,
            correctKeystrokes: state.correctKeystrokes + 1,
            consecutiveErrors: 0,
            errorChar: null,
            streak,
            bestStreak: Math.max(state.bestStreak, streak),
          }
        }

        // 这个字打完了 → 立刻变绿，光标移到下一个字
        const statuses = [...state.statuses]
        statuses[state.cursor] = 'correct'
        const cursor = state.cursor + 1

        return {
          ...state,
          statuses,
          cursor,
          pinyinTyped: '',
          segmentError: false,
          totalKeystrokes: state.totalKeystrokes + 1,
          correctKeystrokes: state.correctKeystrokes + 1,
          firstTryCorrectCount: state.firstTryCorrectCount + (state.segmentError ? 0 : 1),
          consecutiveErrors: 0,
          errorChar: null,
          streak,
          bestStreak: Math.max(state.bestStreak, streak),
          completedAt: cursor >= state.text.length ? action.at : state.completedAt,
        }
      }

      // ---- 普通字符（含中文标点：按对应的英文键） ----
      const char = state.text[state.cursor]
      const expected = CHINESE_PUNCTUATION_KEY[char] ?? char
      const actual = action.char

      if (expected !== actual) {
        return registerError(state, expected, actual, false)
      }

      const wasFirstTry = state.statuses[state.cursor] !== 'error'
      const statuses = [...state.statuses]
      statuses[state.cursor] = 'correct'
      const cursor = state.cursor + 1
      const streak = state.streak + 1

      return {
        ...state,
        statuses,
        cursor,
        totalKeystrokes: state.totalKeystrokes + 1,
        correctKeystrokes: state.correctKeystrokes + 1,
        firstTryCorrectCount: state.firstTryCorrectCount + (wasFirstTry ? 1 : 0),
        consecutiveErrors: 0,
        errorChar: null,
        streak,
        bestStreak: Math.max(state.bestStreak, streak),
        completedAt: cursor >= state.text.length ? action.at : state.completedAt,
      }
    }

    default:
      return state
  }
}

const MINUTE = 60_000

function safeDivide(a: number, b: number): number {
  return b <= 0 ? 0 : a / b
}

export function getElapsedMs(state: SessionState, now: number): number {
  const end = state.completedAt ?? now
  return Math.max(0, end - state.startedAt)
}

export interface LiveStatsOptions {
  now: number
  /** 前若干毫秒的击键不计入速度，避免刚开局数字爆炸 */
  warmupMs?: number
}

export function computeStats(state: SessionState, options: LiveStatsOptions) {
  const { now, warmupMs = 1500 } = options
  const elapsedMs = getElapsedMs(state, now)
  const effectiveMs = Math.max(elapsedMs, warmupMs)
  const minutes = effectiveMs / MINUTE
  const errorAdjusted = Math.max(state.correctKeystrokes - state.errorCount * 0.5, 0)

  return {
    wpm: Math.round(safeDivide(state.correctKeystrokes / 5, minutes)),
    cpm: Math.round(safeDivide(state.correctKeystrokes, minutes)),
    grossCpm: Math.round(safeDivide(state.totalKeystrokes, minutes)),
    accuracy: safeDivide(state.correctKeystrokes, state.totalKeystrokes),
    firstTryAccuracy: safeDivide(state.firstTryCorrectCount, Math.max(state.cursor, 1)),
    adjustedWpm: Math.round(safeDivide(errorAdjusted / 5, minutes)),
    elapsedMs,
    correctKeystrokes: state.correctKeystrokes,
    totalKeystrokes: state.totalKeystrokes,
    errorCount: state.errorCount,
    streak: state.streak,
    bestStreak: state.bestStreak,
    progressRatio: safeDivide(state.cursor, Math.max(state.text.length, 1)),
    completed: state.cursor >= state.text.length,
  }
}

export type LiveStats = ReturnType<typeof computeStats>

/** 星级判定：先准确后速度，正确率是主门槛。 */
export function computeStars(params: {
  accuracy: number
  wpm: number
  targetWpm: number
  completed: boolean
}): number {
  const { accuracy, wpm, targetWpm, completed } = params
  if (!completed || accuracy < 0.85) return 1
  if (accuracy >= 0.97 && wpm >= targetWpm) return 3
  if (accuracy >= 0.93) return 2
  return 1
}

export function topWeakKeys(errorMap: Record<string, number>, limit = 5): WeakKeyStat[] {
  return Object.entries(errorMap)
    .map(([char, count]) => ({ char, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export function topConfusions(confusionMap: Record<string, number>, limit = 3): ConfusionStat[] {
  return Object.entries(confusionMap)
    .map(([pair, count]) => {
      const [expected = '', actual = ''] = pair.split('>')
      return { expected, actual, count }
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export function buildSummary(state: SessionState, now: number, targetWpm: number): AttemptSummary {
  const stats = computeStats(state, { now })
  const completed = state.cursor >= state.text.length

  return {
    wpm: stats.wpm,
    cpm: stats.cpm,
    accuracy: stats.accuracy,
    firstTryAccuracy: stats.firstTryAccuracy,
    errorCount: state.errorCount,
    durationMs: stats.elapsedMs,
    stars: computeStars({ accuracy: stats.accuracy, wpm: stats.wpm, targetWpm, completed }),
    weakKeys: topWeakKeys(state.errorMap),
    confusions: topConfusions(state.confusionMap),
  }
}

/**
 * 将浏览器键盘事件转换为「期望字符」口径的字符。
 * 返回 null 表示这个按键不参与训练判定（修饰键、功能键、中文输入法组合中）。
 */
export function keyEventToChar(event: KeyboardEvent): string | null {
  if (event.isComposing || event.keyCode === 229) return null
  if (event.ctrlKey || event.metaKey || event.altKey) return null
  if (event.key === 'Dead') return null

  if (event.key === ' ' || event.key === 'Spacebar') return ' '
  if (event.key.length === 1) return event.key

  return null
}

/** 提示阶梯：连续错误次数 → 提示级别（L0-L4）。 */
export function hintLevelFor(consecutiveErrors: number): 0 | 1 | 2 | 3 | 4 {
  if (consecutiveErrors >= 5) return 4
  if (consecutiveErrors >= 3) return 3
  if (consecutiveErrors >= 2) return 2
  if (consecutiveErrors >= 1) return 1
  return 0
}