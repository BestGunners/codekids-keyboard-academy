import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/common/Button'
import { Logo } from '@/components/common/Logo'
import { ProgressBar } from '@/components/common/ProgressBar'
import { SoundToggle } from '@/components/common/SoundToggle'
import { Backdrop } from '@/components/fx/Backdrop'
import { Icon, type IconName } from '@/components/icons/Icon'
import { STAGES } from '@/data/courses'
import { getNextLesson, getStageStats, getTotalStars } from '@/engine/progress'
import { levelFromXp, xpFromStars, xpToNextLevel } from '@/engine/rewards'
import { sfx } from '@/engine/sfx'
import { useCurrentChild, useCurrentProgress, useLessonProgress } from '@/store/selectors'
import { cn } from '@/utils/cn'

const JOURNEY: Array<{ icon: IconName; label: string; hint: string; chip: string }> = [
  {
    icon: 'keyboard',
    label: '认键盘',
    hint: '手指各就各位',
    chip: 'border-brand-200 bg-brand-50 text-brand-600',
  },
  {
    icon: 'code',
    label: '敲符号',
    hint: '括号和运算符',
    chip: 'border-[#ded0ff] bg-[#f5f0ff] text-candy-purple',
  },
  {
    icon: 'gamepad',
    label: '做游戏',
    hint: '写自己的小游戏',
    chip: 'border-[#ffd0e0] bg-[#fff0f5] text-[#e0457a]',
  },
]

const FOOTER_LINKS: Array<{ icon: IconName; label: string; path: string }> = [
  { icon: 'map', label: '地图', path: '/map' },
  { icon: 'award', label: '排行榜', path: '/ranking' },
  { icon: 'gear', label: '设置', path: '/settings' },
]

/** 漂浮的键帽：围绕标题散开，每个的速度和角度都不一样，像飘在半空 */
const FLOATING_KEYS: Array<{
  label: string
  pos: string
  size: string
  rotate: string
  color: string
  delay: string
  duration: string
  hideOnMobile?: boolean
}> = [
  { label: 'Q', pos: 'left-[4%] top-[10%]', size: 'h-16 w-16 text-2xl', rotate: '-rotate-12', color: '#6693fb', delay: '0s', duration: '5.4s' },
  { label: 'S', pos: 'left-[11%] top-[46%]', size: 'h-14 w-14 text-xl', rotate: 'rotate-6', color: '#2fd4c4', delay: '1.2s', duration: '6.2s' },
  { label: 'A', pos: 'left-[3%] bottom-[12%]', size: 'h-12 w-12 text-lg', rotate: '-rotate-6', color: '#a78bfa', delay: '2.1s', duration: '5.8s', hideOnMobile: true },
  { label: 'F', pos: 'left-[20%] bottom-[2%]', size: 'h-11 w-11 text-base', rotate: 'rotate-12', color: '#ffb35c', delay: '0.6s', duration: '6.6s', hideOnMobile: true },
  { label: 'J', pos: 'right-[4%] top-[14%]', size: 'h-16 w-16 text-2xl', rotate: 'rotate-12', color: '#ff8fb1', delay: '0.9s', duration: '5.6s' },
  { label: ';', pos: 'right-[12%] top-[50%]', size: 'h-14 w-14 text-2xl', rotate: '-rotate-6', color: '#6fd08c', delay: '1.8s', duration: '6.4s' },
  { label: '{', pos: 'right-[3%] bottom-[14%]', size: 'h-12 w-12 text-lg', rotate: 'rotate-6', color: '#57d6c4', delay: '2.6s', duration: '5.2s', hideOnMobile: true },
  { label: 'K', pos: 'right-[21%] bottom-[1%]', size: 'h-11 w-11 text-base', rotate: '-rotate-12', color: '#f9a826', delay: '3.1s', duration: '6.8s', hideOnMobile: true },
]

