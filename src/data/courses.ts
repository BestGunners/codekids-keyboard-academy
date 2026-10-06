import type { Drill, Lesson, LessonKind, Stage } from '@/types/course'
import { STAGE_KEYBOARD_BASICS } from './keyboardBasics.ts'
import { STAGE_2_TAIL, STAGE_3_TAIL } from './coursesExtra.ts'
import { STAGE_4_SEEDS, STAGE_4_TAIL, STAGE_5_SEEDS, STAGE_5_TAIL } from './codeLessons.ts'
import { STAGE_6_SEEDS } from './chineseLessons.ts'

type DrillEntry = string | { text: string; hint?: string }

function makeDrills(lessonId: string, entries: DrillEntry[]): Drill[] {
  return entries.map((entry, index) => {
    const text = typeof entry === 'string' ? entry : entry.text
    const hint = typeof entry === 'string' ? undefined : entry.hint
    return { id: `${lessonId}-d${index + 1}`, text, hint, mode: 'copy' }
  })
}

export interface LessonSeed {
  title: string
  subtitle: string
  kind: LessonKind
  focusChars: string[]
  targetWpm: number
  boss?: boolean
  drills: DrillEntry[]
}

function buildLesson(stageId: number, order: number, seed: LessonSeed, ready = true): Lesson {
  const id = `s${stageId}-l${String(order).padStart(2, '0')}`
  return {
    id,
    stageId,
    order,
    title: seed.title,
    subtitle: seed.subtitle,
    kind: seed.kind,
    focusChars: seed.focusChars,
    targetWpm: seed.targetWpm,
    boss: seed.boss,
    ready,
    drills: makeDrills(id, seed.drills),
  }
}

