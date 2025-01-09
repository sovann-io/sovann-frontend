export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export const ACCESS_TOKEN = 'access_token';
export const REFRESH_TOKEN = 'refresh_token';

const UI_BASE_URL = process.env.NEXT_PUBLIC_UI_BASE_URL || 'http://localhost:3000'
export const AUTH_REDIRECT_URI = UI_BASE_URL + '/auth/redirect';

export const GOOGLE_AUTH_URL = API_BASE_URL + '/auth/google/authorize'
export const GITHUB_AUTH_URL = API_BASE_URL + '/auth/github/authorize'