/**
 * 首页：标题是主角，周围飘着键帽，背景是柔光 + 网格。
 * 一句话说清"认键盘 → 敲符号 → 做游戏"，一个按钮进入冒险，孩子有进度时下面多一张档案卡。
 */
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
    <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center gap-6 px-4 py-6">
      <Backdrop />

      <header className="z-10 flex w-full items-center justify-between">
        <Logo size={46} />
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

      {/* ---------- 主视觉：标题 + 漂浮键帽 ---------- */}
      <section className="relative flex w-full flex-col items-center justify-center py-4 sm:flex-1 sm:py-10">
        {/* 标题背后的柔光 */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-72 w-[36rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-brand-200/45 via-candy-purple/25 to-candy-pink/35 blur-3xl"
          aria-hidden
        />

        {FLOATING_KEYS.map((key) => (
          <span
            key={key.label}
            aria-hidden
            className={cn(
              'pointer-events-none absolute z-0',
              key.hideOnMobile ? 'hidden md:block' : 'hidden sm:block',
              key.pos,
              key.rotate,
            )}
          >
            <span
              className={cn(
                'anim-float flex items-center justify-center rounded-2xl border-2 bg-white/75 font-mono font-extrabold backdrop-blur-sm',
                'shadow-[0_14px_24px_-16px_rgba(18,32,58,0.55),inset_0_-3px_0_rgba(18,32,58,0.06)]',
                key.size,
              )}
              style={{
                borderColor: key.color,
                color: key.color,
                animationDelay: key.delay,
                animationDuration: key.duration,
              }}
            >
              {key.label}
            </span>
          </span>
        ))}

        <div className="relative z-10 flex flex-col items-center gap-4">
          <h1 className="font-display text-6xl font-extrabold leading-[1.15] tracking-wide sm:text-7xl">
            <span className="bg-gradient-to-r from-brand-600 via-candy-purple to-candy-pink bg-clip-text text-transparent">
              敲敲岛
            </span>
          </h1>

          {/* 标题下面的彩色小弧线 */}
          <span
            aria-hidden
            className="h-2.5 w-44 rounded-full bg-gradient-to-r from-candy-yellow via-candy-orange to-candy-pink opacity-90 sm:w-56"
          />

          <p className="text-lg font-extrabold text-ink-soft">
            {child ? `${child.nickname}，继续闯关吧` : '认键盘 · 敲符号 · 做游戏'}
          </p>

          <button
            type="button"
            onClick={start}
            className="group mt-1 inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-brand-500 via-brand-400 to-candy-purple px-9 py-4 text-2xl font-extrabold text-white shadow-[0_18px_32px_-18px_rgba(39,87,214,0.95)] transition duration-200 hover:-translate-y-0.5 hover:brightness-[1.04] active:translate-y-[2px] active:shadow-none"
          >
            <Icon name="play" size={24} filled />
            {child ? (nextLesson ? `继续第 ${nextLesson.order} 关` : '去地图看看') : '开始冒险'}
          </button>
        </div>
      </section>

      {/* ---------- 三步路线 ---------- */}
      <section className="z-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {JOURNEY.map((step, index) => (
          <div key={step.label} className="flex items-center gap-2 sm:gap-3">
            <div className="flex min-w-[7.5rem] flex-col items-center gap-1.5 rounded-2xl border border-surface-line bg-white/85 px-5 py-3 shadow-[0_10px_20px_-18px_rgba(18,32,58,0.5)] backdrop-blur-sm transition hover:-translate-y-0.5">
              <span
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-xl border',
                  step.chip,
                )}
              >
                <Icon name={step.icon} size={18} />
              </span>
              <span className="text-sm font-extrabold text-ink">{step.label}</span>
              <span className="text-[11px] font-bold text-ink-faint">{step.hint}</span>
            </div>
            {index < JOURNEY.length - 1 ? (
              <Icon name="chevronRight" size={18} className="hidden text-ink-faint sm:block" />
            ) : null}
          </div>
        ))}
      </section>

      {/* ---------- 孩子的档案卡 ---------- */}
      {child ? (
        <section className="z-10 w-full max-w-md space-y-3 rounded-2xl border border-surface-line bg-white/90 p-4 shadow-[0_14px_28px_-22px_rgba(18,32,58,0.5)] backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="rounded-lg bg-gradient-to-r from-brand-500 to-candy-purple px-2.5 py-0.5 font-mono text-xs font-extrabold text-white">
              等级 {level}
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

      <footer className="z-10 mt-auto flex flex-wrap items-center justify-center gap-2 pb-4">
        {FOOTER_LINKS.map((link) => (
          <button
            key={link.label}
            type="button"
            onClick={() => {
              navigate(link.path)
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-surface-line bg-white/85 px-3 py-1.5 text-xs font-extrabold text-ink-soft backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-600"
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
