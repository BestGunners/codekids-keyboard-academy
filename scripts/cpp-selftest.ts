/**
 * C++ 教学解释器自测：语法、执行、错误处理、沙箱保护。
 * 运行方式：node scripts/cpp-selftest.ts
 */
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

function expectOutput(name: string, source: string, expected: string, input: string[] = []) {
  const result = runCpp(source, { input })
  const detail = result.ok
    ? `实际输出「${result.output}」`
    : `报错：${result.error?.message}（第 ${result.error?.line} 行）`
  check(name, result.ok && result.output === expected, detail)
}

function expectError(name: string, source: string, keyword: string, input: string[] = []) {
  const result = runCpp(source, { input })
  const message = result.error?.message ?? ''
  check(
    name,
    !result.ok && message.includes(keyword),
    result.ok ? `居然跑通了，输出「${result.output}」` : `报错内容是「${message}」`,
  )
  return result
}

console.log('\n1. 能跑起来')
{
  expectOutput('最简单的输出', 'cout << "hello";', 'hello')

  expectOutput(
    '带 #include 和 main 的完整程序',
    ['#include <iostream>', 'int main() {', '  cout << "hi";', '  return 0;', '}'].join('\n'),
    'hi',
  )

  expectOutput('std::cout 也能识别', 'std::cout << "ok";', 'ok')
  expectOutput('using namespace std; 会被跳过', 'using namespace std;\ncout << 1;', '1')
  expectOutput('注释会被忽略', '// 说明文字\ncout << 1; /* 这也是注释 */', '1')
  expectOutput('endl 会换行', 'cout << "a" << endl << "b";', 'a\nb')
}

console.log('\n2. 变量与运算')
{
  expectOutput('先乘后加', 'int a = 7;\nint b = 3;\ncout << a + b * 2;', '13')
  expectOutput('整数除法（和真实 C++ 一样）', 'cout << 7 / 2;', '3')
  expectOutput('有一个是小数就是小数除法', 'cout << 7 / 2.0;', '3.5')
  expectOutput('取余数', 'cout << 7 % 3;', '1')
  expectOutput('一行声明两个变量', 'int a = 1, b = 2;\ncout << a + b;', '3')
  expectOutput('自增与复合赋值', 'int i = 0;\ni++;\ni += 4;\ncout << i;', '5')
  expectOutput('小数被装进整数盒子会取整', 'int n = 3.9;\ncout << n;', '3')
  expectOutput('文字可以拼起来', 'string a = "he";\nstring b = "llo";\ncout << a + b;', 'hello')
  expectOutput('文字和数字一起打印', 'int score = 10;\ncout << "score: " << score;', 'score: 10')
  expectOutput('对错值打印成 1', 'bool ok = true;\ncout << ok;', '1')
  expectOutput('一个字符', "char c = 'A';\ncout << c;", 'A')
  expectOutput('字符串里的换行转义', 'cout << "a\\nb";', 'a\nb')
}

console.log('\n3. 判断与循环')
{
  expectOutput(
    'if 成立时走上面那条路',
    'int score = 10;\nif (score > 5) {\n  cout << "big";\n} else {\n  cout << "small";\n}',
    'big',
  )
  expectOutput(
    'if 不成立时走 else',
    'int score = 2;\nif (score > 5) {\n  cout << "big";\n} else {\n  cout << "small";\n}',
    'small',
  )
  expectOutput('两个条件一起判断', 'int x = 5;\nif (x >= 5 && x < 10) {\n  cout << "mid";\n}', 'mid')
  expectOutput('for 循环', 'for (int i = 0; i < 3; i++) {\n  cout << i;\n}', '012')
  expectOutput('for 从 1 数到 3', 'for (int i = 1; i <= 3; i++) {\n  cout << i;\n}', '123')
  expectOutput(
    'while 里用 break 跳出',
    'int i = 0;\nwhile (true) {\n  cout << i;\n  i = i + 1;\n  if (i > 2) {\n    break;\n  }\n}',
    '012',
  )
  expectOutput(
    'continue 会跳过这一圈剩下的部分',
    'for (int i = 0; i < 5; i++) {\n  if (i == 2) {\n    continue;\n  }\n  cout << i;\n}',
    '0134',
  )
  expectOutput('循环里累加', 'int sum = 0;\nfor (int i = 1; i <= 4; i++) {\n  sum = sum + i;\n}\ncout << sum;', '10')
}

