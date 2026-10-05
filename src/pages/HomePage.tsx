import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/common/Button'
import { Logo } from '@/components/common/Logo'
import { ProgressBar } from '@/components/common/ProgressBar'
import { SoundToggle } from '@/components/common/SoundToggle'
import { Backdrop } from '@/components/fx/Backdrop'
import { Icon, type IconName } from '@/components/icons/Icon'
import { Mascot } from '@/components/mascot/Mascot'
import { STAGES } from '@/data/courses'
import { getNextLesson, getStageStats, getTotalStars } from '@/engine/progress'
import { levelFromXp, xpFromStars, xpToNextLevel } from '@/engine/rewards'
import { sfx } from '@/engine/sfx'
import { useCurrentChild, useCurrentProgress, useLessonProgress } from '@/store/selectors'

const JOURNEY: Array<{ icon: IconName; label: string }> = [
  { icon: 'keyboard', label: '认键盘' },
  { icon: 'code', label: '敲符号' },
  { icon: 'gamepad', label: '做游戏' },
]

const FOOTER_LINKS: Array<{ icon: IconName; label: string; path: string }> = [
  { icon: 'map', label: '地图', path: '/map' },
  { icon: 'award', label: '排行榜', path: '/ranking' },
  { icon: 'gear', label: '设置', path: '/settings' },
]

/** 首页：一句话、一个大按钮、一条路线。图标全部线性化，背景改成柔光。 */
export default function HomePage() {
  const navigate = useNavigate()
  const child = useCurrentChild()
  const lessons = useLessonProgress()
  const progress = useCurrentProgress()

  const totalStars = getTotalStars(STAGES, lessons)
  const level = levelFromXp(xpFromStars(totalStars))
  const nextLevel = xpToNextLevel(xpFromStars(totalStars))
  const nextLesson = child ? getNextLesson(STAGES, lessons) : null
  const stageOne = getStageStats(STAGES[0], lessons)

  const start = () => {
    sfx.unlock()
    if (!child) {
      navigate('/login')
      return
    }
    navigate(nextLesson ? `/lesson/${nextLesson.id}` : '/map')
  }

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center gap-8 px-4 py-6">
      <Backdrop />

      <header className="flex w-full items-center justify-between">
        <Logo size={44} />
        <div className="flex items-center gap-2">
          {child ? (
            <Button variant="secondary" size="sm" onClick={() => navigate('/map')}>
              <Icon name="map" size={16} />
              学习地图
            </Button>
          ) : null}
          <SoundToggle />
        </div>
      </header>

      <section className="flex flex-col items-center gap-5 pt-2">
        <Mascot mood={child ? 'happy' : 'cheer'} size={128} />

        <div className="space-y-2 text-center">
          <h1 className="font-display text-5xl font-extrabold leading-tight sm:text-6xl">
            打字冒险
          </h1>
          <p className="text-lg font-bold text-ink-soft">
            {child ? `${child.nickname}，继续闯关吧` : '认键盘 · 敲符号 · 做游戏'}
          </p>
        </div>

        <button
          type="button"
          onClick={start}
          className="anim-float inline-flex items-center gap-3 rounded-kid bg-brand-500 px-8 py-4 text-2xl font-extrabold text-white shadow-kid active:translate-y-[1px]"
        >
          <Icon name="play" size={24} filled />
          {child ? (nextLesson ? `继续第 ${nextLesson.order} 关` : '去地图看看') : '开始冒险'}
        </button>
      </section>

      <section className="flex items-center gap-3">
        {JOURNEY.map((step, index) => (
          <div key={step.label} className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1.5 rounded-kid border border-surface-line bg-white px-5 py-3">
              <Icon name={step.icon} size={22} className="text-brand-500" />
              <span className="text-sm font-extrabold text-ink-soft">{step.label}</span>
            </div>
            {index < JOURNEY.length - 1 ? (
              <Icon name="chevronRight" size={18} className="text-ink-faint" />
            ) : null}
          </div>
        ))}
      </section>

      {child ? (
        <section className="w-full max-w-md space-y-3 rounded-kid border border-surface-line bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="rounded-md border border-brand-200 bg-brand-50 px-2 py-0.5 font-mono text-xs font-extrabold text-brand-700">
              等级{level}
            </span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <Icon name="star" size={15} filled className="text-ember-500" />
                <span className="font-mono text-sm font-extrabold tabular-nums">{totalStars}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="flame" size={15} className="text-ember-600" />
                <span className="font-mono text-sm font-extrabold tabular-nums">
                  {progress.streak.current}
                </span>
              </span>
            </div>
          </div>

          <ProgressBar value={nextLevel.ratio} />

          <div className="flex items-center justify-between text-xs font-bold text-ink-soft">
            <span>
              第 1 岛 {stageOne.completed}/{stageOne.total}
            </span>
            <span>{nextLesson ? `下一关：${nextLesson.title}` : '第 1 岛全部通关啦'}</span>
          </div>
        </section>
      ) : null}

      <footer className="mt-auto flex flex-wrap items-center justify-center gap-2 pb-4">
        {FOOTER_LINKS.map((link) => (
          <button
            key={link.label}
            type="button"
            onClick={() => {
              navigate(link.path)
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-surface-line bg-white px-3 py-1.5 text-xs font-extrabold text-ink-soft transition hover:border-brand-300 hover:text-brand-600"
          >
            <Icon name={link.icon} size={14} />
            {link.label}
          </button>
        ))}
        <span className="w-full pt-1 text-center text-xs font-bold text-ink-faint">
          需要电脑键盘 · 右上角可以调音量
        </span>
      </footer>
    </div>
  )
}
