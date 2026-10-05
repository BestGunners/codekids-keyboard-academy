import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '@/components/common/Logo'
import { Icon } from '@/components/icons/Icon'
import { Modal } from '@/components/common/Modal'
import { SoundToggle } from '@/components/common/SoundToggle'
import { Mascot } from '@/components/mascot/Mascot'
import { AVATARS, PATTERN_ICONS, getAvatar } from '@/data/avatars'
import { sfx } from '@/engine/sfx'
import { AGE_OPTIONS, DEFAULT_AGE, useChildStore, type ChildProfile } from '@/store/childStore'
import { cn } from '@/utils/cn'

const PATTERN_LENGTH = 4

type Step = 'pick' | 'create' | 'pattern'

interface DraftProfile {
  nickname: string
  avatarId: string
  age: number
}

/**
 * 儿童登录：挑头像 + 点图形密码，全程不需要打字或填表。
 * 每点一个图案都会有一声音（音高逐个升高），删除档案会先弹确认气泡。
 */
export default function LoginPage() {
  const navigate = useNavigate()
  const profiles = useChildStore((state) => state.profiles)
  const addProfile = useChildStore((state) => state.addProfile)
  const login = useChildStore((state) => state.login)
  const removeProfile = useChildStore((state) => state.removeProfile)

  const [step, setStep] = useState<Step>(profiles.length > 0 ? 'pick' : 'create')
  const [draft, setDraft] = useState<DraftProfile>({
    nickname: '',
    avatarId: AVATARS[0].id,
    age: DEFAULT_AGE,
  })
  const [target, setTarget] = useState<ChildProfile | null>(null)
  const [pattern, setPattern] = useState<string[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<ChildProfile | null>(null)

  const clearPattern = () => {
    setPattern([])
    setMessage(null)
  }

  const pickIcon = (icon: string) => {
    // 音高随第几个图案升高，孩子听得出手感
    sfx.star(pattern.length)
    setMessage(null)
    setPattern((current) => (current.length >= PATTERN_LENGTH ? current : [...current, icon]))
  }

  const patternReady = pattern.length >= PATTERN_LENGTH

  const confirm = () => {
    if (pattern.length < PATTERN_LENGTH) {
      setMessage(`还差 ${PATTERN_LENGTH - pattern.length} 个图案`)
      return
    }

    if (target) {
      const matched =
        target.pattern.length === pattern.length &&
        target.pattern.every((icon, index) => icon === pattern[index])

      if (!matched) {
        sfx.oops()
        setMessage('再想想图形顺序～')
        setPattern([])
        return
      }

      sfx.badge()
      login(target.id)
      navigate('/map')
      return
    }

    const nickname = draft.nickname.trim() || '小键盘手'
    const profile = addProfile({ ...draft, nickname, pattern })
    sfx.badge()
    login(profile.id)
    navigate('/map')
  }

  const startLogin = (profile: ChildProfile) => {
    setTarget(profile)
    setStep('pattern')
    clearPattern()
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-4 py-6">
      <div className="flex items-center justify-between gap-3">
        <Logo size={40} />
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-sm font-extrabold text-ink-soft"
            onClick={() => {
              navigate('/')
            }}
          >
            <Icon name="back" size={14} /> 首页
          </button>
          <SoundToggle />
        </div>
      </div>

      {step === 'pick' ? (
        <div className="flex flex-col items-center gap-5">
          <Mascot mood="happy" size={92} />
          <h1 className="font-display text-3xl font-extrabold">你是谁呀？</h1>

          <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3">
            {profiles.map((profile) => {
              const avatar = getAvatar(profile.avatarId)
              return (
                <div
                  key={profile.id}
                  className="flex flex-col gap-3 rounded-kid border-b-4 border-brand-200 bg-white p-3 transition hover:-translate-y-1 hover:shadow-pop"
                >
                  <button
                    type="button"
                    onClick={() => startLogin(profile)}
                    className="flex flex-col items-center gap-2"
                  >
                    <span
                      className="flex h-16 w-16 items-center justify-center rounded-kid text-4xl"
                      style={{ backgroundColor: `${avatar.color}33` }}
                    >
                      {avatar.emoji}
                    </span>
                    <span className="text-lg font-extrabold">{profile.nickname}</span>
                    <span className="text-xs font-bold text-ink-soft">
                      {avatar.name} · {profile.age} 岁
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPendingDelete(profile)
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-2xl border-2 border-[#f6ccd7] bg-[#fff5f7] px-3 py-2 text-sm font-extrabold text-[#c2334c] transition hover:bg-[#ffe9ee] active:translate-y-[2px]"
                  >
                    <Icon name="trash" size={15} />
                    删除档案
                  </button>
                </div>
              )
            })}

            <button
              type="button"
              onClick={() => {
                setStep('create')
                setTarget(null)
                clearPattern()
              }}
              className="flex flex-col items-center justify-center gap-2 rounded-kid border-2 border-dashed border-brand-200 bg-white/60 px-3 py-4 text-4xl font-extrabold text-brand-700 transition hover:border-brand-400"
            >
              <Icon name="plus" size={26} className="text-brand-500" />
              <span className="text-sm font-extrabold">新朋友</span>
            </button>
          </div>
        </div>
      ) : null}

      {step === 'create' ? (
        <div className="flex flex-col items-center gap-5">
          <Mascot mood="cheer" size={92} />
          <h1 className="font-display text-3xl font-extrabold">欢迎新朋友！</h1>

          <div className="flex w-full max-w-2xl flex-col gap-5">
            <input
              value={draft.nickname}
              onChange={(event) =>
                setDraft((current) => ({ ...current, nickname: event.target.value }))
              }
              placeholder="我的名字（家长可以帮忙填）"
              maxLength={12}
              className="w-full rounded-kid border-2 border-brand-200 bg-white px-4 py-3 text-center text-xl font-extrabold outline-none focus:border-brand-400"
            />

            <div className="space-y-2">
              <div className="text-center text-sm font-extrabold text-ink-soft">选一个头像</div>
              <div className="grid grid-cols-5 gap-2 sm:grid-cols-7 lg:grid-cols-9">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    title={avatar.name}
                    aria-label={avatar.name}
                    onClick={() => {
                      setDraft((current) => ({ ...current, avatarId: avatar.id }))
                    }}
                    className={cn(
                      'flex aspect-square items-center justify-center rounded-xl border text-2xl transition sm:text-3xl',
                      draft.avatarId === avatar.id
                        ? 'anim-pop-in border-brand-500 bg-brand-50 shadow-pop'
                        : 'border-brand-200 bg-white hover:-translate-y-1',
                    )}
                  >
                    {avatar.emoji}
                  </button>
                ))}
              </div>
              <div className="text-center text-xs font-bold text-ink-soft">
                你选的是「{getAvatar(draft.avatarId).name}」
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-center text-sm font-extrabold text-ink-soft">我今年几岁？</div>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {AGE_OPTIONS.map((age) => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => {
                      setDraft((current) => ({ ...current, age }))
                    }}
                    className={cn(
                      'flex aspect-square flex-col items-center justify-center rounded-2xl border-b-4 transition',
                      draft.age === age
                        ? 'anim-pop-in border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-brand-200 bg-white text-ink-soft hover:-translate-y-1',
                    )}
                  >
                    <span className="text-2xl font-extrabold">{age}</span>
                    <span className="text-[11px] font-bold">岁</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setTarget(null)
                setStep('pattern')
                clearPattern()
              }}
              className="rounded-kid bg-brand-500 px-8 py-4 text-xl font-extrabold text-white shadow-kid active:translate-y-[2px]"
            >
              下一步
              <Icon name="chevronRight" size={16} />
            </button>

            {profiles.length > 0 ? (
              <button
                type="button"
                className="text-sm font-extrabold text-ink-soft"
                onClick={() => setStep('pick')}
              >
                <Icon name="back" size={14} /> 返回
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {step === 'pattern' ? (
        <div className="flex flex-col items-center gap-5">
          <Mascot mood={target ? 'happy' : 'think'} size={92} />
          <h1 className="font-display text-3xl font-extrabold">
            {target ? `${target.nickname}，点出你的图案` : '设计你的图案密码'}
          </h1>

          <div className="flex items-center gap-3">
            {Array.from({ length: PATTERN_LENGTH }, (_, index) => (
              <span
                key={index}
                className={cn(
                  'flex h-16 w-16 items-center justify-center rounded-xl border text-3xl',
                  pattern[index]
                    ? 'anim-pop-in border-brand-400 bg-brand-50'
                    : 'border-brand-200 bg-white/60 text-ink-soft/40',
                )}
              >
                {pattern[index] ?? '·'}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
            {PATTERN_ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                data-no-click-sound
                onClick={() => pickIcon(icon)}
                className="flex h-16 w-16 items-center justify-center rounded-xl border border-surface-line bg-white text-3xl transition hover:-translate-y-1 hover:border-brand-300"
              >
                {icon}
              </button>
            ))}
          </div>

          {message ? (
            <div className="anim-pop-in rounded-2xl bg-[#fffbe8] px-4 py-2 text-sm font-extrabold text-[#8a6410]">
              {message}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              disabled={!patternReady}
              onClick={confirm}
              className={cn(
                'relative inline-flex min-w-[13.5rem] items-center justify-center gap-3 rounded-2xl px-7 py-4 text-xl font-extrabold transition duration-200',
                patternReady
                  ? 'anim-glow-slow bg-gradient-to-r from-brand-500 via-brand-400 to-candy-purple text-white shadow-[0_16px_30px_-16px_rgba(39,87,214,0.9)] hover:-translate-y-0.5 hover:brightness-[1.05] active:translate-y-[2px] active:shadow-none'
                  : 'border-2 border-dashed border-surface-line bg-white text-ink-faint',
              )}
            >
              <span
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full transition',
                  patternReady ? 'bg-white/25 text-white' : 'bg-surface-muted text-ink-faint',
                )}
              >
                <Icon name={patternReady ? 'play' : 'lock'} size={18} />
              </span>
              <span>{patternReady ? '开始学习' : `还差 ${PATTERN_LENGTH - pattern.length} 个图案`}</span>
              {patternReady ? <Icon name="chevronRight" size={18} /> : null}
            </button>
            <button
              type="button"
              onClick={() => {
                clearPattern()
              }}
              className="inline-flex items-center gap-2 rounded-kid border border-surface-line bg-white px-5 py-3 font-extrabold text-ink-soft transition hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50"
            >
              <Icon name="refresh" size={16} /> 重选
            </button>
          </div>
        </div>
      ) : null}

      <Modal open={pendingDelete !== null} className="max-w-md">
        <div className="flex flex-col items-center gap-4 text-center">
          <Mascot mood="think" size={84} />
          <h2 className="text-2xl font-extrabold">
            要删除 {pendingDelete?.nickname} 的档案吗？
          </h2>
          <p className="text-sm font-bold text-ink-soft">
            星星、徽章和练习进度都会一起消失，而且没办法找回来。
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setPendingDelete(null)
              }}
              className="rounded-kid bg-brand-500 px-6 py-3 text-lg font-extrabold text-white shadow-kid active:translate-y-[2px]"
            >
              不要删，继续玩
            </button>
            <button
              type="button"
              onClick={() => {
                sfx.oops()
                if (pendingDelete) removeProfile(pendingDelete.id)
                setPendingDelete(null)
              }}
              className="rounded-kid border-2 border-[#f0c4cf] bg-white px-6 py-3 text-lg font-extrabold text-[#c2334c]"
            >
              确认删除
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
