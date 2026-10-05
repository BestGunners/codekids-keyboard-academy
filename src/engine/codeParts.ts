/** 舞台可以表演的动画类型 */
export type StageEffectKind =
  | 'loop'
  | 'branch'
  | 'box'
  | 'speak'
  | 'listen'
  | 'toolbox'
  | 'start'
  | 'nextline'
  | 'exit'
  | 'block'
  | 'stop'
  | 'compare'
  | 'text'
  | 'call'
  | 'variable'
  | 'wipe'
  | 'draw'
  | 'palette'
  | 'timer'

export interface CodePart {
  id: string
  /** 代码里原样出现的文字 */
  text: string
  /** 给孩子的中文名 */
  label: string
  emoji: string
  effect: StageEffectKind
  /** 一句话解释，念出来不超过 3 秒 */
  explanation: string
  color: string
  /** word：按完整单词匹配；symbol：按字符序列匹配 */
  kind: 'word' | 'symbol' | 'variable'
}

/**
 * 代码零件表：孩子敲到任何一个零件，舞台就演一小段并给一句解释。
 * 这是"打字 → 理解"之间的桥：先让手指敲出来，再让眼睛看见它做什么。
 */
export const CODE_PARTS: CodePart[] = [
  // ---------- C++ 关键词 ----------
  {
    id: 'for',
    text: 'for',
    label: '循环',
    emoji: '🔁',
    effect: 'loop',
    explanation: 'for 会让电脑把同一件事重复好几遍。',
    color: '#57d6c4',
    kind: 'word',
  },
  {
    id: 'while',
    text: 'while',
    label: '条件循环',
    emoji: '🌀',
    effect: 'loop',
    explanation: 'while 会在条件成立的时候一直转圈圈。',
    color: '#6fd08c',
    kind: 'word',
  },
  {
    id: 'if',
    text: 'if',
    label: '判断',
    emoji: '🔀',
    effect: 'branch',
    explanation: 'if 是一个岔路口：条件对了就走这条路。',
    color: '#59a4ff',
    kind: 'word',
  },
  {
    id: 'else',
    text: 'else',
    label: '否则',
    emoji: '↩️',
    effect: 'branch',
    explanation: 'else 是另一条路：上面那条走不通就来这里。',
    color: '#a78bfa',
    kind: 'word',
  },
  {
    id: 'int',
    text: 'int',
    label: '整数盒子',
    emoji: '📦',
    effect: 'box',
    explanation: 'int 是一个盒子，用来装整数。',
    color: '#ffb35c',
    kind: 'word',
  },
  {
    id: 'cout',
    text: 'cout',
    label: '说出来',
    emoji: '📢',
    effect: 'speak',
    explanation: 'cout 让电脑把内容说给屏幕听。',
    color: '#ff8fb1',
    kind: 'word',
  },
  {
    id: 'cin',
    text: 'cin',
    label: '听你说',
    emoji: '👂',
    effect: 'listen',
    explanation: 'cin 让电脑竖起耳朵，听你输入的内容。',
    color: '#46c9c0',
    kind: 'word',
  },
  {
    id: 'include',
    text: 'include',
    label: '打开工具箱',
    emoji: '🧰',
    effect: 'toolbox',
    explanation: 'include 是把工具箱打开，把要用的工具搬进来。',
    color: '#9a7bf0',
    kind: 'word',
  },
  {
    id: 'main',
    text: 'main',
    label: '程序起点',
    emoji: '🚩',
    effect: 'start',
    explanation: 'main 是程序的起点，电脑从这里开始跑。',
    color: '#e8b71d',
    kind: 'word',
  },
  {
    id: 'endl',
    text: 'endl',
    label: '换行',
    emoji: '⬇️',
    effect: 'nextline',
    explanation: 'endl 让光标跳到下一行的开头。',
    color: '#5cc98a',
    kind: 'word',
  },
  {
    id: 'return',
    text: 'return',
    label: '收工',
    emoji: '🏁',
    effect: 'exit',
    explanation: 'return 表示这一段已经干完了。',
    color: '#f97362',
    kind: 'word',
  },
  {
    id: 'break',
    text: 'break',
    label: '跳出循环',
    emoji: '🚪',
    effect: 'exit',
    explanation: 'break 会让电脑立刻跳出循环。',
    color: '#c084fc',
    kind: 'word',
  },

  // ---------- 头文件与指令 ----------
  {
    id: 'pre-include',
    text: '#include',
    label: '请工具箱出场',
    emoji: '🧰',
    effect: 'toolbox',
    explanation: '# 开头的这一行是给电脑的指令：先把工具箱请进来。',
    color: '#9a7bf0',
    kind: 'symbol',
  },
  {
    id: 'iostream',
    text: '<iostream>',
    label: 'iostream 工具箱',
    emoji: '📚',
    effect: 'toolbox',
    explanation: 'iostream 是输入输出的工具箱，cin 和 cout 都住在里面。',
    color: '#8b7bf0',
    kind: 'symbol',
  },
  {
    id: 'hash',
    text: '#',
    label: '井号指令',
    emoji: '#️⃣',
    effect: 'toolbox',
    explanation: '# 开头的这一行不是代码，是给电脑的准备工作。',
    color: '#9a7bf0',
    kind: 'symbol',
  },

  // ---------- 输入输出符号 ----------
  {
    id: 'cout-send',
    text: '<<',
    label: '送出去',
    emoji: '➡️',
    effect: 'speak',
    explanation: '两个小于号像箭头：把右边的内容送进 cout，然后显示出来。',
    color: '#ff8fb1',
    kind: 'symbol',
  },
  {
    id: 'cin-read',
    text: '>>',
    label: '收进来',
    emoji: '⬅️',
    effect: 'listen',
    explanation: '两个大于号像箭头：把键盘输入收进右边的盒子里。',
    color: '#46c9c0',
    kind: 'symbol',
  },
  {
    id: 'quote',
    text: '"',
    label: '文字引号',
    emoji: '💬',
    effect: 'text',
    explanation: '引号里的内容是文字，会原样显示出来，不会被当成数字。',
    color: '#ffa6c1',
    kind: 'symbol',
  },

  // ---------- 括号家族 ----------
  {
    id: 'paren-pair',
    text: '()',
    label: '圆括号',
    emoji: '🎁',
    effect: 'call',
    explanation: '圆括号里装的是要交给它的东西，括号成对出现。',
    color: '#59a4ff',
    kind: 'symbol',
  },
  {
    id: 'paren-open',
    text: '(',
    label: '左括号',
    emoji: '🎁',
    effect: 'call',
    explanation: '左圆括号：从这里开始把东西装进去。',
    color: '#59a4ff',
    kind: 'symbol',
  },
  {
    id: 'paren-close',
    text: ')',
    label: '右括号',
    emoji: '🎁',
    effect: 'call',
    explanation: '右圆括号：装好了，括号配对完成。',
    color: '#59a4ff',
    kind: 'symbol',
  },
  {
    id: 'brace-pair',
    text: '{}',
    label: '代码小屋',
    emoji: '🏠',
    effect: 'block',
    explanation: '一对大括号是一个小屋，里面装着要一起执行的指令。',
    color: '#ffb35c',
    kind: 'symbol',
  },
  {
    id: 'brace-open',
    text: '{',
    label: '小屋开门',
    emoji: '🏠',
    effect: 'block',
    explanation: '左大括号表示小屋开门，下面的指令都属于它。',
    color: '#ffb35c',
    kind: 'symbol',
  },
  {
    id: 'brace-close',
    text: '}',
    label: '小屋关门',
    emoji: '🏠',
    effect: 'block',
    explanation: '右大括号表示小屋关门，这一组指令到这里结束。',
    color: '#ffb35c',
    kind: 'symbol',
  },

  // ---------- 标点与运算 ----------
  {
    id: 'semicolon',
    text: ';',
    label: '一句话的句号',
    emoji: '🔴',
    effect: 'stop',
    explanation: '分号表示这一句写完了，C++ 里几乎每句都要有它。',
    color: '#f97362',
    kind: 'symbol',
  },
  {
    id: 'assign',
    text: '=',
    label: '装进去',
    emoji: '🫳',
    effect: 'box',
    explanation: '一个等号是赋值：把右边的值装进左边的盒子。',
    color: '#ffb35c',
    kind: 'symbol',
  },
  {
    id: 'equal',
    text: '==',
    label: '比一比',
    emoji: '⚖️',
    effect: 'compare',
    explanation: '两个等号是比较：判断左右两边是不是一样。',
    color: '#4f9cf9',
    kind: 'symbol',
  },
  {
    id: 'greater',
    text: '>',
    label: '大于',
    emoji: '⚖️',
    effect: 'compare',
    explanation: '大于号：看看左边是不是比右边大。',
    color: '#4f9cf9',
    kind: 'symbol',
  },
  {
    id: 'less',
    text: '<',
    label: '小于',
    emoji: '⚖️',
    effect: 'compare',
    explanation: '小于号：看看左边是不是比右边小。',
    color: '#4f9cf9',
    kind: 'symbol',
  },
  {
    id: 'comma',
    text: ',',
    label: '逗号',
    emoji: '⏸️',
    effect: 'stop',
    explanation: '逗号把一件事一件事分开来说。',
    color: '#f2a65a',
    kind: 'symbol',
  },

  // ---------- 游戏关会用到的新零件 ----------
  {
    id: 'string',
    text: 'string',
    label: '文字盒子',
    emoji: '🔤',
    effect: 'text',
    explanation: 'string 是装文字的盒子，可以放下一个单词或一句话。',
    color: '#ffa6c1',
    kind: 'word',
  },
  {
    id: 'rand',
    text: 'rand',
    label: '随机数',
    emoji: '🎲',
    effect: 'box',
    explanation: 'rand() 会给你一个随机数字，每次都不一样。',
    color: '#57d6c4',
    kind: 'word',
  },
  {
    id: 'percent',
    text: '%',
    label: '算余数',
    emoji: '➗',
    effect: 'compare',
    explanation: '百分号算出除完还剩多少，比如 13 % 10 剩下 3。',
    color: '#4f9cf9',
    kind: 'symbol',
  },
  // ---------- 舞台绘图指令（岛 5 会用到） ----------
  {
    id: 'clear',
    text: 'clear',
    label: '擦干净',
    emoji: '🧽',
    effect: 'wipe',
    explanation: 'clear() 把舞台擦干净，再画下一帧，画面就动起来了。',
    color: '#7fd6ea',
    kind: 'word',
  },
  {
    id: 'color',
    text: 'color',
    label: '换颜色',
    emoji: '🎨',
    effect: 'palette',
    explanation: 'color("黄色") 像换一支蜡笔，后面的图形都用这个颜色。',
    color: '#ffb35c',
    kind: 'word',
  },
  {
    id: 'circle',
    text: 'circle',
    label: '画圆',
    emoji: '⭕',
    effect: 'draw',
    explanation: 'circle(x, y, 半径) 在指定位置画一个圆，小球就是这样来的。',
    color: '#4f9cf9',
    kind: 'word',
  },
  {
    id: 'rect',
    text: 'rect',
    label: '画方块',
    emoji: '🟦',
    effect: 'draw',
    explanation: 'rect(x, y, 宽, 高) 画一个方块，前两个数字是左上角的位置。',
    color: '#6fd08c',
    kind: 'word',
  },
  {
    id: 'star',
    text: 'star',
    label: '画星星',
    emoji: '⭐',
    effect: 'draw',
    explanation: 'star(x, y) 在指定位置画一颗星星，用它当奖励最合适。',
    color: '#ffd95c',
    kind: 'word',
  },
  {
    id: 'line',
    text: 'line',
    label: '画线',
    emoji: '📏',
    effect: 'draw',
    explanation: 'line 从一个点画到另一个点，可以画跑道、光柱。',
    color: '#a78bfa',
    kind: 'word',
  },
  {
    id: 'stage-text',
    text: 'text',
    label: '舞台写字',
    emoji: '✍️',
    effect: 'text',
    explanation: 'text(内容, x, y) 把文字或数字写在舞台上，分数就靠它显示。',
    color: '#ff8fb1',
    kind: 'word',
  },
  {
    id: 'wait',
    text: 'wait',
    label: '停一下',
    emoji: '⏱️',
    effect: 'timer',
    explanation: 'wait(0.2) 让这一帧停 0.2 秒，一帧一帧连起来就是动画。',
    color: '#57d6c4',
    kind: 'word',
  },
]

