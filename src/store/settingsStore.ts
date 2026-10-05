import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  soundEnabled: boolean
  /** 全局点击音效：关闭后界面点击不再发声，但练习反馈音保留 */
  clickSoundsEnabled: boolean
  /** 0 - 1，默认 0.8 */
  volume: number
  toggleSound: () => void
  toggleClickSounds: () => void
  setVolume: (value: number) => void
}

/** 孩子的偏好设置：声音开关与音量（校内使用时可以一键静音）。 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      soundEnabled: true,
      clickSoundsEnabled: true,
      volume: 0.8,
      toggleSound: () => set({ soundEnabled: !get().soundEnabled }),
      toggleClickSounds: () => set({ clickSoundsEnabled: !get().clickSoundsEnabled }),
      setVolume: (value) => set({ volume: Math.min(1, Math.max(0, value)) }),
    }),
    { name: 'codekids.settings' },
  ),
)