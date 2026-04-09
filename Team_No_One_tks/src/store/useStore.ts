import { create } from 'zustand'

export type UserRole = 'admin' | 'engineer' | 'operator' | 'viewer'

interface UserSession {
  id: string
  email: string
  role: UserRole
  name: string
  organization?: string
}

interface AppState {
  session: UserSession | null
  setSession: (session: UserSession | null) => void
}

export const useStore = create<AppState>((set) => ({
  session: null, // Start with null for unauthenticated state
  setSession: (session) => set({ session }),
}))
