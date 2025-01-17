// stores/useAuthStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'
import { ACCESS_TOKEN, API_BASE_URL, AUTH_BASE_URL, GITHUB_AUTH_URL, GOOGLE_AUTH_URL } from '@/constants/auth'

interface User {
  id: string
  email: string
  username: string
  provider?: 'github' | 'google' | 'credentials'
}

interface AuthState {
  accessToken: string | null
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  setAccessToken: (token: string | null) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  oAuthLogin: (provider: 'github' | 'google') => Promise<void>
  logout: () => void
  fetchUserInfo: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const { data } = await axios.post('/api/auth/login', { email, password })
          const { accessToken } = data
          set({ accessToken, isAuthenticated: true, isLoading: false })
          await get().fetchUserInfo()
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (email, password) => {
        set({ isLoading: true })
        try {
          const { data } = await axios.post('/api/auth/register', { email, password })
          const { accessToken } = data
          set({ accessToken, isAuthenticated: true, isLoading: false })
          await get().fetchUserInfo()
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      oAuthLogin: async (provider) => {
        set({ isLoading: true })
        try {
          const authUrl = await getAuthUrl(provider)
          window.sessionStorage.setItem('auth_redirect', window.location.pathname)
          window.location.href = authUrl
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        })
      },

      setAccessToken: async (token) => {
        set({ accessToken: token, isAuthenticated: !!token })
        if (token) await get().fetchUserInfo()
      },

      fetchUserInfo: async () => {
        const { accessToken } = get()
        if (!accessToken) return

        try {
          const { data } = await axios.get(AUTH_BASE_URL + '/users/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          set({ user: data, isAuthenticated: true })
        } catch (error) {
          get().logout()
          throw error
        }
      },
    }),
    {
      name: ACCESS_TOKEN,
      partialize: (state) => ({ accessToken: state.accessToken }),
    }
  )
)

// Helper function to fetch OAuth URL
const getAuthUrl = async (provider: 'github' | 'google') => {
  const url = provider === 'github' ? GITHUB_AUTH_URL : GOOGLE_AUTH_URL
  const { data } = await axios.get(url)
  return data.authorization_url
}
