import { Navigate, Route, Routes } from 'react-router-dom'
import { BackgroundMusic } from '@/components/fx/BackgroundMusic'
import RequireChild from '@/components/layout/RequireChild'
import { useGlobalClickSound } from '@/hooks/useGlobalClickSound'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import MapPage from '@/pages/MapPage'
import RankingPage from '@/pages/RankingPage'
import SettingsPage from '@/pages/SettingsPage'
import TypingPage from '@/pages/TypingPage'

/**
 * 路由表：未来新增课程类型（代码关、游戏关）时，
 * 只需在此追加路由并复用 /lesson/:lessonId 的关卡加载逻辑。
 */
export default function App() {
  // 全局点击音效：任何按钮被按下都发一声（设置里可关）
  useGlobalClickSound()

  return (
    <>
      {/* 背景音乐：只在非打字页面播放，开关和音量都在设置里 */}
      <BackgroundMusic />
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/map"
        element={
          <RequireChild>
            <MapPage />
          </RequireChild>
        }
      />
      <Route
        path="/lesson/:lessonId"
        element={
          <RequireChild>
            <TypingPage />
          </RequireChild>
        }
      />
      <Route
        path="/ranking"
        element={
          <RequireChild>
            <RankingPage />
          </RequireChild>
        }
      />
      <Route
        path="/settings"
        element={
          <RequireChild>
            <SettingsPage />
          </RequireChild>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
