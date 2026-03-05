import { z } from 'zod'
import { BACKEND_ROLES } from '@/entities/user/model/role'

/**
 * Roles that can be selected during public self-registration.
 */
export const PUBLIC_REGISTRATION_ROLES = ['CUSTOMER', 'ORGANIZER'] as const

/**
 * Login payload schema.
 */
export const loginRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

/**
 * Registration payload schema for public users.
 */
export const createUserRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  role: z.enum(PUBLIC_REGISTRATION_ROLES),
})

/**
 * Schema of a user as returned by user creation endpoints.
 */
export const responseUserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  role: z.enum(BACKEND_ROLES),
})

/**
 * Refresh token request schema.
 */
export const refreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1),
})

/**
 * Access/refresh token pair schema.
 */
export const tokenPairResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  tokenType: z.string().min(1),
  accessTokenExpiresAt: z.string().datetime(),
  refreshTokenExpiresAt: z.string().datetime(),
})

/**
 * Authenticated user payload schema used by `/users/me`.
 */
export const currentUserResponseSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  role: z.enum(BACKEND_ROLES),
  createdAt: z.string().datetime(),
})

/**
 * DTO inferred from {@link loginRequestSchema}.
 */
export type LoginRequestDto = z.infer<typeof loginRequestSchema>
/**
 * DTO inferred from {@link createUserRequestSchema}.
 */
export type CreateUserRequestDto = z.infer<typeof createUserRequestSchema>
/**
 * DTO inferred from {@link responseUserSchema}.
 */
export type ResponseUserDto = z.infer<typeof responseUserSchema>
/**
 * DTO inferred from {@link refreshTokenRequestSchema}.
 */
export type RefreshTokenRequestDto = z.infer<typeof refreshTokenRequestSchema>
/**
 * DTO inferred from {@link tokenPairResponseSchema}.
 */
export type TokenPairResponseDto = z.infer<typeof tokenPairResponseSchema>
/**
 * DTO inferred from {@link currentUserResponseSchema}.
 */
export type CurrentUserResponseDto = z.infer<typeof currentUserResponseSchema>
