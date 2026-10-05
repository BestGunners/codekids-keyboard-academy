/**
 * 打字引擎自测：用「击键脚本回放」验证判定、统计与星级规则。
 * 运行方式：node scripts/engine-selftest.ts
 * （Node 22+ 原生支持直接执行 TypeScript）
 */
import {
  buildSummary,
  computeStars,
  computeStats,
  createSession,
  getExpectedKey,
  getPinyinTask,
  hintLevelFor,
  isKeystrokeCorrect,
  isTypingPinyin,
  keyEventToChar,
  strokeSound,
  landedChineseChar,
  typingReducer,
} from '../src/engine/typingEngine.ts'

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

function replay(text: string, keys: string, startAt = 1_000_000) {
  let state = createSession(text, startAt)
  keys.split('').forEach((char, index) => {
    state = typingReducer(state, { type: 'keystroke', char, at: startAt + (index + 1) * 200 })
  })
  return { state, endAt: startAt + (keys.length + 1) * 200 }
}

console.log('\n1. 正确输入推进光标')
{
  const { state } = replay('asdf', 'asdf')
  check('光标到达末尾', state.cursor === 4)
  check('正确字符计入统计', state.correctKeystrokes === 4)
  check('没有错误', state.errorCount === 0)
  check('全部通过首次输入', state.firstTryCorrectCount === 4)
}

console.log('\n2. 敲错不前进（不允许带错前进）')
{
  const { state } = replay('asdf', 'ax')
  check('光标停在错误字符处', state.cursor === 1)
  check('错误被记录', state.errorCount === 1)
  check('连续错误累加', state.consecutiveErrors === 1)
  check('错误字符被标记为 error', state.statuses[1] === 'error')
}

console.log('\n3. 纠错后继续，首次正确率口径正确')
{
  const { state } = replay('asdf', 'axsdf')
  check('纠正后可以继续前进', state.cursor === 4)
  check('正确率按按键口径 = 4/5', Math.abs(state.correctKeystrokes / state.totalKeystrokes - 0.8) < 1e-9)
  check('首次正确字符为 3 个（第二个字符错过一次）', state.firstTryCorrectCount === 3)
  check('错误后连续错误清零', state.consecutiveErrors === 0)
}

console.log('\n4. 空格与符号判定')
{
  const { state } = replay('a {', 'a {')
  check('空格可以正确输入', state.cursor === 3 && state.errorCount === 0)

  const wrongShift = replay('{', '[')
  check('漏按 Shift 记为错误', wrongShift.state.errorCount === 1 && wrongShift.state.cursor === 0)
}

console.log('\n5. 跳过机制')
{
  let state = createSession('asdf', 1_000_000)
  state = typingReducer(state, { type: 'keystroke', char: 'a', at: 1_000_100 })
  state = typingReducer(state, { type: 'skip', at: 1_000_200 })
  check('跳过后光标前进', state.cursor === 2)
  check('跳过字符被标记', state.statuses[1] === 'skipped')
  check('跳过不计为正确输入', state.correctKeystrokes === 1)
}

console.log('\n6. 速度与正确率计算')
{
  // 20 个字符、用时 24 秒 → 50 CPM，即 10 WPM（20/5=4 词 ÷ 0.4 分钟）
  const text = 'asdfasdfasdfasdfasdf'
  const startAt = 1_000_000
  let state = createSession(text, startAt)
  for (let index = 0; index < text.length; index += 1) {
    state = typingReducer(state, { type: 'keystroke', char: text[index]!, at: startAt + (index + 1) * 1200 })
  }
  const stats = computeStats(state, { now: startAt + text.length * 1200 })
  check('WPM 计算正确（应为 10）', stats.wpm === 10, `实际 ${stats.wpm}`)
  check('CPM 计算正确（应为 50）', stats.cpm === 50, `实际 ${stats.cpm}`)
  check('正确率为 100%', stats.accuracy === 1)
}

console.log('\n7. 星级判定：先准确后速度')
{
  check('准确率不足只给 1 星', computeStars({ accuracy: 0.8, wpm: 40, targetWpm: 10, completed: true }) === 1)
  check('准确率 93% 以上给 2 星', computeStars({ accuracy: 0.94, wpm: 40, targetWpm: 10, completed: true }) === 2)
  check('准确率 97% 且达标给 3 星', computeStars({ accuracy: 0.98, wpm: 12, targetWpm: 10, completed: true }) === 3)
  check('正确率高但速度不够只有 2 星', computeStars({ accuracy: 0.99, wpm: 5, targetWpm: 10, completed: true }) === 2)
  check('未完成只给 1 星', computeStars({ accuracy: 1, wpm: 30, targetWpm: 10, completed: false }) === 1)
}

