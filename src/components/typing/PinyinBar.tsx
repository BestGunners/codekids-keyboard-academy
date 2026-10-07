import { Icon } from '@/components/icons/Icon'
import type { PinyinTask } from '@/engine/typingEngine'

export interface PinyinBarProps {
  /** 当前正在打的中文字，没有就是普通代码 */
  task: PinyinTask | null
  /** 进阶关：不提示拼音，只留一个「先跳过」的出口 */
  hideHints?: boolean
  onSkip?: () => void
}

/**
 * 中文拼音提示条：一次只提示一个字的拼音，打完这个字它立刻变绿，再提示下一个字。
 * 高度固定，出现和消失都不会顶动键盘。
 */
export function PinyinBar({ task, hideHints = false, onSkip }: PinyinBarProps) {
  // 进阶关（课文长句岛）：一个拼音都不给，只留一个"先跳过"的出口
  if (hideHints) {
    return (
      <div className="flex h-[46px] flex-nowrap items-center gap-3 overflow-hidden rounded-kid border-2 border-brand-200 bg-white px-4">
        <Icon name="target" size={16} className="shrink-0 text-brand-500" />
        <span className="min-w-0 truncate text-xs font-extrabold text-ink-soft">
          这一关不给拼音提示，靠自己把每个字的拼音拼出来
        </span>
        {onSkip ? (
          <button
            type="button"
            onClick={onSkip}
            className="ml-auto shrink-0 rounded-xl bg-brand-100 px-3 py-1.5 text-xs font-extrabold text-brand-700 transition hover:bg-brand-200"
          >
            想不起来，先跳过
          </button>
        ) : null}
      </div>
    )
  }

  if (!task) {
    return (
      <div className="flex h-[46px] items-center gap-2 overflow-hidden rounded-kid border-2 border-brand-100 bg-white/70 px-4">
        <span className="text-xs font-extrabold text-ink-soft/70">
          遇到中文时，这里会告诉你拼音怎么打
        </span>
      </div>
    )
  }

  const remaining = task.pinyin.slice(task.typed.length)

  return (
    <div className="flex h-[46px] flex-nowrap items-center gap-3 overflow-hidden rounded-kid border-2 border-brand-200 bg-white px-4">
      <span className="shrink-0 text-xs font-extrabold text-ink-soft">中文用拼音打</span>

      <span className="flex shrink-0 items-center gap-1.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-brand-400 bg-brand-50 text-lg font-extrabold text-brand-700">
          {task.char}
        </span>
        <span className="font-mono text-lg font-extrabold text-brand-700">{task.typed || '·'}</span>
        <span className="font-mono text-lg font-extrabold text-ink-soft/35">{remaining}</span>
      </span>

      <span className="min-w-0 truncate text-xs font-bold text-ink-soft">
        {task.upcoming ? `下一个：${task.upcoming}` : '这是这段中文的最后一个字'}
      </span>

      <span className="ml-auto shrink-0 text-[11px] font-bold text-ink-soft/70">
        打完这个字它就会变绿
      </span>
    </div>
  )
}