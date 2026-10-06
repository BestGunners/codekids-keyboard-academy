/**
 * 背景音乐的播放规则。
 *
 * 只有"没有在打字"的页面才放音乐：打字关（含开场倒计时、写代码时间）
 * 一律暂停，免得盖住按键音、打乱孩子的节奏。
 */
export function shouldPlayMusic(pathname: string): boolean {
  return !pathname.includes('/lesson/')
}
