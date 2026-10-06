import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  soundEnabled: boolean
  /** 全局点击音效：关闭后界面点击不再发声，但练习反馈音保留 */
  clickSoundsEnabled: boolean
  /** 0 - 1，默认 0.8 */
  volume: number
  /** 打字时是否显示下方的模拟键盘（默认显示） */
  keyboardVisible: boolean
  /** 背景音乐：默认开，但只在非打字页面播放 */
  bgmEnabled: boolean
  /** 背景音乐音量 0 - 1，默认 0.35（比音效轻一点） */
  bgmVolume: number
  toggleSound: () => void
  toggleClickSounds: () => void
  setVolume: (value: number) => void
  toggleKeyboard: () => void
  toggleBgm: () => void
  setBgmVolume: (value: number) => void
}

/** 孩子的偏好设置：声音开关与音量（校内使用时可以一键静音）。 */
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      soundEnabled: true,
      clickSoundsEnabled: true,
      volume: 0.8,
      keyboardVisible: true,
      bgmEnabled: true,
      bgmVolume: 0.35,
      toggleSound: () => set({ soundEnabled: !get().soundEnabled }),
      toggleKeyboard: () => set({ keyboardVisible: !get().keyboardVisible }),
      toggleClickSounds: () => set({ clickSoundsEnabled: !get().clickSoundsEnabled }),
      setVolume: (value) => set({ volume: Math.min(1, Math.max(0, value)) }),
      toggleBgm: () => set({ bgmEnabled: !get().bgmEnabled }),
      setBgmVolume: (value) => set({ bgmVolume: Math.min(1, Math.max(0, value)) }),
    }),
    { name: 'codekids.settings' },
  ),
)