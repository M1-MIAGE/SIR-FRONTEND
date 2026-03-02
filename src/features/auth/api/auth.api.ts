import {
  createUserRequestSchema,
  currentUserResponseSchema,
  loginRequestSchema,
  refreshTokenRequestSchema,
  responseUserSchema,
  tokenPairResponseSchema,
  type CreateUserRequestDto,
  type CurrentUserResponseDto,
  type LoginRequestDto,
  type RefreshTokenRequestDto,
  type ResponseUserDto,
  type TokenPairResponseDto,
} from '@/features/auth/model/auth.types'
import { BACKEND_ROLE_TO_ROLE } from '@/entities/user/model/role'
import type { AppUser } from '@/entities/user/model/user'
import { http } from '@/shared/api/http'
import { API_ENDPOINTS } from '@/shared/config/api-routes'

const toAppUser = (raw: CurrentUserResponseDto): AppUser => {
  return {
    id: raw.id,
    email: raw.email,
    firstName: raw.firstName,
    lastName: raw.lastName,
    role: BACKEND_ROLE_TO_ROLE[raw.role],
    createdAt: raw.createdAt,
  }
}

export const authApi = {
  async login(input: LoginRequestDto): Promise<TokenPairResponseDto> {
    const payload = loginRequestSchema.parse(input)
    const { data } = await http.post(API_ENDPOINTS.AUTH.LOGIN, payload)
    return tokenPairResponseSchema.parse(data)
  },

  async register(input: CreateUserRequestDto): Promise<ResponseUserDto> {
    const payload = createUserRequestSchema.parse(input)
    const { data } = await http.post(API_ENDPOINTS.USERS.REGISTER, payload)
    return responseUserSchema.parse(data)
  },

  async refresh(input?: RefreshTokenRequestDto): Promise<TokenPairResponseDto> {
    const payload = input ? refreshTokenRequestSchema.parse(input) : {}
    const { data } = await http.post(API_ENDPOINTS.AUTH.REFRESH, payload)
    return tokenPairResponseSchema.parse(data)
  },

  async me(): Promise<AppUser> {
    const { data } = await http.get(API_ENDPOINTS.USERS.ME)
    const parsed = currentUserResponseSchema.parse(data)
    return toAppUser(parsed)
  },

  async logout(): Promise<void> {
    await http.post(API_ENDPOINTS.AUTH.LOGOUT, {})
  },
}
