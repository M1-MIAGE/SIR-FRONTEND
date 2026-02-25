import { createContext, useContext } from 'react'
import type { CreateUserRequestDto, LoginRequestDto } from '@/features/auth/model/auth.types'
import type { Role } from '@/entities/user/model/role'
import type { AppUser } from '@/entities/user/model/user'
import type { ApiErrorCode } from '@/shared/api/map-api-error'

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

export const AuthContext = createContext<AuthContextValue | null>(null)

export const useAuth = (): AuthContextValue => {
  const contextValue = useContext(AuthContext)

  if (!contextValue) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return contextValue
}
