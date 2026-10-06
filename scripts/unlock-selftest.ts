/**
 * 解锁与「下一关」规则自测。
 * 规则：每个岛一开始只开放前 3 关；通过前 3 关后开第 4 关；之后每过一关开下一关。
 * 运行方式：node scripts/unlock-selftest.ts
 */
import { STAGES } from '../src/data/courses.ts'
import {
  FREE_START_LESSONS,
  countCompletedLessons,
  getLessonAfter,
  getLessonStatus,
  getNextLesson,
  isStageCompleted,
} from '../src/engine/progress.ts'
import type { LessonProgress } from '../src/types/course.ts'

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

function progressWith(lessonIds: string[], stars = 1): Record<string, LessonProgress> {
  const record: Record<string, LessonProgress> = {}
  lessonIds.forEach((id) => {
    record[id] = {
      stars,
      bestWpm: 20,
      bestAccuracy: 0.98,
      attempts: 1,
      completedAt: '2026-10-05',
    }
  })
  return record
}

const stageOne = STAGES[0]
const ids = stageOne.lessons.map((lesson) => lesson.id)
// 顺序解锁用关卡更多的岛来验证（第一个板块「认识键盘」只有 6 关）
const longStage = STAGES.find((stage) => stage.lessons.length >= 10) ?? stageOne
const longIds = longStage.lessons.map((lesson) => lesson.id)

console.log(`\n1. 每个岛一开始只开放前 ${FREE_START_LESSONS} 关`)
{
  const empty = {}
  STAGES.forEach((stage) => {
    const first = getLessonStatus(stage, 0, empty)
    const second = getLessonStatus(stage, 1, empty)
    const third = getLessonStatus(stage, 2, empty)
    const fourth = getLessonStatus(stage, 3, empty)
    check(
      `第 ${stage.id} 岛：前三关可玩`,
      first === 'unlocked' && second === 'unlocked' && third === 'unlocked',
      `实际 ${first}/${second}/${third}`,
    )
    check(`第 ${stage.id} 岛：第 4 关锁定`, fourth === 'locked', `实际 ${fourth}`)
  })
}

console.log('\n2. 内容没做好的关卡仍然会被锁住（守门规则）')
{
  check(
    '现在所有关卡都有内容',
    STAGES.every((stage) => stage.lessons.every((lesson) => lesson.ready)),
  )

  const stageTwo = STAGES[1]
  const pulledContent = {
    ...stageTwo,
    lessons: stageTwo.lessons.map((lesson, index) =>
      index === 0 ? { ...lesson, ready: false } : lesson,
    ),
  }
  check('内容未完成的关卡即使在前 3 关里也保持锁定', getLessonStatus(pulledContent, 0, {}) === 'locked')
  check('同岛的其它关卡不受影响', getLessonStatus(stageTwo, 1, {}) === 'unlocked')
  check('内容未完成的关卡不会被推荐', getNextLesson([pulledContent], {})?.id !== stageTwo.lessons[0].id)
}

console.log('\n3. 通过前 3 关后，第 4 关开启')
{
  const firstThree = progressWith(longIds.slice(0, 3))
  check('通过前 3 关后，第 4 关开启', getLessonStatus(longStage, 3, firstThree) === 'unlocked')
  check('但第 5 关仍然锁着', getLessonStatus(longStage, 4, firstThree) === 'locked')
  check('只通过 2 关时，第 4 关还是锁的', getLessonStatus(longStage, 3, progressWith(longIds.slice(0, 2))) === 'locked')
}

console.log('\n4. 之后每过一关才开下一关（严格按顺序）')
{
  const fourDone = progressWith(longIds.slice(0, 4))
  check('通过第 4 关后，第 5 关开启', getLessonStatus(longStage, 4, fourDone) === 'unlocked')
  check('第 6 关仍然锁着', getLessonStatus(longStage, 5, fourDone) === 'locked')

  const fiveDone = progressWith(longIds.slice(0, 5))
  check('通过第 5 关后，第 6 关开启', getLessonStatus(longStage, 5, fiveDone) === 'unlocked')
  check('第 9 关仍然锁着（不会再一次性全开）', getLessonStatus(longStage, 8, fiveDone) === 'locked')
  check('最后一关也要一关一关来', getLessonStatus(longStage, longIds.length - 1, fiveDone) === 'locked')

  // 跳着玩也不破坏顺序：第 3 关通过后，第 4 关照样开启
  const onlyThird = progressWith([longIds[2]])
  check('跳着玩时也遵守同一规则', getLessonStatus(longStage, 3, onlyThird) === 'unlocked')
}

console.log('\n5. 「下一关」跟着当前关卡往后走')
{
  const after = getLessonAfter(STAGES, ids[2], progressWith([ids[2]]))
  check('从第 3 关出发，下一关是第 4 关', after?.id === ids[3], `实际 ${after?.id}`)
  check('不会跳回第 1 关', after?.id !== ids[0])

  const afterFirst = getLessonAfter(STAGES, ids[0], progressWith([ids[0]]))
  check('从第 1 关出发，下一关是第 2 关', afterFirst?.id === ids[1], `实际 ${afterFirst?.id}`)

  const stageFive = STAGES[4]
  const stageFiveIds = stageFive.lessons.map((lesson) => lesson.id)
  const toNext = getLessonAfter(STAGES, stageFiveIds[2], progressWith([stageFiveIds[2]]))
  check('岛 5 第 3 关之后能到第 4 关', toNext?.id === stageFiveIds[3], `实际 ${toNext?.id}`)

  const allStageOne = progressWith(ids)
  check('整岛通关判定', isStageCompleted(stageOne, allStageOne))
  const toNextIsland = getLessonAfter(STAGES, ids[ids.length - 1], allStageOne)
  check('整岛通关后进入下一个岛', toNextIsland?.id === STAGES[1].lessons[0].id, `实际 ${toNextIsland?.id}`)

  const allStageFive = progressWith(stageFiveIds)
  const lastFive = getLessonAfter(STAGES, stageFiveIds[stageFiveIds.length - 1], allStageFive)
  check('后面还有第 6 岛，所以还能继续', lastFive?.id === STAGES[5].lessons[0].id, `实际 ${lastFive?.id}`)
}

console.log('\n6. 「继续闯关」的推荐顺序')
{
  check('一开始推荐第 1 关', getNextLesson(STAGES, {})?.id === ids[0])
  const freeStart = progressWith([ids[0], ids[2]])
  check('跳着玩之后推荐未通关的第 2 关', getNextLesson(STAGES, freeStart)?.id === ids[1])
  check('已通关 2 关', countCompletedLessons(stageOne, freeStart) === 2)
}

console.log(`\n结果：${passed} 项通过，${failures.length} 项失败`)
if (failures.length > 0) {
  failures.forEach((item) => console.log(` - ${item}`))
  process.exit(1)
}
console.log('解锁规则自测全部通过 🎉')