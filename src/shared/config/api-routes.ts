const API_SEGMENTS = {
  AUTH: 'auth',
  USERS: 'users',
  CONCERTS: 'concerts',
  PLACES: 'places',
  STATS: 'stats',
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
    CREATE: `/${API_SEGMENTS.CONCERTS}/create`,
  },
  PLACES: {
    ALL: `/${API_SEGMENTS.PLACES}/all`,
  },
  STATS: {
    ME_CONCERTS: `/${API_SEGMENTS.STATS}/me/concerts`,
  },
} as const
