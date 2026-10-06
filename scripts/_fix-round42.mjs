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

// 1. 第 2 岛那道题和第 1 岛重复了，换一个写法
edit('src/data/courses.ts', [
  [
    [
      "      { text: 'asdf jkl; fdsa ;lkj', hint: '正着打、倒着打，各来一遍。' },",
    ].join('\n'),
    [
      "      { text: 'asdf fdsa jkl; ;lkj', hint: '正着打、倒着打，各来一遍。' },",
    ].join('\n'),
    '重复题',
  ],
])

// 2. 补拼音：回
edit('src/data/pinyin.ts', [
  [
    "  爱: 'ai',\n}\n",
    "  爱: 'ai',\n  回: 'hui',\n}\n",
    '新增字 回',
  ],
])

// 3. 舞台自测里岛 5 的关卡数从 10 改成 12
edit('scripts/stage-selftest.ts', [
  [
    "  check('岛 5 的 10 关都有可运行程序', lessons.filter((lesson) => lesson.stageId === 5).every((lesson) => programIds.includes(lesson.id)))\n",
    "  check('岛 5 的 12 关都有可运行程序', lessons.filter((lesson) => lesson.stageId === 5).every((lesson) => programIds.includes(lesson.id)))\n",
    '岛 5 关卡数（文案）',
  ],
  [
    "  check('岛 5 的程序都标记为舞台关卡', stageIds.length === 10, String(stageIds.length))\n",
    "  check('岛 5 的程序都标记为舞台关卡', stageIds.length === 12, String(stageIds.length))\n",
    '岛 5 关卡数（断言）',
  ],
])