export interface CodePartOccurrence {
  part: CodePart
  start: number
  /** 零件最后一个字符的下标（含）——舞台就在这个字符敲完时亮起 */
  end: number
}

function isWordChar(char: string): boolean {
  return /[A-Za-z0-9_]/.test(char)
}

/** 长零件优先，保证 <iostream> 不会被拆成 < 和 iostream */
const PARTS_BY_LENGTH = [...CODE_PARTS].sort((a, b) => b.text.length - a.text.length)

/**
 * 找出文本里所有代码零件（从左到右、最长匹配，不会重复覆盖同一段字符）。
 * 单词类零件要求完整单词边界，所以 forest 不会命中 for。
 */
/** 课程里会出现的变量名：给它们准备孩子能懂的解释 */
export const VARIABLE_NAMES: Record<
  string,
  { label: string; emoji: string; explanation: string; color: string }
> = {
  score: {
    label: '分数盒子',
    emoji: '📦',
    explanation: 'score 是你给分数起的名字，这个盒子里装着当前得分。',
    color: '#ffb35c',
  },
  scores: {
    label: '一排分数',
    emoji: '📚',
    explanation: 'scores 里装的不止一个分数，而是一排分数。',
    color: '#ffb35c',
  },
  age: {
    label: '年龄盒子',
    emoji: '🎂',
    explanation: 'age 是装年龄的盒子：你输入几岁，它就记住几岁。',
    color: '#f9a826',
  },
  name: {
    label: '名字盒子',
    emoji: '🏷️',
    explanation: 'name 是装名字的盒子，把输入的名字存起来。',
    color: '#59a4ff',
  },
  level: {
    label: '关卡盒子',
    emoji: '🚩',
    explanation: 'level 记录现在是第几关。',
    color: '#a78bfa',
  },
  guess: {
    label: '猜的数字',
    emoji: '🤔',
    explanation: 'guess 装的是玩家猜的这个数字。',
    color: '#46c9c0',
  },
  secret: {
    label: '秘密数字',
    emoji: '🤫',
    explanation: 'secret 是电脑藏起来的秘密数字，玩家要猜中它。',
    color: '#ef7bc0',
  },
  i: {
    label: '循环计数器',
    emoji: '🔢',
    explanation: 'i 是循环用的计数器，记住现在跑到第几圈了。',
    color: '#57d6c4',
  },
  count: {
    label: '计数盒子',
    emoji: '🔢',
    explanation: 'count 用来数一数一共有多少个。',
    color: '#57d6c4',
  },
  total: {
    label: '总数盒子',
    emoji: '➕',
    explanation: 'total 装的是加起来的总数。',
    color: '#ffb35c',
  },
  answer: {
    label: '答案盒子',
    emoji: '✅',
    explanation: 'answer 装的是正确答案。',
    color: '#5cc98a',
  },
  key: {
    label: '按键盒子',
    emoji: '⌨️',
    explanation: 'key 装的是玩家刚刚按下的那个键。',
    color: '#59a4ff',
  },
  word: {
    label: '单词盒子',
    emoji: '🔤',
    explanation: 'word 装的是要打出来的那个单词。',
    color: '#ffa6c1',
  },
  life: {
    label: '生命值',
    emoji: '❤️',
    explanation: 'life 记录玩家还有几次机会。',
    color: '#f97362',
  },
  speed: {
    label: '速度盒子',
    emoji: '💨',
    explanation: 'speed 决定游戏里的东西跑得多快。',
    color: '#57d6c4',
  },
  sum: {
    label: '加起来的结果',
    emoji: '➕',
    explanation: 'sum 装的是几个数加在一起的结果。',
    color: '#ffb35c',
  },
  head: {
    label: '蛇头位置',
    emoji: '🐍',
    explanation: 'head 记住小蛇的头现在在哪一格。',
    color: '#6fd08c',
  },
  snake: {
    label: '蛇的身体',
    emoji: '🐍',
    explanation: 'snake 是一排格子，装着整条小蛇的身体。',
    color: '#5cc98a',
  },
  x: { label: '横向位置', emoji: '➡️', explanation: 'x 是横向位置，数字越大越靠右。', color: '#59a4ff' },
  y: { label: '纵向位置', emoji: '⬇️', explanation: 'y 是纵向位置，数字越大越靠下。', color: '#59a4ff' },
  t: { label: '倒计时数', emoji: '⏳', explanation: 't 装的是倒计时还剩几，每转一圈就减 1。', color: '#f9a826' },
  k: { label: '按下的键', emoji: '⌨️', explanation: 'k 装的是玩家刚刚按下的那个键。', color: '#59a4ff' },
  dice: { label: '骰子点数', emoji: '🎲', explanation: 'dice 装的是这次掷出来的点数，从 1 到 6。', color: '#57d6c4' },
  ballX: { label: '小球的横向位置', emoji: '🎯', explanation: 'ballX 记住小球现在横向跑到哪了。', color: '#4f9cf9' },
  ballY: { label: '小球的高度', emoji: '⬇️', explanation: 'ballY 记住小球现在离顶上有多远。', color: '#4f9cf9' },
  step: { label: '这一步', emoji: '👣', explanation: 'step 是每一步挪多远，负号就表示往回走。', color: '#6fd08c' },
  redX: { label: '红队的位置', emoji: '🔴', explanation: 'redX 记住红队的小方块跑到哪儿了。', color: '#ef5350' },
  blueX: { label: '蓝队的位置', emoji: '🔵', explanation: 'blueX 记住蓝队的小方块跑到哪儿了。', color: '#4f9cf9' },
  me: { label: '我出的这一手', emoji: '✋', explanation: 'me 装的是我出的那一手，比如石头。', color: '#ffb35c' },
  you: { label: '电脑出的这一手', emoji: '🤖', explanation: 'you 装的是电脑出的那一手。', color: '#a78bfa' },
  a: { label: '第一份材料', emoji: '1️⃣', explanation: 'a 是函数接到的第一份材料。', color: '#ffb35c' },
  b: { label: '第二份材料', emoji: '2️⃣', explanation: 'b 是函数接到的第二份材料。', color: '#ffb35c' },
}

