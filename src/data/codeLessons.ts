import type { LessonSeed } from '@/data/courses'

/**
 * 岛 4「代码工厂」和岛 5「游戏岛」的全部关卡内容（第 28 轮重做）。
 *
 * 设计原则：
 * 1. 练习题就是这一关程序里的真代码：孩子敲完题目，其实已经写出了能跑的程序；
 * 2. 岛 4 的效果在「屏幕」上：数字会变、星星塔会一层层长高、倒计时会数到发射；
 * 3. 岛 5 的效果在「舞台」上：clear() 擦掉上一帧 + wait() 停一下 = 一帧一帧的动画，
 *    每一关最后都能看到会动的画面（星星飞过、小球弹跳、地鼠冒头、赛跑、小蛇爬）；
 * 4. 每关 5-8 道题，比原来多一倍，让孩子多敲一点、多练一点。
 */

/** 岛 4：简单代码输入（第 1-3 关） */
export const STAGE_4_SEEDS: LessonSeed[] = [
  {
    title: '我的第一行',
    subtitle: '让屏幕跟你打招呼',
    kind: 'code',
    focusChars: ['#', '<', '>', ';', '"'],
    targetWpm: 7,
    drills: [
      { text: '#include <iostream>', hint: '# 是 Shift + 3，尖括号在逗号和句点上面。' },
      { text: 'int main() {', hint: 'main 是程序的起点，电脑从这里开始跑。' },
      { text: 'cout << "你好";', hint: '引号里的中文用拼音打：ni hao。' },
      { text: 'cout << "我是小侠";', hint: '这一句的拼音是 wo shi xiao xia。' },
      { text: 'cout << endl;', hint: 'endl 负责换行，让下一句话新起一行。' },
      { text: 'return 0;', hint: '写上面这句收工，程序就跑完了。' },
    ],
  },
  {
    title: '数字盒子',
    subtitle: '把分数装进盒子再说出来',
    kind: 'code',
    focusChars: ['=', ';', '"'],
    targetWpm: 8,
    drills: [
      { text: 'int score = 10;', hint: 'int 是装整数的盒子，score 是它的小名。' },
      { text: 'cout << score;', hint: '把盒子里的数字说给屏幕听。' },
      { text: 'score = score + 5;', hint: '先算右边，再把结果装回盒子里。' },
      { text: 'cout << score;', hint: '再看一眼，盒子里的数字变大了。' },
      { text: 'cout << "太棒了";', hint: '中文要自己用拼音打：tai bang le。' },
    ],
  },
  {
    title: '听你说',
    subtitle: '让程序记住你输入的数字',
    kind: 'code',
    focusChars: ['=', ';', '<', '>'],
    targetWpm: 8,
    drills: [
      { text: 'int age;', hint: '先准备一个空盒子，里面还没装东西。' },
      { text: 'cin >> age;', hint: 'cin 是耳朵，把你输入的数字收进盒子。' },
      { text: 'cout << "我今年";', hint: '这句话的拼音是 wo jin nian。' },
      { text: 'cout << age;', hint: '把刚收到的年龄说出来。' },
      { text: 'cout << "岁";', hint: '最后一个字的拼音是 sui。' },
    ],
  },
]

