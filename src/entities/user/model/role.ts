export const ROLES = ['CUSTOMER', 'ORGANIZER', 'ADMIN'] as const

export type Role = (typeof ROLES)[number]
