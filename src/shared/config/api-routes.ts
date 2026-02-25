const API_SEGMENTS = {
  AUTH: 'auth',
  USERS: 'users',
} as const

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `/${API_SEGMENTS.AUTH}/login`,
    LOGOUT: `/${API_SEGMENTS.AUTH}/logout`,
    REFRESH: `/${API_SEGMENTS.AUTH}/refresh`,
  },
  USERS: {
    ME: `/${API_SEGMENTS.USERS}/me`,
  }
} as const
