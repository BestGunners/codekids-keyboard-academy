import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/common/Button'
import { Mascot } from '@/components/mascot/Mascot'
import { StageCanvas } from '@/components/code/StageCanvas'
import { StepPlayer } from '@/components/code/StepPlayer'
import { Icon } from '@/components/icons/Icon'
import { countSceneKinds, resolveFrames, runCpp, type RunCppResult } from '@/engine/cpp'
import { sfx } from '@/engine/sfx'
import type { LessonProgram } from '@/data/programs'
import { cn } from '@/utils/cn'

const SHAPE_LABELS: Record<string, string> = {
  star: '颗星星',
  circle: '个圆',
  rect: '个方块',
  line: '条线',
  text: '段文字',
}

/** 把「几种图形各几个」说成孩子能懂的话 */
function describeScene(counts: Partial<Record<string, number>>): string {
  const parts = Object.entries(counts)
    .filter(([kind, value]) => SHAPE_LABELS[kind] && (value ?? 0) > 0)
    .map(([kind, value]) => `${value}${SHAPE_LABELS[kind]}`)
  return parts.length > 0 ? parts.join('、') : '什么都没画'
}

export interface CodeRunnerProps {
  /** 例如「第 4 岛 · 第 1 关 · 我的第一行」 */
  lessonLabel: string
  program: LessonProgram
  onFinish: (passed: boolean) => void
}

/**
 * 写代码时间：孩子把刚才一行行敲过的代码在这里运行起来。
 * 可以随便改数字再运行，看着屏幕上的结果变来变去——这就是编程最好玩的地方。
 */
