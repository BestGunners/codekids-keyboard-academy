import type { IconName } from '@/components/icons/Icon'
import { Icon } from '@/components/icons/Icon'
import type { LiveStats } from '@/engine/typingEngine'
import type { AgeBand } from '@/store/childStore'
import { cn } from '@/utils/cn'

export interface TypingStatsPanelProps {
  stats: LiveStats
  targetWpm: number
  ageBand: AgeBand
  className?: string
}

interface ReadoutProps {
  icon: IconName
  label: string
  value: string | number
  unit?: string
  tone: string
}

function Readout({ icon, label, value, unit, tone }: ReadoutProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-surface-line bg-white px-3 py-1.5">
      <Icon name={icon} size={15} className={tone} />
      <span className="text-[10px] font-bold text-ink-faint">{label}</span>
      <span className="inline-block min-w-[2.6rem] text-right font-mono text-lg font-extrabold leading-none tabular-nums text-ink">
        {value}
      </span>
      {unit ? <span className="text-[10px] font-bold text-ink-faint">{unit}</span> : null}
    </div>
  )
}

/** 数据读数：三个小仪表，数字用等宽字体。 */
export function TypingStatsPanel({ stats, targetWpm, ageBand, className }: TypingStatsPanelProps) {
  const useCpm = ageBand === '5-7'
  const speed = useCpm ? stats.cpm : stats.wpm
  const speedUnit = useCpm ? '字/分' : '词/分'
  const accuracy = stats.totalKeystrokes === 0 ? 100 : Math.round(stats.accuracy * 100)
  const accuracyTone = accuracy >= 93 ? 'text-mint-600' : accuracy >= 85 ? 'text-ember-600' : 'text-[#e0455f]'

  return (
    <div className={cn('flex flex-nowrap items-center gap-2', className)}>
      <Readout icon="bolt" label="速度" value={speed} unit={speedUnit} tone="text-brand-500" />
      <Readout icon="target" label="准确" value={accuracy} unit="%" tone={accuracyTone} />
      <Readout icon="award" label="目标" value={targetWpm} unit="词/分" tone="text-ember-500" />
    </div>
  )
}