/** 已经在固定零件表里的名字（int、cout、main…），不再当作变量重复解释 */
const RESERVED_WORDS = new Set(CODE_PARTS.map((part) => part.text))

const IDENTIFIER_PATTERN = /[A-Za-z_][A-Za-z0-9_]*/g

/**
 * 把一个标识符变成可解释的零件：
 * 认识的变量给专门解释，不认识的给通用解释（仍然告诉孩子"这是变量名"）。
 */
export function describeVariableName(name: string): CodePart {
  const known = VARIABLE_NAMES[name]

  if (known) {
    return {
      id: `var-${name}`,
      text: name,
      label: known.label,
      emoji: known.emoji,
      effect: 'variable',
      explanation: known.explanation,
      color: known.color,
      kind: 'variable',
    }
  }

  return {
    id: `var-name-${name}`,
    text: name,
    label: '变量名',
    emoji: '🏷️',
    effect: 'variable',
    explanation: `「${name}」是变量名——你自己给盒子起的名字，里面装的东西以后可以变。`,
    color: '#94a3b8',
    kind: 'variable',
  }
}

function matchKnownPartAt(text: string, index: number): CodePart | null {
  for (const part of PARTS_BY_LENGTH) {
    if (!text.startsWith(part.text, index)) continue

    if (part.kind === 'word') {
      const before = index > 0 ? text[index - 1] : ''
      const after = text[index + part.text.length] ?? ''
      if ((before && isWordChar(before)) || (after && isWordChar(after))) continue
    }

    return part
  }

  return null
}

