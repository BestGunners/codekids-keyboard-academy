import { useNavigate } from 'react-router-dom'
import { Icon } from '@/components/icons/Icon'
import { ProgressBar } from '@/components/common/ProgressBar'
import { SoundToggle } from '@/components/common/SoundToggle'
import { getAvatar } from '@/data/avatars'
import { STAGES } from '@/data/courses'
import { getTotalStars } from '@/engine/progress'
import { levelFromXp, xpFromStars, xpToNextLevel } from '@/engine/rewards'
import { useChildStore } from '@/store/childStore'
import { useCurrentChild, useCurrentProgress, useLessonProgress } from '@/store/selectors'

export interface KidHeaderProps {
  showMapLink?: boolean
}

/** 顶部状态条：头像 + 等级能量条 + 星星 + 连续天数，图标全部用线性图标。 */
export function KidHeader({ showMapLink = true }: KidHeaderProps) {
  const child = useCurrentChild()
  const navigate = useNavigate()
  const logout = useChildStore((state) => state.logout)
  const lessons = useLessonProgress()
  const progress = useCurrentProgress()

  if (!child) return null

  const avatar = getAvatar(child.avatarId)
  const totalStars = getTotalStars(STAGES, lessons)
  const xp = xpFromStars(totalStars)
  const level = levelFromXp(xp)
  const nextLevel = xpToNextLevel(xp)

  const iconButton =
    'flex h-9 w-9 items-center justify-center rounded-xl border border-surface-line bg-white text-ink-soft transition hover:border-brand-300 hover:text-brand-600'

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 rounded-kid border border-surface-line bg-white px-4 py-3 shadow-[0_1px_2px_rgba(18,32,58,0.04)]">
      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-xl text-2xl"
          style={{ backgroundColor: `${avatar.color}22` }}
        >
          {avatar.emoji}
        </span>
        <div className="leading-tight">
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold">{child.nickname}</span>
            <span className="rounded-md border border-brand-200 bg-brand-50 px-1.5 py-0.5 font-mono text-[11px] font-extrabold text-brand-700">
              等级{level}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <ProgressBar value={nextLevel.ratio} className="h-1.5 w-28" />
            <span className="font-mono text-[10px] font-bold text-ink-faint">
              {nextLevel.current}/{nextLevel.needed}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-xl border border-surface-line bg-white px-2.5 py-1.5">
          <Icon name="star" size={14} filled className="text-ember-500" />
          <span className="font-mono text-sm font-extrabold tabular-nums">{totalStars}</span>
        </span>
        <span className="flex items-center gap-1.5 rounded-xl border border-surface-line bg-white px-2.5 py-1.5">
          <Icon name="flame" size={14} className="text-ember-600" />
          <span className="font-mono text-sm font-extrabold tabular-nums">
            {progress.streak.current}
          </span>
        </span>
        <SoundToggle />
        {showMapLink ? (
          <button
            type="button"
            aria-label="学习地图"
            className={iconButton}
            onClick={() => {
              navigate('/map')
            }}
          >
            <Icon name="map" size={18} />
          </button>
        ) : null}
        <button
          type="button"
          aria-label="排行榜"
          className={iconButton}
          onClick={() => {
            navigate('/ranking')
          }}
        >
          <Icon name="award" size={18} />
        </button>
        <button
          type="button"
          aria-label="设置"
          className={iconButton}
          onClick={() => {
            navigate('/settings')
          }}
        >
          <Icon name="gear" size={18} />
        </button>
        <button
          type="button"
          className="rounded-xl px-3 py-2 text-xs font-extrabold text-ink-faint transition hover:text-ink-soft"
          onClick={() => {
            logout()
          }}
        >
          退出
        </button>
      </div>
    </header>
  )
}