console.log('\n4. 数组与函数')
{
  expectOutput('一排格子的初始化', 'int a[3] = {1, 2, 3};\ncout << a[0] << a[2];', '13')
  expectOutput('没写初值就是 0', 'int a[3];\ncout << a[1];', '0')
  expectOutput('不写长度也能自动数', 'int a[] = {4, 5, 6};\ncout << a[2];', '6')
  expectOutput('可以给格子重新赋值', 'int a[2] = {1, 2};\na[1] = 9;\ncout << a[1];', '9')
  expectOutput(
    '自己写的函数',
    ['int add(int a, int b) {', '  return a + b;', '}', 'int main() {', '  cout << add(2, 3);', '}'].join('\n'),
    '5',
  )
  expectOutput(
    '函数可以套着调用',
    ['int twice(int x) {', '  return x * 2;', '}', 'int main() {', '  cout << twice(twice(3));', '}'].join('\n'),
    '12',
  )
  expectOutput('没有 main 也会从上往下跑', 'int a = 2;\ncout << a * 3;', '6')
}

console.log('\n5. 输入与交互（游戏关卡会用到）')
{
  expectOutput('读一个数字', 'int age;\ncin >> age;\ncout << age;', '7', ['7'])

  expectOutput(
    '猜数字游戏：猜三次直到猜中',
    [
      'int secret = 7;',
      'int guess = 0;',
      'while (guess != secret) {',
      '  cin >> guess;',
      '  if (guess > secret) {',
      '    cout << "too big";',
      '  }',
      '  if (guess < secret) {',
      '    cout << "too small";',
      '  }',
      '}',
      'cout << "win";',
    ].join('\n'),
    'too smalltoo bigwin',
    ['3', '9', '7'],
  )

  expectOutput('文字也能读进来', 'string word;\ncin >> word;\ncout << word;', 'cat', ['cat'])
  let randOk = true
  for (let index = 0; index < 20; index += 1) {
    const value = runCpp('cout << rand() % 10;').output
    if (!/^[0-9]$/.test(value)) randOk = false
  }
  check('rand() % 10 一定是个位数', randOk)
}

console.log('\n6. 会拦住错误，并给出人话提示')
{
  const noSemicolon = expectError('少写分号', 'int a = 1\ncout << a;', '分号')
  check('少写分号会指出行号', noSemicolon.error?.line === 1, String(noSemicolon.error?.line))
  check('少写分号会给出提示', (noSemicolon.error?.hint ?? '').length > 3)

  expectError('用了没有的变量', 'cout << score;', 'score')
  expectError('括号没有配对', 'cout << (1 + 2;', '圆括号')
  expectError('大括号没有配对', 'int main() {\n  cout << 1;', '大括号')
  expectError('不能除以 0', 'cout << 1 / 0;', '除以 0')
  expectError('格子越界', 'int a[3] = {1, 2, 3};\ncout << a[5];', '格子')
  expectError('一排格子不能直接打印', 'int a[3];\ncout << a;', '不能直接打印')
  expectError('用错函数名', 'cout << foo(1);', 'foo')
  expectError(
    '函数材料给少了',
    ['int add(int a, int b) {', '  return a + b;', '}', 'int main() {', '  cout << add(1);', '}'].join('\n'),
    '材料',
  )
  expectError('还不支持 do-while', 'do {\n} while (1);', 'do-while')
  expectError('中文标点会被拦住', 'cout << "hi"；', '看不懂')
}

