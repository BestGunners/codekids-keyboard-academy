import { useState, type ReactNode } from 'react'
import { Icon } from '@/components/icons/Icon'
import { PATTERN_ICONS } from '@/data/avatars'
import { sfx } from '@/engine/sfx'
import { cn } from '@/utils/cn'

export interface PatternPadProps {
  title: string
  hint?: string
  submitLabel?: string
  /** 图形密码位数，默认 4 */
  length?: number
  /** 返回 false 表示这次输入不被接受（例如旧密码不对），组件会清空并提示 */
  onSubmit: (pattern: string[]) => boolean
  onCancel?: () => void
  footer?: ReactNode
}

/**
 * 图形密码输入盘：点图案 → 音高逐级升高 → 点确认。
 * 登录、修改密码（旧密码 / 新密码 / 再输一次）都用这一个组件。
 */
export function PatternPad({
  title,
  hint,
  submitLabel = '确定',
  length = 4,
  onSubmit,
  onCancel,
  footer,
}: PatternPadProps) {
  const [pattern, setPattern] = useState<string[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [rejected, setRejected] = useState(false)

  const pickIcon = (icon: string) => {
    sfx.star(pattern.length)
    setMessage(null)
    setRejected(false)
    setPattern((current) => (current.length >= length ? current : [...current, icon]))
  }

  const confirm = () => {
    if (pattern.length < length) {
      setMessage(`还差 ${length - pattern.length} 个图案`)
      return
    }

    const accepted = onSubmit(pattern)
    if (accepted === false) {
      sfx.oops()
      setRejected(true)
      setPattern([])
      setMessage('不对哦，再试一次')
      return
    }

    setPattern([])
    setMessage(null)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="space-y-1 text-center">
        <h2 className="text-2xl font-extrabold">{title}</h2>
        {hint ? <p className="text-sm font-bold text-ink-soft">{hint}</p> : null}
      </div>

      <div className={cn('flex items-center gap-3', rejected && 'anim-wiggle')}>
        {Array.from({ length }, (_, index) => (
          <span
            key={index}
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-2xl border-b-4 text-2xl',
              pattern[index]
                ? 'anim-pop-in border-brand-400 bg-brand-50'
                : 'border-brand-200 bg-white/60 text-ink-soft/40',
            )}
          >
            {pattern[index] ?? '·'}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {PATTERN_ICONS.map((icon) => (
          <button
            key={icon}
            type="button"
            data-no-click-sound
            onClick={() => pickIcon(icon)}
            className="flex h-14 w-14 items-center justify-center rounded-kid border-b-4 border-brand-200 bg-white text-2xl transition hover:-translate-y-1 hover:border-brand-400"
          >
            {icon}
          </button>
        ))}
      </div>

      {message ? (
        <div className="anim-pop-in rounded-2xl bg-[#fffbe8] px-4 py-2 text-sm font-extrabold text-[#8a6410]">
          {message}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          disabled={pattern.length < length}
          onClick={confirm}
          className="rounded-kid bg-brand-500 px-7 py-3 text-lg font-extrabold text-white shadow-kid transition active:translate-y-[2px] disabled:opacity-40"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={() => {
            setPattern([])
            setMessage(null)
          }}
          className="rounded-kid border-2 border-brand-200 bg-white px-5 py-3 font-extrabold text-ink-soft"
        >
          <Icon name="refresh" size={16} /> 重选
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={() => {
              setPattern([])
              setMessage(null)
              onCancel()
            }}
            className="rounded-kid px-4 py-3 font-extrabold text-ink-soft"
          >
            取消
          </button>
        ) : null}
      </div>

      {footer}
    </div>
  )
}
