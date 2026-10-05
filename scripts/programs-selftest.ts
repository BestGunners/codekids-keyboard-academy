/**
 * 关卡程序自测：确保每一段「可运行程序」真的能跑，并且输出与预期一致。
 * 运行方式：node scripts/programs-selftest.ts
 */
import { STAGES } from '../src/data/courses.ts'
import { LESSON_PROGRAMS, getProgramLessonIds } from '../src/data/programs.ts'
import { runCpp } from '../src/engine/cpp/index.ts'

let passed = 0
const failures: string[] = []

function check(name: string, condition: boolean, extra = '') {
  if (condition) {
    passed += 1
    console.log(`  ✅ ${name}`)
  } else {
    failures.push(`${name} ${extra}`)
    console.log(`  ❌ ${name} ${extra}`)
  }
}

const lessons = STAGES.flatMap((stage) => stage.lessons)
const byId = new Map(lessons.map((lesson) => [lesson.id, lesson]))
const programIds = getProgramLessonIds()

console.log('\n1. 程序的归属正确')
{
  check('每个程序都对应一关真实存在的关卡', programIds.every((id) => byId.has(id)))
  check('程序都挂在编程类关卡上', programIds.every((id) => ['code', 'game'].includes(byId.get(id)?.kind ?? '')))
  check('岛 4 的 12 关都有可运行程序', lessons.filter((lesson) => lesson.stageId === 4).every((lesson) => programIds.includes(lesson.id)))
  check('岛 1-3 不需要运行程序', lessons.filter((lesson) => lesson.stageId <= 3).every((lesson) => !programIds.includes(lesson.id)))
  check('每个程序都有任务说明', programIds.every((id) => (LESSON_PROGRAMS[id].task ?? '').length > 5))
  check('每个程序至少 3 行', programIds.every((id) => LESSON_PROGRAMS[id].program.length >= 3))
}

console.log('\n2. 每段程序都能真的跑起来')
{
  programIds.forEach((id) => {
    const entry = LESSON_PROGRAMS[id]
    const lesson = byId.get(id)
    const result = runCpp(entry.program.join('\n'), { input: entry.input ?? [] })
    check(
      `第 ${lesson?.order} 关「${lesson?.title}」能运行`,
      result.ok,
      result.ok ? '' : `第 ${result.error?.line} 行：${result.error?.message}`,
    )
  })
}

console.log('\n3. 输出与预期一致（自动判定的依据）')
{
  programIds.forEach((id) => {
    const entry = LESSON_PROGRAMS[id]
    if (entry.expectedOutput === undefined) return

    const lesson = byId.get(id)
    const result = runCpp(entry.program.join('\n'), { input: entry.input ?? [] })
    check(
      `第 ${lesson?.order} 关「${lesson?.title}」输出符合预期`,
      result.output === entry.expectedOutput,
      `期望「${entry.expectedOutput}」，实际「${result.output}」`,
    )
  })

  const freeRun = programIds.filter(
    (id) =>
      LESSON_PROGRAMS[id].expectedOutput === undefined &&
      LESSON_PROGRAMS[id].expectedScene === undefined,
  )
  check('只有随机数那一关是自由探索', freeRun.length === 1 && freeRun[0] === 's4-l09', freeRun.join(','))
}

console.log('\n4. 需要输入的关卡都准备好了输入内容')
{
  programIds.forEach((id) => {
    const entry = LESSON_PROGRAMS[id]
    if (!entry.program.some((line) => line.includes('cin'))) return
    const lesson = byId.get(id)
    check(`第 ${lesson?.order} 关准备了输入内容`, (entry.input ?? []).length > 0)
  })
}

console.log('\n5. 孩子改代码也不会崩')
{
  const base = LESSON_PROGRAMS['s4-l05']
  const edited = base.program.join('\n').replace('int age = 9;', 'int age = 6;')
  const result = runCpp(edited)
  check('把 9 改成 6 会走 else 分支', result.output === '小孩子', result.output)

  const broken = runCpp('int score = 10\ncout << score;')
  check('少写分号会给出提示而不是崩溃', !broken.ok && (broken.error?.message ?? '').includes('分号'))

  const loopForever = runCpp('while (true) {\n}')
  check('改成死循环会被沙箱拦住', !loopForever.ok && (loopForever.error?.message ?? '').includes('循环'))
}

console.log(`\n结果：${passed} 项通过，${failures.length} 项失败`)
if (failures.length > 0) {
  failures.forEach((item) => console.log(` - ${item}`))
  process.exit(1)
}
console.log('关卡程序自测全部通过 🎉')
