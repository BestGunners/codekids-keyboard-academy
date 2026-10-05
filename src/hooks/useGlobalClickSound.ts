import { useEffect } from 'react'
import { sfx } from '@/engine/sfx'
import { useSettingsStore } from '@/store/settingsStore'

const CLICKABLE = 'button, a, [role="button"], summary, label, input[type="range"]'

/**
 * 全局点击音效：页面上任何按钮、链接、开关被按下都会响一声。
 * 可以在「设置 → 全局点击音效」里关掉；打字输入区不发声，避免干扰练习。
 */
export function useGlobalClickSound() {
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!useSettingsStore.getState().clickSoundsEnabled) return
      if (!useSettingsStore.getState().soundEnabled) return

      const target = event.target
      // 注意：图标是 SVG，不能只判断 HTMLElement
      if (!(target instanceof Element)) return
      if (target.closest('[data-no-click-sound]')) return
      // 打字 / 写代码的区域不发声
      if (target.closest('textarea, input[type="text"], input:not([type])')) return
      if (!target.closest(CLICKABLE)) return

      sfx.unlock()
      sfx.tap()
    }

    // 任何一次交互（点击 / 按键 / 触摸）都先把音频解锁，
    // 否则第一次点击可能因为浏览器自动播放策略而没声音
    const unlockOnce = () => sfx.unlock()

    window.addEventListener('pointerdown', handlePointerDown, true)
    window.addEventListener('pointerdown', unlockOnce, true)
    window.addEventListener('keydown', unlockOnce, true)
    window.addEventListener('touchstart', unlockOnce, true)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown, true)
      window.removeEventListener('pointerdown', unlockOnce, true)
      window.removeEventListener('keydown', unlockOnce, true)
      window.removeEventListener('touchstart', unlockOnce, true)
    }
  }, [])
}