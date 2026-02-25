import { z } from 'zod'
import { ROLES } from '@/entities/user/model/role'
import type { AppUser } from '@/entities/user/model/user'
import { http } from '@/shared/api/http'
import { API_ENDPOINTS } from '@/shared/config/api-routes'

const authRoleSchema = z.enum(ROLES)

const authUserResponseSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  email: z.email(),
  role: authRoleSchema,
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
  fullName: z.string().trim().optional(),
})

const toAppUser = (raw: z.infer<typeof authUserResponseSchema>): AppUser => {
  const fullNameParts = raw.fullName?.split(/\s+/).filter(Boolean) ?? []
  const firstNameFromFullName = fullNameParts[0] ?? ''
  const lastNameFromFullName = fullNameParts.slice(1).join(' ')

  const firstName = raw.firstName || firstNameFromFullName || 'User'
  const lastName = raw.lastName || lastNameFromFullName || firstName

  return {
    id: raw.id,
    email: raw.email,
    role: raw.role,
    firstName,
    lastName,
  }
}

export const authApi = {
  async me(): Promise<AppUser> {
    const { data } = await http.get(API_ENDPOINTS.USERS.ME)
    const parsed = authUserResponseSchema.parse(data)
    return toAppUser(parsed)
  },

  async logout(): Promise<void> {
    await http.post(API_ENDPOINTS.AUTH.LOGOUT)
  },
}