/** 岛 4：第 4-12 关 */
export const STAGE_4_TAIL: LessonSeed[] = [
  {
    title: '岔路口',
    subtitle: '条件成立才走这条路',
    kind: 'code',
    focusChars: ['>', '(', ')', '{', '}', ';'],
    targetWpm: 9,
    drills: [
      { text: 'int score = 12;', hint: '先给分数一个盒子，里面放 12。' },
      { text: 'if (score > 10) {', hint: 'if 后面写条件，成立才进小屋。' },
      { text: 'cout << "过关啦";', hint: '中文用拼音打：guo guan la。' },
      { text: '} else {', hint: '先关掉上一间小屋，再打开另一间。' },
      { text: 'cout << "再来一次";', hint: '拼音是 zai lai yi ci。' },
    ],
  },
  {
    title: '两条路',
    subtitle: '大于等于 8 岁就是大孩子',
    kind: 'code',
    focusChars: ['=', '>', '{', '}', ';'],
    targetWpm: 9,
    drills: [
      { text: 'int age = 9;', hint: '把 9 装进年龄盒子，等下要拿它比一比。' },
      { text: 'if (age >= 8) {', hint: '大于等于要写两个符号：> 和 =。' },
      { text: 'cout << "大孩子";', hint: '条件成立才说这句：da hai zi。' },
      { text: '} else {', hint: '条件不成立就走到这里。' },
      { text: 'cout << "小孩子";', hint: '拼音是 xiao hai zi。' },
    ],
  },
  {
    title: '星星塔',
    subtitle: '用两层循环搭一座星号塔',
    kind: 'code',
    focusChars: ['(', ')', ';', '*'],
    targetWpm: 8,
    drills: [
      { text: 'for (int i = 1; i < 5; i++) {', hint: 'i 从 1 数到 4，一共转四圈。' },
      { text: 'for (int j = 0; j < i; j++) {', hint: '里面这层转 i 次，外面变大它就变大。' },
      { text: 'cout << "*";', hint: '每转一圈就画一颗小星星。' },
      { text: 'cout << endl;', hint: '一层画完要换行，塔才立得起来。' },
      { text: 'return 0;', hint: '程序跑完记得收工。' },
    ],
  },
  {
    title: '倒数发射',
    subtitle: '一边数数一边判断',
    kind: 'code',
    focusChars: ['=', '-', ';', '{'],
    targetWpm: 8,
    drills: [
      { text: 'int t = 3;', hint: 't 是倒计时的数字，从 3 开始。' },
      { text: 'while (t > 0) {', hint: '只要 t 还大于 0，就一直转圈。' },
      { text: 'cout << t;', hint: '把现在的数字说出来。' },
      { text: 't = t - 1;', hint: '每转一圈减 1，不然会停不下来。' },
      { text: 'cout << "发射";', hint: '中文用拼音打：fa she。' },
    ],
  },
  {
    title: '打包机器',
    subtitle: '把加法打包成一个函数',
    kind: 'code',
    focusChars: ['(', ')', ',', '{', ';'],
    targetWpm: 8,
    drills: [
      { text: 'int add(int a, int b) {', hint: '圆括号里是它需要的两样材料。' },
      { text: 'return a + b;', hint: '把算好的结果送回给叫它的地方。' },
      { text: 'int sum = add(3, 4);', hint: '叫它一次，把结果装进 sum。' },
      { text: 'cout << "3加4等于";', hint: '中文用拼音打：jia deng yu。' },
      { text: 'cout << sum;', hint: '把结果说出来看看对不对。' },
      { text: 'cout << add(10, 20);', hint: '再叫它一次，换成 10 和 20。' },
    ],
  },
  {
    title: '会变的数字',
    subtitle: '让电脑掷一次骰子',
    kind: 'code',
    focusChars: ['#', '<', '>', '%', ';'],
    targetWpm: 8,
    drills: [
      { text: '#include <cstdlib>', hint: '先请随机数工具箱进来。' },
      { text: 'int dice = rand() % 6 + 1;', hint: '% 6 让结果落在 0 到 5，再加 1 就是 1 到 6。' },
      { text: 'cout << "掷骰子：";', hint: '中文用拼音打：zhi tou zi。' },
      { text: 'cout << dice;', hint: '把这一次的点数说出来。' },
      { text: 'cout << endl;', hint: '换一行，方便多看几次结果。' },
    ],
  },
  {
    title: '一排格子',
    subtitle: '把好几个数字放进一排',
    kind: 'code',
    focusChars: ['[', ']', '{', '}', ';'],
    targetWpm: 8,
    drills: [
      { text: 'int scores[3] = {3, 5, 7};', hint: '方括号里写这一排能放几个数字。' },
      { text: 'int total = 0;', hint: '再准备一个盒子装总数。' },
      { text: 'for (int i = 0; i < 3; i++) {', hint: '转三圈，把三个格子都看一遍。' },
      { text: 'total = total + scores[i];', hint: '每一圈把一个格子加到总数里。' },
      { text: 'cout << "总分是";', hint: '中文用拼音打：zong fen shi。' },
      { text: 'cout << total;', hint: '把最后算出来的总数说出来。' },
    ],
  },
  {
    title: '猜数字',
    subtitle: '把学过的东西拼成一个游戏',
    kind: 'code',
    focusChars: ['=', '!', '>', '<', ';'],
    targetWpm: 9,
    drills: [
      { text: 'int secret = 7;', hint: '先把秘密数字藏进盒子。' },
      { text: 'int guess = 0;', hint: '再准备一个盒子装玩家猜的数。' },
      { text: 'while (guess != secret) {', hint: '没猜对就一直转圈，!= 表示不相等。' },
      { text: 'cin >> guess;', hint: '听玩家猜的数字。' },
      { text: 'if (guess > secret) {', hint: '猜大了要提醒一下。' },
      { text: 'cout << "太大了";', hint: '中文用拼音打：tai da le。' },
      { text: 'cout << "猜对啦";', hint: '最后说一句庆祝的话：cai dui la。' },
    ],
  },
  {
    title: '代码综合练习',
    subtitle: '把学过的代码拼一拼',
    kind: 'code',
    focusChars: ['#', '<', '>', '{', '}', ';'],
    targetWpm: 8,
    drills: [
      { text: '#include <iostream>', hint: '一切从工具箱开始。' },
      { text: 'int main() {', hint: '你的程序从这里跑起来。' },
      { text: 'for (int i = 1; i < 4; i++) {', hint: '一共三轮，从第 1 名数到第 3 名。' },
      { text: 'cout << "第";', hint: '第 的拼音是 di。' },
      { text: 'cout << i;', hint: '把这一轮的号码说出来。' },
      { text: 'cout << "名，好棒！";', hint: '拼音是 ming hao bang。' },
      { text: 'cout << "全部完成！";', hint: '拼音是 quan bu wan cheng。' },
    ],
  },
]

