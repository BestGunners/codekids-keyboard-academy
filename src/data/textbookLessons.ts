import type { LessonSeed } from '@/data/courses'

/**
 * 第 8 个板块：课文长句（进阶挑战，12 关）。
 *
 * 规则：
 * 1. **一个拼音都不给**——汉字上方不显示拼音，下面也不提示"这个字怎么拼"，
 *    孩子得自己把每个字的拼音想出来；打对一个字才能往下一个字走。
 * 2. **每关就是一篇课文/一首古诗的一个段落**，4-5 句，句句不同；
 *    整岛 50 句没有一句重复（自测里守着这条规则）。
 */
export const STAGE_8_SEEDS: LessonSeed[] = [
  {
    title: '小小的船',
    subtitle: '一年级课文·叶圣陶',
    kind: 'words',
    hidePinyin: true,
    focusChars: ['弯', '船', '两', '尖'],
    targetWpm: 7,
    drills: [
      { text: '弯弯的月儿小小的船', hint: '一年级课文的第一句：先在心里把每个字念一遍。' },
      { text: '小小的船儿两头尖', hint: '注意"两"和"尖"这两个字。' },
      { text: '我在小小的船里坐', hint: '"坐"是上下两个"人"，想想它的拼音。' },
      { text: '只看见闪闪的星星蓝蓝的天', hint: '最后一句最长，一个词一个词来。' },
    ],
  },
  {
    title: '家',
    subtitle: '一年级课文',
    kind: 'words',
    hidePinyin: true,
    focusChars: ['蓝', '林', '河', '泥'],
    targetWpm: 7,
    drills: [
      { text: '蓝天是白云的家', hint: '一年级课文《家》的第一句。' },
      { text: '树林是小鸟的家', hint: '"树林"两个字都是木字旁。' },
      { text: '小河是鱼儿的家', hint: '注意"鱼儿"里的儿。' },
      { text: '泥土是种子的家', hint: '"泥土"和"种子"都是课本里的词。' },
      { text: '我们爱我们的家', hint: '最后一句换成了我们。' },
    ],
  },
  {
    title: '比一比',
    subtitle: '一年级识字课文',
    kind: 'words',
    hidePinyin: true,
    focusChars: ['牛', '边', '群', '鸭'],
    targetWpm: 7,
    drills: [
      { text: '一个大，一个小。', hint: '先比大小，两个短句。' },
      { text: '一头黄牛，一只猫。', hint: '"头"和"只"都是量词。' },
      { text: '一边多，一边少。', hint: '这次比多少。' },
      { text: '一群鸭子，一只鸟。', hint: '注意"一群"的群。' },
    ],
  },
  {
    title: '日月明',
    subtitle: '一年级识字课文',
    kind: 'words',
    hidePinyin: true,
    focusChars: ['明', '男', '尖', '林'],
    targetWpm: 7,
    drills: [
      { text: '日月明，田力男。', hint: '把两个字拼在一起，就成了新字。' },
      { text: '小大尖，小土尘。', hint: '"尖"和"尘"都是上下结构。' },
      { text: '二人从，三人众。', hint: '一个人、两个人、三个人。' },
      { text: '双木林，三木森。', hint: '两棵树是林，三棵树是森。' },
    ],
  },
  {
    title: '秋天',
    subtitle: '一年级课文',
    kind: 'words',
    hidePinyin: true,
    focusChars: ['秋', '片', '雁', '蓝'],
    targetWpm: 7,
    drills: [
      { text: '天气凉了，树叶黄了。', hint: '一年级课文《秋天》的开头。' },
      { text: '一片片叶子从树上落下来。', hint: '"一片片"表示叶子很多。' },
      { text: '天空那么蓝，那么高。', hint: '"那么"两个字连着用。' },
      { text: '一群大雁往南飞。', hint: '"大雁"是秋天往南飞的鸟。' },
      { text: '一会儿排成个人字，一会儿排成个一字。', hint: '大雁飞的时候会排队形。' },
    ],
  },
  {
    title: '雪地里的小画家',
    subtitle: '一年级课文',
    kind: 'words',
    hidePinyin: true,
    focusChars: ['雪', '鸡', '梅', '鸭'],
    targetWpm: 7,
    drills: [
      { text: '下雪啦，下雪啦！', hint: '一年级课文《雪地里的小画家》的开头。' },
      { text: '雪地里来了一群小画家。', hint: '注意"雪地"两个字。' },
      { text: '小鸡画竹叶，小狗画梅花。', hint: '它们的脚印就是画。' },
      { text: '小鸭画枫叶，小马画月牙。', hint: '"枫叶"和"月牙"也都是脚印。' },
    ],
  },
  {
    title: '影子',
    subtitle: '一年级课文',
    kind: 'words',
    hidePinyin: true,
    focusChars: ['影', '跟', '像', '条'],
    targetWpm: 7,
    drills: [
      { text: '影子在前，影子在后。', hint: '一年级课文《影子》的开头。' },
      { text: '影子常常跟着我。', hint: '"跟着"两个字连在一起。' },
      { text: '就像一条小黑狗。', hint: '"像"是把影子比成小狗。' },
      { text: '影子是我的好朋友。', hint: '最后一句，把影子当朋友。' },
    ],
  },
  {
    title: '雨点儿',
    subtitle: '一年级课文',
    kind: 'words',
    hidePinyin: true,
    focusChars: ['点', '彩', '飘', '问'],
    targetWpm: 7,
    drills: [
      { text: '数不清的雨点儿，从云彩里飘落下来。', hint: '一年级课文《雨点儿》的第一句。' },
      { text: '半空中，大雨点儿问小雨点儿。', hint: '雨点儿也会说话。' },
      { text: '你要到哪里去？', hint: '问句的末尾是问号。' },
      { text: '我要去有花有草的地方。', hint: '小雨点儿的回答。' },
    ],
  },
  {
    title: '画',
    subtitle: '一年级古诗',
    kind: 'words',
    hidePinyin: true,
    focusChars: ['听', '无', '还', '惊'],
    targetWpm: 7,
    drills: [
      { text: '远看山有色。', hint: '一年级古诗《画》第一句。' },
      { text: '近听水无声。', hint: '画里的水不会响。' },
      { text: '春去花还在。', hint: '春天过去了，花还开着。' },
      { text: '人来鸟不惊。', hint: '人走近，画里的鸟也不飞。' },
    ],
  },
  {
    title: '一去二三里',
    subtitle: '一年级古诗',
    kind: 'words',
    hidePinyin: true,
    focusChars: ['烟', '村', '亭', '枝'],
    targetWpm: 7,
    drills: [
      { text: '一去二三里。', hint: '一年级古诗，第一句全是数字。' },
      { text: '烟村四五家。', hint: '"烟村"是冒着炊烟的小村子。' },
      { text: '亭台六七座。', hint: '"亭台"两个字都是课外的常用字。' },
      { text: '八九十枝花。', hint: '最后一句数到十。' },
    ],
  },
  {
    title: '惜时谚语',
    subtitle: '课本里的名句',
    kind: 'words',
    hidePinyin: true,
    focusChars: ['春', '金', '惜', '勤'],
    targetWpm: 7,
    drills: [
      { text: '一年之计在于春，一日之计在于晨。', hint: '"计"和"晨"是关键的两个字。' },
      { text: '一寸光阴一寸金，寸金难买寸光阴。', hint: '时间比金子还贵。' },
      { text: '少壮不努力，老大徒伤悲。', hint: '小时候不努力，长大就会后悔。' },
      { text: '黑发不知勤学早，白首方悔读书迟。', hint: '这一句最长，说读书要趁早。' },
    ],
  },
  {
    title: '读书名言',
    subtitle: '收尾关·课本里的读书名句',
    kind: 'words',
    hidePinyin: true,
    boss: true,
    focusChars: ['读', '勤', '路', '海'],
    targetWpm: 8,
    drills: [
      { text: '读书破万卷，下笔如有神。', hint: '杜甫的名句。' },
      { text: '温故而知新。', hint: '复习旧知识，能得到新收获。' },
      { text: '千里之行，始于足下。', hint: '再远的路，也从脚下第一步开始。' },
      { text: '书山有路勤为径，学海无涯苦作舟。', hint: '最后一句最长，讲的是勤奋。' },
    ],
  },
]
