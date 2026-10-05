import { useEffect, useState } from 'react'
import { Icon } from '@/components/icons/Icon'
import type { CodePart } from '@/engine/codeParts'
import { cn } from '@/utils/cn'

export interface CodeStageProps {
  /** 刚刚敲完的代码零件，null 表示舞台待机 */
  part: CodePart | null
  /** 本次练习已经收集到的零件 */
  discovered: CodePart[]
  className?: string
}

/** 每种零件对应的小演出，全部用 div + emoji + CSS 动画拼出来，不依赖图片。 */
function StageEffect({ part }: { part: CodePart }) {
  const kind = part.effect
  const color = part.color

  switch (kind) {
    case 'loop':
      return (
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-4 border-dashed" style={{ borderColor: color }} />
          <div className="anim-orbit absolute inset-0">
            <span
              className="absolute left-1/2 top-0 h-3.5 w-3.5 -translate-x-1/2 rounded-full"
              style={{ backgroundColor: color }}
            />
          </div>
        </div>
      )

    case 'branch':
      return (
        <div className="flex flex-col items-center gap-0.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="h-2 w-1 rounded" style={{ backgroundColor: color }} />
          <div className="flex gap-4">
            <span className="anim-slide-up h-1.5 w-7 rounded" style={{ backgroundColor: color }} />
            <span className="anim-slide-up h-1.5 w-7 rounded bg-[#c9d3e6]" />
          </div>
        </div>
      )

    case 'box':
      return (
        <div
          className="anim-pop-in flex h-12 w-12 items-center justify-center rounded-xl border-4 text-lg font-extrabold"
          style={{ borderColor: color, color }}
        >
          10
        </div>
      )

    case 'speak':
      return (
        <div className="relative h-14 w-20">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="anim-bubble absolute bottom-0 h-4 w-4 rounded-full"
              style={{ backgroundColor: color, left: 4 + index * 18, animationDelay: `${index * 0.16}s` }}
            />
          ))}
        </div>
      )

    case 'listen':
      return (
        <div className="relative h-14 w-14">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="anim-wave absolute inset-0 rounded-full border-4"
              style={{ borderColor: color, animationDelay: `${index * 0.2}s` }}
            />
          ))}
        </div>
      )

    case 'toolbox':
      return (
        <div className="anim-pop-in text-4xl" aria-hidden>
          🧰
        </div>
      )

    case 'start':
      return (
        <div className="anim-flag flex flex-col items-center">
          <span className="text-3xl" aria-hidden>
            🚩
          </span>
          <span className="h-6 w-1 rounded" style={{ backgroundColor: color }} />
        </div>
      )

    case 'nextline':
      return (
        <div className="flex flex-col items-center">
          <span className="anim-drop text-2xl" style={{ color }} aria-hidden>
            ⬇
          </span>
          <span className="h-1.5 w-10 rounded" style={{ backgroundColor: color }} />
        </div>
      )

    case 'exit':
      return (
        <div className="anim-door text-4xl" aria-hidden>
          🚪
        </div>
      )

    case 'block':
      return (
        <div className="flex items-center gap-1 font-mono text-2xl font-extrabold" style={{ color }}>
          <span>{'{'}</span>
          <span className="anim-bounce-soft h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
          <span>{'}'}</span>
        </div>
      )

    case 'stop':
      return (
        <div className="flex flex-col items-center">
          <span className="anim-pop-in font-mono text-3xl font-extrabold" style={{ color }}>
            ;
          </span>
          <span className="anim-glow-slow h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        </div>
      )

    case 'compare':
      return (
        <div className="anim-flag text-3xl" aria-hidden>
          ⚖️
        </div>
      )

    case 'text':
      return (
        <div className="relative h-14 w-16">
          {[0, 1].map((index) => (
            <span
              key={index}
              className="anim-bubble absolute bottom-0 text-xl"
              style={{ left: 6 + index * 16, animationDelay: `${index * 0.25}s` }}
            >
              💬
            </span>
          ))}
        </div>
      )

    case 'call':
      return (
        <div className="flex items-center gap-1 font-mono text-2xl font-extrabold" style={{ color }}>
          <span>(</span>
          <span className="anim-pop-in text-lg" aria-hidden>
            🎁
          </span>
          <span>)</span>
        </div>
      )

    case 'variable':
      return (
        <div className="flex flex-col items-center gap-0.5">
          <span
            className="anim-drop h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span
            className="flex h-10 w-16 items-center justify-center overflow-hidden rounded-lg border-4 px-1 font-mono text-[10px] font-extrabold"
            style={{ borderColor: color, color }}
          >
            {part.text}
          </span>
        </div>
      )

    case 'draw':
      return (
        <div className="relative h-14 w-16">
          <span
            className="anim-pop-in absolute left-1 top-2 h-5 w-5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span
            className="anim-pop-in absolute right-1 top-5 h-5 w-5 rounded-md"
            style={{ backgroundColor: color, opacity: 0.75 }}
          />
          <span
            className="anim-pop-in absolute bottom-1 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rotate-45 rounded-[3px]"
            style={{ backgroundColor: color, opacity: 0.55 }}
          />
        </div>
      )

    case 'wipe':
      return (
        <div
          className="relative h-12 w-14 overflow-hidden rounded-lg border-2"
          style={{ borderColor: color }}
        >
          <span className="absolute inset-0" style={{ backgroundColor: color, opacity: 0.12 }} />
          <span className="anim-drift absolute inset-y-0 left-1/3 w-2.5 rounded-full bg-white/90" />
        </div>
      )

    case 'palette':
      return (
        <div className="anim-pop-in flex items-center gap-1.5">
          {['#ff9f43', '#6fd08c', '#4f9cf9', '#a78bfa'].map((item) => (
            <span key={item} className="h-4 w-4 rounded-full" style={{ backgroundColor: item }} />
          ))}
        </div>
      )

    case 'timer':
      return (
        <div className="relative h-12 w-12">
          <span
            className="anim-orbit absolute inset-0 rounded-full border-4 border-dashed"
            style={{ borderColor: color }}
          />
          <span
            className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
      )

    default:
      return null
  }
}

