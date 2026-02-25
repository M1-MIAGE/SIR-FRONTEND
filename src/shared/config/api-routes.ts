const API_SEGMENTS = {
  AUTH: 'auth',
  USERS: 'users',
} as const

export const API_ENDPOINTS = {
  AUTH: {
    ME: `/${API_SEGMENTS.AUTH}/me`,
    LOGOUT: `/${API_SEGMENTS.AUTH}/logout`,
  },
  USERS: {
    ME: `/${API_SEGMENTS.USERS}/me`,
  }
} as const
