import type { SceneCounts } from '@/engine/cpp/interpreter'
import { LESSON_PROGRAMS_CODE } from './programsCode.ts'
import { LESSON_PROGRAMS_EXTRA } from './programsExtra.ts'

export interface LessonProgram {
  /** 拼好的完整程序（孩子在关卡里已经一行一行敲过，这里直接给他看运行结果） */
  program: string[]
  /** 期望输出：写了才会自动判定通过 */
  expectedOutput?: string
  /** 运行时预填的输入内容 */
  input?: string[]
  /** 一句话任务，告诉孩子这段程序要做什么 */
  task: string
  /** 这一关要在舞台上画图（岛 5） */
  stage?: boolean
  /** 期望画面：只要写了的图形数量对得上就算通过 */
  expectedScene?: SceneCounts
}

/**
 * 可以真正运行的关卡程序。
 * 内容放在这里而不是课程数据里，是为了让「练习用的打字内容」和「能跑起来的完整程序」
 * 各自保持干净：打字内容可以是一个片段，程序必须是完整可运行的。
 */
export const LESSON_PROGRAMS: Record<string, LessonProgram> = {
  ...LESSON_PROGRAMS_CODE,
  ...LESSON_PROGRAMS_EXTRA,
}

export function getLessonProgram(lessonId: string): LessonProgram | undefined {
  return LESSON_PROGRAMS[lessonId]
}

export function getProgramLessonIds(): string[] {
  return Object.keys(LESSON_PROGRAMS)
}
