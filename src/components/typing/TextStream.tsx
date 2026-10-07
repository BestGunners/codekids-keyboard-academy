import { useEffect, useRef, useState } from 'react'
import { Sparkles } from '@/components/fx/Sparkles'
import { PINYIN_BY_CHAR, type PinyinSegment } from '@/data/pinyin'
import type { CharStatus } from '@/types/typing'
import { cn } from '@/utils/cn'

export interface TextStreamProps {
  text: string
  statuses: CharStatus[]
  cursor: number
  /** kid：圆润字体（字母与单词关）；code：等宽字体（符号、代码、游戏关） */
  variant?: 'kid' | 'code'
  /** 中文段落：用来在汉字上方显示拼音 */
  segments?: PinyinSegment[]
  /** 当前这个字已经敲出的拼音 */
  pinyinTyped?: string
}

const STATUS_CLASS: Record<CharStatus, string> = {
  pending: 'text-ink-soft/35',
  correct: 'text-mint-600',
  error: 'bg-[#ffe9f0] text-[#d9557a]',
  skipped: 'text-ink-soft/25 line-through',
}

/**
 * 目标字符流：要打的字是画面主角。
 * 汉字上排显示拼音，打一个字母就变深一点，整个字打完汉字变绿——和打代码一样的即时反馈。
 */
export function TextStream({
  text,
  statuses,
  cursor,
  variant = 'kid',
  segments = [],
  pinyinTyped = '',
}: TextStreamProps) {
  const [burst, setBurst] = useState<{ index: number; key: number } | null>(null)
  const previousCursor = useRef(cursor)
  const burstCount = useRef(0)

  useEffect(() => {
    const justTyped = cursor - 1
    const typedByKid = justTyped >= 0 && statuses[justTyped] === 'correct'

    if (cursor > previousCursor.current && typedByKid) {
      burstCount.current += 1
      setBurst({ index: justTyped, key: burstCount.current })
      previousCursor.current = cursor
      const timer = window.setTimeout(() => setBurst(null), 520)
      return () => window.clearTimeout(timer)
    }

    previousCursor.current = cursor
    return undefined
  }, [cursor, statuses])

  const hasPinyinRow = segments.length > 0

  return (
    <div
      className={cn(
        // 固定高度：不管这一题有多长，下面的键盘都不会被顶来顶去；
        // 有拼音行（中文岛）时留得更高一点，拼音放大后也不会被裁掉
        'flex flex-wrap content-center items-end justify-center gap-x-1 gap-y-1 overflow-hidden rounded-kid border border-surface-line bg-white px-5 py-4 font-extrabold leading-tight shadow-[0_1px_2px_rgba(18,32,58,0.04)]',
        hasPinyinRow
          ? 'h-[176px] sm:h-[252px]'
          : text.length > 30
            ? 'h-[196px] sm:h-[236px]'
            : 'h-[164px]',
        text.length > 28 ? 'text-3xl' : text.length > 18 ? 'text-4xl' : 'text-4xl sm:text-5xl',
        variant === 'code' ? 'font-mono tracking-tight' : 'tracking-wide',
      )}
    >
      {text.split('').map((char, index) => {
        const status = statuses[index] ?? 'pending'
        const isCurrent = index === cursor
        const isSpace = char === ' '
        const segment = hasPinyinRow
          ? segments.find((item) => index >= item.start && index < item.start + item.length)
          : undefined
        const pinyin = segment ? (PINYIN_BY_CHAR[char] ?? '') : ''
        const typedCount = !segment
          ? 0
          : index < cursor
            ? pinyin.length
            : index === cursor
              ? Math.min(pinyinTyped.length, pinyin.length)
              : 0

        return (
          <span key={`${char}-${index}`} className="flex flex-col items-center">
            {segment ? (
              <span className="mb-1 flex font-mono text-base font-extrabold leading-[20px] sm:text-lg sm:leading-[22px]">
                {pinyin.split('').map((letter, letterIndex) => (
                  <span
                    key={letterIndex}
                    className={
                      letterIndex < typedCount
                        ? 'font-extrabold text-brand-600'
                        : 'text-ink-faint/60'
                    }
                  >
                    {letter}
                  </span>
                ))}
              </span>
            ) : (
              <span className="mb-1 h-[20px] sm:h-[22px]" aria-hidden />
            )}

            <span
              className={cn(
                'relative inline-block rounded-lg px-1.5 py-0.5 transition-all duration-150',
                STATUS_CLASS[status],
                // 当前字只做静态高亮：不加呼吸/放大动画，文字位置才不会一直飘
                isCurrent && 'bg-brand-100 text-brand-800 ring-4 ring-brand-300',
                status === 'error' && isCurrent && 'anim-wiggle',
              )}
            >
              {isSpace ? (
                // 空格的盒子宽度固定：光标停在空格上会换成「␣」，
                // 不固定宽度的话整行会重新折行，文字看上去就在飘
                <span className="inline-flex w-[0.62em] items-center justify-center">
                  {isCurrent ? '␣' : '\u00A0'}
                </span>
              ) : (
                char
              )}
              {burst && burst.index === index ? <Sparkles burstKey={burst.key} /> : null}
            </span>
          </span>
        )
      })}
    </div>
  )
}