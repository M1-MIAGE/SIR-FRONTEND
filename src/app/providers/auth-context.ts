import { createContext, useContext } from 'react'
import type { CreateUserRequestDto, LoginRequestDto } from '@/features/auth/model/auth.types'
import type { Role } from '@/entities/user/model/role'
import type { AppUser } from '@/entities/user/model/user'
import type { ApiErrorCode } from '@/shared/api/map-api-error'

/**
 * Contract exposed by authentication context.
 */
export type AuthContextValue = {
  user: AppUser | null
  role: Role | null
  isAuthenticated: boolean
  isLoading: boolean
  bootstrapErrorCode: ApiErrorCode | null
  refreshSession: () => Promise<void>
  login: (credentials: LoginRequestDto) => Promise<void>
  register: (payload: CreateUserRequestDto) => Promise<void>
  logout: () => Promise<void>
}

/**
 * React context storing current authentication state and actions.
 */
export const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * Hook to access the current authentication context.
 *
 * @throws {Error} When used outside {@link AuthProvider}.
 */
export const useAuth = (): AuthContextValue => {
  const contextValue = useContext(AuthContext)

  if (!contextValue) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return contextValue
}
