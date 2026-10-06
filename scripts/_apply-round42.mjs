import { readFileSync, writeFileSync } from 'node:fs'

const ROOT = 'C:/Users/TT/Desktop/SC/SC打字与编程/'

function edit(rel, pairs) {
  const raw = readFileSync(ROOT + rel, 'utf8')
  const eol = raw.includes('\r\n') ? '\r\n' : '\n'
  const fix = (block) => (eol === '\r\n' ? block.split('\n').join('\r\n') : block)
  let text = raw
  pairs.forEach(([oldBlock, newBlock, label]) => {
    const from = fix(oldBlock)
    const index = text.indexOf(from)
    if (index < 0) throw new Error(rel + '：找不到锚点 ' + label)
    if (text.indexOf(from, index + 1) >= 0) throw new Error(rel + '：锚点不唯一 ' + label)
    text = text.slice(0, index) + fix(newBlock) + text.slice(index + from.length)
  })
  writeFileSync(ROOT + rel, text)
  console.log('  ok  ' + rel)
}

// ---------------------------------------------- 1. 新增程序接入
edit('src/data/programs.ts', [
  [
    "import { LESSON_PROGRAMS_CODE } from './programsCode.ts'\n",
    "import { LESSON_PROGRAMS_CODE } from './programsCode.ts'\nimport { LESSON_PROGRAMS_EXTRA } from './programsExtra.ts'\n",
    '导入新增程序',
  ],
  [
    '  ...LESSON_PROGRAMS_CODE,\n',
    '  ...LESSON_PROGRAMS_CODE,\n  ...LESSON_PROGRAMS_EXTRA,\n',
    '合并新增程序',
  ],
])

// ---------------------------------------------- 2. 各岛接入新增关卡
edit('src/data/courses.ts', [
  [
    "import { STAGE_KEYBOARD_BASICS } from './keyboardBasics.ts'\n",
    "import { STAGE_KEYBOARD_BASICS } from './keyboardBasics.ts'\nimport {\n  EXTRA_1,\n  EXTRA_2,\n  EXTRA_3,\n  EXTRA_4,\n  EXTRA_5,\n  EXTRA_6,\n  EXTRA_7,\n} from './extraLessons.ts'\n",
    '导入新增关卡',
  ],
  [
    '    lessons: STAGE_KEYBOARD_BASICS.map((seed, index) => buildLesson(7, index + 1, seed)),\n',
    [
      '    lessons: [',
      '      ...STAGE_KEYBOARD_BASICS.map((seed, index) => buildLesson(7, index + 1, seed)),',
      '      ...EXTRA_7.map((seed, index) =>',
      '        buildLesson(7, STAGE_KEYBOARD_BASICS.length + index + 1, seed),',
      '      ),',
      '    ],',
      '',
    ].join('\n'),
    '认识键盘加课',
  ],
  [
    '      ...STAGE_1_SEEDS.map((seed, index) => buildLesson(1, index + 1, seed)),\n',
    [
      '      ...STAGE_1_SEEDS.map((seed, index) => buildLesson(1, index + 1, seed)),',
      '      ...EXTRA_1.map((seed, index) =>',
      '        buildLesson(1, STAGE_1_SEEDS.length + index + 1, seed),',
      '      ),',
      '',
    ].join('\n'),
    '键盘启蒙加课',
  ],
  [
    '      ...STAGE_2_TAIL.map((seed, index) => buildLesson(2, STAGE_2_SEEDS.length + index + 1, seed)),\n',
    [
      '      ...STAGE_2_TAIL.map((seed, index) => buildLesson(2, STAGE_2_SEEDS.length + index + 1, seed)),',
      '      ...EXTRA_2.map((seed, index) =>',
      '        buildLesson(2, STAGE_2_SEEDS.length + STAGE_2_TAIL.length + index + 1, seed),',
      '      ),',
      '',
    ].join('\n'),
    '英文单词加课',
  ],
  [
    '      ...STAGE_3_TAIL.map((seed, index) => buildLesson(3, STAGE_3_SEEDS.length + index + 1, seed)),\n',
    [
      '      ...STAGE_3_TAIL.map((seed, index) => buildLesson(3, STAGE_3_SEEDS.length + index + 1, seed)),',
      '      ...EXTRA_3.map((seed, index) =>',
      '        buildLesson(3, STAGE_3_SEEDS.length + STAGE_3_TAIL.length + index + 1, seed),',
      '      ),',
      '',
    ].join('\n'),
    '代码符号加课',
  ],
  [
    '      ...STAGE_4_TAIL.map((seed, index) => buildLesson(4, STAGE_4_SEEDS.length + index + 1, seed)),\n',
    [
      '      ...STAGE_4_TAIL.map((seed, index) => buildLesson(4, STAGE_4_SEEDS.length + index + 1, seed)),',
      '      ...EXTRA_4.map((seed, index) =>',
      '        buildLesson(4, STAGE_4_SEEDS.length + STAGE_4_TAIL.length + index + 1, seed),',
      '      ),',
      '',
    ].join('\n'),
    '简单代码加课',
  ],
  [
    '      ...STAGE_5_TAIL.map((seed, index) => buildLesson(5, STAGE_5_SEEDS.length + index + 1, seed)),\n',
    [
      '      ...STAGE_5_TAIL.map((seed, index) => buildLesson(5, STAGE_5_SEEDS.length + index + 1, seed)),',
      '      ...EXTRA_5.map((seed, index) =>',
      '        buildLesson(5, STAGE_5_SEEDS.length + STAGE_5_TAIL.length + index + 1, seed),',
      '      ),',
      '',
    ].join('\n'),
    '小游戏加课',
  ],
  [
    '      ...STAGE_6_SEEDS.map((seed, index) => buildLesson(6, index + 1, seed)),\n',
    [
      '      ...STAGE_6_SEEDS.map((seed, index) => buildLesson(6, index + 1, seed)),',
      '      ...EXTRA_6.map((seed, index) =>',
      '        buildLesson(6, STAGE_6_SEEDS.length + index + 1, seed),',
      '      ),',
      '',
    ].join('\n'),
    '中文打字加课',
  ],
])

