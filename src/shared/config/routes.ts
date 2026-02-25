import type { Role } from '@/entities/user/model/role'

export const ROUTE_SEGMENTS = {
  LOGIN: 'login',
  CUSTOMER: 'customer',
  ORGANIZER: 'organizer',
  ADMIN: 'admin',
  ERRORS: 'errors',
} as const

export const ROUTE_PATHS = {
  ROOT: '/',
  LOGIN: `/${ROUTE_SEGMENTS.LOGIN}`,
  CUSTOMER_HOME: `/${ROUTE_SEGMENTS.CUSTOMER}`,
  ORGANIZER_HOME: `/${ROUTE_SEGMENTS.ORGANIZER}`,
  ADMIN_HOME: `/${ROUTE_SEGMENTS.ADMIN}`,
  ERRORS_ROOT: `/${ROUTE_SEGMENTS.ERRORS}`,
  ERROR_DETAIL: `/${ROUTE_SEGMENTS.ERRORS}/:statusCode`,
  NOT_FOUND: '*',
} as const

export const ERROR_CODES = {
  BAD_REQUEST: '400',
  UNAUTHORIZED: '401',
  FORBIDDEN: '403',
  NOT_FOUND: '404',
  METHOD_NOT_ALLOWED: '405',
  REQUEST_TIMEOUT: '408',
  CONFLICT: '409',
  GONE: '410',
  PAYLOAD_TOO_LARGE: '413',
  UNSUPPORTED_MEDIA_TYPE: '415',
  UNPROCESSABLE_ENTITY: '422',
  TOO_MANY_REQUESTS: '429',
  INTERNAL: '500',
  NOT_IMPLEMENTED: '501',
  BAD_GATEWAY: '502',
  SERVICE_UNAVAILABLE: '503',
  GATEWAY_TIMEOUT: '504',
  OFFLINE: 'offline',
  UNEXPECTED: 'unexpected',
} as const

type KnownErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]
type ErrorCodeInput = KnownErrorCode | `${number}`

export const ROUTES = {
  root: (): string => ROUTE_PATHS.ROOT,
  login: (): string => ROUTE_PATHS.LOGIN,
  roleHome: (role: Role): string => {
    if (role === 'CUSTOMER') {
      return ROUTE_PATHS.CUSTOMER_HOME
    }

    if (role === 'ORGANIZER') {
      return ROUTE_PATHS.ORGANIZER_HOME
    }

    return ROUTE_PATHS.ADMIN_HOME
  },
  errors: {
    root: (): string => ROUTE_PATHS.ERRORS_ROOT,
    byCode: (code: ErrorCodeInput): string => `${ROUTE_PATHS.ERRORS_ROOT}/${code}`,
    unauthorized: (): string => `${ROUTE_PATHS.ERRORS_ROOT}/${ERROR_CODES.UNAUTHORIZED}`,
    forbidden: (): string => `${ROUTE_PATHS.ERRORS_ROOT}/${ERROR_CODES.FORBIDDEN}`,
    notFound: (): string => `${ROUTE_PATHS.ERRORS_ROOT}/${ERROR_CODES.NOT_FOUND}`,
    internal: (): string => `${ROUTE_PATHS.ERRORS_ROOT}/${ERROR_CODES.INTERNAL}`,
    serviceUnavailable: (): string =>
      `${ROUTE_PATHS.ERRORS_ROOT}/${ERROR_CODES.SERVICE_UNAVAILABLE}`,
    offline: (): string => `${ROUTE_PATHS.ERRORS_ROOT}/${ERROR_CODES.OFFLINE}`,
    unexpected: (): string => `${ROUTE_PATHS.ERRORS_ROOT}/${ERROR_CODES.UNEXPECTED}`,
  },
} as const
