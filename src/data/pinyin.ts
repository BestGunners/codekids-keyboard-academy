/**
 * 拼音表：代码和课文里的中文让孩子自己用拼音打出来（不用切系统输入法）。
 * 缺字会在内容自测里被拦住，所以宁多勿少。
 */
export const PINYIN_BY_CHAR: Record<string, string> = {
  // 第一册识字与常用字
  你: 'ni',
  好: 'hao',
  我: 'wo',
  他: 'ta',
  人: 'ren',
  天: 'tian',
  地: 'di',
  口: 'kou',
  耳: 'er',
  目: 'mu',
  手: 'shou',
  足: 'zu',
  站: 'zhan',
  坐: 'zuo',
  日: 'ri',
  月: 'yue',
  水: 'shui',
  火: 'huo',
  山: 'shan',
  石: 'shi',
  田: 'tian',
  禾: 'he',
  云: 'yun',
  对: 'dui',
  雨: 'yu',
  雪: 'xue',
  风: 'feng',
  // 四季与词语
  春: 'chun',
  夏: 'xia',
  秋: 'qiu',
  冬: 'dong',
  霜: 'shuang',
  花: 'hua',
  朵: 'duo',
  鸟: 'niao',
  小: 'xiao',
  大: 'da',
  // 成语与数字
  一: 'yi',
  十: 'shi',
  全: 'quan',
  美: 'mei',
  心: 'xin',
  意: 'yi',
  守: 'shou',
  株: 'zhu',
  待: 'dai',
  兔: 'tu',
  画: 'hua',
  蛇: 'she',
  添: 'tian',
  // 古诗
  床: 'chuang',
  前: 'qian',
  明: 'ming',
  光: 'guang',
  疑: 'yi',
  是: 'shi',
  上: 'shang',
  鹅: 'e',
  曲: 'qu',
  项: 'xiang',
  向: 'xiang',
  歌: 'ge',
  眠: 'mian',
  不: 'bu',
  觉: 'jue',
  晓: 'xiao',
  处: 'chu',
  闻: 'wen',
  啼: 'ti',
  // 名言与其他
  读: 'du',
  书: 'shu',
  破: 'po',
  万: 'wan',
  卷: 'juan',
  下: 'xia',
  笔: 'bi',
  如: 'ru',
  有: 'you',
  神: 'shen',
  // 界面与编程课里用到的
  赢: 'ying',
  啦: 'la',
  了: 'le',
  太: 'tai',
  猜: 'cai',
  完: 'wan',
  成: 'cheng',
  猫: 'mao',
  的: 'de',
  游: 'you',
  戏: 'xi',
  剪: 'jian',
  刀: 'dao',
  孩: 'hai',
  子: 'zi',
  头: 'tou',
  棒: 'bang',
  // 一年级识字扩充
  金: 'jin',
  木: 'mu',
  土: 'tu',
  二: 'er',
  三: 'san',
  四: 'si',
  五: 'wu',
  左: 'zuo',
  右: 'you',
  后: 'hou',
  里: 'li',
  外: 'wai',
  多: 'duo',
  长: 'chang',
  短: 'duan',
  高: 'gao',
  矮: 'ai',
  树: 'shu',
  虫: 'chong',
  // 词语
  爸: 'ba',
  妈: 'ma',
  朋: 'peng',
  友: 'you',
  狗: 'gou',
  鱼: 'yu',
  // 古诗
  举: 'ju',
  低: 'di',
  故: 'gu',
  乡: 'xiang',
  白: 'bai',
  毛: 'mao',
  浮: 'fu',
  绿: 'lv',
  红: 'hong',
  掌: 'zhang',
  拨: 'bo',
  清: 'qing',
  波: 'bo',
  夜: 'ye',
  来: 'lai',
  声: 'sheng',
  落: 'luo',
  知: 'zhi',
  锄: 'chu',
  当: 'dang',
  午: 'wu',
  汗: 'han',
  滴: 'di',
  谁: 'shui',
  盘: 'pan',
  餐: 'can',
  粒: 'li',
  皆: 'jie',
  辛: 'xin',
  苦: 'ku',
  // 课文短文
  初: 'chu',
  性: 'xing',
  本: 'ben',
  善: 'shan',
  近: 'jin',
  习: 'xi',
  远: 'yuan',
  早: 'zao',
  阳: 'yang',
  升: 'sheng',
  起: 'qi',
  在: 'zai',
  飞: 'fei',
  开: 'kai',
  叶: 'ye',
  黄: 'huang',
  很: 'hen',
  少: 'shao',
  青: 'qing',
  草: 'cao',
  望: 'wang',
  思: 'si',
  之: 'zhi',
  相: 'xiang',
  中: 'zhong',
  // 岛 4 / 岛 5 编程关里会出现的字
  键: 'jian',
  侠: 'xia',
  代: 'dai',
  码: 'ma',
  工: 'gong',
  厂: 'chang',
  欢: 'huan',
  迎: 'ying',
  到: 'dao',
  今: 'jin',
  年: 'nian',
  岁: 'sui',
  过: 'guo',
  关: 'guan',
  再: 'zai',
  次: 'ci',
  发: 'fa',
  射: 'she',
  加: 'jia',
  等: 'deng',
  于: 'yu',
  掷: 'zhi',
  骰: 'tou',
  总: 'zong',
  分: 'fen',
  第: 'di',
  名: 'ming',
  部: 'bu',
  队: 'dui',
  星: 'xing',
  流: 'liu',
  跳: 'tiao',
  接: 'jie',
  住: 'zhu',
  器: 'qi',
  洞: 'dong',
  鼠: 'shu',
  快: 'kuai',
  乐: 'le',
  色: 'se',
  橙: 'cheng',
  蓝: 'lan',
  紫: 'zi',
  棕: 'zong',
  粉: 'fen',
  黑: 'hei',
  // 加课新增的字
  数: 'shu',
  颜: 'yan',
  六: 'liu',
  七: 'qi',
  八: 'ba',
  九: 'jiu',
  们: 'men',
  和: 'he',
  燕: 'yan',
  真: 'zhen',
  都: 'dou',
  爱: 'ai',
  回: 'hui',
  // 课文长句岛新增的字
  弯: 'wan',
  船: 'chuan',
  两: 'liang',
  尖: 'jian',
  只: 'zhi',
  看: 'kan',
  见: 'jian',
  闪: 'shan',
  个: 'ge',
  家: 'jia',
  林: 'lin',
  河: 'he',
  泥: 'ni',
  种: 'zhong',
  牛: 'niu',
  边: 'bian',
  群: 'qun',
  鸭: 'ya',
  也: 'ye',
  片: 'pian',
  从: 'cong',
  计: 'ji',
  晨: 'chen',
  寸: 'cun',
  阴: 'yin',
  写: 'xie',
  生: 'sheng',
  学: 'xue',
  儿: 'er',
  字: 'zi',
}

