import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/common/Card'
import { Icon } from '@/components/icons/Icon'
import { FingerHint } from '@/components/keyboard/FingerHint'
import { VirtualKeyboard } from '@/components/keyboard/VirtualKeyboard'
import { Mascot, type MascotMood } from '@/components/mascot/Mascot'
import { CodeStage } from '@/components/stage/CodeStage'
import { ComboMeter } from '@/components/typing/ComboMeter'
import { PinyinBar } from '@/components/typing/PinyinBar'
import { TextStream } from '@/components/typing/TextStream'
import { TypingStatsPanel } from '@/components/typing/TypingStatsPanel'
import { WarningBanner } from '@/components/typing/WarningBanner'
import { addDrillResult, createAccumulator, finalizeAttempt } from '@/engine/attemptAggregator'
import { findCodePartOccurrences, type CodePart } from '@/engine/codeParts'
import { comboCheer, isComboMilestone } from '@/engine/rewards'
import { sfx } from '@/engine/sfx'
import type { SessionState } from '@/engine/typingEngine'
import { useTypingSession } from '@/hooks/useTypingSession'
import { ageBandOf, type ChildProfile } from '@/store/childStore'
import type { Lesson } from '@/types/course'
import type { AttemptSummary } from '@/types/typing'
import { cn } from '@/utils/cn'

export interface TypingStageProps {
  lesson: Lesson
  child: ChildProfile
  onFinish: (summary: AttemptSummary) => void
}

/** 会出现在编程舞台上的关卡类型：符号关、代码关、游戏关 */
const STAGE_LESSON_KINDS = ['symbols', 'code', 'game']

/**
 * 训练主体：要打的字是画面主角，手指提示和键盘都保持紧凑，
 * 编程关卡在旁边多一块「编程舞台」，敲到代码零件就演给你看。
 */
