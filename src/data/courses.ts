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
    title: '找到家 F 和 J',
    subtitle: '认识键盘上的两个小凸点',
    kind: 'intro',
    focusChars: ['f', 'j'],
    targetWpm: 5,
    drills: [
      { text: 'ffff jjjj', hint: '食指轻轻放在 F 和 J 上，能摸到小凸点吗？' },
      { text: 'fj fj fj', hint: '食指原地起落，别的手指不要动。' },
      { text: 'f j f j j f', hint: '一下一下地敲，稳稳的。' },
    ],
  },
  {
    title: '手指宝宝上班啦',
    subtitle: '左手四个手指认识自己的位置',
    kind: 'letters',
    focusChars: ['a', 's', 'd', 'f'],
    targetWpm: 5,
    drills: [
      { text: 'aaaa ssss', hint: '小指管 A，无名指管 S。' },
      { text: 'dddd ffff', hint: '中指管 D，食指管 F。' },
      { text: 'asdf asdf', hint: '四个手指排队敲一遍。' },
    ],
  },
  {
    title: '坐姿小超人',
    subtitle: '坐正、手腕放松，双手同时到位',
    kind: 'intro',
    focusChars: ['a', 's', 'd', 'f', 'j', 'k', 'l'],
    targetWpm: 5,
    drills: [
      { text: 'asdf jkl;', hint: '左手在左半边，右手在右半边。' },
      { text: 'asdf jkl; asdf', hint: '敲完记得回到基准位置。' },
    ],
  },
  {
    title: '左手归位 ASDF',
    subtitle: '不看键盘也能找到左手位置',
    kind: 'letters',
    focusChars: ['a', 's', 'd', 'f'],
    targetWpm: 6,
    drills: [
      { text: 'aaaa ssss dddd ffff', hint: '每个键敲四下，手指不要跑到别处。' },
      { text: 'asdf asdf asdf', hint: '眼睛看屏幕，手指自己找位置。' },
      { text: 'fdsa fdsa', hint: '倒着敲一遍，手指也要乖乖归位。' },
    ],
  },
  {
    title: '右手归位 JKL;',
    subtitle: '右手四个手指找到自己的家',
    kind: 'letters',
    focusChars: ['j', 'k', 'l', ';'],
    targetWpm: 6,
    drills: [
      { text: 'jjjj kkkk llll ;;;;', hint: '右手食指管 J，小指管分号。' },
      { text: 'jkl; jkl; jkl;', hint: '顺序敲一遍，速度不重要，准确最重要。' },
      { text: ';lkj ;lkj', hint: '倒着来一遍，感受小指的位置。' },
    ],
  },
  {
    title: '双手都到家',
    subtitle: '双手同时归位，盲找 F 和 J',
    kind: 'letters',
    focusChars: ['f', 'j', 'd', 'k', 's', 'l'],
    targetWpm: 7,
    drills: [
      { text: 'fj fj dk dk sl sl', hint: '左右手同时出发，像照镜子。' },
      { text: 'asdf jkl; fj dk', hint: '先归位，再出发。' },
      { text: 'a; a; s l s l', hint: '无名指和小指的组合。' },
    ],
  },
  {
    title: '我的第一组字母',
    subtitle: '两个键一组，敲出节奏',
    kind: 'letters',
    focusChars: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
    targetWpm: 8,
    drills: [
      { text: 'as as df df jk jk l; l;', hint: '每组敲两遍，中间留一个空格。' },
      { text: 'asdf jkl; asdf jkl;', hint: '双手配合，节拍均匀。' },
      { text: 'fj dk sl a;', hint: '每个组合只敲一次，快而不乱。' },
    ],
  },
  {
    title: '三指小跳',
    subtitle: '相邻手指的小跳跃',
    kind: 'letters',
    focusChars: ['a', 'd', 's', 'f', 'k', 'l', ';'],
    targetWpm: 8,
    drills: [
      { text: 'ad sf kl ;l', hint: '跳到旁边的键，跳完要回家。' },
      { text: 'ad ad sf sf kl kl', hint: '每一组敲两遍。' },
      { text: 'sd lk fj ;a', hint: '这是最难的一组，慢慢来。' },
    ],
  },
  {
    title: '中排小词',
    subtitle: '只用基准行，也能拼出真的单词',
    kind: 'words',
    focusChars: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    targetWpm: 9,
    drills: [
      { text: 'add all ask sad', hint: '这些单词只用左手和食指就够了。' },
      { text: 'fall glass flask', hint: '字母多了，手指还是不要看键盘。' },
      { text: 'half salad dad', hint: '试试看，你已经在盲打了！' },
    ],
  },
  {
    title: '大写开关',
    subtitle: 'Shift 与左手小指的合作',
    kind: 'words',
    focusChars: ['A', 'S', 'D', 'F', 'J', 'K'],
    targetWpm: 9,
    drills: [
      { text: 'Ada Sam Fall', hint: '打大写时，用另一只手的小指按住 Shift。' },
      { text: 'Ask Dad Add', hint: '一只手按 Shift，另一只手敲字母。' },
      { text: 'Dad Has A Flask', hint: '每个单词的第一个字母是大写。' },
    ],
  },
  {
    title: '空格小火车',
    subtitle: '拇指敲空格，把单词连成句子',
    kind: 'words',
    focusChars: ['a', 's', 'd', 'f', 'h', 'l', ' '],
    targetWpm: 9,
    drills: [
      { text: 'add a salad', hint: '用拇指敲空格，敲完马上回基准行。' },
      { text: 'a sad lad', hint: '短句也要保持节奏。' },
      { text: 'dad has a glass', hint: '空格错误也会被记录下来哦。' },
    ],
  },
  {
    title: '阶段大挑战',
    subtitle: '完成它，你就是键盘新手',
    kind: 'words',
    focusChars: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    targetWpm: 10,
    boss: true,
    drills: [
      { text: 'asdf jkl; fall glass', hint: '把它当成一场小小的比赛。' },
      { text: 'all sad lads fall', hint: '保持准确，速度自然会上来。' },
      { text: 'dad has a glass flask', hint: '最后一题，稳住节奏！' },
    ],
  },
]

const STAGE_2_SEEDS: LessonSeed[] = [
  {
    title: '基准行加速',
    subtitle: '先热热身，把手指叫醒',
    kind: 'words',
    focusChars: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
    targetWpm: 12,
    drills: [
      { text: 'asdf jkl; asdf jkl;', hint: '两只手像齿轮一样咬合。' },
      { text: 'add all ask sad', hint: '回到真实单词上。' },
      { text: 'fall glass half', hint: '不要偷看键盘哦。' },
    ],
  },
  {
    title: '混合词复习',
    subtitle: '基准行也能写出小故事',
    kind: 'words',
    focusChars: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    targetWpm: 13,
    drills: [
      { text: 'half a glass', hint: '空格也要用拇指敲。' },
      { text: 'dad has a flask', hint: '一次敲一个单词，别急。' },
      { text: 'all lads fall', hint: '换行不用，直接连着敲。' },
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
    subtitle: '认识键盘、手指归位、ASDF 与 JKL;',
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