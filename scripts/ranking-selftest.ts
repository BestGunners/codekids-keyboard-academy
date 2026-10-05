/**
 * 排行榜自测：验证三种榜单的排序、并列规则与奖牌分配。
 * 运行方式：node scripts/ranking-selftest.ts
 */
import { buildRankEntries, medalFor, metricOf, rankBy } from '../src/engine/ranking.ts'
import { STAGES } from '../src/data/courses.ts'
import type { ChildProfile } from '../src/store/childStore.ts'
import type { ChildProgress } from '../src/store/progressStore.ts'

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

function profile(id: string, nickname: string): ChildProfile {
  return {
    id,
    nickname,
    avatarId: 'fox',
    ageBand: '8-10',
    pattern: ['🌟', '🚀', '🐟', '🍎'],
    createdAt: '2026-09-01',
  }
}

function progressWith(starsByLesson: Record<string, number>, streak = 1): ChildProgress {
  const lessons = Object.fromEntries(
    Object.entries(starsByLesson).map(([lessonId, stars]) => [
      lessonId,
      { stars, bestWpm: 10 * stars, bestAccuracy: 0.95, attempts: 1, completedAt: '2026-09-24' },
    ]),
  )

  return {
    lessons,
    streak: { current: streak, longest: streak, lastActiveDate: '2026-09-24' },
    badges: [],
  }
}

const ids = STAGES[0].lessons.map((lesson) => lesson.id)
const children = [profile('a', '小雨'), profile('b', '阿宝'), profile('c', '豆豆')]
const byChild: Record<string, ChildProgress> = {
  a: progressWith({ [ids[0]]: 3, [ids[1]]: 2 }, 5),
  b: progressWith({ [ids[0]]: 3, [ids[1]]: 3, [ids[2]]: 3 }, 2),
  c: progressWith({}, 9),
}

console.log('\n1. 榜单数据整理')
{
  const entries = buildRankEntries(children, byChild, STAGES)
  const byId = Object.fromEntries(entries.map((entry) => [entry.childId, entry]))

  check('星星换算成能量（3 星 + 2 星 = 5 星 → 50 能量）', byId.a.xp === 50, `实际 ${byId.a.xp}`)
  check('等级由能量推导（100 能量一级）', byId.b.level === 1 && byId.b.xp === 90)
  check('速度取个人最快成绩', byId.b.bestWpm === 30, `实际 ${byId.b.bestWpm}`)
  check('坚持天数来自连续记录', byId.c.streakDays === 9)
  check('没有进度的小朋友也能进榜', byId.c.xp === 0 && byId.c.bestWpm === 0)
}

console.log('\n2. 能量榜')
{
  const ranked = rankBy(buildRankEntries(children, byChild, STAGES), 'xp')
  check('能量最高的排第一', ranked[0].childId === 'b', `实际 ${ranked[0].childId}`)
  check('名次依次递减', ranked.map((entry) => entry.xp).join(',') === '90,50,0', ranked.map((entry) => entry.xp).join(','))
}

console.log('\n3. 速度榜与坚持榜')
{
  const entries = buildRankEntries(children, byChild, STAGES)
  const speed = rankBy(entries, 'speed')
  check('速度榜第一是最快的孩子', speed[0].childId === 'b')
  check('没有记录的孩子排在最后', speed[speed.length - 1].childId === 'c')

  const streak = rankBy(entries, 'streak')
  check('坚持榜第一是连续天数最多的孩子', streak[0].childId === 'c')
}

console.log('\n4. 并列与奖牌')
{
  const tied = [
    profile('x', '小明'),
    profile('y', '安安'),
  ]
  const tiedProgress: Record<string, ChildProgress> = {
    x: progressWith({ [ids[0]]: 3 }),
    y: progressWith({ [ids[0]]: 3 }),
  }
  const ranked = rankBy(buildRankEntries(tied, tiedProgress, STAGES), 'xp')
  check('并列时按昵称稳定排序', ranked.map((entry) => entry.nickname).join(',') === '安安,小明', ranked.map((entry) => entry.nickname).join(','))

  check('第一名是金牌', medalFor(0) === '🥇')
  check('第二名是银牌', medalFor(1) === '🥈')
  check('第三名是铜牌', medalFor(2) === '🥉')
  check('第四名没有奖牌', medalFor(3) === null)
}

console.log('\n5. 空榜')
{
  const empty = buildRankEntries([], {}, STAGES)
  check('没有小朋友时榜单为空', empty.length === 0)
  const first = profile('z', '小新')
  const solo = buildRankEntries([first], {}, STAGES)
  check('单个小朋友也能正常显示', solo.length === 1 && metricOf(solo[0], 'xp') === 0)
}

console.log(`\n结果：${passed} 项通过，${failures.length} 项失败`)
if (failures.length > 0) {
  failures.forEach((item) => console.log(` - ${item}`))
  process.exit(1)
}
console.log('排行榜自测全部通过 🎉')