/**
 * 中文标点：用英文键盘上对应的键敲出来（和真实输入法一致）。
 * 例如打「，」就按逗号键，打「。」就按句点键。
 */
export const CHINESE_PUNCTUATION_KEY: Record<string, string> = {
  '，': ',',
  '。': '.',
  '？': '?',
  '！': '!',
  '、': ',',
  '：': ':',
  '；': ';',
  '“': '"',
  '”': '"',
  '《': '<',
  '》': '>',
}

export interface PinyinSegment {
  /** 这一段中文在整句里的起始下标 */
  start: number
  /** 有几个汉字 */
  length: number
  /** 汉字本身，例如「你好」 */
  text: string
  /** 要敲的拼音，例如「nihao」 */
  pinyin: string
}

export function isChineseChar(char: string): boolean {
  return /[\u4e00-\u9fa5]/.test(char)
}

export function pinyinOf(text: string): string {
  return [...text].map((char) => PINYIN_BY_CHAR[char] ?? '').join('')
}

/** 有哪些汉字还没有拼音 */
export function missingPinyin(text: string): string[] {
  const missing = new Set<string>()
  for (const char of text) {
    if (isChineseChar(char) && !PINYIN_BY_CHAR[char]) missing.add(char)
  }
  return [...missing]
}

/** 有哪些中文标点还没有对应的按键 */
export function missingPunctuation(text: string): string[] {
  const missing = new Set<string>()
  for (const char of text) {
    const isCjkPunctuation = /[\u3000-\u303f\uff00-\uffef]/.test(char)
    if (isCjkPunctuation && !CHINESE_PUNCTUATION_KEY[char]) missing.add(char)
  }
  return [...missing]
}

/** 找出一句话里所有连续的中文段落 */
export function findPinyinSegments(text: string): PinyinSegment[] {
  const segments: PinyinSegment[] = []
  let index = 0

  while (index < text.length) {
    if (!isChineseChar(text[index])) {
      index += 1
      continue
    }

    let end = index
    while (end < text.length && isChineseChar(text[end])) end += 1

    const segmentText = text.slice(index, end)
    segments.push({
      start: index,
      length: end - index,
      text: segmentText,
      pinyin: pinyinOf(segmentText),
    })
    index = end
  }

  return segments
}