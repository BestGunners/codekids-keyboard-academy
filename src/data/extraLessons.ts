import type { LessonSeed } from '@/data/courses'

/**
 * 各岛新增的关卡（第 42 轮加课）。
 *
 * 规则：
 * 1. 全部接在每岛原有内容后面，最后那一关才是 boss —— 这样已有题目的编号（s1-l01 …）
 *    完全不动，孩子的星星进度不会错位；
 * 2. 第一、二个板块之间不出现一模一样的题目（有自测守着）；
 * 3. 岛 4/5 的新关卡在 programsExtra.ts 里配了能跑的程序；
 * 4. 中文新字都已经补进 pinyin.ts。
 */

/** 内部 id 7：认识键盘（+6，总 12 关） */
export const EXTRA_7: LessonSeed[] = [
  {
    title: '回车和退格',
    subtitle: '右手小指管的两个键',
    kind: 'intro',
    focusChars: ['p', ';'],
    targetWpm: 5,
    drills: [
      { text: 'p ; p ;', hint: '回车和退格都在右手小指那一列，先熟悉这根小指。' },
      { text: '; p p ;', hint: '小指在 P 和分号之间来回，手腕不要跟着动。' },
      { text: 'p p ; ;', hint: '敲完记得把手指放回基准行。' },
    ],
  },
  {
    title: 'Shift 在哪里',
    subtitle: '左手小指的另一个任务',
    kind: 'intro',
    focusChars: ['a', 's', 'f'],
    targetWpm: 5,
    drills: [
      { text: 'a A a A', hint: '要打大写，就按住 Shift 再敲字母：左手敲字母时用右手小指按 Shift。' },
      { text: 's S s S', hint: 'Shift 按住不要松开，敲完字母再抬手。' },
      { text: 'a A s S d D', hint: '左手三个键挨个试一遍大写。' },
    ],
  },
  {
    title: '两只手怎么配合',
    subtitle: '一只手按 Shift，另一只手敲字母',
    kind: 'intro',
    focusChars: ['f', 'j'],
    targetWpm: 5,
    drills: [
      { text: 'f F f F', hint: '打大写 F：右手小指按住 Shift，左手食指敲 F。' },
      { text: 'j J j J', hint: '打大写 J：左手小指按住 Shift，右手食指敲 J。' },
      { text: 'F J F J', hint: '两只手一按一敲，配合起来就不别扭了。' },
    ],
  },
  {
    title: '数字行认一认',
    subtitle: '数字行就在字母区上面',
    kind: 'intro',
    focusChars: ['1', '4', '7'],
    targetWpm: 5,
    drills: [
      { text: '1 2 3', hint: '数字行在最上面：1 用左手小指，2 用无名指，3 用中指。' },
      { text: '4 5 6 7', hint: '两只食指最灵活，4、5、6、7 都归它们。' },
      { text: '8 9 0', hint: '8、9、0 归右手的中指、无名指和小指。' },
    ],
  },
  {
    title: '眼睛看屏幕',
    subtitle: '盲打小考验',
    kind: 'intro',
    focusChars: ['f', 'j'],
    targetWpm: 5,
    drills: [
      { text: 'j f j f', hint: '眼睛盯着屏幕，用手指去感觉 F 和 J 上的两个小凸点。' },
      { text: 'asdf jkl; asdf', hint: '找不到位置就先摸凸点，再让其它手指落下来。' },
      { text: 'f j d k s l a ; f j', hint: '从头到尾都不看键盘，试试看。' },
    ],
  },
  {
    title: '键盘小达人',
    subtitle: '把这一岛学的都用上',
    kind: 'intro',
    boss: true,
    focusChars: ['a', 's', 'f', 'j'],
    targetWpm: 6,
    drills: [
      { text: 'asdf jkl; fdsa ;lkj', hint: '先归位，再倒着来一遍。' },
      { text: 'fgrtvb aqz swx dec', hint: '左手六种键、三根手指各走一遍。' },
      { text: 'jhyunm p; ki lo', hint: '右手也走一遍，小指记得管 P 和分号。' },
      { text: 'A S D F', hint: '最后来一组大写，Shift 用另一只手的小指按住。' },
    ],
  },
]