export function CodeRunner({ lessonLabel, program, onFinish }: CodeRunnerProps) {
  const navigate = useNavigate()
  const [code, setCode] = useState(() => program.program.join('\n'))
  const [input, setInput] = useState(() => (program.input ?? []).join('\n'))
  const [result, setResult] = useState<RunCppResult | null>(null)
  const [runCount, setRunCount] = useState(0)
  const [stepMode, setStepMode] = useState(false)

  const lines = useMemo(() => code.split('\n'), [code])
  const usesCin = /\bcin\b/.test(code)
  const usesKey = /\bkey\s*\(/.test(code)
  const needsInput = usesCin || usesKey
  const inputLabel = usesCin && usesKey
    ? '输入（cin 和 key() 都会读这里的内容，一行一个）'
    : usesKey
      ? '按键（程序里的 key() 会读这里的内容，一行一个）'
      : '输入（程序里的 cin 会读这里的内容，一行一个）'
  const errorLine = result && !result.ok ? (result.error?.line ?? null) : null
  const expectedOutput = program.expectedOutput
  const expectedScene = program.expectedScene

  // 把舞台指令切成一帧一帧：wait() 就是「这一帧停一下」，画面因此会动起来
  const frames = useMemo(() => resolveFrames(result?.scene ?? []), [result])
  const [frameIndex, setFrameIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const lastIndex = Math.max(frames.length - 1, 0)
  const currentFrame = frames[Math.min(frameIndex, lastIndex)]?.commands ?? []
  // 判断画面看的是最后一帧（动画播完的样子）
  const sceneCounts = countSceneKinds(frames[lastIndex]?.commands ?? [])

  useEffect(() => {
    if (!playing || frames.length === 0) return undefined
    if (frameIndex >= frames.length - 1) {
      setPlaying(false)
      return undefined
    }
    const seconds = Math.min(Math.max(frames[frameIndex].duration, 0.06), 1.2)
    const timer = window.setTimeout(() => setFrameIndex((index) => index + 1), seconds * 1000)
    return () => window.clearTimeout(timer)
  }, [playing, frameIndex, frames])
  const sceneMatched = expectedScene
    ? Object.entries(expectedScene).every(
        ([kind, count]) => sceneCounts[kind as keyof typeof sceneCounts] === count,
      )
    : false
  const outputMatched =
    expectedOutput !== undefined && result?.ok === true && result.output === expectedOutput
  const hasCheck = expectedOutput !== undefined || expectedScene !== undefined
  const passed = expectedScene ? result?.ok === true && sceneMatched : outputMatched
  const canContinue = hasCheck ? passed : result?.ok === true

  const run = () => {
    sfx.unlock()
    const next = runCpp(code, { input: input.split('\n') })
    setResult(next)
    setStepMode(false)
    setRunCount((count) => count + 1)
    if (next.ok) {
      sfx.drillDone()
      setFrameIndex(0)
      setPlaying(true)
    } else {
      sfx.oops()
      setPlaying(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-kid border-2 border-brand-200 bg-white/90 px-4 py-3 shadow-pop">
        <div className="flex items-center gap-3">
          <Mascot mood={passed ? 'cheer' : 'happy'} size={48} />
          <div className="leading-tight">
            <div className="text-xs font-extrabold text-ink-soft">{lessonLabel} · 写代码时间</div>
            <div className="text-lg font-extrabold"><Icon name="target" size={18} className="text-brand-500" /> {program.task}</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-2xl bg-brand-50 px-3 py-1.5 text-xs font-extrabold text-brand-700">
            已运行 {runCount} 次
          </span>
          <button
            type="button"
            onClick={() => {
              navigate('/map')
            }}
            className="rounded-2xl border-2 border-brand-100 bg-white px-3 py-1.5 text-xs font-extrabold text-ink-soft transition hover:border-brand-300"
          >
            <Icon name="back" size={14} /> 返回地图
          </button>
        </div>
      </div>

      {stepMode && result ? (
        <StepPlayer
          code={code}
          trace={result.trace}
          output={result.output}
          scene={result.scene}
          error={result.error ?? null}
          onExit={() => setStepMode(false)}
        />
      ) : (
      <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="overflow-hidden rounded-kid border-2 border-brand-200 bg-white shadow-pop">
          <div className="flex items-center justify-between border-b border-brand-100 bg-brand-50/70 px-3 py-2">
            <span className="text-xs font-extrabold text-ink-soft">代码（可以随便改）</span>
            <span className="text-[11px] font-bold text-ink-soft">Ctrl + Enter 运行</span>
          </div>

          <div className="flex">
            <div className="select-none border-r border-brand-100 bg-brand-50/40 px-2 py-3 text-right font-mono text-xs leading-6 text-ink-soft/60">
              {lines.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    'px-1',
                    errorLine === index + 1 && 'rounded bg-[#ffe9ee] font-extrabold text-[#c2334c]',
                  )}
                >
                  {index + 1}
                </div>
              ))}
            </div>
            <textarea
              value={code}
              spellCheck={false}
              onChange={(event) => {
                setCode(event.target.value)
                setResult(null)
              }}
              onKeyDown={(event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                  event.preventDefault()
                  run()
                }
              }}
              rows={Math.max(lines.length, 8)}
              className="flex-1 resize-none bg-transparent px-3 py-3 font-mono text-sm leading-6 text-ink outline-none"
            />
          </div>
        </div>

        <div className="space-y-3">
          {program.stage ? (
            <div className="overflow-hidden rounded-kid border-2 border-brand-200 bg-white shadow-pop">
              <div className="flex items-center justify-between border-b border-brand-100 bg-brand-50/70 px-3 py-2">
                <span className="text-xs font-extrabold text-ink-soft">舞台（代码画出来的画面）</span>
                <span className="text-[11px] font-bold text-ink-soft">
                  {result ? describeScene(sceneCounts) : '还没运行'}
                </span>
              </div>
              <div className="aspect-[8/5] w-full">
                <StageCanvas scene={currentFrame} />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-brand-100 bg-white px-3 py-2">
                {frames.length > 1 ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold text-ink-soft">
                      第 {Math.min(frameIndex + 1, frames.length)} / {frames.length} 帧
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setFrameIndex(0)
                        setPlaying(true)
                      }}
                      className="rounded-lg bg-brand-500 px-2.5 py-1 text-[11px] font-extrabold text-white"
                    >
                      <Icon name="play" size={13} filled /> 重播动画
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPlaying(false)
                        setFrameIndex(lastIndex)
                      }}
                      className="rounded-lg border border-brand-200 bg-white px-2.5 py-1 text-[11px] font-extrabold text-brand-700"
                    >
                      <Icon name="chevronRight" size={13} /> 最后一帧
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] font-bold text-ink-soft">
                    想让它动起来？试试 clear() 清屏 + wait(0.2) 停一下
                  </span>
                )}
                <span className="text-[11px] font-bold text-ink-soft">
                  {result ? describeScene(sceneCounts) : '还没运行'}
                </span>
              </div>
            </div>
          ) : null}

          <div className="overflow-hidden rounded-kid border-2 border-brand-200 bg-[#101a33] shadow-pop">
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
              <span className="text-xs font-extrabold text-white/80">屏幕</span>
              <span className="text-[11px] font-bold text-white/50">
                {result?.ok ? '运行完成' : result ? '出错了' : '还没运行'}
              </span>
            </div>
            <pre className="min-h-[120px] whitespace-pre-wrap break-words px-3 py-3 font-mono text-base leading-6 text-[#8ef0c0]">
              {result ? result.output || '（这次没有输出）' : '点下面的「运行」试试看'}
            </pre>
          </div>

          {needsInput ? (
            <div className="rounded-kid border-2 border-brand-200 bg-white p-3 shadow-pop">
              <div className="mb-1 text-xs font-extrabold text-ink-soft">{inputLabel}</div>
            <textarea
              value={input}
              spellCheck={false}
              onChange={(event) => {
                setInput(event.target.value)
                setResult(null)
              }}
              rows={2}
              placeholder="一行一个，例如：7"
                className="w-full resize-none rounded-xl border-2 border-brand-100 bg-white px-3 py-2 font-mono text-sm outline-none focus:border-brand-400"
              />
            </div>
          ) : null}

          {result && !result.ok ? (
            <div className="anim-pop-in space-y-1 rounded-kid border-2 border-[#f6ccd7] bg-[#fff5f7] px-4 py-3">
              <div className="text-sm font-extrabold text-[#c2334c]">
                第 {result.error?.line} 行：{result.error?.message}
              </div>
              {result.error?.hint ? (
                <div className="flex items-start gap-1.5 text-xs font-bold text-[#c2334c]/80"><Icon name="lightbulb" size={14} /> {result.error.hint}</div>
              ) : null}
            </div>
          ) : null}

          {result?.ok && expectedOutput !== undefined ? (
            outputMatched ? (
              <div className="anim-pop-in rounded-kid bg-[#e8f8ee] px-4 py-3 text-sm font-extrabold text-[#2f9d63]">
                <Icon name="check" size={16} /> 输出正确，和预期一模一样！
              </div>
            ) : (
              <div className="anim-pop-in space-y-1 rounded-kid bg-[#fffbe8] px-4 py-3 text-sm font-extrabold text-[#8a6410]">
                <div className="flex items-center gap-2"><Icon name="refresh" size={16} /> 程序跑通了，但输出还不太一样</div>
                <div className="text-xs font-bold">
                  期望「{expectedOutput}」，实际「{result.output}」——改一改代码再运行试试
                </div>
              </div>
            )
          ) : null}

          {result?.ok && expectedScene ? (
            sceneMatched ? (
              <div className="anim-pop-in rounded-kid bg-[#e8f8ee] px-4 py-3 text-sm font-extrabold text-[#2f9d63]">
                <Icon name="check" size={16} /> 舞台上的画面和任务一样！
              </div>
            ) : (
              <div className="anim-pop-in space-y-1 rounded-kid bg-[#fffbe8] px-4 py-3 text-sm font-extrabold text-[#8a6410]">
                <div className="flex items-center gap-2"><Icon name="refresh" size={16} /> 程序跑通了，但舞台上的画面还不太一样</div>
                <div className="text-xs font-bold">
                  任务要求 {describeScene(expectedScene)}，现在舞台上是 {describeScene(sceneCounts)}
                </div>
              </div>
            )
          ) : null}

          {result?.ok && expectedOutput === undefined && expectedScene === undefined ? (
            <div className="anim-pop-in rounded-kid bg-[#e8f8ee] px-4 py-3 text-sm font-extrabold text-[#2f9d63]">
              <Icon name="check" size={16} /> 运行成功！多运行几次看看结果会不会变
            </div>
          ) : null}
        </div>
      </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="lg" data-no-click-sound onClick={run}>
          <Icon name="run" size={18} /> 运行
        </Button>
        <Button
          variant="secondary"
          disabled={!result || result.trace.length === 0}
          onClick={() => {
            setStepMode((value) => !value)
          }}
        >
          <Icon name="step" size={16} />{stepMode ? '回到编辑' : '一步一步看'}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setCode(program.program.join('\n'))
            setInput((program.input ?? []).join('\n'))
            setResult(null)
          }}
        >
          <Icon name="refresh" size={16} /> 还原代码
        </Button>
        <Button
          size="lg"
          variant={canContinue ? 'success' : 'secondary'}
          disabled={!canContinue}
          onClick={() => {
            sfx.badge()
            onFinish(passed)
          }}
        >
          {canContinue ? '完成这一关' : '完成这一关（先把程序跑对）'}
        </Button>
        {canContinue ? null : (
          <Button
            variant="ghost"
            onClick={() => {
              onFinish(false)
            }}
          >
            先跳过编程，直接完成这一关
          </Button>
        )}
      </div>
    </div>
  )
}
