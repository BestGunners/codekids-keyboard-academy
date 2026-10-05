import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/** 用于展示与难度分层的年龄段：由具体年龄推导 */
export type AgeBand = '5-7' | '8-10' | '11-16'

/** 注册时可选的具体年龄 */
export const AGE_OPTIONS = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

export const DEFAULT_AGE = 8

export function ageBandOf(age: number): AgeBand {
  if (age <= 7) return '5-7'
  if (age <= 10) return '8-10'
  return '11-16'
}

export interface ChildProfile {
  id: string
  nickname: string
  avatarId: string
  /** 孩子的具体年龄（岁） */
  age: number
  /** 图形密码：图标序列 */
  pattern: string[]
  createdAt: string
}

export interface CreateChildInput {
  nickname: string
  avatarId: string
  age: number
  pattern: string[]
}
/** 修改档案时只允许改这几项（设置页用） */
export type UpdateChildInput = Partial<
  Pick<ChildProfile, 'nickname' | 'avatarId' | 'age' | 'pattern'>
>

interface ChildState {
  profiles: ChildProfile[]
  currentChildId: string | null
  addProfile: (input: CreateChildInput) => ChildProfile
  updateProfile: (id: string, patch: UpdateChildInput) => void
  removeProfile: (id: string) => void
  login: (id: string) => void
  logout: () => void
}

/** 旧版本存的是年龄段字符串，迁移时换算成具体年龄 */
interface LegacyChildProfile extends Omit<ChildProfile, 'age'> {
  age?: number
  ageBand?: string
}

function createId(): string {
  return `kid_${Math.random().toString(36).slice(2, 10)}`
}

/**
 * 儿童账号（MVP 本地版）：
 * 真实产品中家长手机号是认证主体，孩子用图形密码登录；
 * 这里先用 localStorage 持久化，后续接入后端时只需替换这一层。
 */
export const useChildStore = create<ChildState>()(
  persist(
    (set, get) => ({
      profiles: [],
      currentChildId: null,
      addProfile: (input) => {
        const profile: ChildProfile = {
          id: createId(),
          nickname: input.nickname.trim() || '小键盘手',
          avatarId: input.avatarId,
          age: input.age,
          pattern: input.pattern,
          createdAt: new Date().toISOString(),
        }
        set({ profiles: [...get().profiles, profile] })
        return profile
      },
      updateProfile: (id, patch) =>
        set((state) => ({
          profiles: state.profiles.map((profile) => {
            if (profile.id !== id) return profile
            const nickname =
              patch.nickname !== undefined
                ? patch.nickname.trim() || profile.nickname
                : profile.nickname
            return { ...profile, ...patch, nickname }
          }),
        })),
      removeProfile: (id) =>
        set((state) => ({
          profiles: state.profiles.filter((profile) => profile.id !== id),
          currentChildId: state.currentChildId === id ? null : state.currentChildId,
        })),
      login: (id) => set({ currentChildId: id }),
      logout: () => set({ currentChildId: null }),
    }),
    {
      name: 'codekids.child',
      version: 1,
      migrate: (persisted) => {
        const legacy = persisted as
          | { profiles?: LegacyChildProfile[]; currentChildId?: string | null }
          | undefined

        if (!legacy?.profiles) return persisted as ChildState

        return {
          ...legacy,
          profiles: legacy.profiles.map((profile) => ({
            ...profile,
            age: profile.age ?? (profile.ageBand === '6-7' || profile.ageBand === '5-7' ? 7 : 9),
          })),
        } as ChildState
      },
    },
  ),
)

/** 从状态中取出当前登录的孩子档案。 */
export function selectCurrentChild(state: ChildState): ChildProfile | null {
  if (!state.currentChildId) return null
  return state.profiles.find((profile) => profile.id === state.currentChildId) ?? null
}