/** 内部 id 1：键盘启蒙（+6，总 18 关） */
export const EXTRA_1: LessonSeed[] = [
  {
    title: '同一根手指连按',
    subtitle: '一根手指连敲同一个键',
    kind: 'letters',
    focusChars: ['f', 'j', 'a', ';'],
    targetWpm: 8,
    drills: [
      { text: 'ff jj ff jj', hint: '同一根手指连敲两下，手腕不要晃。' },
      { text: 'fff jjj fff jjj', hint: '连敲三下，节奏像敲门一样均匀。' },
      { text: 'aa ss dd ff jj kk ll ;;', hint: '每根手指都连敲两下，从左到右过一遍。' },
    ],
  },
  {
    title: '三根手指一起走',
    subtitle: '相邻的三根手指连着敲',
    kind: 'letters',
    focusChars: ['a', 's', 'd', 'f'],
    targetWpm: 8,
    drills: [
      { text: 'asd jkl', hint: '三根手指排着队敲，一根接一根。' },
      { text: 'asd asd jkl jkl', hint: '一组敲两遍，找到连贯的感觉。' },
      { text: 'dfg hjk', hint: '这次用中间三组，两只食指也带上。' },
    ],
  },
  {
    title: '中排长句',
    subtitle: '用基准行写一句话',
    kind: 'words',
    focusChars: ['a', 's', 'd', 'f'],
    targetWpm: 8,
    drills: [
      { text: 'a sad lad had a salad', hint: '一句话五个词，中间都用拇指按空格。' },
      { text: 'all lads ask dad', hint: '每个词都只用基准行，别着急。' },
      { text: 'dad adds a glass', hint: 'adds 里有两个 d，注意别漏字母。' },
    ],
  },
  {
    title: '大写小词',
    subtitle: '每个词的第一个字母大写',
    kind: 'words',
    focusChars: ['a', 's', 'd', 'f'],
    targetWpm: 8,
    drills: [
      { text: 'A Lad Has A Salad', hint: '每个词的第一个字母按住 Shift 打大写。' },
      { text: 'Dad Asks A Lad', hint: 'Shift 用另一只手的小指按，两只手配合。' },
      { text: 'All Lads Add A Salad', hint: '五个词一口气打完，大小写别乱。' },
    ],
  },
  {
    title: '空格与节奏',
    subtitle: '拇指按空格，词与词之间要匀',
    kind: 'words',
    focusChars: [' '],
    targetWpm: 8,
    drills: [
      { text: 'a lad has a glass', hint: '空格永远用大拇指，敲完马上回基准行。' },
      { text: 'dad has a flask', hint: '四个词、三个空格，节奏要稳。' },
      { text: 'a sad lass adds a salad', hint: '句子长也别慌，一个词一个词来。' },
    ],
  },
  {
    title: '键盘启蒙大挑战',
    subtitle: '完成它，基准行就成肌肉记忆了',
    kind: 'words',
    boss: true,
    focusChars: ['a', 's', 'd', 'f', 'j', 'k', 'l'],
    targetWpm: 9,
    drills: [
      { text: 'jkl; asdf jkl; asdf', hint: '先热身，双手来回归位。' },
      { text: 'a glass flask falls flat', hint: '五个词连打，手指不要跑偏。' },
      { text: 'all lads add a salad', hint: '最后一题，稳住节奏就通关。' },
    ],
  },
]

/** 内部 id 2：英文单词输入（+2，总 18 关） */
export const EXTRA_2: LessonSeed[] = [
  {
    title: '长句练习',
    subtitle: '把句子打长一点',
    kind: 'words',
    focusChars: ['t', 'h', 'e'],
    targetWpm: 14,
    drills: [
      { text: 'I like to read books', hint: '句子变长了，先保证每个词都对。' },
      { text: 'my cat can jump high', hint: '注意空格和字母顺序，别急。' },
      { text: 'we play games after school', hint: '一口气打完，手指不要离开键盘。' },
    ],
  },
  {
    title: '单词森林大挑战',
    subtitle: '完成它，进入符号火山',
    kind: 'words',
    boss: true,
    focusChars: ['w', 'o', 'r', 'd'],
    targetWpm: 15,
    drills: [
      { text: 'the quick brown fox', hint: '这句话里有好几个高频词，稳住。' },
      { text: 'you and I can type well', hint: '大写 I 要按住 Shift。' },
      { text: 'we can read and write every day', hint: '最后一题，打完就是单词高手啦。' },
    ],
  },
]