/** 岛 5：小游戏编程（第 1-3 关） */
export const STAGE_5_SEEDS: LessonSeed[] = [
  {
    title: '会跑的星星',
    subtitle: '让星星一颗接一颗亮起来',
    kind: 'game',
    focusChars: ['(', ')', ';', '*'],
    targetWpm: 8,
    drills: [
      { text: 'clear();', hint: 'clear() 先把舞台擦干净，再开始画。' },
      { text: 'color("黄色");', hint: 'color 换颜色，中文颜色名用拼音打。' },
      { text: 'for (int i = 0; i < 5; i++) {', hint: '转五圈，就是五颗星星。' },
      { text: 'star(40 + i * 55, 70);', hint: 'i 每转一圈变大，星星就往右挪一点。' },
      { text: 'wait(0.25);', hint: '每画一颗就停一下，才能看出一颗颗亮。' },
    ],
  },
  {
    title: '会跳的小球',
    subtitle: '擦掉上一帧，小球就动起来了',
    kind: 'game',
    focusChars: ['=', '+', '-', ';'],
    targetWpm: 9,
    drills: [
      { text: 'int ballY = 30;', hint: 'ballY 记住小球现在的高度。' },
      { text: 'int step = 25;', hint: 'step 是一次挪多远，负号就是往上弹。' },
      { text: 'if (ballY > 150) {', hint: '掉到底部就把方向改成往上。' },
      { text: 'step = -25;', hint: '负号让高度变小，小球就往上走。' },
      { text: 'ballY = ballY + step;', hint: '每一步都改变小球的位置。' },
      { text: 'circle(160, ballY, 14);', hint: '在舞台中间画一个圆就是小球。' },
      { text: 'wait(0.2);', hint: '停一下，下一帧擦掉重画就动起来了。' },
    ],
  },
  {
    title: '石头剪刀布',
    subtitle: '用图形比出胜负',
    kind: 'game',
    focusChars: ['=', '"', '{', ';'],
    targetWpm: 9,
    drills: [
      { text: 'string me = "石头";', hint: 'string 是装文字的盒子，中文用拼音打。' },
      { text: 'string you = "剪刀";', hint: '电脑出的那一手也放进盒子。' },
      { text: 'color("橙色");', hint: '下面的图形都会用这个颜色。' },
      { text: 'circle(90, 100, 30);', hint: '三个数字是：横坐标、纵坐标、半径。' },
      { text: 'rect(200, 70, 60, 60);', hint: '方块要写左上角坐标，再加宽和高。' },
      { text: 'if (me != you) {', hint: '两边不一样就算赢了。' },
      { text: 'text("你赢了", 120, 180);', hint: '文字也能写在舞台上，拼音 ni ying le。' },
    ],
  },
]

