import { type PropsWithChildren, useEffect, useMemo, useState } from 'react'
import { AuthContext, type AuthContextValue } from '@/app/providers/auth-context'
import { authApi } from '@/features/auth/api/auth.api'
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
        setUser(null)
        return
      }

      setBootstrapErrorCode(mappedCode)
    } finally {
      setIsLoading(false)
    }
  }

  const logout: AuthContextValue['logout'] = async () => {
    try {
      await authApi.logout()
    } finally {
      setUser(null)
      setBootstrapErrorCode(null)
    }
  }

  useEffect(() => {
    void refreshSession()
  }, [])

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      user,
      role: user?.role ?? null,
      isAuthenticated: Boolean(user),
      isLoading,
      bootstrapErrorCode,
      refreshSession,
      logout,
    }),
    [user, isLoading, bootstrapErrorCode],
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
