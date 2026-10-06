/**
 * 舞台绘图自测：画图 API、坐标与颜色校验、岛 5 每关的画面判定。
 * 运行方式：node scripts/stage-selftest.ts
 */
import { STAGE_COLORS, countSceneKinds, resolveFrames, runCpp } from '../src/engine/cpp/index.ts'
import { LESSON_PROGRAMS, getProgramLessonIds } from '../src/data/programs.ts'
import { STAGES } from '../src/data/courses.ts'

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

function scene(source: string) {
  return runCpp(source).scene
}

/** 动画播完之后（最后一帧）的画面统计 */
function finalCounts(source: string, input: string[] = []) {
  const frames = resolveFrames(runCpp(source, { input }).scene)
  return countSceneKinds(frames[frames.length - 1]?.commands ?? [])
}

console.log('\n1. 画图 API')
{
  const star = scene('star(10, 20);')[0]
  check('画星星', star?.type === 'star' && star.x === 10 && star.y === 20, JSON.stringify(star))

  const circle = scene('circle(50, 60, 12);')[0]
  check('画圆（带半径）', circle?.type === 'circle' && circle.radius === 12, JSON.stringify(circle))

  const rect = scene('rect(10, 20, 30, 40);')[0]
  check('画方块（带宽高）', rect?.type === 'rect' && rect.width === 30 && rect.height === 40, JSON.stringify(rect))

  const line = scene('line(0, 0, 100, 50);')[0]
  check('画线', line?.type === 'line' && line.x2 === 100 && line.y2 === 50, JSON.stringify(line))

  const text = scene('text("win", 20, 30);')[0]
  check('写字', text?.type === 'text' && text.text === 'win', JSON.stringify(text))

  check('默认颜色是橙色', star?.type === 'star' && star.color === 'orange', JSON.stringify(star))

  const colored = scene('color("red");\nstar(10, 10);')
  check('换颜色之后画的星星是红色', colored[0]?.type === 'star' && colored[0].color === 'red', JSON.stringify(colored))

  check('clear() 会记在舞台指令里', scene('clear();')[0]?.type === 'clear')
}

console.log('\n2. 循环真的能画出很多东西')
{
  const five = scene('for (int i = 0; i < 5; i++) {\n  star(i * 30 + 20, 40);\n}')
  check('循环 5 次画出 5 颗星', countSceneKinds(five).star === 5, JSON.stringify(countSceneKinds(five)))

  const eight = scene('for (int i = 0; i < 8; i++) {\n  star(i * 30 + 20, 40);\n}')
  check('把 5 改成 8 就画 8 颗星（孩子改数字的乐趣）', countSceneKinds(eight).star === 8)

  const colored = scene('for (int i = 0; i < 3; i++) {\n  color("blue");\n  circle(20 + i * 40, 60, 10);\n}')
  check('循环里换颜色也生效', countSceneKinds(colored).circle === 3 && colored.every((item) => item.type === 'circle' && item.color === 'blue'), JSON.stringify(countSceneKinds(colored)))

  const numbers = scene('int score = 30;\ntext(score, 20, 30);')
  check('写数字会自动变成文字', numbers[0]?.type === 'text' && numbers[0].text === '30', JSON.stringify(numbers[0]))
}