/**
 * 编程舞台：孩子每敲出一个代码零件，舞台就演一个小动画并给一句解释。
 * 打字变成看得见的结果，孩子能立刻明白这个零件是干什么的。
 */
export function CodeStage({ part, discovered, className }: CodeStageProps) {
  const [pulseKey, setPulseKey] = useState(0)

  useEffect(() => {
    if (part) setPulseKey((key) => key + 1)
  }, [part])

  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-kid border-2 border-brand-200 bg-gradient-to-br from-white/95 to-brand-50/90 p-3 shadow-pop',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-extrabold text-ink-soft">编程舞台</span>
        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-extrabold text-brand-700">
          C++
        </span>
      </div>

      {part ? (
        <>
          <div className="flex items-center gap-3">
            <div
              key={`fx-${pulseKey}`}
              className="anim-pop-in flex h-20 w-20 shrink-0 items-center justify-center rounded-kid bg-white shadow-pop"
            >
              <StageEffect part={part} />
            </div>
            <div key={`text-${pulseKey}`} className="anim-slide-up min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xl font-extrabold" style={{ color: part.color }}>
                  {part.text}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-extrabold text-white"
                  style={{ backgroundColor: part.color }}
                >
                  {part.label}
                </span>
              </div>
              <p className="text-xs font-bold leading-snug text-ink-soft">{part.explanation}</p>
            </div>
          </div>

          {discovered.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5 border-t border-brand-100 pt-2">
              <span className="text-[10px] font-extrabold text-ink-soft">收集到</span>
              {discovered.slice(0, 8).map((item) => (
                <span
                  key={item.id}
                  className="rounded-lg px-1.5 py-0.5 font-mono text-[11px] font-extrabold text-white"
                  style={{ backgroundColor: item.color }}
                >
                  {item.text}
                </span>
              ))}
              {discovered.length > 8 ? (
                <span className="text-[10px] font-extrabold text-ink-soft">
                  +{discovered.length - 8}
                </span>
              ) : null}
            </div>
          ) : null}
        </>
      ) : (
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
            <Icon name="sparkle" size={20} />
          </span>
          <p className="text-xs font-extrabold text-ink-soft">
            敲出代码里的零件，舞台就会有反应
          </p>
        </div>
      )}
    </div>
  )
}