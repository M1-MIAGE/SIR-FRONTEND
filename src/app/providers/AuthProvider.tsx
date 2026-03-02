import { type PropsWithChildren, useEffect, useRef, useState } from 'react'
import { AuthContext, type AuthContextValue } from '@/app/providers/auth-context'
import { authApi } from '@/features/auth/api/auth.api'
import { authTokenStore } from '@/shared/auth/token-store'
import { mapApiErrorCode } from '@/shared/api/map-api-error'
import { ERROR_CODES, ROUTE_PATHS } from '@/shared/config/routes'
import type { AppUser } from '@/entities/user/model/user'

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const didBootstrapRef = useRef(false)
  const [bootstrapErrorCode, setBootstrapErrorCode] =
    useState<AuthContextValue['bootstrapErrorCode']>(null)

  const refreshSession: AuthContextValue['refreshSession'] = async () => {
    setIsLoading(true)
    setBootstrapErrorCode(null)

    try {
      try {
        const authenticatedUser = await authApi.me()
        setUser(authenticatedUser)
        return
      } catch (error) {
        const mappedCode = mapApiErrorCode(error)
        if (mappedCode !== ERROR_CODES.UNAUTHORIZED) {
          setBootstrapErrorCode(mappedCode)
          return
        }
      }

      try {
        const refreshedTokenPair = await authApi.refresh()
        authTokenStore.set(refreshedTokenPair)
      } catch {
        authTokenStore.clear()
        setUser(null)
        return
      }

      try {
        const authenticatedUser = await authApi.me()
        setUser(authenticatedUser)
      } catch (error) {
        const mappedCode = mapApiErrorCode(error)
        if (mappedCode === ERROR_CODES.UNAUTHORIZED) {
          authTokenStore.clear()
          setUser(null)
          return
        }

        setBootstrapErrorCode(mappedCode)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const login: AuthContextValue['login'] = async (credentials) => {
    setBootstrapErrorCode(null)

    const tokenPair = await authApi.login(credentials)
    authTokenStore.set(tokenPair)

    await refreshSession()
  }

  const register: AuthContextValue['register'] = async (payload) => {
    setBootstrapErrorCode(null)
    await authApi.register(payload)
  }

  const logout: AuthContextValue['logout'] = async () => {
    try {
      await authApi.logout()
    } finally {
      authTokenStore.clear()
      setUser(null)
      setBootstrapErrorCode(null)
    }
  }

  useEffect(() => {
    if (didBootstrapRef.current) {
      return
    }

    didBootstrapRef.current = true

    if (typeof window !== 'undefined') {
      const publicPaths: Set<string> = new Set([ROUTE_PATHS.ROOT, ROUTE_PATHS.LOGIN, ROUTE_PATHS.REGISTER])

      if (publicPaths.has(window.location.pathname)) {
        setIsLoading(false)
        return
      }
    }

    void refreshSession()
  }, [])

  const contextValue: AuthContextValue = {
    user,
    role: user?.role ?? null,
    isAuthenticated: Boolean(user),
    isLoading,
    bootstrapErrorCode,
    refreshSession,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
