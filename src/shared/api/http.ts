import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { tokenPairResponseSchema } from '@/features/auth/model/auth.types'
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

const AUTH_EXCLUDED_PATHS = new Set<string>([
  API_ENDPOINTS.AUTH.LOGIN,
  API_ENDPOINTS.AUTH.REFRESH,
  API_ENDPOINTS.USERS.REGISTER,
])

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

let refreshPromise: Promise<void> | null = null

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

const isAuthExcludedPath = (config: Pick<InternalAxiosRequestConfig, 'url' | 'baseURL'>): boolean => {
  const requestPath = normalizeRequestPath(config.url, config.baseURL ?? env.apiBaseUrl)
  return Boolean(requestPath && AUTH_EXCLUDED_PATHS.has(requestPath))
}

const runRefresh = async (): Promise<void> => {
  if (!refreshPromise) {
    refreshPromise = http
      .post(API_ENDPOINTS.AUTH.REFRESH, {})
      .then(({ data }) => {
        const refreshedTokenPair = tokenPairResponseSchema.parse(data)
        authTokenStore.set(refreshedTokenPair)
      })
      .catch((error: unknown) => {
        authTokenStore.clear()
        throw error
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  await refreshPromise
}

http.interceptors.request.use((config) => {
  if (isAuthExcludedPath(config)) {
    return config
  }

  const tokenState = authTokenStore.get()

  if (!tokenState) {
    return config
  }

  config.headers = config.headers ?? {}
  config.headers.Authorization = `${tokenState.tokenType} ${tokenState.accessToken}`

  return config
})

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined

    if (!originalRequest) {
      return Promise.reject(error)
    }

    if (error.response?.status !== 401 || isAuthExcludedPath(originalRequest) || originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      await runRefresh()
    } catch {
      return Promise.reject(error)
    }

    const tokenState = authTokenStore.get()

    if (tokenState) {
      originalRequest.headers = originalRequest.headers ?? {}
      originalRequest.headers.Authorization = `${tokenState.tokenType} ${tokenState.accessToken}`
    }

    return http(originalRequest)
  },
)
