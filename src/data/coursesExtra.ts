import type { LessonSeed } from '@/data/courses'

/**
 * 各岛第 4 关以后的内容。
 * 之前这些关卡只有标题、没有题目，所以引擎把它们锁成「马上就来」；
 * 现在把内容补齐，孩子通关前 3 关后可以继续往下走。
 */

/** 岛 2：英文单词输入（第 4-16 关） */
export const STAGE_2_TAIL: LessonSeed[] = [
  {
    title: '上排 Q W',
    subtitle: '左手小指和无名指向上搬',
    kind: 'words',
    focusChars: ['q', 'w'],
    targetWpm: 14,
    drills: [
      { text: 'qq ww qq ww', hint: 'Q 用左手小指，W 用左手无名指，敲完要回位。' },
      { text: 'qw wq qw wq', hint: '一上一下，来回找位置。' },
      { text: 'we wear red', hint: '这三个词只用学过的字母。' },
    ],
  },
  {
    title: '上排 T Y',
    subtitle: '食指的两次远行',
    kind: 'words',
    focusChars: ['t', 'y'],
    targetWpm: 15,
    drills: [
      { text: 'tt yy tt yy', hint: '左手食指够 T，右手食指够 Y。' },
      { text: 'ty yt ty yt', hint: '食指伸出去，再收回来。' },
      { text: 'they try that', hint: '眼睛看屏幕，手指自己找路。' },
    ],
  },
  {
    title: '上排 U I O P',
    subtitle: '右手把上排补齐',
    kind: 'words',
    focusChars: ['u', 'i', 'o', 'p'],
    targetWpm: 15,
    drills: [
      { text: 'uu ii oo pp', hint: '右手食指、中指、无名指、小指各管一个。' },
      { text: 'ui op ui op', hint: '两组一起敲，节奏要匀。' },
      { text: 'you put it up', hint: '敲到这里，全部字母都会啦。' },
    ],
  },
  {
    title: '下排 Z X',
    subtitle: '小指往下够',
    kind: 'words',
    focusChars: ['z', 'x'],
    targetWpm: 15,
    drills: [
      { text: 'zz xx zz xx', hint: 'Z 是左手小指，X 是左手无名指。' },
      { text: 'zx xz zx xz', hint: '往下伸的时候手腕别乱动。' },
      { text: 'zoo fox box', hint: '注意字母顺序，不要看着键盘。' },
    ],
  },
  {
    title: '下排 C V',
    subtitle: '中指和食指的下排位置',
    kind: 'words',
    focusChars: ['c', 'v'],
    targetWpm: 15,
    drills: [
      { text: 'cc vv cc vv', hint: 'C 是中指，V 是食指。' },
      { text: 'cv vc cv vc', hint: '一左一右，手指要跳得准。' },
      { text: 'cat cup very', hint: '敲完马上回到基准位置。' },
    ],
  },
  {
    title: '下排 B N M',
    subtitle: '食指负责下排中间',
    kind: 'words',
    focusChars: ['b', 'n', 'm'],
    targetWpm: 16,
    drills: [
      { text: 'bb nn mm bb', hint: 'B 是左手食指，N 和 M 是右手食指。' },
      { text: 'bn nm mb bn', hint: '食指往下伸，别的指头别跟着跑。' },
      { text: 'man bus home', hint: '26 个字母你都学完啦！' },
    ],
  },
  {
    title: '数字 4 5 6 7',
    subtitle: '两只食指负责的数字',
    kind: 'words',
    focusChars: ['4', '5', '6', '7'],
    targetWpm: 14,
    drills: [
      { text: '44 55 66 77', hint: '4、5 是左手食指，6、7 是右手食指。' },
      { text: '4567 7654', hint: '正着敲一遍，倒着敲一遍。' },
      { text: '4 5 6 7 4 5', hint: '数字也要盲打，不要低头找。' },
    ],
  },
  {
    title: '数字 8 9 0',
    subtitle: '右手剩下三个手指',
    kind: 'words',
    focusChars: ['8', '9', '0'],
    targetWpm: 14,
    drills: [
      { text: '88 99 00', hint: '8 是中指，9 是无名指，0 是小指。' },
      { text: '890 098 809', hint: '小指敲 0 最容易歪，慢一点。' },
      { text: '80 90 100', hint: '数字连起来也不怕。' },
    ],
  },
  {
    title: '数字与单词混排',
    subtitle: '一句话里又有字又有数',
    kind: 'words',
    focusChars: ['0', '1', '2', '3'],
    targetWpm: 16,
    drills: [
      { text: 'level 3 and 7', hint: '数字和字母之间的空格也要敲。' },
      { text: 'score 10 25 30', hint: '数字键在字母区上方，伸上去再回来。' },
      { text: 'you have 2 cats', hint: '像写句子一样，一口气敲完。' },
    ],
  },
  {
    title: '高频词 1',
    subtitle: '英语里最常出现的词',
    kind: 'words',
    focusChars: ['t', 'h', 'e', 'a', 'n', 'd'],
    targetWpm: 18,
    drills: [
      { text: 'the and you that', hint: '一次看一个词，不要一个字母一个字母看。' },
      { text: 'was for are with', hint: '这些词出现最多，练熟很划算。' },
      { text: 'his they have this', hint: '手指记住整块动作，速度就上来了。' },
    ],
  },
  {
    title: '高频词 2',
    subtitle: '再练一批常用词',
    kind: 'words',
    focusChars: ['f', 'r', 'o', 'm', 'w', 'l'],
    targetWpm: 18,
    drills: [
      { text: 'from will one all', hint: '保持匀速，别忽快忽慢。' },
      { text: 'were when your can', hint: '小指和无名指最容易出错，注意。' },
      { text: 'said there use them', hint: '慢慢加速，准确优先。' },
    ],
  },
  {
    title: '短语练习',
    subtitle: '把几个词连起来敲',
    kind: 'words',
    focusChars: [' ', 'c', 'o', 'm', 'e'],
    targetWpm: 18,
    drills: [
      { text: 'come here please', hint: '空格用拇指，每个空格只敲一下。' },
      { text: 'look at me now', hint: '短句中间不要停下来看键盘。' },
      { text: 'a big red cat', hint: '像唱歌一样有节奏地敲。' },
    ],
  },
  {
    title: '句子练习',
    subtitle: '把学过的单词连成句子',
    kind: 'words',
    focusChars: ['t', 'y', 'p', 'e', 'I'],
    targetWpm: 20,
    drills: [
      { text: 'I can type fast', hint: '大写 I 要用另一只手的小指按住 Shift。' },
      { text: 'you and I can play', hint: '保持准确，速度自然会来。' },
      { text: 'we type every day', hint: '最后一题，稳住节奏！' },
    ],
  },
]

