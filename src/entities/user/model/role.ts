export const ROLES = ['CUSTOMER', 'ORGANIZER', 'ADMIN'] as const

export type Role = (typeof ROLES)[number]

export const BACKEND_ROLES = ['ROLE_CUSTOMER', 'ROLE_ORGANIZER', 'ROLE_ADMIN'] as const

export type BackendRole = (typeof BACKEND_ROLES)[number]

export const BACKEND_ROLE_TO_ROLE: Record<BackendRole, Role> = {
  ROLE_CUSTOMER: 'CUSTOMER',
  ROLE_ORGANIZER: 'ORGANIZER',
  ROLE_ADMIN: 'ADMIN',
}
