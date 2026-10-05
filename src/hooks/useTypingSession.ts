import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import {
  computeStats,
  createSession,
  getExpectedKey,
  getPinyinTask,
  hintLevelFor,
  keyEventToChar,
  strokeSound,
  typingReducer,
  type SessionState,
  type StrokeSound,
} from '@/engine/typingEngine'

export interface LastStroke {
  char: string
  correct: boolean
  /** 这一次击键该配的声音：引擎在按键的当下算好，界面直接照着放 */
  sound: StrokeSound
  at: number
}

export interface UseTypingSessionParams {
  text: string
  enabled?: boolean
  onComplete?: (state: SessionState) => void
}

/**
 * 打字训练会话：
 * - 监听键盘事件并按「期望字符」判定
 * - 维护实时 WPM / 正确率 / 连续正确
 * - 检测 Caps Lock 与中文输入法状态，供界面给出儿童化提示
 * - 连续错误次数驱动提示阶梯（L0-L4）
 */
export function useTypingSession({ text, enabled = true, onComplete }: UseTypingSessionParams) {
  const [state, dispatch] = useReducer(typingReducer, undefined, () =>
    createSession(text, Date.now()),
  )
  const [now, setNow] = useState(() => Date.now())
  const [capsLock, setCapsLock] = useState(false)
  const [imeActive, setImeActive] = useState(false)
  const [lastStroke, setLastStroke] = useState<LastStroke | null>(null)

  const stateRef = useRef(state)
  const completedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)

  stateRef.current = state
  onCompleteRef.current = onComplete

  // 切换题目时重置会话
  useEffect(() => {
    completedRef.current = false
    setLastStroke(null)
    dispatch({ type: 'reset', text, at: Date.now() })
  }, [text])

  // 实时刷新时钟，让 WPM 数字平滑变化
  useEffect(() => {
    if (state.completedAt) return undefined
    const timer = window.setInterval(() => setNow(Date.now()), 400)
    return () => window.clearInterval(timer)
  }, [state.completedAt])

  useEffect(() => {
    if (!enabled) return undefined

    const handleKeyDown = (event: KeyboardEvent) => {
      setCapsLock(event.getModifierState?.('CapsLock') ?? false)
      if (event.isComposing) {
        setImeActive(true)
        return
      }

      const char = keyEventToChar(event)
      if (char === null) return

      // 阻止空格滚动页面、Tab 切换焦点等默认行为
      event.preventDefault()

      const current = stateRef.current
      if (current.cursor >= current.text.length) return

      // 对错与声音都交给引擎在「按键这一刻」算好：
      // 中文按拼音字母判、中文标点按对应的英文键判，
      // 并且靠光标有没有前进来区分「拼音敲了一半」和「一个字打出来了」。
      const sound = strokeSound(current, char)
      const at = Date.now()

      setNow(at)
      setLastStroke({ char, correct: sound !== 'wrong', at, sound })
      dispatch({ type: 'keystroke', char, at })
    }

    const handleCompositionStart = () => setImeActive(true)
    const handleCompositionEnd = () => setImeActive(false)

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('compositionstart', handleCompositionStart)
    window.addEventListener('compositionend', handleCompositionEnd)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('compositionstart', handleCompositionStart)
      window.removeEventListener('compositionend', handleCompositionEnd)
    }
  }, [enabled])

  // 本题完成时回调一次
  useEffect(() => {
    if (!state.completedAt || completedRef.current) return
    completedRef.current = true
    onCompleteRef.current?.(state)
  }, [state])

  const stats = useMemo(() => computeStats(state, { now }), [state, now])
  const hintLevel = hintLevelFor(state.consecutiveErrors)
  // 中文段落要打拼音，所以「该按哪个键」由引擎给出
  const expectedKey = getExpectedKey(state)
  const pinyinTask = getPinyinTask(state)

  const skip = useCallback(() => {
    dispatch({ type: 'skip', at: Date.now() })
  }, [])

  const restart = useCallback(() => {
    completedRef.current = false
    setLastStroke(null)
    dispatch({ type: 'reset', text: stateRef.current.text, at: Date.now() })
  }, [])

  return {
    state,
    stats,
    hintLevel,
    expectedKey,
    pinyinTask,
    capsLock,
    imeActive,
    lastStroke,
    skip,
    restart,
  }
}