console.log('\n7. 沙箱保护')
{
  const infiniteWhile = expectError('停不下来的 while 会被中断', 'while (true) {\n}', '循环')
  check('中断时也会给出建议', (infiniteWhile.error?.hint ?? '').length > 3)

  expectError('疯狂输出会被中断', 'while (true) {\n  cout << "x";\n}', '太多')
  expectError('没填输入时会提示', 'int x;\ncin >> x;', '输入')
  expectError('递归太深会被拦住', 'int f(int n) {\n  return f(n + 1);\n}\nint main() {\n  cout << f(1);\n}', '太深')

  const limited = runCpp('int a = 0;\nwhile (true) {\n  a = a + 1;\n}', { maxSteps: 500 })
  check('可以按需要限制步数', !limited.ok && limited.steps > 400, String(limited.steps))
}

console.log('\n8. 给「逐行演示」准备好的执行轨迹')
{
  const result = runCpp('int x = 5;\nx = x + 1;\ncout << x;')
  check('跑通了', result.ok)
  check('记录了三步', result.trace.length === 3, String(result.trace.length))
  check('记录里带行号', result.trace.map((entry) => entry.line).join(',') === '1,2,3', result.trace.map((entry) => entry.line).join(','))
  check('第一步就能看到 x = 5', result.trace[0].variables.x === '5', JSON.stringify(result.trace[0].variables))
  check('第三步看到 x = 6', result.trace[2].variables.x === '6', JSON.stringify(result.trace[2].variables))
  check('结束时变量表也是最新的', result.variables.x === '6', JSON.stringify(result.variables))
  check('步数被统计', result.steps === 3, String(result.steps))
  check('输出长度被记录（方便同步回放）', result.trace[2].outputLength >= 1, String(result.trace[2].outputLength))
}

console.log('\n9. 执行轨迹：循环每一圈都能看到')
{
  const loop = runCpp('for (int i = 0; i < 3; i++) {\n  cout << i;\n}')
  check('循环程序记录了 4 步（1 次初始化 + 3 次循环体）', loop.trace.length === 4, String(loop.trace.length))
  check(
    '行号顺序是「第 1 行、第 2 行、第 2 行、第 2 行」',
    loop.trace.map((entry) => entry.line).join(',') === '1,2,2,2',
    loop.trace.map((entry) => entry.line).join(','),
  )
  check(
    '每一步的变量都在变',
    loop.trace[1].variables.i === '0' && loop.trace[3].variables.i === '2',
    JSON.stringify(loop.trace.map((entry) => entry.variables.i)),
  )
  check(
    '输出长度逐步增长（可以按步回放输出）',
    loop.trace.map((entry) => entry.outputLength).join(',') === '0,1,2,3',
    loop.trace.map((entry) => entry.outputLength).join(','),
  )

  const drawing = runCpp('star(10, 10);\nstar(50, 10);')
  check(
    '画图程序也记录舞台进度',
    drawing.trace[0].sceneLength === 1 && drawing.trace[1].sceneLength === 2,
    JSON.stringify(drawing.trace.map((entry) => entry.sceneLength)),
  )

  const withError = runCpp('int a = 1;\ncout << b;')
  check('出错前的步骤也被记下来', withError.trace.length === 2 && withError.error?.line === 2, String(withError.trace.length))
}
console.log('\n10. 代码里的中文内容')
{
  expectOutput('打印中文', 'cout << "你好";', '你好')
  expectOutput('中文和数字一起打印', 'int score = 10;\ncout << "得分 " << score;', '得分 10')
  const scene = runCpp('text("你赢了", 20, 40);').scene
  check('舞台上也能写中文', scene[0]?.type === 'text' && scene[0].text === '你赢了', JSON.stringify(scene[0]))
  expectOutput('中文字符串可以用在判断里', 'string k = "小猫";\nif (k == "小猫") {\n  cout << "对啦";\n}', '对啦')
}console.log(`\n结果：${passed} 项通过，${failures.length} 项失败`)
if (failures.length > 0) {
  failures.forEach((item) => console.log(` - ${item}`))
  process.exit(1)
}
console.log('C++ 教学解释器自测全部通过 🎉')