/** 岛 3：代码符号输入（第 4-14 关） */
export const STAGE_3_TAIL: LessonSeed[] = [
  {
    title: '尖括号 < >',
    subtitle: '比较大小用的两只小箭头',
    kind: 'symbols',
    focusChars: ['<', '>'],
    targetWpm: 10,
    drills: [
      { text: '<< >> << >>', hint: '小于号是 Shift + 逗号，大于号是 Shift + 句点。' },
      { text: '< < > >', hint: '右手中指和无名指负责这一对。' },
      { text: '<> <> <>', hint: '两个方向相反，别敲错。' },
    ],
  },
  {
    title: '括号混合速射',
    subtitle: '圆的、方的、花的轮着来',
    kind: 'symbols',
    focusChars: ['(', ')', '[', ']', '{', '}'],
    targetWpm: 10,
    drills: [
      { text: '{ } [ ] ( )', hint: '三种括号，右手的三个手指轮流出动。' },
      { text: '{} [] ()', hint: '一对一对地敲，中间留空格。' },
      { text: '[{}] ()', hint: '括号还可以套在一起。' },
    ],
  },
  {
    title: '等号与加号',
    subtitle: '右手小指的两个邻居键',
    kind: 'symbols',
    focusChars: ['=', '+'],
    targetWpm: 10,
    drills: [
      { text: '== ++ == ++', hint: '加号要按住 Shift 再敲等号键。' },
      { text: '= + = +', hint: '小指力量弱，多练几次就稳了。' },
      { text: '1 = 2 + 3', hint: '这就是计算机里最常见的算式。' },
    ],
  },
  {
    title: '减号、星号、斜杠',
    subtitle: '三个运算符',
    kind: 'symbols',
    focusChars: ['-', '*', '/'],
    targetWpm: 10,
    drills: [
      { text: '- - * *', hint: '减号在 0 的右边，星号是 Shift + 8。' },
      { text: '/ / - -', hint: '斜杠用右手小指。' },
      { text: '- * / - * /', hint: '三个符号轮着敲一遍。' },
    ],
  },
  {
    title: '分号与冒号',
    subtitle: 'C++ 里最重要的两个标点',
    kind: 'symbols',
    focusChars: [';', ':'],
    targetWpm: 11,
    drills: [
      { text: '; ; : :', hint: '同一个键：不按 Shift 是分号，按住是冒号。' },
      { text: ';: ;: ;:', hint: '一松一按，感受 Shift 的节奏。' },
      { text: '1; 2: 3;', hint: '分号表示一句话结束，冒号后面常跟着一段代码。' },
    ],
  },
  {
    title: '引号家族',
    subtitle: '装文字用的单引号和双引号',
    kind: 'symbols',
    focusChars: ['"', "'"],
    targetWpm: 10,
    drills: [
      { text: "\" \" ' '", hint: '双引号要按 Shift + 引号键，单引号直接敲。' },
      { text: "\"\" '' \"\"", hint: '引号总是成对出现的。' },
      { text: "\"ok\" 'no'", hint: '引号里的内容是要显示的文字。' },
    ],
  },
  {
    title: '感叹与问号',
    subtitle: '句子末尾的两个常用符号',
    kind: 'symbols',
    focusChars: ['!', '?'],
    targetWpm: 10,
    drills: [
      { text: '! ! ? ?', hint: '感叹号是 Shift + 1，问号是 Shift + 斜杠。' },
      { text: '!! ?? !! ??', hint: '连着敲两个，节奏要均匀。' },
      { text: '1! 2? 3!', hint: '数字和符号配合起来。' },
    ],
  },
  {
    title: '组合比较符',
    subtitle: '两个符号组成的比较',
    kind: 'symbols',
    focusChars: ['!', '=', '>', '<'],
    targetWpm: 10,
    drills: [
      { text: '!= == >= <=', hint: '四个组合，每个都是两个符号连敲。' },
      { text: '<= >= == !=', hint: '倒过来再练一遍。' },
      { text: '1 != 2', hint: '不等于是感叹号加等号。' },
    ],
  },
  {
    title: '缩进与空格',
    subtitle: '代码开头的四个空格',
    kind: 'symbols',
    focusChars: [' '],
    targetWpm: 10,
    drills: [
      { text: '    x = 1', hint: '这四个空格叫缩进，用拇指一下一下敲。' },
      { text: '    y = 2', hint: '缩进让代码整整齐齐。' },
      { text: '    z = 3', hint: '四个空格不多不少，不要用 Tab 代替。' },
    ],
  },
  {
    title: '符号大乱斗',
    subtitle: '所有符号混在一起',
    kind: 'symbols',
    focusChars: ['(', ')', '{', '}', ';', '='],
    targetWpm: 10,
    drills: [
      { text: '{ } [ ] ( )', hint: '先慢慢确认每个键的位置。' },
      { text: '; : = + - * /', hint: '一排符号轮流来。' },
      { text: '" < > ! ?', hint: '引号和箭头放在一起。' },
    ],
  },
  {
    title: '符号综合练习',
    subtitle: '把所有符号混着打一遍',
    kind: 'symbols',
    focusChars: ['(', ')', '{', '}', '<', '>', ';'],
    targetWpm: 11,
    drills: [
      { text: '(){}[] <>', hint: '括号家族集合啦。' },
      { text: '== != <= >=', hint: '比较符四兄弟。' },
      { text: '[{()}] <>', hint: '最后一题，稳住！' },
    ],
  },
]
