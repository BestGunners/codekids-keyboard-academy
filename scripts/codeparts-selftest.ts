/**
 * 代码零件与舞台联动自测：验证零件识别、匹配规则与课程覆盖。
 * 运行方式：node scripts/codeparts-selftest.ts
 */
import {
  CODE_PARTS,
  VARIABLE_NAMES,
  describeVariableName,
  findCodePartOccurrences,
  getCodePartById,
} from '../src/engine/codeParts.ts'
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

function idsIn(text: string): string[] {
  return findCodePartOccurrences(text).map((item) => item.part.id)
}

function labelAt(text: string, index: number): string | undefined {
  return findCodePartOccurrences(text).find((item) => item.end === index)?.part.label
}

console.log('\n1. #include <iostream> 逐个零件都有介绍')
{
  const line = '#include <iostream>'
  const found = findCodePartOccurrences(line)
  check('识别出 #include 和 <iostream> 两个零件', idsIn(line).join(',') === 'pre-include,iostream', idsIn(line).join(','))
  check('#include 在敲完第 8 个字符时出现', found[0].end === 7, `实际 ${found[0].end}`)
  check('敲到 include 时介绍的是工具箱', found[0].part.label === '请工具箱出场')
  check('<iostream> 在敲完 > 时出现', found[1].end === 18, `实际 ${found[1].end}`)
  check('敲到 iostream 时有单独介绍', found[1].part.explanation.includes('iostream'))
}

console.log('\n2. 一行里的每个关键零件都能触发')
{
  const line = 'int main() {'
  check('识别 int / main / () / {', idsIn(line).join(',') === 'int,main,paren-pair,brace-open', idsIn(line).join(','))
  check('敲完 main 会介绍程序起点', labelAt(line, 7) === '程序起点')

  const printLine = 'cout << "hi";'
  const ids = idsIn(printLine)
  check('识别 cout / <<  / 引号 / 分号', ids.join(',') === 'cout,cout-send,quote,quote,semicolon', ids.join(','))
  check('敲完 << 会介绍送出去', labelAt(printLine, 6) === '送出去')
  check('敲完分号会介绍句号', labelAt(printLine, 12) === '一句话的句号')

  const inputLine = 'cin >> age;'
  check('识别 cin / >> / 分号 / 变量', idsIn(inputLine).join(',') === 'cin,cin-read,var-age,semicolon', idsIn(inputLine).join(','))

  const loopLine = 'for (int i = 0; i < 3; i++) {'
  const loopIds = idsIn(loopLine)
  check('循环行里 for 在最前面', loopIds[0] === 'for')
  check('循环行里包含 int / = / 小于 / 分号 / 大括号', ['int', 'assign', 'less', 'semicolon', 'brace-open'].every((id) => loopIds.includes(id)), loopIds.join(','))

  const branchLine = 'if (guess == secret) {'
  const branchIds = idsIn(branchLine)
  check('判断行里有 if 和两个等号', branchIds.includes('if') && branchIds.includes('equal'))
  check('两个等号不会被当成一个等号', !branchIds.includes('assign'))
  check('右括号也能触发', branchIds.includes('paren-close'))
}

console.log('\n3. 匹配规则')
{
  check('forest 里的 for 不会误触发（它只被当成普通单词）', !idsIn('forest is big').includes('for'))
  check('my_for 里的 for 不会误触发', !idsIn('my_for = 1').includes('for'), idsIn('my_for = 1').join(','))
  check('但同一行里的等号仍然会触发', idsIn('my_for = 1').includes('assign'))
  check('大写的 For 不触发（C++ 区分大小写）', !idsIn('For x').includes('for'))
  check('单独的 include 也能触发', idsIn('include').join(',') === 'include')
  check('左右括号分开时各自触发', findCodePartOccurrences('( 1 )').map((item) => item.part.id).join(',') === 'paren-open,paren-close')
  check('大括号成对时按一对触发', idsIn('{}').join(',') === 'brace-pair')
  check('零件不会重叠覆盖（main() 里的括号算一次）', idsIn('main()').join(',') === 'main,paren-pair')
}

