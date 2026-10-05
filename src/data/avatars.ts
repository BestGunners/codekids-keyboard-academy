export interface AvatarOption {
  id: string
  emoji: string
  name: string
  color: string
}

/** 儿童头像：用 emoji 起步，后续可替换为插画素材。 */
export const AVATARS: AvatarOption[] = [
  { id: 'fox', emoji: '🦊', name: '小狐狸', color: '#ffb35c' },
  { id: 'cat', emoji: '🐱', name: '小猫', color: '#f9a826' },
  { id: 'panda', emoji: '🐼', name: '熊猫', color: '#cbd5e1' },
  { id: 'rabbit', emoji: '🐰', name: '小兔子', color: '#f7c4d8' },
  { id: 'tiger', emoji: '🐯', name: '小老虎', color: '#ffb35c' },
  { id: 'koala', emoji: '🐨', name: '考拉', color: '#b9c9d6' },
  { id: 'lion', emoji: '🦁', name: '小狮子', color: '#ffcf6b' },
  { id: 'monkey', emoji: '🐵', name: '小猴子', color: '#e0a366' },
  { id: 'frog', emoji: '🐸', name: '小青蛙', color: '#8fd88f' },
  { id: 'penguin', emoji: '🐧', name: '企鹅', color: '#4f9cf9' },
  { id: 'turtle', emoji: '🐢', name: '小乌龟', color: '#5cc98a' },
  { id: 'octopus', emoji: '🐙', name: '章鱼哥', color: '#ef7bc0' },
  { id: 'unicorn', emoji: '🦄', name: '独角兽', color: '#a78bfa' },
  { id: 'dragon', emoji: '🐲', name: '小恐龙', color: '#6fd08c' },
  { id: 'dino', emoji: '🦖', name: '霸王龙', color: '#7bd389' },
  { id: 'robot', emoji: '🤖', name: '小机器人', color: '#46c9c0' },
  { id: 'alien', emoji: '👽', name: '外星人', color: '#9ad6a0' },
  { id: 'wizard', emoji: '🧙', name: '小魔法师', color: '#b39ddb' },
  { id: 'hero', emoji: '🦸', name: '小英雄', color: '#59a4ff' },
  { id: 'ninja', emoji: '🥷', name: '小忍者', color: '#94a3b8' },
  { id: 'astronaut', emoji: '🧑‍🚀', name: '航天员', color: '#8ec5ff' },
  { id: 'artist', emoji: '🧑‍🎨', name: '小画家', color: '#ffa6c1' },
  { id: 'donut', emoji: '🍩', name: '甜甜圈', color: '#f3b98f' },
  { id: 'strawberry', emoji: '🍓', name: '小草莓', color: '#ff8fa3' },
  { id: 'star', emoji: '🌟', name: '小星星', color: '#ffd95c' },
  { id: 'rocket', emoji: '🚀', name: '火箭', color: '#7fb4ff' },
]

export function getAvatar(id: string): AvatarOption {
  return AVATARS.find((avatar) => avatar.id === id) ?? AVATARS[0]
}

/** 图形密码图标池：孩子记「小狗-星星-火箭」比记密码容易。 */
export const PATTERN_ICONS: string[] = ['🌟', '🚀', '🐟', '🍎', '🎈', '🐝', '🌈', '🎵', '⚡', '🍄', '🐬', '🎁']