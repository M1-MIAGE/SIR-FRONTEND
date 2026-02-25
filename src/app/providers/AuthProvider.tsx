import { type PropsWithChildren, useEffect, useState } from 'react'
import { AuthContext, type AuthContextValue } from '@/app/providers/auth-context'
import { authApi } from '@/features/auth/api/auth.api'
import { authTokenStore } from '@/shared/auth/token-store'
import { mapApiErrorCode } from '@/shared/api/map-api-error'
import { ERROR_CODES } from '@/shared/config/routes'
import type { AppUser } from '@/entities/user/model/user'

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [bootstrapErrorCode, setBootstrapErrorCode] =
    useState<AuthContextValue['bootstrapErrorCode']>(null)

  const refreshSession: AuthContextValue['refreshSession'] = async () => {
    setIsLoading(true)
    setBootstrapErrorCode(null)

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
    logout,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