/** 标出引号里的内容：字符串里的英文不是变量名 */
function buildStringMask(text: string): boolean[] {
  const mask = new Array<boolean>(text.length).fill(false)
  let inString = false

  for (let index = 0; index < text.length; index += 1) {
    if (text[index] === '"') {
      mask[index] = true
      inString = !inString
      continue
    }
    mask[index] = inString
  }

  return mask
}

/**
 * 找出文本里所有可讲解的零件，按出现顺序排列：
 * 1. 固定零件：关键词与符号（从左到右最长匹配，单词要求完整边界）；
 * 2. 变量名：剩下的标识符一律解释——认识的在变量表里给专门解释，不认识的给通用解释。
 * 已经被固定零件覆盖的部分、以及引号里的文字，都不会重复解释。
 */
export function findCodePartOccurrences(text: string): CodePartOccurrence[] {
  const occurrences: CodePartOccurrence[] = []
  const covered = new Array<boolean>(text.length).fill(false)

  let index = 0
  while (index < text.length) {
    const matched = matchKnownPartAt(text, index)
    if (!matched) {
      index += 1
      continue
    }

    occurrences.push({ part: matched, start: index, end: index + matched.text.length - 1 })
    for (let cursor = index; cursor < index + matched.text.length; cursor += 1) {
      covered[cursor] = true
    }
    index += matched.text.length
  }

  const inString = buildStringMask(text)
  IDENTIFIER_PATTERN.lastIndex = 0

  let match: RegExpExecArray | null
  while ((match = IDENTIFIER_PATTERN.exec(text)) !== null) {
    const name = match[0]
    const start = match.index
    const end = start + name.length - 1

    if (RESERVED_WORDS.has(name)) continue

    let insideOther = false
    for (let cursor = start; cursor <= end; cursor += 1) {
      if (covered[cursor] || inString[cursor]) {
        insideOther = true
        break
      }
    }
    if (insideOther) continue

    occurrences.push({ part: describeVariableName(name), start, end })
  }

  return occurrences.sort((a, b) => a.start - b.start)
}

export function getCodePartById(id: string): CodePart | undefined {
  return CODE_PARTS.find((part) => part.id === id)
}
