// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-storage')?.value

    // List of protected routes
    const protectedRoutes = ['/dashboard', '/profile', '/settings']
    const isProtectedRoute = protectedRoutes.some(route =>
        request.nextUrl.pathname.startsWith(route)
    )

    // Redirect to login if accessing protected route without token
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('from', request.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
    }

    // Redirect to dashboard if accessing login page with token
    if (request.nextUrl.pathname === '/login' && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/profile/:path*',
        '/settings/:path*',
        '/login',
    ],
}