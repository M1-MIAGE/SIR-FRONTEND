import type { Role } from '@/entities/user/model/role'

export type AppUser = {
  firstName: string
  lastName: string
  email: string
  role: Role
  createdAt: string
}