const STAGE_1_SEEDS: LessonSeed[] = [
  {
    title: '双手回家',
    subtitle: '摸摸两个小凸点，双手一起归位',
    kind: 'letters',
    focusChars: ['f', 'j', 'a', ';'],
    targetWpm: 7,
    drills: [
      { text: 'fj fj fj', hint: '食指先摸到凸点，再让其它手指自然落下。' },
      { text: 'asdf jkl; fj', hint: '双手一起归位，每次敲完都回到基准行。' },
      { text: 'a; s l d k f j', hint: '左右手对称着敲：小指对小指，食指对食指。' },
    ],
  },
  {
    title: '左手 A S D F',
    subtitle: '四根手指各就各位',
    kind: 'letters',
    focusChars: ['a', 's', 'd', 'f'],
    targetWpm: 7,
    drills: [
      { text: 'aaaa ssss dddd ffff', hint: '每根手指只动自己那一格，别的手指不要跟着动。' },
      { text: 'asdf asdf asdf', hint: '四个键连起来，节奏要均匀。' },
      { text: 'fdsa fdsa', hint: '倒着打一遍，手指照样要归位。' },
    ],
  },
  {
    title: '右手 J K L ;',
    subtitle: '右边四根手指对齐',
    kind: 'letters',
    focusChars: ['j', 'k', 'l', ';'],
    targetWpm: 7,
    drills: [
      { text: 'jjjj kkkk llll ;;;;', hint: '右手食指管 J，小指管分号。' },
      { text: 'jkl; jkl; jkl;', hint: '顺序敲一遍，速度先放慢。' },
      { text: ';lkj ;lkj', hint: '倒着来一遍，感受小指的位置。' },
    ],
  },
  {
    title: '左右手交替',
    subtitle: '一只手敲，另一只手接着来',
    kind: 'letters',
    focusChars: ['f', 'j', 'a', ';'],
    targetWpm: 8,
    drills: [
      { text: 'f j f j f j', hint: '两个食指像传球一样，一个敲完另一个接上。' },
      { text: 'a ; a ; a ;', hint: '两个小指轮流按，其它手指保持不动。' },
      { text: 'fj dk sl a;', hint: '从中间往外走一遍，感受左右对称。' },
    ],
  },
  {
    title: '相邻手指小跳',
    subtitle: '挨着的两根手指换着敲',
    kind: 'letters',
    focusChars: ['a', 'd', 's', 'f'],
    targetWpm: 8,
    drills: [
      { text: 'ad sf kl ;l', hint: '相邻两根手指互相换位，手腕不要动。' },
      { text: 'ad ad sf sf kl kl', hint: '每一组敲两遍，找到均匀的节奏。' },
      { text: 'sd lk fj ;a', hint: '从里往外、再从外往里，手指都要归位。' },
    ],
  },
  {
    title: '两个键一组',
    subtitle: '成对敲击，打出均匀的节奏',
    kind: 'letters',
    focusChars: ['a', 's', 'd', 'f'],
    targetWpm: 8,
    drills: [
      { text: 'as as df df jk jk l; l;', hint: '每两个键一组，像拍手一样有节拍。' },
      { text: 'asdf jkl; fdsa ;lkj', hint: '正着打、倒着打，各来一遍。' },
      { text: 'a s d f j k l ;', hint: '一个一个慢慢来，重点是不看键盘。' },
    ],
  },
  {
    title: '中排小词 1',
    subtitle: '只用基准行也能拼出真的单词',
    kind: 'words',
    focusChars: ['a', 's', 'd', 'f'],
    targetWpm: 8,
    drills: [
      { text: 'add all ask sad', hint: '这四个词只用 A S D F 就能拼出来。' },
      { text: 'dad lad had', hint: '三个词的字母排列很像，注意别敲乱。' },
      { text: 'as sad dad', hint: '把它当成一句话，中间记得按空格。' },
    ],
  },
  {
    title: '中排小词 2',
    subtitle: '再练几个中排词',
    kind: 'words',
    focusChars: ['g', 'h', 'l', 'f'],
    targetWpm: 8,
    drills: [
      { text: 'fall glass flask', hint: 'glass 和 flask 里都有 s，别漏掉。' },
      { text: 'half a salad', hint: '空格用大拇指，词与词之间留一格。' },
      { text: 'all lads fall', hint: '一口气敲完，手指始终贴着基准行。' },
    ],
  },
  {
    title: '大写开关',
    subtitle: 'Shift 与另一只手的小指合作',
    kind: 'words',
    focusChars: ['a', 's', 'd', 'f'],
    targetWpm: 8,
    drills: [
      { text: 'Ada Sam Fall', hint: '要打大写，就按住 Shift 再敲字母。' },
      { text: 'Ask Dad Add', hint: 'Shift 用另一只手的小指按，两只手配合。' },
      { text: 'Dad Has A Flask', hint: '松开 Shift 就回到小写，注意大小写别乱。' },
    ],
  },
  {
    title: '空格小火车',
    subtitle: '拇指敲空格，把单词连成短语',
    kind: 'words',
    focusChars: [' '],
    targetWpm: 8,
    drills: [
      { text: 'add a salad', hint: '空格永远用大拇指，敲完马上回到基准行。' },
      { text: 'a sad lad', hint: '三个词、两个空格，节奏要稳。' },
      { text: 'dad has a glass', hint: '这是四个词的短语，中间别漏空格。' },
    ],
  },
  {
    title: '中排冲刺',
    subtitle: '把基准行学的连起来打',
    kind: 'words',
    focusChars: ['a', 's', 'd', 'f'],
    targetWpm: 9,
    drills: [
      { text: 'asdf jkl; fj dk', hint: '先热身，再进短词。' },
      { text: 'a glass flask falls', hint: '长一点也没关系，眼睛看屏幕。' },
      { text: 'dad has a salad', hint: '空格和大小写都别漏。' },
    ],
  },
  {
    title: '阶段大挑战',
    subtitle: '完成它，你就把基准行练熟了',
    kind: 'words',
    boss: true,
    focusChars: ['a', 's', 'd', 'f', 'j', 'k', 'l'],
    targetWpm: 9,
    drills: [
      { text: 'asdf jkl; fall glass', hint: '先归位，再敲词。' },
      { text: 'all sad lads fall', hint: '四个词连起来，手指不要跑偏。' },
      { text: 'dad has a glass flask', hint: '最后一题，稳住节奏就通关啦。' },
    ],
  },
]
const STAGE_2_SEEDS: LessonSeed[] = [
  {
    title: '热身：手指归位',
    subtitle: '开打前把双手叫醒',
    kind: 'words',
    focusChars: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
    targetWpm: 12,
    drills: [
      { text: 'asdf jkl; asdf jkl;', hint: '两只手像齿轮一样咬合。' },
      { text: 'fj dk sl a; fj dk', hint: '从中间往外走一遍，再收回来。' },
      { text: 'fdsa ;lkj fdsa ;lkj', hint: '倒着归位一遍，手指不要跑偏。' },
    ],
  },
  {
    title: '热身：中排词',
    subtitle: '用几个中排词把手指叫醒',
    kind: 'words',
    focusChars: ['a', 's', 'd', 'f', 'g', 'h', 'l'],
    targetWpm: 13,
    drills: [
      { text: 'glad lads', hint: '只用基准行的词，先慢后快。' },
      { text: 'dash a flag', hint: '空格用拇指，词与词之间留一格。' },
      { text: 'half a glass', hint: '连着敲三个词，中间别停手。' },
    ],
  },
  {
    title: '上排 E R',
    subtitle: '手指向上斜着搬家',
    kind: 'words',
    focusChars: ['e', 'r'],
    targetWpm: 14,
    drills: [
      { text: 'ee rr ee rr', hint: '左手中指管 E，食指管 R。' },
      { text: 'er er re re', hint: '敲完马上回到 D 和 F。' },
      { text: 'red ear her here', hint: '手指记住上去再回来的路。' },
    ],
  },
]

