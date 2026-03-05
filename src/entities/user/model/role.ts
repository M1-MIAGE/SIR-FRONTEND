/**
 * Supported application roles after normalization from backend payloads.
 */
export const ROLES = ['CUSTOMER', 'ORGANIZER', 'ADMIN'] as const

/**
 * Role union used by UI guards and route decisions.
 */
export type Role = (typeof ROLES)[number]

/**
 * Raw role values returned by backend services.
 */
export const BACKEND_ROLES = ['ROLE_CUSTOMER', 'ROLE_ORGANIZER', 'ROLE_ADMIN'] as const

/**
 * Backend role union used by payload schemas.
 */
export type BackendRole = (typeof BACKEND_ROLES)[number]

/**
 * Conversion map from backend role names to frontend role names.
 */
export const BACKEND_ROLE_TO_ROLE: Record<BackendRole, Role> = {
  ROLE_CUSTOMER: 'CUSTOMER',
  ROLE_ORGANIZER: 'ORGANIZER',
  ROLE_ADMIN: 'ADMIN',
}
