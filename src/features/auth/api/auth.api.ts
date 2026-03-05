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

/**
 * Converts `/users/me` payload to application user shape.
 */
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

/**
 * Authentication API client.
 *
 * Each method validates input/output payloads with Zod before exposing typed DTOs.
 */
export const authApi = {
  /**
   * Authenticates a user and returns a token pair.
   *
   * @param input Login credentials.
   */
  async login(input: LoginRequestDto): Promise<TokenPairResponseDto> {
    const payload = loginRequestSchema.parse(input)
    const { data } = await http.post(API_ENDPOINTS.AUTH.LOGIN, payload)
    return tokenPairResponseSchema.parse(data)
  },

  /**
   * Registers a new user account.
   *
   * @param input Registration payload.
   */
  async register(input: CreateUserRequestDto): Promise<ResponseUserDto> {
    const payload = createUserRequestSchema.parse(input)
    const { data } = await http.post(API_ENDPOINTS.USERS.REGISTER, payload)
    return responseUserSchema.parse(data)
  },

  /**
   * Refreshes session tokens.
   *
   * @param input Optional payload when refresh token is not cookie-based.
   */
  async refresh(input?: RefreshTokenRequestDto): Promise<TokenPairResponseDto> {
    const payload = input ? refreshTokenRequestSchema.parse(input) : {}
    const { data } = await http.post(API_ENDPOINTS.AUTH.REFRESH, payload)
    return tokenPairResponseSchema.parse(data)
  },

  /**
   * Retrieves the authenticated user profile.
   */
  async me(): Promise<AppUser> {
    const { data } = await http.get(API_ENDPOINTS.USERS.ME)
    const parsed = currentUserResponseSchema.parse(data)
    return toAppUser(parsed)
  },

  /**
   * Invalidates the current session on backend side.
   */
  async logout(): Promise<void> {
    await http.post(API_ENDPOINTS.AUTH.LOGOUT, {})
  },
}
