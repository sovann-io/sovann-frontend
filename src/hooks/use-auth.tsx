// hooks/useAuth.ts
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/use-auth-store'
import { ACCESS_TOKEN } from '@/constants/auth'

export const useAuth = (requireAuth: boolean = true) => {
    const router = useRouter()
    const [isInitialized, setIsInitialized] = useState(false)
    const {
        isAuthenticated,
        isLoading,
        user,
        accessToken,
        setAccessToken,
        login,
        register,
        oAuthLogin,
        logout,
        fetchUserInfo
    } = useAuthStore()

    useEffect(() => {
        // If we have a token but no user info, fetch it
        if (accessToken && !user) {
            fetchUserInfo()
        }
        // Handle authentication requirements
        const authStorage = localStorage.getItem(ACCESS_TOKEN)
        if (!isLoading && !isAuthenticated && !authStorage) {
            router.push('/auth/login')
        }
    }, [isAuthenticated, isLoading, router, requireAuth, accessToken, user, fetchUserInfo])

    return {
        isAuthenticated,
        isLoading,
        user,
        accessToken,
        setAccessToken,
        login,
        register,
        oAuthLogin,
        logout,
        fetchUserInfo
    }
}