console.log('\n4. 零件表本身')
{
  const ids = CODE_PARTS.map((part) => part.id)
  const texts = CODE_PARTS.map((part) => part.text)
  check('id 不重复', new Set(ids).size === ids.length)
  check('匹配文本不重复', new Set(texts).size === texts.length)
  check('每个零件都有中文名和解释', CODE_PARTS.every((part) => part.label.length > 0 && part.explanation.length > 5))
  check('for 的中文名是循环', getCodePartById('for')?.label === '循环')
  check('未知 id 返回 undefined', getCodePartById('nope') === undefined)
}

console.log('\n5. 课程覆盖（孩子在关卡里真的会敲到）')
{
  const texts: string[] = []
  STAGES.filter((stage) => stage.id >= 4).forEach((stage) => {
    stage.lessons
      .filter((lesson) => lesson.ready)
      .forEach((lesson) => lesson.drills.forEach((drill) => texts.push(drill.text)))
  })

  const covered = new Set<string>()
  texts.forEach((text) => {
    findCodePartOccurrences(text).forEach((item) => covered.add(item.part.id))
  })

  const mustHave = [
    'pre-include',
    'iostream',
    'int',
    'main',
    'paren-pair',
    'brace-open',
    'semicolon',
    'cout',
    'cout-send',
    'cin',
    'cin-read',
    'if',
    'equal',
    'greater',
    'for',
    'assign',
    'quote',
  ]
  mustHave.forEach((id) => {
    check(`课程里能敲到 ${getCodePartById(id)?.text ?? id}`, covered.has(id))
  })
  check('编程关卡行数足够', texts.length >= 18, `实际 ${texts.length} 行`)
}

console.log('\n6. 变量名也会被舞台解释')
{
  check('score 有专门解释（分数盒子）', describeVariableName('score').label === '分数盒子')
  check(
    '变量表覆盖课程会用到的名字',
    ['score', 'age', 'guess', 'secret', 'i', 'name', 'level'].every((key) => key in VARIABLE_NAMES),
  )

  const scoreLine = 'int score = 10;'
  const scoreIds = idsIn(scoreLine)
  check('一行里识别 int / 变量 / 等号 / 分号', scoreIds.join(',') === 'int,var-score,assign,semicolon', scoreIds.join(','))
  check('score 在敲完 e 时触发', findCodePartOccurrences(scoreLine)[1].end === 8)

  check('age 有专门解释', idsIn('int age;').join(',') === 'int,var-age,semicolon', idsIn('int age;').join(','))
  check('循环计数器 i 有解释', idsIn('int i = 0;').includes('var-i'))
  check(
    'guess 与 secret 都有解释',
    idsIn('if (guess == secret) {').includes('var-guess') &&
      idsIn('if (guess == secret) {').includes('var-secret'),
  )
  check('cin >> guess 里的变量也能解释', idsIn('cin >> guess;').includes('var-guess'))

  check('不认识的变量名给通用解释', describeVariableName('banana').label === '变量名')
  check('通用解释里带上变量名', describeVariableName('banana').explanation.includes('banana'))
  check('课程外的变量名同样会触发', idsIn('int banana = 1;').includes('var-name-banana'))

  check('引号里的英文不会被当成变量', !idsIn('cout << "too big";').some((id) => id.startsWith('var-')))
  check('关键词不会重复当变量', !idsIn('cout << 1;').some((id) => id.startsWith('var-')))
  check(
    'iostream 由固定零件解释，不重复当变量',
    !idsIn('#include <iostream>').some((id) => id === 'var-name-iostream'),
  )

  const ordered = findCodePartOccurrences('int score = 10;').map((item) => item.part.text)
  check('零件按出现顺序排列', ordered.join(' ') === 'int score = ;', ordered.join(' '))
}
console.log(`\n结果：${passed} 项通过，${failures.length} 项失败`)
if (failures.length > 0) {
  failures.forEach((item) => console.log(` - ${item}`))
  process.exit(1)
}
console.log('代码零件与舞台自测全部通过 🎉')
