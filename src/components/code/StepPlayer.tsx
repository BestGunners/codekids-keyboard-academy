import { useEffect, useMemo, useState } from 'react'
import { StageCanvas } from '@/components/code/StageCanvas'
import { Icon } from '@/components/icons/Icon'
import { Mascot } from '@/components/mascot/Mascot'
import type { RunCppError, SceneCommand, TraceEntry } from '@/engine/cpp'
import { cn } from '@/utils/cn'

export interface StepPlayerProps {
  code: string
  trace: TraceEntry[]
  output: string
  scene: SceneCommand[]
  error?: RunCppError | null
  onExit: () => void
}

/**
 * 一步一步看：把程序执行的过程放慢。
 * 每一步高亮正在执行的代码行，旁边显示变量变成了几、屏幕上输出了什么、舞台画到哪了。
 */
export function StepPlayer({ code, trace, output, scene, error, onExit }: StepPlayerProps) {
  const [index, setIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)

  const lines = useMemo(() => code.split('\n'), [code])
  const lastIndex = Math.max(trace.length - 1, 0)
  const entry = trace[Math.min(index, lastIndex)]
  const previous = index > 0 ? trace[index - 1] : undefined
  const currentLine = entry?.line ?? null

  const changedNames = useMemo(() => {
    if (!entry) return [] as string[]
    if (!previous) return Object.keys(entry.variables)
    return Object.keys(entry.variables).filter(
      (name) => previous.variables[name] !== entry.variables[name],
    )
  }, [entry, previous])

  const executedLines = useMemo(() => {
    const set = new Set<number>()
    trace.slice(0, index + 1).forEach((item) => set.add(item.line))
    return set
  }, [trace, index])

  const atEnd = index >= lastIndex

  useEffect(() => {
    if (!autoPlay) return undefined
    if (index >= lastIndex) {
      setAutoPlay(false)
      return undefined
    }
    const timer = window.setTimeout(() => setIndex((value) => value + 1), 450)
    return () => window.clearTimeout(timer)
  }, [autoPlay, index, lastIndex])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        setIndex((value) => Math.min(value + 1, lastIndex))
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setIndex((value) => Math.max(value - 1, 0))
      }
      if (event.key === 'Escape') {
        event.preventDefault()
        onExit()
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lastIndex, onExit])

  const go = (next: number) => {
    setAutoPlay(false)
    setIndex(Math.max(0, Math.min(next, lastIndex)))
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-kid border-2 border-brand-200 bg-white/90 px-4 py-3 shadow-pop">
        <div className="flex items-center gap-3">
          <Mascot mood="think" size={44} />
          <div className="leading-tight">
            <div className="text-xs font-extrabold text-ink-soft">一步一步看</div>
            <div className="text-lg font-extrabold">
              {currentLine ? `正在执行第 ${currentLine} 行` : '程序还没开始'}
              <span className="ml-2 text-sm font-bold text-ink-soft">
                第 {Math.min(index + 1, trace.length)} / {trace.length} 步
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => go(0)}
            className="rounded-xl border-2 border-brand-100 bg-white px-3 py-1.5 text-sm font-extrabold text-ink-soft"
          >
            <Icon name="chevronLeft" size={16} />
          </button>
          <button
            type="button"
            onClick={() => go(index - 1)}
            className="rounded-xl border-2 border-brand-100 bg-white px-3 py-1.5 text-sm font-extrabold text-ink-soft"
          >
            <Icon name="chevronLeft" size={14} /> 上一步
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            className="rounded-xl bg-brand-500 px-4 py-1.5 text-sm font-extrabold text-white"
          >
            下一步 <Icon name="chevronRight" size={14} />
          </button>
          <button
            type="button"
            onClick={() => go(lastIndex)}
            className="rounded-xl border-2 border-brand-100 bg-white px-3 py-1.5 text-sm font-extrabold text-ink-soft"
          >
            <Icon name="chevronRight" size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              setIndex(0)
              setAutoPlay((value) => !value)
            }}
            className={cn(
              'rounded-xl px-3 py-1.5 text-sm font-extrabold',
              autoPlay ? 'bg-[#ffd95c] text-[#8a6410]' : 'border-2 border-brand-100 bg-white text-ink-soft',
            )}
          >
            {autoPlay ? '暂停' : '自动'}
          </button>
          <button
            type="button"
            onClick={() => {
              onExit()
            }}
            className="rounded-xl px-3 py-1.5 text-sm font-extrabold text-ink-soft"
          >
            退出演示
          </button>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr]">
        <div className="overflow-hidden rounded-kid border-2 border-brand-200 bg-white shadow-pop">
          <div className="border-b border-brand-100 bg-brand-50/70 px-3 py-2 text-xs font-extrabold text-ink-soft">
            代码（← → 键也能翻步）
          </div>
          <div className="flex">
            <div className="select-none border-r border-brand-100 bg-brand-50/40 px-2 py-3 text-right font-mono text-xs leading-6 text-ink-soft/60">
              {lines.map((_, lineIndex) => (
                <div
                  key={lineIndex}
                  className={cn(
                    'px-1',
                    currentLine === lineIndex + 1 && 'rounded bg-brand-500 font-extrabold text-white',
                  )}
                >
                  {lineIndex + 1}
                </div>
              ))}
            </div>
            <div className="flex-1 py-3 font-mono text-sm leading-6">
              {lines.map((line, lineIndex) => (
                <div
                  key={lineIndex}
                  className={cn(
                    'whitespace-pre px-3',
                    currentLine === lineIndex + 1
                      ? 'bg-brand-100 font-extrabold text-brand-800'
                      : executedLines.has(lineIndex + 1)
                        ? 'text-ink-soft'
                        : 'text-ink-soft/45',
                  )}
                >
                  {line.length > 0 ? line : ' '}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-kid border-2 border-brand-200 bg-white p-3 shadow-pop">
            <div className="mb-2 text-xs font-extrabold text-ink-soft">
              变量（变绿的这一步刚改过）
            </div>
            {entry && Object.keys(entry.variables).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {Object.entries(entry.variables).map(([name, value]) => (
                  <span
                    key={name}
                    className={cn(
                      'rounded-xl px-2.5 py-1 font-mono text-sm font-extrabold',
                      changedNames.includes(name)
                        ? 'anim-pop-in bg-[#e8f8ee] text-[#2f9d63]'
                        : 'bg-brand-50 text-brand-700',
                    )}
                  >
                    {name} = {value}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-xs font-bold text-ink-soft">这一步还没有变量</div>
            )}
          </div>

          <div className="overflow-hidden rounded-kid border-2 border-brand-200 bg-[#101a33] shadow-pop">
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
              <span className="text-xs font-extrabold text-white/80">屏幕（到这一步为止）</span>
            </div>
            <pre className="min-h-[56px] whitespace-pre-wrap break-words px-3 py-2 font-mono text-base leading-6 text-[#8ef0c0]">
              {entry && entry.outputLength > 0 ? output.slice(0, entry.outputLength) : '（还没有输出）'}
            </pre>
          </div>

          {scene.length > 0 ? (
            <div className="overflow-hidden rounded-kid border-2 border-brand-200 bg-white shadow-pop">
              <div className="border-b border-brand-100 bg-brand-50/70 px-3 py-2 text-xs font-extrabold text-ink-soft">
                舞台（到这一步为止）
              </div>
              <div className="aspect-[8/5] w-full">
                <StageCanvas scene={entry ? scene.slice(0, entry.sceneLength) : []} />
              </div>
            </div>
          ) : null}

          {atEnd && error ? (
            <div className="anim-pop-in space-y-1 rounded-kid border-2 border-[#f6ccd7] bg-[#fff5f7] px-4 py-3">
              <div className="text-sm font-extrabold text-[#c2334c]">
                第 {error.line} 行：{error.message}
              </div>
              {error.hint ? (
                <div className="flex items-start gap-1.5 text-xs font-bold text-[#c2334c]/80"><Icon name="lightbulb" size={14} /> {error.hint}</div>
              ) : null}
            </div>
          ) : null}

          {atEnd && !error ? (
            <div className="anim-pop-in rounded-kid bg-[#e8f8ee] px-4 py-3 text-sm font-extrabold text-[#2f9d63]">
              <Icon name="check" size={16} /> 程序跑到最后一步啦
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