// ---------------------------------------------- 3. 原来的收尾关不再当 boss
const bossPairs = [
  [
    'src/data/courses.ts',
    [
      "    title: '阶段大挑战',",
      "    subtitle: '完成它，你就把基准行练熟了',",
      "    kind: 'words',",
      '    boss: true,',
    ].join('\n'),
    [
      "    title: '中排大检验',",
      "    subtitle: '把基准行练到不用想',",
      "    kind: 'words',",
    ].join('\n'),
    '键盘启蒙收尾关',
  ],
  [
    'src/data/coursesExtra.ts',
    [
      "    title: '单词森林大挑战',",
      "    subtitle: '完成它，进入符号火山',",
      "    kind: 'words',",
      '    boss: true,',
    ].join('\n'),
    [
      "    title: '句子练习',",
      "    subtitle: '把学过的单词连成句子',",
      "    kind: 'words',",
    ].join('\n'),
    '英文单词收尾关',
  ],
  [
    'src/data/coursesExtra.ts',
    [
      "    title: '符号火山大挑战',",
      "    subtitle: '完成它，进入代码工厂',",
      "    kind: 'symbols',",
      '    boss: true,',
    ].join('\n'),
    [
      "    title: '符号综合练习',",
      "    subtitle: '把所有符号混着打一遍',",
      "    kind: 'symbols',",
    ].join('\n'),
    '符号收尾关',
  ],
  [
    'src/data/codeLessons.ts',
    [
      "    title: '代码工厂大挑战',",
      "    subtitle: '写一个完整的小程序',",
      "    kind: 'code',",
      '    boss: true,',
    ].join('\n'),
    [
      "    title: '代码综合练习',",
      "    subtitle: '把学过的代码拼一拼',",
      "    kind: 'code',",
    ].join('\n'),
    '代码收尾关',
  ],
  [
    'src/data/codeLessons.ts',
    [
      "    title: '我的第一个小游戏',",
      "    subtitle: '把标题、动画和分数拼起来',",
      "    kind: 'game',",
      '    boss: true,',
    ].join('\n'),
    [
      "    title: '分数和星星',",
      "    subtitle: '把标题、动画和分数拼起来',",
      "    kind: 'game',",
    ].join('\n'),
    '小游戏收尾关',
  ],
  [
    'src/data/chineseLessons.ts',
    [
      "    title: '短文·四季',",
      "    subtitle: '二年级短文（最后一关）',",
      "    kind: 'words',",
      '    boss: true,',
    ].join('\n'),
    [
      "    title: '短文·四季',",
      "    subtitle: '二年级短文',",
      "    kind: 'words',",
    ].join('\n'),
    '中文收尾关',
  ],
  [
    'src/data/keyboardBasics.ts',
    [
      "    title: '双手都准备好了',",
      "    subtitle: '把每根手指认全',",
      "    kind: 'intro',",
      '    boss: true,',
    ].join('\n'),
    [
      "    title: '双手都准备好了',",
      "    subtitle: '把每根手指认全',",
      "    kind: 'intro',",
    ].join('\n'),
    '认识键盘收尾关',
  ],
]

bossPairs.forEach(([rel, from, to, label]) => edit(rel, [[from, to, label]]))

// ---------------------------------------------- 4. 新字补进拼音表
edit('src/data/pinyin.ts', [
  [
    "  黑: 'hei',\n}\n",
    [
      "  黑: 'hei',",
      '  // 加课新增的字',
      "  数: 'shu',",
      "  颜: 'yan',",
      "  六: 'liu',",
      "  七: 'qi',",
      "  八: 'ba',",
      "  九: 'jiu',",
      "  们: 'men',",
      "  和: 'he',",
      "  燕: 'yan',",
      "  真: 'zhen',",
      "  都: 'dou',",
      "  爱: 'ai',",
      '}',
      '',
    ].join('\n'),
    '新增字',
  ],
])

// ---------------------------------------------- 5. 自测总数更新
edit('scripts/content-selftest.ts', [
  [
    "  check('关卡总数为 90（键盘入门 6 关 + 5 个岛 64 关 + 中文岛 20 关）', lessons.length === 90, String(lessons.length))\n",
    "  check('关卡总数为 120（12 + 18×4 + 12 + 24）', lessons.length === 120, String(lessons.length))\n",
    '总数',
  ],
])