console.log('\n8. 提示阶梯')
{
  check('无错误 L0', hintLevelFor(0) === 0)
  check('错 1 次 L1', hintLevelFor(1) === 1)
  check('错 2 次 L2', hintLevelFor(2) === 2)
  check('错 3 次 L3', hintLevelFor(3) === 3)
  check('错 5 次 L4 允许跳过', hintLevelFor(5) === 4)
}

console.log('\n9. 键盘事件解析')
{
  const fake = (init: Partial<KeyboardEvent>) => init as unknown as KeyboardEvent
  check('普通字母', keyEventToChar(fake({ key: 'a' })) === 'a')
  check('Shift 组合符号', keyEventToChar(fake({ key: '{' })) === '{')
  check('空格', keyEventToChar(fake({ key: ' ' })) === ' ')
  check('修饰键被忽略', keyEventToChar(fake({ key: 'Shift' })) === null)
  check('带 Ctrl 的快捷键被忽略', keyEventToChar(fake({ key: 'a', ctrlKey: true })) === null)
  check('中文输入法组合中不判定', keyEventToChar(fake({ key: 'a', isComposing: true })) === null)
}

console.log('\n10. 关卡结算汇总')
{
  const { state, endAt } = replay('asdf', 'asdf')
  const summary = buildSummary(state, endAt, 5)
  check('结算是 3 星（准确率 100% 且速度达标）', summary.stars === 3, `实际 ${summary.stars}`)
  check('无弱键', summary.weakKeys.length === 0)

  const withError = replay('asdf', 'axsdf')
  const errorSummary = buildSummary(withError.state, withError.endAt, 5)
  check('弱键统计包含出错的键', errorSummary.weakKeys.some((item) => item.char === 's'))
  check('易混淆对记录完整', errorSummary.confusions.some((item) => item.expected === 's' && item.actual === 'x'))
}

