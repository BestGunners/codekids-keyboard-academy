import type { LessonSeed } from '@/data/courses'

/**
 * 最前面的「认识键盘」板块（6 关，内部 id 用 7，避免打乱已有岛屿的关卡编号）。
 *
 * 它不追求速度，只解决一个问题：孩子得先知道键盘怎么用——
 * 手该放在哪儿、每个键该用哪根手指按、空格归大拇指。
 * 打字页右侧会同时显示「手指分工表」，按到哪个键，对应的手指就亮起来。
 */
export const STAGE_KEYBOARD_BASICS: LessonSeed[] = [
  {
    title: '认识键盘',
    subtitle: '键盘分成哪几块',
    kind: 'intro',
    focusChars: ['f', 'j'],
    targetWpm: 5,
    drills: [
      { text: 'f f', hint: 'F 键在左手食指下面，键上有个小凸点，先摸一摸它。' },
      { text: 'j j', hint: 'J 键在右手食指下面，也有小凸点——两个凸点就是双手的家。' },
      { text: 'f j', hint: '键盘上有数字行、字母区、空格、回车、退格，这一课先把字母区认熟。' },
    ],
  },
  {
    title: '手怎么放',
    subtitle: '坐姿与基准行',
    kind: 'intro',
    focusChars: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
    targetWpm: 5,
    drills: [
      { text: 'asdf', hint: '左手四根手指：小指 A、无名指 S、中指 D、食指 F。' },
      { text: 'jkl;', hint: '右手四根手指：食指 J、中指 K、无名指 L、小指 分号。' },
      { text: 'asdf jkl;', hint: '背挺直、手腕轻轻抬起，双手一起放在这一行上。' },
    ],
  },
  {
    title: '左手四根手指',
    subtitle: '每根手指管哪些键',
    kind: 'intro',
    focusChars: ['a', 'q', 'z', 's', 'w', 'x', 'd', 'e', 'c'],
    targetWpm: 5,
    drills: [
      { text: 'aqz', hint: '左手小指管 A、Q、Z：向上够 Q，向下够 Z。' },
      { text: 'swx', hint: '左手无名指管 S、W、X，上下各走一格。' },
      { text: 'dec', hint: '左手中指管 D、E、C，敲完记得回到 D。' },
      { text: 'fgrtvb', hint: '左手食指最忙：F、G、R、T、V、B 都归它管。' },
      { text: 'aqz swx dec', hint: '三根手指各走一遍，右手先休息一下。' },
    ],
  },
  {
    title: '右手四根手指',
    subtitle: '每根手指管哪些键',
    kind: 'intro',
    focusChars: ['j', 'h', 'y', 'u', 'n', 'm', 'k', 'i', 'l', 'o', 'p'],
    targetWpm: 5,
    drills: [
      { text: 'jhyunm', hint: '右手食指管 J、H、Y、U、N、M，它要走的路最多。' },
      { text: 'ki', hint: '右手中指管 K 和 I。' },
      { text: 'lo', hint: '右手无名指管 L 和 O。' },
      { text: 'p;', hint: '右手小指管 P、分号，还有右边的回车和退格。' },
      { text: 'jhyunm ki lo', hint: '右手四根手指轮一遍，左手先休息一下。' },
    ],
  },
  {
    title: '大拇指管空格',
    subtitle: '空格键永远用拇指',
    kind: 'intro',
    focusChars: [' '],
    targetWpm: 5,
    drills: [
      { text: 'f j', hint: '空格键在键盘最下面，用大拇指轻轻一按。' },
      { text: 'j f j', hint: '拇指按空格的时候，其它手指不要离开基准行。' },
      { text: 'a f j l', hint: '小指按 A 和分号，拇指按空格，交替着来。' },
    ],
  },
  {
    title: '双手都准备好了',
    subtitle: '把每根手指认全',
    kind: 'intro',
    focusChars: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
    targetWpm: 6,
    drills: [
      { text: 'asdf jkl;', hint: '左手 A S D F，右手 J K L 分号，一起放上去。' },
      { text: 'aqz swx dec fgrtvb', hint: '左手四根手指各走一遍，眼睛看屏幕。' },
      { text: 'jhyunm ki lo p;', hint: '右手也轮一遍，敲完都回到基准行。' },
      { text: 'f j d k s l a ;', hint: '每根手指都找到自己的键，这一课就通关啦。' },
    ],
  },
]
