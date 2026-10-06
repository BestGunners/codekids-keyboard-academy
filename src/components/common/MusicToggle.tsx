import { useRef } from 'react'
import { Icon } from '@/components/icons/Icon'
import { sfx } from '@/engine/sfx'
import { useSettingsStore } from '@/store/settingsStore'
import { cn } from '@/utils/cn'

/**
 * 顶部的声音入口。
 *
 * 平时只显示一个音符图标（点一下＝开关背景音乐），鼠标移上去才展开两条**互相独立**的滑杆：
 * 上面调背景音乐，下面调点击音效——两者互不影响。
 * 触屏设备没有悬停，滑杆可以到「设置」页里调。
 */
export function MusicToggle({ className }: { className?: string }) {
  const bgmEnabled = useSettingsStore((state) => state.bgmEnabled)
  const bgmVolume = useSettingsStore((state) => state.bgmVolume)
  const setBgmVolume = useSettingsStore((state) => state.setBgmVolume)
  const toggleBgm = useSettingsStore((state) => state.toggleBgm)

  const soundEnabled = useSettingsStore((state) => state.soundEnabled)
  const volume = useSettingsStore((state) => state.volume)
  const setVolume = useSettingsStore((state) => state.setVolume)
  const toggleSound = useSettingsStore((state) => state.toggleSound)

  const lastPreviewAt = useRef(0)
  const previewThrottled = () => {
    const now = Date.now()
    if (now - lastPreviewAt.current < 260) return
    lastPreviewAt.current = now
    sfx.preview()
  }

  const rowButton =
    'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-surface-line bg-white text-ink-soft transition hover:border-brand-300 hover:text-brand-600'
  const slider = 'h-1.5 w-full cursor-pointer accent-brand-500'

  return (
    <div className={cn('group relative', className)}>
      <button
        type="button"
        aria-label={bgmEnabled ? '关闭背景音乐' : '打开背景音乐'}
        title="背景音乐"
        onClick={() => {
          sfx.unlock()
          toggleBgm()
          if (!bgmEnabled) sfx.tap()
        }}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-xl border transition',
          bgmEnabled
            ? 'border-brand-200 bg-brand-50 text-brand-600'
            : 'border-surface-line bg-white text-ink-faint',
        )}
      >
        <Icon name={bgmEnabled ? 'music' : 'mute'} size={18} />
      </button>

      {/* 悬停 / 键盘聚焦时展开的面板 */}
      <div
        className={cn(
          'pointer-events-none absolute right-0 top-full z-30 mt-2 w-64 space-y-3 rounded-2xl border border-surface-line bg-white/95 p-3 opacity-0 shadow-pop backdrop-blur transition',
          'group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100',
        )}
      >
        {/* 背景音乐 */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={bgmEnabled ? '关闭背景音乐' : '打开背景音乐'}
              onClick={() => {
                sfx.unlock()
                toggleBgm()
                if (!bgmEnabled) sfx.tap()
              }}
              className={rowButton}
            >
              <Icon name={bgmEnabled ? 'music' : 'mute'} size={14} />
            </button>
            <span className="text-xs font-extrabold text-ink-soft">背景音乐</span>
            <span className="ml-auto font-mono text-[11px] font-extrabold text-brand-700">
              {Math.round(bgmVolume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={Math.round(bgmVolume * 100)}
            data-no-click-sound
            aria-label="背景音乐音量"
            onChange={(event) => {
              const next = Number(event.target.value) / 100
              setBgmVolume(next)
              if (next > 0 && !bgmEnabled) toggleBgm()
            }}
            className={slider}
          />
        </div>

        {/* 点击音效 */}
        <div className="space-y-1.5 border-t border-surface-line pt-2.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={soundEnabled ? '关闭音效' : '打开音效'}
              onClick={() => {
                sfx.unlock()
                toggleSound()
                if (!soundEnabled) sfx.tap()
              }}
              className={rowButton}
            >
              <Icon name={soundEnabled ? 'sound' : 'mute'} size={14} />
            </button>
            <span className="text-xs font-extrabold text-ink-soft">点击音效</span>
            <span className="ml-auto font-mono text-[11px] font-extrabold text-brand-700">
              {Math.round(volume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={Math.round(volume * 100)}
            data-no-click-sound
            aria-label="点击音效音量"
            onChange={(event) => {
              const next = Number(event.target.value) / 100
              setVolume(next)
              if (next > 0 && !soundEnabled) toggleSound()
              if (next > 0) previewThrottled()
            }}
            className={slider}
          />
        </div>

        <p className="text-[10px] font-bold text-ink-faint">打字练习时背景音乐会自动暂停</p>
      </div>
    </div>
  )
}