const STAGE_3_SEEDS: LessonSeed[] = [
  {
    title: '圆括号 ( )',
    subtitle: '代码里最常见的两只小耳朵',
    kind: 'symbols',
    focusChars: ['(', ')'],
    targetWpm: 8,
    drills: [
      { text: '( ( ) )', hint: '( 是 Shift + 9，) 是 Shift + 0，用左手小指按住 Shift。' },
      { text: '() () ()', hint: '一次一个括号，敲完回基准行。' },
      { text: '(()) ()', hint: '连着两个也不怕。' },
    ],
  },
  {
    title: '方括号 [ ]',
    subtitle: '右边小指的任务',
    kind: 'symbols',
    focusChars: ['[', ']'],
    targetWpm: 8,
    drills: [
      { text: '[ [ ] ]', hint: '方括号不用按 Shift，右手小指直接敲。' },
      { text: '[] [] []', hint: '敲完手指回到分号上。' },
      { text: '[[]] []', hint: '左右各一个，别按错。' },
    ],
  },
  {
    title: '花括号 { }',
    subtitle: 'Shift 与方括号的组合',
    kind: 'symbols',
    focusChars: ['{', '}'],
    targetWpm: 9,
    drills: [
      { text: '{ { } }', hint: '{ 是 Shift + [ ，} 是 Shift + ]。' },
      { text: '{} {} {}', hint: '左手小指按住 Shift，右手小指敲括号。' },
      { text: '{{}} {}', hint: '花括号是很多代码的门口。' },
    ],
  },
]

export const STAGES: Stage[] = [
  {
    // 内部 id 用 7：新板块排在最前面，但不去改动其它岛的关卡编号，
    // 这样孩子已有的星星进度不会错位（显示时按列表顺序编号）
    id: 7,
    code: 'keyboard-basics',
    title: '认识键盘',
    subtitle: '坐姿、手位、每根手指管哪些键',
    emoji: '⌨️',
    gradient: 'from-brand-400/70 to-candy-mint/70',
    available: true,
    lessons: STAGE_KEYBOARD_BASICS.map((seed, index) => buildLesson(7, index + 1, seed)),
  },
  {
    id: 1,
    code: 'keyboard-meadow',
    title: '键盘启蒙',
    subtitle: '把基准行练熟：归位、节奏、中排小词',
    emoji: '🌱',
    gradient: 'from-candy-green/80 to-candy-mint/70',
    available: true,
    lessons: [
      ...STAGE_1_SEEDS.map((seed, index) => buildLesson(1, index + 1, seed)),
    ],
  },
  {
    id: 2,
    code: 'word-forest',
    title: '英文单词输入',
    subtitle: '上排、下排、数字与高频词',
    emoji: '🌳',
    gradient: 'from-candy-mint/70 to-brand-300/70',
    available: true,
    lessons: [
      ...STAGE_2_SEEDS.map((seed, index) => buildLesson(2, index + 1, seed)),
      ...STAGE_2_TAIL.map((seed, index) => buildLesson(2, STAGE_2_SEEDS.length + index + 1, seed)),
    ],
  },
  {
    id: 3,
    code: 'symbol-volcano',
    title: '代码符号输入',
    subtitle: '括号、运算符、冒号与引号',
    emoji: '🌋',
    gradient: 'from-candy-orange/70 to-candy-pink/70',
    available: true,
    lessons: [
      ...STAGE_3_SEEDS.map((seed, index) => buildLesson(3, index + 1, seed)),
      ...STAGE_3_TAIL.map((seed, index) => buildLesson(3, STAGE_3_SEEDS.length + index + 1, seed)),
    ],
  },
  {
    id: 4,
    code: 'code-factory',
    title: '简单代码输入',
    subtitle: '用 C++ 敲出真正的代码',
    emoji: '🏭',
    gradient: 'from-brand-300/70 to-candy-purple/70',
    available: true,
    lessons: [
      ...STAGE_4_SEEDS.map((seed, index) => buildLesson(4, index + 1, seed)),
      ...STAGE_4_TAIL.map((seed, index) => buildLesson(4, STAGE_4_SEEDS.length + index + 1, seed)),
    ],
  },
  {
    id: 5,
    code: 'game-island',
    title: '小游戏编程',
    subtitle: '用 C++ 做出自己的小游戏',
    emoji: '🎮',
    gradient: 'from-candy-purple/70 to-candy-pink/70',
    available: true,
    lessons: [
      ...STAGE_5_SEEDS.map((seed, index) => buildLesson(5, index + 1, seed)),
      ...STAGE_5_TAIL.map((seed, index) => buildLesson(5, STAGE_5_SEEDS.length + index + 1, seed)),
    ],
  },
  {
    id: 6,
    code: 'chinese-garden',
    title: '中文打字',
    subtitle: '用拼音打出汉字、词语和古诗',
    emoji: '📜',
    gradient: 'from-ember-300/70 to-candy-orange/70',
    available: true,
    lessons: [
      ...STAGE_6_SEEDS.map((seed, index) => buildLesson(6, index + 1, seed)),
    ],
  },
]