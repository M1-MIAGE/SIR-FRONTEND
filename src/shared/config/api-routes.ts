const API_SEGMENTS = {
  AUTH: 'auth',
  USERS: 'users',
  CONCERTS: 'concerts',
} as const

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `/${API_SEGMENTS.AUTH}/login`,
    LOGOUT: `/${API_SEGMENTS.AUTH}/logout`,
    REFRESH: `/${API_SEGMENTS.AUTH}/refresh`,
  },
  USERS: {
    ME: `/${API_SEGMENTS.USERS}/me`,
    REGISTER: `/${API_SEGMENTS.USERS}/register`,
  },
  CONCERTS: {
    PUBLIC_PLACES: `/${API_SEGMENTS.CONCERTS}/public/places`,
  },
} as const
