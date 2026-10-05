import { useMemo, useState } from 'react'
import { ProgressBar } from '@/components/common/ProgressBar'
import { Icon, type IconName } from '@/components/icons/Icon'
import { AppShell } from '@/components/layout/AppShell'
import { KidHeader } from '@/components/layout/KidHeader'
import { Mascot } from '@/components/mascot/Mascot'
import { getAvatar } from '@/data/avatars'
import { STAGES } from '@/data/courses'
import { buildRankEntries, metricOf, rankBy, type RankingMetric } from '@/engine/ranking'
import { useChildStore } from '@/store/childStore'
import { useProgressStore } from '@/store/progressStore'
import { useCurrentChild } from '@/store/selectors'
import { cn } from '@/utils/cn'

const TABS: Array<{ id: RankingMetric; label: string; icon: IconName; unit: string }> = [
  { id: 'xp', label: '能量榜', icon: 'star', unit: '能量' },
  { id: 'speed', label: '速度榜', icon: 'bolt', unit: '词/分' },
  { id: 'streak', label: '坚持榜', icon: 'flame', unit: '天' },
]

/** 排行榜：只统计这台电脑上的小朋友，名次用色块徽章表示。 */
export default function RankingPage() {
  const child = useCurrentChild()
  const profiles = useChildStore((state) => state.profiles)
  const byChild = useProgressStore((state) => state.byChild)
  const [tab, setTab] = useState<RankingMetric>('xp')

  const entries = useMemo(
    () => rankBy(buildRankEntries(profiles, byChild, STAGES), tab),
    [profiles, byChild, tab],
  )

  if (!child) return null

  const activeTab = TABS.find((item) => item.id === tab) ?? TABS[0]
  const maxValue = entries.reduce((max, entry) => Math.max(max, metricOf(entry, tab)), 0)

  return (
    <AppShell className="gap-5">
      <KidHeader />

      <div className="flex flex-col items-center gap-5">
        <div className="flex items-center gap-3">
          <Mascot mood="cheer" size={56} />
          <h1 className="font-display text-3xl font-extrabold">排行榜</h1>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTab(item.id)
              }}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-base font-extrabold transition',
                tab === item.id
                  ? 'border-transparent bg-brand-500 text-white shadow-kid'
                  : 'border-surface-line bg-white text-ink-soft hover:border-brand-300 hover:text-brand-600',
              )}
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="w-full max-w-xl space-y-2">
          {entries.map((entry, index) => {
            const avatar = getAvatar(entry.avatarId)
            const value = metricOf(entry, tab)
            const isMe = entry.childId === child.id

            return (
              <div
                key={entry.childId}
                className={cn(
                  'flex items-center gap-3 rounded-kid border bg-white px-4 py-3 transition',
                  isMe ? 'border-brand-400 shadow-glow' : 'border-surface-line',
                )}
              >
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border font-mono text-sm font-extrabold',
                    index === 0 && 'border-ember-300 bg-ember-50 text-ember-600',
                    index === 1 && 'border-surface-line bg-surface-muted text-ink-soft',
                    index === 2 && 'border-[#e8c9a0] bg-[#fdf3e7] text-[#a86a2c]',
                    index > 2 && 'border-surface-line bg-white text-ink-faint',
                  )}
                >
                  {index + 1}
                </span>

                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl"
                  style={{ backgroundColor: `${avatar.color}22` }}
                >
                  {avatar.emoji}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-lg font-extrabold">{entry.nickname}</span>
                    {isMe ? (
                      <span className="rounded-md border border-brand-200 bg-brand-50 px-1.5 py-0.5 text-[10px] font-extrabold text-brand-700">
                        我
                      </span>
                    ) : null}
                    <span className="font-mono text-[11px] font-bold text-ink-faint">
                      等级{entry.level}
                    </span>
                  </div>
                  <ProgressBar
                    value={maxValue === 0 ? 0 : value / maxValue}
                    className="mt-1.5 h-1.5"
                  />
                </div>

                <div className="text-right leading-tight">
                  <div className="font-mono text-xl font-extrabold tabular-nums text-brand-600">
                    {value}
                  </div>
                  <div className="text-[10px] font-bold text-ink-faint">{activeTab.unit}</div>
                </div>
              </div>
            )
          })}
        </div>

        {entries.length <= 1 ? (
          <p className="text-sm font-extrabold text-ink-soft">
            再建一个小朋友的档案，就能一起比赛啦
          </p>
        ) : null}

        <p className="pb-4 text-center text-xs font-bold text-ink-faint">
          这里只显示这台电脑上的小朋友，不会公开给其他人
        </p>
      </div>
    </AppShell>
  )
}
