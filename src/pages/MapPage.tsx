import { useNavigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { KidHeader } from '@/components/layout/KidHeader'
import { Icon } from '@/components/icons/Icon'
import { StageIsland } from '@/components/map/StageIsland'
import { STAGES } from '@/data/courses'
import { getNextLesson } from '@/engine/progress'
import { useCurrentChild, useLessonProgress } from '@/store/selectors'

/** 学习地图：只有一处文字提示，其余靠节点状态、动画和角色表达。 */
export default function MapPage() {
  const navigate = useNavigate()
  const child = useCurrentChild()
  const lessons = useLessonProgress()

  if (!child) return null

  const nextLesson = getNextLesson(STAGES, lessons)

  return (
    <AppShell className="gap-5">
      <KidHeader showMapLink={false} />



      {nextLesson ? (
        <button
          type="button"
          onClick={() => {
            navigate(`/lesson/${nextLesson.id}`)
          }}
          className="anim-float flex w-full items-center justify-center gap-3 rounded-kid bg-brand-500 px-6 py-4 text-xl font-extrabold text-white shadow-kid active:translate-y-[1px]"
        >
          <Icon name="play" size={22} filled />
          继续闯关
        </button>
      ) : null}

      <section className="space-y-4">
        {STAGES.map((stage) => (
          <StageIsland
            key={stage.id}
            stage={stage}
            progress={lessons}
            onSelectLesson={
              stage.available
                ? (lessonId) => {
                    navigate(`/lesson/${lessonId}`)
                  }
                : undefined
            }
          />
        ))}
      </section>

      <p className="pb-4 text-center text-xs font-bold text-ink-soft">
        每个岛的前 3 关都已经开放 · 连续错 5 次会让你先跳过这个键
      </p>
    </AppShell>
  )
}