console.log('\n11. 中文一个字一个字用拼音打')
{
  const text = 'cout << "你好";'
  const typeAll = (start: SessionState, keys: string, base: number) =>
    keys.split('').reduce(
      (acc, char, index) =>
        typingReducer(acc, { type: 'keystroke', char, at: base + (index + 1) * 100 }),
      start,
    )

  let state = typeAll(createSession(text, 1_000_000), 'cout << "', 1_000_000)
  check('敲到引号后停在第一个汉字上', state.cursor === 9, String(state.cursor))
  check('这时该敲拼音字母 n', getExpectedKey(state) === 'n', String(getExpectedKey(state)))

  state = typingReducer(state, { type: 'keystroke', char: 'n', at: 1_000_100 })
  check('拼音没打完，还停在这个字上', state.cursor === 9 && getExpectedKey(state) === 'i', String(getExpectedKey(state)))
  check('打过的拼音会显示出来', state.pinyinTyped === 'n', state.pinyinTyped)

  state = typingReducer(state, { type: 'keystroke', char: 'i', at: 1_000_200 })
  check('第一个字打完立刻变绿', state.statuses[9] === 'correct', state.statuses.join(''))
  check('光标移到第二个字', state.cursor === 10, String(state.cursor))
  check('接着该敲 h', getExpectedKey(state) === 'h', String(getExpectedKey(state)))

  state = typeAll(state, 'hao', 1_000_300)
  check('第二个字打完也立刻变绿', state.statuses[10] === 'correct', state.statuses.join(''))
  check('光标跳过这段中文', state.cursor === 11, String(state.cursor))
  check('接着敲引号', getExpectedKey(state) === '"', String(getExpectedKey(state)))

  state = typeAll(state, '";', 1_000_400)
  const stats = computeStats(state, { now: 1_000_600 })
  check('整句完成', state.cursor === 13 && stats.completed)
  check('正确率 100%', stats.accuracy === 1, String(stats.accuracy))
  check('首次正确率 100%', stats.firstTryAccuracy === 1, String(stats.firstTryAccuracy))
  check('全对给三星', computeStars({ accuracy: stats.accuracy, wpm: 30, targetWpm: 8, completed: true }) === 3)

  check('普通代码句没有拼音任务', getPinyinTask(createSession('cout << 1;', 2_000_000)) === null)
  const running = getPinyinTask(typeAll(createSession(text, 2_000_000), 'cout << "n', 2_000_000))
  check('拼音任务说明当前是哪个字', running?.char === '你' && running?.pinyin === 'ni', JSON.stringify(running))
  check('拼音任务会提示后面的字', (running?.upcoming ?? '').includes('好'), running?.upcoming)

  const beforePinyin = typeAll(createSession(text, 3_000_000), 'cout << "', 3_000_000)
  const wrongPinyin = typingReducer(beforePinyin, { type: 'keystroke', char: 'x', at: 3_000_100 })
  check('拼音敲错会被记录', wrongPinyin.errorCount === 1, String(wrongPinyin.errorCount))
  check('拼音敲错不前进', wrongPinyin.cursor === 9, String(wrongPinyin.cursor))
  check('敲错的拼音进弱键统计', (wrongPinyin.errorMap.n ?? 0) === 1, JSON.stringify(wrongPinyin.errorMap))

  const skipped = typingReducer(beforePinyin, { type: 'skip', at: 3_000_200 })
  check('跳过会整段跳过中文', skipped.cursor === 11 && skipped.statuses[9] === 'skipped', String(skipped.cursor))

  // 打中文时的对错判定：按拼音字母算对，直接按汉字算错
  check('打中文时按拼音字母算敲对', isKeystrokeCorrect(beforePinyin, 'n') === true)
  check('直接按目标汉字不算敲对', isKeystrokeCorrect(beforePinyin, '你') === false)
  const beforeComma = typeAll(createSession('你好，', 4_400_000), 'nihao', 4_400_000)
  check('中文标点按逗号键算敲对', isKeystrokeCorrect(beforeComma, ',') === true)
  check('直接按中文逗号不算敲对', isKeystrokeCorrect(beforeComma, '，') === false)

  // 打出一个汉字的那一刻要能认出来（界面据此换音效）
  const afterNi = typeAll(createSession(text, 4_000_000), 'cout << "ni', 4_000_000)
  check('拼音打完，认得出刚打出的汉字', landedChineseChar(afterNi) === '你', String(landedChineseChar(afterNi)))
  const inPinyin = typeAll(createSession(text, 4_100_000), 'cout << "n', 4_100_000)
  check('拼音还没打完，不算打出一个字', landedChineseChar(inPinyin) === null, String(landedChineseChar(inPinyin)))
  const letters = typeAll(createSession('abc', 4_200_000), 'ab', 4_200_000)
  check('打字母时不会误报汉字', landedChineseChar(letters) === null, String(landedChineseChar(letters)))
  check('拼音打了一半，算「正在打拼音」（这一声要静音）', isTypingPinyin(inPinyin) === true)
  check('普通英文输入不算打拼音', isTypingPinyin(letters) === false)

  // 声音必须按「这次击键有没有让一个汉字落地」来算：
  // 拼音中间静音，字落地才响——从第二个字开始最容易出错
  const soundSeq: string[] = []
  let walk = createSession('你我他', 5_000_000)
  for (const key of 'niwota') {
    soundSeq.push(strokeSound(walk, key))
    walk = typingReducer(walk, { type: 'keystroke', char: key, at: 5_000_000 })
  }
  check(
    '打「你我他」：拼音中间静音，只有字落地才响',
    soundSeq.join(',') === 'pinyin,chinese,pinyin,chinese,pinyin,chinese',
    soundSeq.join(','),
  )
  check('打英文时每个字母都出声', strokeSound(createSession('abc', 5_100_000), 'a') === 'correct')
  check('敲错时放错音', strokeSound(createSession('abc', 5_200_000), 'x') === 'wrong')
  const beforeComma2 = typeAll(createSession('你好，', 5_300_000), 'nihao', 5_300_000)
  check('中文标点是清脆的一声', strokeSound(beforeComma2, ',') === 'correct')
  const punctuation = typeAll(createSession('你好，', 4_300_000), 'nihao,', 4_300_000)
  check('中文标点不算汉字', landedChineseChar(punctuation) === null, String(landedChineseChar(punctuation)))
}console.log(`\n结果：${passed} 项通过，${failures.length} 项失败`)
if (failures.length > 0) {
  console.log('失败项：')
  failures.forEach((item) => console.log(` - ${item}`))
  process.exit(1)
}
console.log('打字引擎自测全部通过 🎉')