console.log('\n3. 让画面动起来（wait 与帧）')
{
  const still = resolveFrames(runCpp('star(10, 10);').scene)
  check('没有 wait 的程序只有一帧', still.length === 1, String(still.length))

  const moving = resolveFrames(
    runCpp('for (int i = 0; i < 3; i++) {\n  clear();\n  circle(20 + i * 20, 40, 8);\n  wait(0.2);\n}').scene,
  )
  check('三次 wait 得到 3 帧', moving.length === 3, String(moving.length))
  check('每帧记下了要停多久', moving.every((frame) => Math.abs(frame.duration - 0.2) < 1e-9))
  check(
    '每帧只有一个圆（clear 生效，看起来就在动）',
    moving.every((frame) => frame.commands.filter((command) => command.type === 'circle').length === 1),
  )

  const accumulating = resolveFrames(
    runCpp('star(10, 10);\nwait(0.2);\nstar(50, 10);\nwait(0.2);\nstar(90, 10);').scene,
  )
  check(
    '不清屏时星星会一颗颗累加',
    accumulating.map((frame) => frame.commands.length).join(',') === '1,2,3',
    accumulating.map((frame) => frame.commands.length).join(','),
  )

  const tooLong = runCpp('for (int i = 0; i < 40; i++) {\n  wait(2);\n}')
  check('动画超过 30 秒会被拦住', !tooLong.ok && (tooLong.error?.message ?? '').includes('太长'))

  const badWait = runCpp('wait(9);')
  check('等待时间超出范围会报错', !badWait.ok && (badWait.error?.message ?? '').includes('等待时间'))

  const keyed = runCpp('string k = key();\nif (k == "1") {\n  star(10, 10);\n}', { input: ['1'] })
  check('key() 能读到按键（写在输入框里）', keyed.ok && countSceneKinds(keyed.scene).star === 1)

  const otherKey = runCpp('string k = key();\nif (k == "1") {\n  star(10, 10);\n} else {\n  circle(60, 60, 10);\n}', {
    input: ['2'],
  })
  check('按别的键会走 else 分支', otherKey.ok && countSceneKinds(otherKey.scene).circle === 1)

  const noKey = runCpp('string k = key();')
  check('没给按键时会提示', !noKey.ok && (noKey.error?.message ?? '').includes('输入'))
}
console.log('\n4. 舞台也会拦住错误')
{
  const badColor = runCpp('color("rainbow");')
  check('不认识的颜色会报错', !badColor.ok && (badColor.error?.message ?? '').includes('颜色'))
  check('报错时会列出可用颜色（中文）', (badColor.error?.hint ?? '').includes('绿色'))
  check('可用颜色表里有 10 种', STAGE_COLORS.length === 10, String(STAGE_COLORS.length))

  const chinese = scene('color("绿色");\nstar(10, 10);')
  check('颜色可以直接写中文', chinese[0]?.type === 'star' && chinese[0].color === 'green', JSON.stringify(chinese[0]))

  const badCoordinate = runCpp('star(9999, 10);')
  check('坐标跑出舞台会报错', !badCoordinate.ok && (badCoordinate.error?.message ?? '').includes('舞台'))

  const tooMany = runCpp('for (int i = 0; i < 900; i++) {\n  star(10, 10);\n}')
  check('画太多会被拦住', !tooMany.ok && (tooMany.error?.message ?? '').includes('太多'))
}

console.log('\n5. 岛 5 每一关都能画出画面')
{
  const lessons = STAGES.flatMap((stage) => stage.lessons)
  const byId = new Map(lessons.map((lesson) => [lesson.id, lesson]))
  const programIds = getProgramLessonIds()
  const stageIds = programIds.filter((id) => LESSON_PROGRAMS[id].stage)

  check('岛 5 的 12 关都有可运行程序', lessons.filter((lesson) => lesson.stageId === 5).every((lesson) => programIds.includes(lesson.id)))
  check('岛 5 的程序都标记为舞台关卡', stageIds.length === 12, String(stageIds.length))
  check('岛 4 的程序不显示舞台', programIds.filter((id) => LESSON_PROGRAMS[id].stage !== true).every((id) => (byId.get(id)?.stageId ?? 0) === 4))
  check('每个舞台关卡都写了期望画面', stageIds.every((id) => LESSON_PROGRAMS[id].expectedScene !== undefined))

  stageIds.forEach((id) => {
    const entry = LESSON_PROGRAMS[id]
    const lesson = byId.get(id)
    const result = runCpp(entry.program.join('\n'), { input: entry.input ?? [] })
    const frameList = resolveFrames(result.scene)
    const counts = countSceneKinds(frameList[frameList.length - 1]?.commands ?? [])
    const expected = entry.expectedScene ?? {}
    const matched = Object.entries(expected).every(([kind, count]) => counts[kind as keyof typeof counts] === count)

    check(
      `第 ${lesson?.order} 关「${lesson?.title}」画面符合预期`,
      result.ok && matched,
      result.ok ? `期望 ${JSON.stringify(expected)}，实际 ${JSON.stringify(counts)}` : `报错：${result.error?.message}`,
    )
  })
}

console.log('\n6. 改代码，画面跟着变')
{
  const base = LESSON_PROGRAMS['s5-l08']
  const edited = base.program.join('\n').replace('int speed = 5;', 'int speed = 8;')
  check('把 speed 改成 8，星星就变 8 颗', finalCounts(edited).star === 8, JSON.stringify(finalCounts(edited)))

  const s5l10 = LESSON_PROGRAMS['s5-l10']
  const more = s5l10.program.join('\n').replace('i < 4;', 'i < 6;')
  check('把循环次数改成 6，就画 6 颗星', finalCounts(more).star === 6)
}

console.log(`\n结果：${passed} 项通过，${failures.length} 项失败`)
if (failures.length > 0) {
  failures.forEach((item) => console.log(` - ${item}`))
  process.exit(1)
}
console.log('舞台绘图自测全部通过 🎉')