/** 岛 5：第 4-10 关 */
export const STAGE_5_TAIL: LessonSeed[] = [
  {
    title: '键盘反应王',
    subtitle: '按 1 就放一串礼花',
    kind: 'game',
    focusChars: ['=', '"', ';', '(', ')'],
    targetWpm: 9,
    drills: [
      { text: 'string k = key();', hint: 'key() 读你按下的键，写在下面的输入框里。' },
      { text: 'if (k == "1") {', hint: '按的是一，就放礼花；按别的就画大圆。' },
      { text: 'for (int i = 0; i < 3; i++) {', hint: '三圈就是三颗星星。' },
      { text: 'star(80 + i * 70, 90);', hint: '每次往右挪一点，星星排队跳出来。' },
      { text: 'wait(0.25);', hint: '每跳一颗停一下，看清楚它落在哪。' },
      { text: 'circle(160, 100, 40);', hint: '按别的键时走 else，画一个大圆。' },
    ],
  },
  {
    title: '打地鼠',
    subtitle: '地鼠从随机的洞里冒出来',
    kind: 'game',
    focusChars: ['%', '+', ';', '('],
    targetWpm: 9,
    drills: [
      { text: 'int score = 0;', hint: '分数从 0 开始数。' },
      { text: 'for (int i = 0; i < 5; i++) {', hint: '地鼠一共冒出来五次。' },
      { text: 'int x = rand() % 260 + 30;', hint: 'rand() 让每次出现的位置都不一样。' },
      { text: 'circle(x, 150, 20);', hint: '在洞口画一个棕色圆就是地鼠。' },
      { text: 'score = score + 1;', hint: '冒出来一只，分数就加一。' },
      { text: 'text(score, 20, 30);', hint: '把分数写在舞台左上角。' },
      { text: 'wait(0.3);', hint: '停一下，再换下一个洞口。' },
    ],
  },
  {
    title: '赛跑比赛',
    subtitle: '两个方块比谁跑得快',
    kind: 'game',
    focusChars: ['=', '+', ';', '('],
    targetWpm: 9,
    drills: [
      { text: 'int redX = 0;', hint: 'redX 记住红队跑到哪儿了。' },
      { text: 'int blueX = 0;', hint: 'blueX 是蓝队的位置，也从 0 开始。' },
      { text: 'for (int i = 0; i < 8; i++) {', hint: '八圈就是八帧画面。' },
      { text: 'redX = redX + 16;', hint: '红队每帧往前跑 16。' },
      { text: 'blueX = blueX + 11;', hint: '蓝队慢一点，每帧只跑 11。' },
      { text: 'rect(redX, 60, 24, 24);', hint: '两个方块就是两位选手。' },
      { text: 'text("红队赢了", 100, 175);', hint: '跑完在下面写结果：hong dui ying le。' },
    ],
  },
  {
    title: '小蛇出发',
    subtitle: '一排方块一起往前爬',
    kind: 'game',
    focusChars: ['[', ']', '{', '}', ';'],
    targetWpm: 8,
    drills: [
      { text: 'int snake[3] = {40, 70, 100};', hint: '一排三个数字就是小蛇的三节身体。' },
      { text: 'int count = 0;', hint: 'count 数一数小蛇走了几步。' },
      { text: 'while (count < 5) {', hint: '走五步，每一步都往前挪一点。' },
      { text: 'clear();', hint: '每走一步先擦掉上一帧。' },
      { text: 'int x = snake[i] + count * 20;', hint: '算出这一节身体现在在什么位置。' },
      { text: 'rect(x, 90, 24, 24);', hint: '在算好的位置画一节身体。' },
      { text: 'star(280, 102);', hint: '前面那颗星星是小蛇的午饭。' },
      { text: 'wait(0.25);', hint: '停下来让眼睛跟得上。' },
    ],
  },
  {
    title: '星星发射器',
    subtitle: '把速度改成几就画几颗星',
    kind: 'game',
    focusChars: ['=', '+', ';', '('],
    targetWpm: 9,
    drills: [
      { text: 'int speed = 5;', hint: '这个数字由你决定，改成 8 就有八颗星。' },
      { text: 'int x = 10;', hint: 'x 是第一颗星星的位置。' },
      { text: 'for (int i = 0; i < speed; i++) {', hint: '转几圈由 speed 说了算。' },
      { text: 'star(x, 70);', hint: '在这个位置画一颗星星。' },
      { text: 'x = x + 45;', hint: '下一颗星星往右挪 45。' },
      { text: 'wait(0.2);', hint: '一颗一颗出现，看得更清楚。' },
    ],
  },
  {
    title: '接住小球',
    subtitle: '一边接球一边计分',
    kind: 'game',
    focusChars: ['=', '+', ';', '('],
    targetWpm: 9,
    drills: [
      { text: 'int score = 0;', hint: '接住一次就加分，先记 0。' },
      { text: 'int ballX = 150;', hint: 'ballX 是小球的横向位置。' },
      { text: 'int ballY = 40;', hint: 'ballY 是小球离顶部有多远。' },
      { text: 'for (int i = 0; i < 5; i++) {', hint: '小球会掉下来五次。' },
      { text: 'rect(110 + i * 22, 175, 70, 14);', hint: '下面的长条是接球板，它会跟着跑。' },
      { text: 'circle(ballX, ballY, 10);', hint: '小球一边往下掉，一边往右飘。' },
      { text: 'ballX = ballX + 12;', hint: '每丢掉一帧，小球就往右挪一点。' },
      { text: 'text(score, 260, 30);', hint: '把分数写在右上角。' },
    ],
  },
  {
    title: '分数和星星',
    subtitle: '把标题、动画和分数拼起来',
    kind: 'game',
    focusChars: ['=', '"', '+', ';'],
    targetWpm: 9,
    drills: [
      { text: 'int score = 0;', hint: '游戏一开始，分数是 0。' },
      { text: 'text("我的游戏", 110, 30);', hint: '先写标题：wo de you xi。' },
      { text: 'for (int i = 0; i < 4; i++) {', hint: '四颗星星排队出现。' },
      { text: 'star(40 + i * 60, 100);', hint: '每转一圈往右挪 60。' },
      { text: 'score = score + 25;', hint: '每出现一颗星，加 25 分。' },
      { text: 'wait(0.25);', hint: '停一下，看得出星星是一颗颗来的。' },
      { text: 'text(score, 140, 180);', hint: '最后把总分写在下面。' },
    ],
  },
]
