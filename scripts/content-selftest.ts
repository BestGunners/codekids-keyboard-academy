/**
 * 课程内容自测：确认每一关都有题、都能真的敲出来。
 * 运行方式：node scripts/content-selftest.ts
 */
import { STAGES } from '../src/data/courses.ts'
import { getCharKeyInfo } from '../src/engine/keyMap.ts'
import {
  CHINESE_PUNCTUATION_KEY,
  PINYIN_BY_CHAR,
  findPinyinSegments,
  missingPinyin,
  missingPunctuation,
  pinyinOf,
} from '../src/data/pinyin.ts'
import { LESSON_PROGRAMS, getProgramLessonIds } from '../src/data/programs.ts'

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

/**
 * 字符串引号里可以放中文（打字时由系统自动填好，孩子不用切输入法）；
 * 引号外面的字符必须都能真的按出来。
 */
function untypeableChars(text: string): string[] {
  const bad = new Set<string>()
  let inString = false

  for (const char of text) {
    if (char === '"') {
      inString = !inString
      continue
    }
    if (inString) continue
    if (char === ' ') continue
    // 能直接按出来的字符
    if (getCharKeyInfo(char)) continue
    // 汉字：用拼音打出来
    if (PINYIN_BY_CHAR[char]) continue
    // 中文标点：按对应的英文键，例如「，」按逗号键
    if (CHINESE_PUNCTUATION_KEY[char]) continue
    bad.add(char)
  }

  return [...bad]
}

const lessons = STAGES.flatMap((stage) => stage.lessons)

console.log('\n1. 每个板块都能一路玩下去')
{
  STAGES.forEach((stage, index) => {
    const notReady = stage.lessons.filter((lesson) => !lesson.ready)
    check(
      `第 ${index + 1} 个板块「${stage.title}」${stage.lessons.length} 关全部有题目`,
      notReady.length === 0,
      notReady.length > 0 ? `还有 ${notReady.length} 关没内容：${notReady.map((l) => l.order).join(',')}` : '',
    )
  })

  check('所有岛都处于开放状态', STAGES.every((stage) => stage.available))
  check('关卡总数为 90（键盘入门 6 关 + 5 个岛 64 关 + 中文岛 20 关）', lessons.length === 90, String(lessons.length))
  check('第一个板块是「认识键盘」', STAGES[0]?.id === 7 && STAGES[0]?.lessons[0]?.kind === 'intro', String(STAGES[0]?.title))
  check('第一个板块教的是键盘与手指（题量少、目标速度慢）', (STAGES[0]?.lessons.length ?? 0) >= 5 && (STAGES[0]?.lessons[0]?.targetWpm ?? 99) <= 7)
}

console.log('\n2. 每关结构完整')
{
  check('关卡 id 不重复', lessons.length === new Set(lessons.map((lesson) => lesson.id)).size)

  const badOrder = STAGES.filter((stage) =>
    stage.lessons.some((lesson, index) => lesson.order !== index + 1 || lesson.stageId !== stage.id),
  )
  check('关卡序号连续、且与所在岛一致', badOrder.length === 0, badOrder.map((s) => s.title).join(','))

  check('每关都有标题', lessons.every((lesson) => lesson.title.trim().length > 0))
  check('每关至少 2 道题', lessons.every((lesson) => lesson.drills.length >= 2))
  check('每关都标了重点字符', lessons.every((lesson) => lesson.focusChars.length > 0))
  check('每关目标速度合理（5-40 WPM）', lessons.every((lesson) => lesson.targetWpm >= 5 && lesson.targetWpm <= 40))
}

console.log('\n3. 每道题都能真的敲出来')
{
  const allDrills = lessons.flatMap((lesson) => lesson.drills)
  check('题目总数足够', allDrills.length >= 180, String(allDrills.length))
  check('没有空题目', allDrills.every((drill) => drill.text.trim().length > 0))
  check(
    '题目不会太长（≤ 34 字符）',
    allDrills.every((drill) => drill.text.length <= 34),
    allDrills.filter((drill) => drill.text.length > 34).map((drill) => drill.text).join(' | '),
  )
  check('每道题都有提示', allDrills.every((drill) => (drill.hint ?? '').length > 3))

  const untypeable: string[] = []
  lessons.forEach((lesson) => {
    lesson.drills.forEach((drill) => {
      const bad = untypeableChars(drill.text)
      if (bad.length > 0) untypeable.push(`${lesson.id}「${drill.text}」→ ${bad.join('')}`)
    })
  })
  check('每个字都打得出来（汉字用拼音、中文标点用对应按键）', untypeable.length === 0, untypeable.slice(0, 5).join(' ; '))
}

