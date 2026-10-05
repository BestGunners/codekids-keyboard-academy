import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card } from '@/components/common/Card'
import { AppShell } from '@/components/layout/AppShell'
import { CodeRunner } from '@/components/code/CodeRunner'
import { KidHeader } from '@/components/layout/KidHeader'
import { Icon } from '@/components/icons/Icon'
import { LevelIntro } from '@/components/typing/LevelIntro'
import { TypingResult } from '@/components/typing/TypingResult'
import { TypingStage } from '@/components/typing/TypingStage'
import { STAGES } from '@/data/courses'
import { getLessonProgram } from '@/data/programs'
import { findLesson, getLessonAfter, getTotalStars } from '@/engine/progress'
import { levelFromXp, xpFromStars, xpToNextLevel } from '@/engine/rewards'
import { useProgressStore } from '@/store/progressStore'
import { useCurrentChild, useLessonProgress } from '@/store/selectors'
import type { AttemptSummary } from '@/types/typing'

interface ResultState {
  summary: AttemptSummary
  newBadges: string[]
  /** 编程关的程序有没有跑对 */
  codePassed: boolean
}

const EMPTY_SUMMARY: AttemptSummary = {
  wpm: 0,
  cpm: 0,
  accuracy: 0,
  firstTryAccuracy: 0,
  errorCount: 0,
  durationMs: 0,
  stars: 0,
  weakKeys: [],
  confusions: [],
}

type Phase = 'intro' | 'play' | 'run' | 'done'

export default function TypingPage() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  const child = useCurrentChild()
  const lessons = useLessonProgress()
  const recordAttempt = useProgressStore((state) => state.recordAttempt)

  const [phase, setPhase] = useState<Phase>('intro')
  const [roundKey, setRoundKey] = useState(0)
  const [result, setResult] = useState<ResultState | null>(null)
  const [pending, setPending] = useState<{ summary: AttemptSummary; newBadges: string[] } | null>(
    null,
  )

  const lesson = lessonId ? findLesson(STAGES, lessonId) : null

  // 换关卡时重新走一遍开场倒计时，保持每次进入都有「开始游戏」的仪式感
  useEffect(() => {
    setPhase('intro')
    setRoundKey(0)
    setResult(null)
    setPending(null)
  }, [lessonId])

  if (!child) return null

  if (!lesson || lesson.drills.length === 0) {
    return (
      <AppShell className="gap-5">
        <KidHeader />
        <Card className="flex flex-col items-center gap-4 py-10 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-400">`n            <Icon name="run" size={30} />`n          </span>
          <h1 className="text-2xl font-extrabold">这里还在建设中</h1>
          <button
            type="button"
            onClick={() => navigate('/map')}
            className="rounded-kid bg-brand-500 px-6 py-3 text-lg font-extrabold text-white shadow-kid"
          >
            回地图看看别的
          </button>
        </Card>
      </AppShell>
    )
  }

  const program = getLessonProgram(lesson.id)

  const finishLesson = (codePassed: boolean) => {
    if (!pending) return
    setResult({ summary: pending.summary, newBadges: pending.newBadges, codePassed })
    setPhase('done')
  }

  const handleFinish = (summary: AttemptSummary) => {
    // 打字练完就先把成绩记下来，这样中途离开也不会丢星星
    const { newBadges } = recordAttempt(child.id, lesson.id, summary)

    // 有可运行程序的关卡，接着去「写代码时间」把程序跑起来
    if (program) {
      setPending({ summary, newBadges })
      setPhase('run')
      return
    }

    setResult({ summary, newBadges, codePassed: false })
    setPhase('done')
  }

  const xp = xpFromStars(getTotalStars(STAGES, lessons))
  const nextLevel = xpToNextLevel(xp)
  const upcoming = getLessonAfter(STAGES, lesson.id, lessons)
  const nextLesson = upcoming && upcoming.id !== lesson.id ? upcoming : null

  return (
    <AppShell className="gap-4">
      {phase !== 'play' ? <KidHeader /> : null}

      {phase === 'intro' ? (
        <LevelIntro
          lesson={lesson}
          onStart={() => setPhase('play')}
          onBack={() => {
            navigate('/map')
          }}
        />
      ) : null}

      {phase === 'run' && program && pending ? (
        <CodeRunner
          lessonLabel={`第 ${lesson.stageId} 岛 · 第 ${lesson.order} 关 · ${lesson.title}`}
          program={program}
          onFinish={finishLesson}
        />
      ) : null}

      {phase === 'play' ? (
        <TypingStage
          key={`${lesson.id}-${roundKey}`}
          lesson={lesson}
          child={child}
          onFinish={handleFinish}
        />
      ) : null}

      <TypingResult
        open={phase === 'done' && result !== null}
        lesson={lesson}
        summary={result?.summary ?? EMPTY_SUMMARY}
        newBadgeIds={result?.newBadges ?? []}
        codePassed={result?.codePassed ?? false}
        level={levelFromXp(xp)}
        xpRatio={nextLevel.ratio}
        nextLesson={nextLesson}
        onNextLevel={() => {
          if (nextLesson) navigate(`/lesson/${nextLesson.id}`)
        }}
        onRetry={() => {
          setResult(null)
          setRoundKey((key) => key + 1)
          setPhase('play')
        }}
        onBackToMap={() => {
          navigate('/map')
        }}
      />
    </AppShell>
  )
}
