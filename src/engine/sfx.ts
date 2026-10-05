import { useSettingsStore } from '@/store/settingsStore'

/**
 * 音效引擎：用 Web Audio 实时合成，不依赖任何音频素材文件。
 * 儿童产品的音效原则——正确音清脆短促且每次略有变化，错误音柔和低沉（不用刺耳蜂鸣）。
 * 实际音量 = 基础音量 × 孩子设置的音量。
 */

let audioContext: AudioContext | null = null
let lastPlayedAt = 0
let lastTapAt = 0

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null

  if (!audioContext) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    audioContext = new Ctor()
  }

  if (audioContext.state === 'suspended') {
    void audioContext.resume()
  }

  return audioContext
}

interface ToneOptions {
  freq: number
  duration: number
  type?: OscillatorType
  gain?: number
  delay?: number
  sweepTo?: number
}

function tone({ freq, duration, type = 'sine', gain = 0.15, delay = 0, sweepTo }: ToneOptions) {
  const context = getContext()
  if (!context) return

  const volume = useSettingsStore.getState().volume
  if (volume <= 0) return

  const start = context.currentTime + delay
  const peak = Math.max(0.0002, gain * volume)
  const oscillator = context.createOscillator()
  const amp = context.createGain()

  oscillator.type = type
  oscillator.frequency.setValueAtTime(freq, start)
  if (sweepTo) {
    oscillator.frequency.exponentialRampToValueAtTime(sweepTo, start + duration)
  }

  // 短促的淡入淡出，避免爆音
  amp.gain.setValueAtTime(0.0002, start)
  amp.gain.exponentialRampToValueAtTime(peak, start + 0.014)
  amp.gain.exponentialRampToValueAtTime(0.0002, start + duration)

  oscillator.connect(amp)
  amp.connect(context.destination)
  oscillator.start(start)
  oscillator.stop(start + duration + 0.03)
}

/**
 * 浏览器的自动播放策略要求音频在用户手势后才能出声。
 * 如果上下文还没 running，就等它恢复后再播，避免"第一次点没声音"。
 */
function playWhenReady(play: () => void) {
  const context = getContext()
  if (!context) return

  if (context.state === 'running') {
    play()
    return
  }

  void context.resume().then(
    () => {
      if (context.state === 'running') play()
    },
    () => undefined,
  )
}

function shouldPlay(): boolean {
  const settings = useSettingsStore.getState()
  if (!settings.soundEnabled || settings.volume <= 0) return false
  // 密集击键时限制最小间隔，避免音效糊成一片
  const now = typeof performance === 'undefined' ? Date.now() : performance.now()
  if (now - lastPlayedAt < 22) return false
  lastPlayedAt = now
  return true
}

export const sfx = {
  /** 首次用户点击时调用，满足浏览器自动播放策略 */
  unlock() {
    const context = getContext()
    if (context && context.state === 'suspended') {
      void context.resume()
    }
  },

  /** 音量试听：调整音量时给一声反馈 */
  preview() {
    if (!shouldPlay()) return
    ;[0, 1].forEach((index) => {
      tone({ freq: 660 + index * 220, duration: 0.09, type: 'triangle', gain: 0.14, delay: index * 0.08 })
    })
  },

  /** 敲对：清脆的小音符，音高轻微随机，避免机械感 */
  key() {
    if (!shouldPlay()) return
    const base = 880 + Math.random() * 180
    tone({ freq: base, duration: 0.06, gain: 0.13 })
  },

  /** 打出一个汉字：一声上扬的小铃铛（单个音，不会和下一个字的铃声叠成一片） */
  hanzi() {
    if (!shouldPlay()) return
    // 音高轻微变化，避免同一个字反复打时听起来发闷
    const base = 820 + Math.random() * 120
    tone({ freq: base, sweepTo: base * 1.45, duration: 0.13, type: 'sine', gain: 0.21 })
  },

  /** 敲错：柔和的低音，不刺耳、不惊吓 */
  oops() {
    if (!shouldPlay()) return
    tone({ freq: 240, sweepTo: 165, duration: 0.16, type: 'triangle', gain: 0.16 })
  },

  /** 连击达成：上行小琶音 */
  combo(step = 1) {
    if (!shouldPlay()) return
    const lift = Math.min(step / 10, 1.2)
    ;[0, 1, 2].forEach((index) => {
      tone({
        freq: (620 + index * 150) * (1 + lift * 0.12),
        duration: 0.1,
        type: 'triangle',
        gain: 0.18,
        delay: index * 0.07,
      })
    })
  },

  /** 一道题完成 */
  drillDone() {
    if (!shouldPlay()) return
    ;[0, 1].forEach((index) => {
      tone({ freq: 700 + index * 240, duration: 0.13, gain: 0.18, delay: index * 0.09 })
    })
  },

  /** 每点亮一颗星 */
  star(index: number) {
    if (!shouldPlay()) return
    tone({ freq: 680 + index * 190, duration: 0.18, gain: 0.19 })
  },

  /** 过关号角 */
  fanfare() {
    if (!shouldPlay()) return
    ;[523, 659, 784, 1046].forEach((freq, index) => {
      tone({ freq, duration: 0.26, type: 'triangle', gain: 0.2, delay: index * 0.11 })
    })
  },

  /** 新徽章 */
  badge() {
    if (!shouldPlay()) return
    ;[784, 988, 1318].forEach((freq, index) => {
      tone({ freq, duration: 0.2, gain: 0.18, delay: index * 0.09 })
    })
  },

  /** 敲出一个新的编程关键词：舞台点亮的声音 */
  keyword() {
    if (!shouldPlay()) return
    ;[0, 1, 2, 3].forEach((index) => {
      tone({
        freq: 520 * Math.pow(1.22, index),
        duration: 0.12,
        type: 'triangle',
        gain: 0.17,
        delay: index * 0.08,
      })
    })
  },

  /** 开始倒计时 */
  tick() {
    if (!shouldPlay()) return
    tone({ freq: 520, duration: 0.08, type: 'square', gain: 0.11 })
  },

  /** 界面点击 */
  tap() {
    // 全局点击音效可以在设置里关掉
    if (!useSettingsStore.getState().clickSoundsEnabled) return

    // 同一次点击可能被多个来源触发，这里做一次去重：80ms 内只响一声
    const now = typeof performance === 'undefined' ? Date.now() : performance.now()
    if (now - lastTapAt < 80) return
    lastTapAt = now

    if (!shouldPlay()) return

    playWhenReady(() => {
      // 干净的单音：不叠第二层，避免听起来像"两声"
      tone({ freq: 880, duration: 0.055, type: 'triangle', gain: 0.22 })
    })
  },

  /** 音频状态：设置页用来排查"为什么没声音" */
  status() {
    const settings = useSettingsStore.getState()
    return {
      created: audioContext !== null,
      state: audioContext ? audioContext.state : 'not-created',
      soundEnabled: settings.soundEnabled,
      clickSounds: settings.clickSoundsEnabled,
      volume: settings.volume,
    }
  },

  /** 解锁新区域 */
  gate() {
    if (!shouldPlay()) return
    ;[440, 554, 659, 880].forEach((freq, index) => {
      tone({ freq, duration: 0.22, type: 'triangle', gain: 0.17, delay: index * 0.1 })
    })
  },
}