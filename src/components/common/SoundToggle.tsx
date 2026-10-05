import { useRef } from 'react'
import { Icon } from '@/components/icons/Icon'
import { sfx } from '@/engine/sfx'
import { useSettingsStore } from '@/store/settingsStore'
import { cn } from '@/utils/cn'

/** 声音控件：线性图标 + 细滑杆，拖动时有一声试听。 */
export function SoundToggle({ className }: { className?: string }) {
  const soundEnabled = useSettingsStore((state) => state.soundEnabled)
  const volume = useSettingsStore((state) => state.volume)
  const toggleSound = useSettingsStore((state) => state.toggleSound)
  const setVolume = useSettingsStore((state) => state.setVolume)
  const lastPreviewAt = useRef(0)

  const previewThrottled = () => {
    const now = Date.now()
    if (now - lastPreviewAt.current < 260) return
    lastPreviewAt.current = now
    sfx.preview()
  }

  const muted = !soundEnabled || volume <= 0

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-xl border border-surface-line bg-white px-2 py-1',
        className,
      )}
    >
      <button
        type="button"
        aria-label={soundEnabled ? '关闭声音' : '打开声音'}
        onClick={() => {
          toggleSound()
          sfx.unlock()
          if (!soundEnabled) sfx.tap()
        }}
        className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-soft transition hover:bg-surface-muted"
      >
        <Icon name={muted ? 'mute' : 'sound'} size={16} />
      </button>

      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={Math.round(volume * 100)}
        data-no-click-sound
        aria-label="音量"
        title={`音量 ${Math.round(volume * 100)}%`}
        onChange={(event) => {
          const next = Number(event.target.value) / 100
          setVolume(next)
          if (next > 0 && !soundEnabled) toggleSound()
          if (next > 0) previewThrottled()
        }}
        className="h-1.5 w-20 cursor-pointer accent-brand-500"
      />
    </div>
  )
}