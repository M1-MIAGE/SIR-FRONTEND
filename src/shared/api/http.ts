import axios from 'axios'
import { env } from '@/shared/config/env'
import { authTokenStore } from '@/shared/auth/token-store'

export const http = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.request.use((config) => {
  const tokenPair = authTokenStore.get()

  if (!tokenPair) {
    return config
  }

  config.headers = config.headers ?? {}
  config.headers.Authorization = `${tokenPair.tokenType} ${tokenPair.accessToken}`

  return config
})
