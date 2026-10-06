/**
 * 设置与档案自测：验证声音设置、点击音效开关、档案修改与密码更改所需的数据能力。
 * 运行方式：node scripts/settings-selftest.ts
 * 注意：Node 环境没有 localStorage，控制台会出现 zustand persist 的提示，属于正常现象。
 */
import { AGE_OPTIONS, ageBandOf, useChildStore } from '../src/store/childStore.ts'
import { useSettingsStore } from '../src/store/settingsStore.ts'

let passed = 0
const failures: string[] = []

function check(name: string, condition: boolean, extra = '') {
  if (condition) {
    passed += 1
    console.log(`  ✅ ${name}`)
  } else {
    failures.push(`${name} ${extra}`)
    console.log(`  ❌ ${name} ${extra}`)
  }
}

console.log('\n1. 声音设置')
{
  const settings = useSettingsStore.getState()
  check('默认开启声音', settings.soundEnabled === true)
  check('默认开启全局点击音效', settings.clickSoundsEnabled === true)
  check('默认音量 0.8', Math.abs(settings.volume - 0.8) < 1e-9, String(settings.volume))
  check('默认显示模拟键盘', settings.keyboardVisible === true)

  useSettingsStore.getState().toggleKeyboard()
  check('模拟键盘开关可以翻转', useSettingsStore.getState().keyboardVisible === false)
  useSettingsStore.getState().toggleKeyboard()
  check('再点一次就恢复显示', useSettingsStore.getState().keyboardVisible === true)

  useSettingsStore.getState().toggleSound()
  check('静音开关可以翻转', useSettingsStore.getState().soundEnabled === false)
  useSettingsStore.getState().toggleSound()

  useSettingsStore.getState().toggleClickSounds()
  check('点击音效开关可以翻转', useSettingsStore.getState().clickSoundsEnabled === false)
  useSettingsStore.getState().toggleClickSounds()

  const setVolume = useSettingsStore.getState().setVolume
  setVolume(0.35)
  check('音量可以调到 35%', Math.abs(useSettingsStore.getState().volume - 0.35) < 1e-9)
  setVolume(2)
  check('音量上限被限制为 1', useSettingsStore.getState().volume === 1)
  setVolume(-1)
  check('音量下限被限制为 0', useSettingsStore.getState().volume === 0)
  setVolume(0.8)
}

console.log('\n2. 年龄与年龄段')
{
  check('年龄选项为 5-16 岁', AGE_OPTIONS[0] === 5 && AGE_OPTIONS[AGE_OPTIONS.length - 1] === 16 && AGE_OPTIONS.length === 12)
  check('5 岁属于 5-7 段', ageBandOf(5) === '5-7')
  check('7 岁属于 5-7 段', ageBandOf(7) === '5-7')
  check('8 岁属于 8-10 段', ageBandOf(8) === '8-10')
  check('10 岁属于 8-10 段', ageBandOf(10) === '8-10')
  check('11 岁属于 11-16 段', ageBandOf(11) === '11-16')
  check('16 岁属于 11-16 段', ageBandOf(16) === '11-16')
}

console.log('\n3. 档案修改（改名字 / 换头像 / 改图形密码）')
{
  useChildStore.setState({ profiles: [], currentChildId: null })
  const create = useChildStore.getState().addProfile
  const profile = create({
    nickname: '小雨',
    avatarId: 'fox',
    age: 8,
    pattern: ['🌟', '🚀', '🐟', '🍎'],
  })

  check('建档成功', useChildStore.getState().profiles.length === 1)

  const updateProfile = useChildStore.getState().updateProfile
  updateProfile(profile.id, { nickname: '小雨点', avatarId: 'unicorn' })
  const updated = useChildStore.getState().profiles[0]
  check('可以改名字', updated.nickname === '小雨点', updated.nickname)
  check('可以换头像', updated.avatarId === 'unicorn', updated.avatarId)
  check('原图形密码不受影响', updated.pattern.join('') === '🌟🚀🐟🍎')

  updateProfile(profile.id, { pattern: ['🎈', '🐝', '🌈', '🎵'] })
  check('可以改图形密码', useChildStore.getState().profiles[0].pattern.join('') === '🎈🐝🌈🎵')

  updateProfile(profile.id, { nickname: '   ' })
  check('空白名字不会覆盖原名字', useChildStore.getState().profiles[0].nickname === '小雨点')

  useChildStore.getState().login(profile.id)
  check('可以登录', useChildStore.getState().currentChildId === profile.id)
  useChildStore.getState().logout()
  check('可以退出', useChildStore.getState().currentChildId === null)

  useChildStore.getState().removeProfile(profile.id)
  check('可以删除档案', useChildStore.getState().profiles.length === 0)
}

console.log('\n4. 密码校验逻辑（改密码第一步要用）')
{
  const stored = ['🌟', '🚀', '🐟', '🍎']
  const same = (input: string[]) =>
    stored.length === input.length && stored.every((icon, index) => icon === input[index])

  check('顺序一致才算正确', same(['🌟', '🚀', '🐟', '🍎']))
  check('顺序不同就不通过', !same(['🚀', '🌟', '🐟', '🍎']))
  check('位数不同不通过', !same(['🌟', '🚀', '🐟']))
}

console.log(`\n结果：${passed} 项通过，${failures.length} 项失败`)
if (failures.length > 0) {
  failures.forEach((item) => console.log(` - ${item}`))
  process.exit(1)
}
console.log('设置与档案自测全部通过 🎉')