/** 内部 id 3：代码符号输入（+4，总 18 关） */
export const EXTRA_3: LessonSeed[] = [
  {
    title: '井号与美元符',
    subtitle: '代码里的两个 Shift 符号',
    kind: 'symbols',
    focusChars: ['#', '$'],
    targetWpm: 9,
    drills: [
      { text: '# # $ $', hint: '# 是 Shift+3、$ 是 Shift+4，都用左手。' },
      { text: '#$ #$ #$', hint: '两个符号换着来，Shift 一直按住。' },
      { text: '# $ # $ #', hint: '敲完记得松开 Shift，手指回基准行。' },
    ],
  },
  {
    title: '下划线与与号',
    subtitle: '变量名里的小横线',
    kind: 'symbols',
    focusChars: ['_', '&'],
    targetWpm: 9,
    drills: [
      { text: '_ _ & &', hint: '_ 是 Shift+减号，& 是 Shift+7。' },
      { text: '_& _& _&', hint: '一个用右手小指，一个用右手食指。' },
      { text: 'a_b a_b', hint: '下划线常出现在变量名中间，别打成减号。' },
    ],
  },
  {
    title: '符号连打',
    subtitle: '括号、等号、分号连着来',
    kind: 'symbols',
    focusChars: ['(', ')', ';'],
    targetWpm: 9,
    drills: [
      { text: '() ;', hint: '括号和分号是代码里最常见的组合。' },
      { text: '[] {} () ;', hint: '三组括号轮一遍，最后收一个分号。' },
      { text: '= ; = ;', hint: '等号和分号都归右手小指。' },
    ],
  },
  {
    title: '符号火山大挑战',
    subtitle: '完成它，进入代码工厂',
    kind: 'symbols',
    boss: true,
    focusChars: ['{', '}', '[', ']'],
    targetWpm: 9,
    drills: [
      { text: '# $ _ &', hint: '四个 Shift 符号连着来。' },
      { text: '[] {} () <>', hint: '四组括号排好队，一个都别漏。' },
      { text: 'a_b = 1; c = 2;', hint: '像真的代码一样，符号配着字母写。' },
    ],
  },
]

/** 内部 id 4：简单代码输入（+6，总 18 关；程序在 programsExtra.ts） */
export const EXTRA_4: LessonSeed[] = [
  {
    title: '分数加了加',
    subtitle: '用 += 把分数加上去',
    kind: 'code',
    focusChars: ['+', '=', ';'],
    targetWpm: 9,
    drills: [
      { text: 'int score = 5;', hint: '先给分数一个盒子，里面放 5。' },
      { text: 'score += 10;', hint: '+= 是"加上去"：等于 score = score + 10。' },
      { text: 'cout << "分数是";', hint: '中文用拼音打：fen shu shi。' },
      { text: 'cout << score;', hint: '把加完的分数说出来。' },
    ],
  },
  {
    title: '分数等级',
    subtitle: '三个分支怎么走',
    kind: 'code',
    focusChars: ['{', '}', ';'],
    targetWpm: 9,
    drills: [
      { text: 'int score = 12;', hint: '先给分数一个盒子。' },
      { text: 'if (score >= 10) {', hint: '先判断是不是大于等于 10。' },
      { text: 'cout << "太棒了";', hint: '够 10 分就说这句：tai bang le。' },
      { text: '} else if (score >= 5) {', hint: 'else if 是"否则再看看另一个条件"。' },
      { text: 'cout << "下次再来";', hint: '不够 10 分就说这句：xia ci zai lai。' },
    ],
  },
  {
    title: '数星星',
    subtitle: '用循环把星星加起来',
    kind: 'code',
    focusChars: ['+', '=', '<'],
    targetWpm: 9,
    drills: [
      { text: 'int stars = 0;', hint: '准备一个盒子数星星，从 0 开始。' },
      { text: 'for (int i = 0; i < 5; i++) {', hint: '转五圈，每圈加一颗星。' },
      { text: 'stars += 1;', hint: '每转一圈就给星星数加一。' },
      { text: 'cout << "星星";', hint: '中文用拼音打：xing xing。' },
      { text: 'cout << stars;', hint: '最后把星星的数量说出来。' },
    ],
  },
  {
    title: '名字打印',
    subtitle: '让循环念你的名字',
    kind: 'code',
    focusChars: ['"', ';'],
    targetWpm: 9,
    drills: [
      { text: 'string name = "小侠";', hint: 'string 是装文字的盒子，中文用拼音打。' },
      { text: 'for (int i = 0; i < 3; i++) {', hint: '三圈就是念三遍。' },
      { text: 'cout << name;', hint: '把盒子里的名字说一遍。' },
      { text: 'cout << endl;', hint: 'endl 让每一遍都换到新的一行。' },
    ],
  },
  {
    title: '分数翻倍',
    subtitle: '让分数一直翻倍',
    kind: 'code',
    focusChars: ['*', '='],
    targetWpm: 9,
    drills: [
      { text: 'int score = 1;', hint: '从 1 分开始。' },
      { text: 'while (score < 10) {', hint: '只要还没到 10 分，就一直翻倍。' },
      { text: 'cout << score;', hint: '每一圈都报一次当前的分数。' },
      { text: 'score = score * 2;', hint: '乘以 2 就是翻倍，别漏掉这一句。' },
    ],
  },
  {
    title: '代码工厂大挑战',
    subtitle: '写一个完整的小程序',
    kind: 'code',
    boss: true,
    focusChars: ['#', '{', '}', ';'],
    targetWpm: 9,
    drills: [
      { text: '#include <iostream>', hint: '一切从工具箱开始。' },
      { text: 'int main() {', hint: '程序从这里跑起来。' },
      { text: 'int sum = 0;', hint: '准备一个盒子装总和。' },
      { text: 'for (int i = 1; i <= 4; i++) {', hint: 'i 从 1 数到 4，注意是小于等于。' },
      { text: 'sum = sum + i;', hint: '把每一圈的数字加进总和。' },
      { text: 'cout << "总分是";', hint: '中文用拼音打：zong fen shi。' },
      { text: 'cout << sum;', hint: '把最后的总和说出来。' },
    ],
  },
]

