import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { shouldPlayMusic } from '@/engine/music'
import { useSettingsStore } from '@/store/settingsStore'
import { assetUrl } from '@/utils/asset'

/**
 * 背景音乐。
 *
 * - 只在"没有在打字"的页面播放（首页 / 地图 / 排行榜 / 设置……），
 *   进打字关自动暂停，离开后从原来的位置接着放；
 * - 受两个设置控制：「背景音乐」开关与「音乐音量」——和"点击音效"完全独立；
 * - 遵守浏览器自动播放策略：小朋友第一次点击或按键之后才开始播；
 * - 切到别的标签页、最小化窗口时自动暂停。
 */
export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [armed, setArmed] = useState(false)
  const location = useLocation()

  const bgmEnabled = useSettingsStore((state) => state.bgmEnabled)
  const bgmVolume = useSettingsStore((state) => state.bgmVolume)

  // 浏览器不允许"没交互就出声"，所以等第一次点击/按键之后才开播
  useEffect(() => {
    if (armed) return undefined
    const arm = () => {
      setArmed(true)
      // iOS Safari 要求"首次播放"发生在用户手势里，所以这里顺手播一下；
      // 如果在打字关里点的，下面的 effect 会立刻把它暂停掉。
      const audio = audioRef.current
      const settings = useSettingsStore.getState()
      if (
        audio &&
        settings.bgmEnabled &&
        shouldPlayMusic(window.location.pathname)
      ) {
        void audio.play().catch(() => undefined)
      }
    }
    window.addEventListener('pointerdown', arm, { once: true })
    window.addEventListener('keydown', arm, { once: true })
    return () => {
      window.removeEventListener('pointerdown', arm)
      window.removeEventListener('keydown', arm)
    }
  }, [armed])

  // 音量跟随设置（音乐比分贝较高的音效轻一些）
  useEffect(() => {
    const audio = audioRef.current
    if (audio) audio.volume = Math.min(1, Math.max(0, bgmVolume))
  }, [bgmVolume])

  // 播放 / 暂停：路由、开关、标签页可见性都会影响
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined

    // 音乐和"点击音效"是两套独立设置：这里只听音乐开关（音量由 bgmVolume 控制）
    const wantPlay = armed && bgmEnabled && shouldPlayMusic(location.pathname)

    const sync = () => {
      if (wantPlay && !document.hidden) {
        void audio.play().catch(() => undefined)
      } else {
        audio.pause()
      }
    }

    sync()
    document.addEventListener('visibilitychange', sync)
    return () => document.removeEventListener('visibilitychange', sync)
  }, [armed, bgmEnabled, location.pathname])

  return (
    <audio
      ref={audioRef}
      src={assetUrl('audio/bgm.mp3')}
      loop
      preload="none"
      aria-hidden
    />
  )
}
