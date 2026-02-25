import { z } from 'zod'
import { BACKEND_ROLES } from '@/entities/user/model/role'

export const loginRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

export const tokenPairResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  tokenType: z.string().min(1),
  accessTokenExpiresAt: z.string().datetime(),
  refreshTokenExpiresAt: z.string().datetime(),
})

export const currentUserResponseSchema = z.object({
  email: z.email(),
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  role: z.enum(BACKEND_ROLES),
  createdAt: z.string().datetime(),
})

export type LoginRequestDto = z.infer<typeof loginRequestSchema>
export type TokenPairResponseDto = z.infer<typeof tokenPairResponseSchema>
export type CurrentUserResponseDto = z.infer<typeof currentUserResponseSchema>
