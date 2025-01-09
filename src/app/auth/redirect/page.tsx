'use client'

import { ACCESS_TOKEN } from '@/constants/auth'
import { useAuthStore } from '@/stores/use-auth-store'
import localforage from 'localforage'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import { toast } from 'sonner'

export default function AuthRedirectPage() {
    // Get query params from URL
    const setAccessToken = useAuthStore(state => state.setAccessToken)
    const params = useSearchParams()
    const router = useRouter()
    const accessToken = params.get('accessToken')
    const error = params.get('error')
    useEffect(() => {
        if (error) {
            toast.error(error)
        }
        if (accessToken) {
            localforage
                .setItem(ACCESS_TOKEN, accessToken)
                .then(() => {
                    setAccessToken(accessToken)
                    router.push('/dashboard')
                })
                .catch(error => {
                    toast.error('Failed to store access token. Reason: ' + error)
                })
        }
    }, [accessToken, error, router])
    return (
        <Suspense>
            <div>{error && <p>{error}</p>}</div>
        </Suspense>
    )
}