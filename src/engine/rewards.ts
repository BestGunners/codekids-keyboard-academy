/** 即时奖励的统一口径：星星换算能量（XP）、等级、连击里程碑。 */

export const XP_PER_STAR = 10
export const XP_PER_LEVEL = 100

export const COMBO_STEPS = [5, 10, 20, 30, 50]

export function xpFromStars(stars: number): number {
  return Math.max(0, stars) * XP_PER_STAR
}

export function levelFromXp(xp: number): number {
  return Math.floor(Math.max(0, xp) / XP_PER_LEVEL) + 1
}

export function xpToNextLevel(xp: number): { current: number; needed: number; ratio: number } {
  const safeXp = Math.max(0, xp)
  const current = safeXp % XP_PER_LEVEL
  return { current, needed: XP_PER_LEVEL, ratio: current / XP_PER_LEVEL }
}

export function isComboMilestone(streak: number): boolean {
  return COMBO_STEPS.includes(streak)
}

/** 连击的夸奖语：给孩子的即时反馈，越短越好。 */
export function comboCheer(streak: number): string {
  if (streak >= 50) return '无敌啦！'
  if (streak >= 30) return '超厉害！'
  if (streak >= 20) return '太强了！'
  if (streak >= 10) return '好快呀！'
  return '不错哦！'
}
