import axios from 'axios'
import { env } from '@/shared/config/env'
import { authTokenStore } from '@/shared/auth/token-store'
import { API_ENDPOINTS } from '@/shared/config/api-routes'

export const http = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

const AUTH_HEADER_EXCLUDED_PATHS = new Set<string>([
  API_ENDPOINTS.AUTH.LOGIN,
  API_ENDPOINTS.AUTH.REFRESH,
  API_ENDPOINTS.USERS.REGISTER,
])

const normalizeRequestPath = (url: string | undefined, baseURL: string | undefined): string | null => {
  if (!url) {
    return null
  }

  try {
    return new URL(url, baseURL).pathname
  } catch {
    return null
  }
}

http.interceptors.request.use((config) => {
  const requestPath = normalizeRequestPath(config.url, config.baseURL ?? env.apiBaseUrl)
  if (requestPath && AUTH_HEADER_EXCLUDED_PATHS.has(requestPath)) {
    return config
  }

  const tokenPair = authTokenStore.get()

  if (!tokenPair) {
    return config
  }

  config.headers = config.headers ?? {}
  config.headers.Authorization = `${tokenPair.tokenType} ${tokenPair.accessToken}`

  return config
})
