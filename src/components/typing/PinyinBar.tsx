import type { PinyinTask } from '@/engine/typingEngine'

export interface PinyinBarProps {
  /** 当前正在打的中文字，没有就是普通代码 */
  task: PinyinTask | null
}

/**
 * 中文拼音提示条：一次只提示一个字的拼音，打完这个字它立刻变绿，再提示下一个字。
 * 高度固定，出现和消失都不会顶动键盘。
 */
export function PinyinBar({ task }: PinyinBarProps) {
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