export function TypingStage({ lesson, child, onFinish }: TypingStageProps) {
  const navigate = useNavigate()
  const [drillIndex, setDrillIndex] = useState(0)
  const [mood, setMood] = useState<MascotMood>('idle')
  const [celebration, setCelebration] = useState<string | null>(null)
  const [drillClear, setDrillClear] = useState(false)
  const [activePart, setActivePart] = useState<CodePart | null>(null)
  const [discovered, setDiscovered] = useState<CodePart[]>([])
  const accumulatorRef = useRef(createAccumulator(Date.now()))
  const lastTriggerRef = useRef<{ id: string; at: number }>({ id: '', at: 0 })

  const drill = lesson.drills[drillIndex]
  const isLastDrill = drillIndex >= lesson.drills.length - 1
  const ageBand = ageBandOf(child.age)
  const hasStage = STAGE_LESSON_KINDS.includes(lesson.kind)
  const occurrences = useMemo(() => findCodePartOccurrences(drill.text), [drill.text])

  const handleComplete = useCallback(
    (state: SessionState) => {
      accumulatorRef.current = addDrillResult(accumulatorRef.current, state, Date.now())
      sfx.drillDone()
      setMood('cheer')
      setDrillClear(true)

      if (isLastDrill) {
        window.setTimeout(
          () => onFinish(finalizeAttempt(accumulatorRef.current, lesson.targetWpm)),
          650,
        )
        return
      }

      window.setTimeout(() => {
        setDrillClear(false)
        setMood('idle')
        setDrillIndex((index) => index + 1)
      }, 650)
    },
    [isLastDrill, lesson.targetWpm, onFinish],
  )

  const session = useTypingSession({ text: drill.text, onComplete: handleComplete })
  // 中文段落时，这里给出的是要敲的拼音字母（拼音打完是空格）
  const targetChar = session.expectedKey
  const streak = session.state.streak

  useEffect(() => {
    setActivePart(null)
  }, [drill.id])

  // 每一次击键都有即时反馈：声音 + 表情
  useEffect(() => {
    if (!session.lastStroke) return undefined
    const { sound } = session.lastStroke
    const correct = sound !== 'wrong'

    // 声音由引擎在按键的当下算好，界面只负责放哪一声：
    //   chinese = 打出一个汉字（一声「叮」）
    //   pinyin  = 拼音中间的字母（静音，只靠颜色反馈）
    //   correct = 普通字母和符号（清脆的「嗒」）
    //   wrong   = 敲错（柔和低音）
    if (sound === 'chinese') sfx.hanzi()
    else if (sound === 'correct') sfx.key()
    else if (sound === 'wrong') sfx.oops()

    setMood(correct ? 'happy' : 'oops')
    const timer = window.setTimeout(() => setMood('idle'), correct ? 420 : 850)
    return () => window.clearTimeout(timer)
  }, [session.lastStroke])

  // 连击里程碑
  useEffect(() => {
    if (!isComboMilestone(streak)) return undefined
    sfx.combo(streak)
    setCelebration(comboCheer(streak))
    const timer = window.setTimeout(() => setCelebration(null), 1100)
    return () => window.clearTimeout(timer)
  }, [streak])

  // 敲到一个代码零件 → 舞台立刻演出并解释
  useEffect(() => {
    if (!hasStage) return

    const justTyped = session.state.cursor - 1
    if (justTyped < 0) return

    const hit = occurrences.find((item) => item.end === justTyped)
    if (!hit) return

    // 同一个零件短时间内重复出现（比如一对引号）就不重复打断
    const now = Date.now()
    if (lastTriggerRef.current.id === hit.part.id && now - lastTriggerRef.current.at < 2500) return
    lastTriggerRef.current = { id: hit.part.id, at: now }

    setActivePart(hit.part)
    setDiscovered((list) =>
      list.some((item) => item.id === hit.part.id) ? list : [...list, hit.part],
    )
    sfx.keyword()
  }, [session.state.cursor, occurrences, hasStage])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Mascot mood={mood} size={44} />
          <div className="flex items-center gap-2">
            {lesson.drills.map((item, index) => (
              <span
                key={item.id}
                className={cn(
                  'h-2.5 rounded-full transition-all',
                  index < drillIndex
                    ? 'w-2.5 bg-[#6fd08c]'
                    : index === drillIndex
                      ? 'w-7 bg-brand-500'
                      : 'w-2.5 bg-brand-100',
                )}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-label="回到地图"
          onClick={() => {
            navigate('/map')
          }}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-surface-line bg-white text-ink-soft transition hover:border-brand-300 hover:text-brand-600"
        >
          <Icon name="close" size={16} />
        </button>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.9fr_1fr]">
        <div className="relative space-y-3">
          {celebration ? (
            <div className="anim-pop-in pointer-events-none absolute -top-3 left-1/2 z-20 -translate-x-1/2 rounded-2xl bg-[#ffd95c] px-5 py-1.5 text-lg font-extrabold text-[#8a6410] shadow-pop">
              {celebration}
            </div>
          ) : null}

          <TextStream
            text={session.state.text}
            statuses={session.state.statuses}
            cursor={session.state.cursor}
            variant={hasStage ? 'code' : 'kid'}
            segments={session.state.segments}
            pinyinTyped={session.state.pinyinTyped}
          />

          <PinyinBar task={session.pinyinTask} />

          <div className="flex flex-wrap items-center gap-3">
            <ComboMeter streak={streak} milestone={celebration !== null} />
            <TypingStatsPanel
              stats={session.stats}
              targetWpm={lesson.targetWpm}
              ageBand={ageBand}
            />
          </div>
        </div>

        {hasStage ? (
          <CodeStage part={activePart} discovered={discovered} className="h-[186px] overflow-hidden" />
        ) : (
          <Card className="h-[186px] space-y-2 overflow-hidden p-3">
            <div className="text-[11px] font-extrabold text-ink-soft">本关重点</div>
            <div className="flex flex-wrap gap-1.5">
              {lesson.focusChars.map((char) => (
                <span
                  key={char}
                  className="rounded-lg bg-brand-50 px-2.5 py-1 font-mono text-sm font-extrabold text-brand-700"
                >
                  {char === ' ' ? '空格' : char}
                </span>
              ))}
            </div>
          </Card>
        )}
      </div>

      <FingerHint char={targetChar} level={session.hintLevel} onSkip={session.skip} />

      {session.imeActive || session.capsLock ? (
        <div className="pointer-events-none fixed left-1/2 top-20 z-50 w-[min(92vw,520px)] -translate-x-1/2 space-y-2">
          {session.imeActive ? (
            <WarningBanner icon="keyboard" title="先把输入法切成 English">
              按 Shift 或点右下角键盘图标，选 English 就能继续啦。
            </WarningBanner>
          ) : null}
          {session.capsLock ? (
            <WarningBanner icon="lock" title="大写锁定开着啦">
              按一下 Caps Lock 关掉它。
            </WarningBanner>
          ) : null}
        </div>
      ) : null}

      <Card className="p-2">
        <VirtualKeyboard targetChar={targetChar} lastStroke={session.lastStroke} size="sm" />
      </Card>

      {drillClear ? (
        <div className="anim-pop-in pointer-events-none fixed inset-0 z-40 flex items-center justify-center">
          <div className="rounded-kid bg-white/95 px-10 py-6 text-3xl font-extrabold text-[#2f9d63] shadow-pop">
            {isLastDrill ? '全部完成啦！' : '答对啦！'}
          </div>
        </div>
      ) : null}
    </div>
  )
}