console.log('\n4. 每关都有一个 boss 关做收尾')
{
  STAGES.forEach((stage) => {
    const bosses = stage.lessons.filter((lesson) => lesson.boss)
    check(
      `第 ${stage.id} 岛的 boss 关在最后一关`,
      bosses.length === 1 && bosses[0].order === stage.lessons.length,
      String(bosses.length),
    )
  })
}

console.log('\n5. 内容分布')
{
  const byKind = new Map<string, number>()
  lessons.forEach((lesson) => byKind.set(lesson.kind, (byKind.get(lesson.kind) ?? 0) + 1))
  check('有字母/单词关卡', (byKind.get('letters') ?? 0) + (byKind.get('words') ?? 0) > 0)
  check('有符号关卡', (byKind.get('symbols') ?? 0) >= 10, String(byKind.get('symbols') ?? 0))
  check('有代码关卡', (byKind.get('code') ?? 0) >= 10, String(byKind.get('code') ?? 0))
  check('有游戏关卡', (byKind.get('game') ?? 0) >= 8, String(byKind.get('game') ?? 0))
}

console.log('\n6. 中文都能用拼音打出来')
{
  check('拼音表能拼出「你好」', pinyinOf('你好') === 'nihao', pinyinOf('你好'))

  const missing: string[] = []
  const chineseLessonIds = new Set<string>()

  lessons.forEach((lesson) => {
    lesson.drills.forEach((drill) => {
      const lack = missingPinyin(drill.text)
      if (lack.length > 0) missing.push(`${lesson.id}「${drill.text}」→ 缺 ${lack.join('')}`)
      if (findPinyinSegments(drill.text).length > 0) chineseLessonIds.add(lesson.id)
    })
  })

  check('每个汉字都在拼音表里', missing.length === 0, missing.slice(0, 3).join(' ; '))
  check('课程里确实有要打中文的关卡', chineseLessonIds.size >= 25, String(chineseLessonIds.size))

  const badPunctuation: string[] = []
  lessons.forEach((lesson) => {
    lesson.drills.forEach((drill) => {
      const lack = missingPunctuation(drill.text)
      if (lack.length > 0) badPunctuation.push(`${lesson.id}「${drill.text}」→ 缺 ${lack.join('')}`)
    })
  })
  check('每个中文标点都有对应的按键', badPunctuation.length === 0, badPunctuation.slice(0, 3).join(' ; '))

  const sample = findPinyinSegments('cout << "你好";')
  check('能识别出中文段落的位置', sample.length === 1 && sample[0].start === 9 && sample[0].length === 2, JSON.stringify(sample))
  check('中文段落的拼音正确', sample[0].pinyin === 'nihao', sample[0].pinyin)
}
console.log('\n7. 岛 4/5 给孩子看的内容都是中文')
{
  // 岛 1-3 是字母、英文单词、符号练习，本来就要打英文；
  // 岛 4-5 是编程关，代码里给孩子看的提示文字必须是中文。
  const found: string[] = []

  const scanLiterals = (text: string, where: string) => {
    const literals = text.match(/"[^"]*"/g) ?? []
    literals.forEach((literal) => {
      const inner = literal.slice(1, -1)
      if (/[A-Za-z]/.test(inner)) found.push(`${where} 里写着「${inner}」`)
    })
  }

  lessons.forEach((lesson) => {
    if (lesson.stageId < 4) return
    lesson.drills.forEach((drill) => scanLiterals(drill.text, `${lesson.id} 练习`))
  })

  getProgramLessonIds().forEach((id) => {
    const entry = LESSON_PROGRAMS[id]
    entry.program.forEach((line) => scanLiterals(line, `${id} 程序`))
    if (entry.expectedOutput && /[A-Za-z]/.test(entry.expectedOutput)) {
      found.push(`${id} 期望输出「${entry.expectedOutput}」`)
    }
  })

  check('编程关里没有英文提示文字', found.length === 0, found.slice(0, 20).join(' ; '))
}
console.log(`\n结果：${passed} 项通过，${failures.length} 项失败`)
if (failures.length > 0) {
  failures.forEach((item) => console.log(` - ${item}`))
  process.exit(1)
}
console.log('课程内容自测全部通过 🎉')
