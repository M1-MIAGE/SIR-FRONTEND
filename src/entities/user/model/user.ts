import type { Role } from '@/entities/user/model/role'

/**
 * Authenticated user shape used across the frontend domain layer.
 */
export type AppUser = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: Role
  createdAt: string
}