/** 内部 id 5：小游戏编程（+2，总 12 关；程序在 programsExtra.ts） */
export const EXTRA_5: LessonSeed[] = [
  {
    title: '烟花大会',
    subtitle: '让烟花一圈圈炸开',
    kind: 'game',
    focusChars: ['(', ')', ';'],
    targetWpm: 10,
    drills: [
      { text: 'int r = 10;', hint: 'r 是烟花的半径，先设小一点。' },
      { text: 'for (int i = 0; i < 6; i++) {', hint: '六圈就是六帧画面。' },
      { text: 'circle(160, 100, r);', hint: '在舞台中间画一个圆，半径用 r。' },
      { text: 'r = r + 12;', hint: '每转一圈半径变大，烟花就炸开了。' },
      { text: 'wait(0.2);', hint: '停一下，看得清每一圈。' },
    ],
  },
  {
    title: '我的第一个小游戏',
    subtitle: '把标题、星星和分数拼起来',
    kind: 'game',
    boss: true,
    focusChars: ['"', '+', ';'],
    targetWpm: 10,
    drills: [
      { text: 'int score = 0;', hint: '游戏一开始，分数是 0。' },
      { text: 'text("我的游戏", 110, 30);', hint: '先写标题：wo de you xi。' },
      { text: 'for (int i = 0; i < 5; i++) {', hint: '五颗星星排队出现。' },
      { text: 'star(30 + i * 60, 100);', hint: '每转一圈往右挪 60。' },
      { text: 'score = score + 20;', hint: '每出现一颗星，加 20 分。' },
      { text: 'text(score, 150, 180);', hint: '最后把总分写在舞台下方。' },
    ],
  },
]

/** 内部 id 6：中文打字（+4，总 24 关） */
export const EXTRA_6: LessonSeed[] = [
  {
    title: '成语·三心二意',
    subtitle: '两个新成语',
    kind: 'words',
    focusChars: ['三', '心', '二'],
    targetWpm: 7,
    drills: [
      { text: '三心二意', hint: 'san xin er yi，做事不专心就是这个成语。' },
      { text: '五颜六色', hint: 'wu yan liu se，形容颜色很多很漂亮。' },
      { text: '三心二意 五颜六色', hint: '两个成语连打，中间用拇指按空格。' },
    ],
  },
  {
    title: '数字歌',
    subtitle: '一二三四五六七八九十',
    kind: 'words',
    focusChars: ['六', '七', '八'],
    targetWpm: 7,
    drills: [
      { text: '一二三四五', hint: 'yi er san si wu。' },
      { text: '六七八九十', hint: 'liu qi ba jiu shi。' },
      { text: '一二三四五 六七八九十', hint: '十个数字连起来打一遍。' },
    ],
  },
  {
    title: '我和好朋友',
    subtitle: '用汉字写一句话',
    kind: 'words',
    focusChars: ['我', '和', '们'],
    targetWpm: 7,
    drills: [
      { text: '我们是好朋友', hint: 'wo men shi hao peng you。' },
      { text: '我和爸爸妈妈', hint: 'wo he ba ba ma ma。' },
      { text: '我和朋友一起读书', hint: 'wo he peng you yi qi du shu。' },
    ],
  },
  {
    title: '短文·春天',
    subtitle: '最后一关：把春天读出来',
    kind: 'words',
    boss: true,
    focusChars: ['春', '天', '花'],
    targetWpm: 7,
    drills: [
      { text: '春天来了。花开了，草绿了。', hint: 'chun tian lai le，hua kai le，cao lv le。' },
      { text: '小燕子飞回来了。', hint: 'xiao yan zi fei hui lai le。' },
      { text: '春天真美，我们都爱春天。', hint: 'chun tian zhen mei，wo men dou ai chun tian。' },
    ],
  },
]
