import type { Role } from '@/entities/user/model/role'

/**
 * Atomic route segments used to build path constants.
 */
export const ROUTE_SEGMENTS = {
  DASHBOARD: 'dashboard',
  LOGIN: 'login',
  REGISTER: 'register',
  CONCERTS: 'concerts',
  TICKETS: 'tickets',
  CREATE: 'create',
  CUSTOMER: 'customer',
  ORGANIZER: 'organizer',
  ADMIN: 'admin',
  ERRORS: 'errors',
} as const

/**
 * Centralized absolute route paths used by the router configuration.
 */
export const ROUTE_PATHS = {
  ROOT: '/',
  DASHBOARD: `/${ROUTE_SEGMENTS.DASHBOARD}`,
  LOGIN: `/${ROUTE_SEGMENTS.LOGIN}`,
  REGISTER: `/${ROUTE_SEGMENTS.REGISTER}`,
  CUSTOMER_HOME: `/${ROUTE_SEGMENTS.CUSTOMER}`,
  CUSTOMER_TICKETS: `/${ROUTE_SEGMENTS.CUSTOMER}/${ROUTE_SEGMENTS.TICKETS}`,
  CUSTOMER_CONCERT_DETAIL: `/${ROUTE_SEGMENTS.CUSTOMER}/${ROUTE_SEGMENTS.CONCERTS}/:concertId`,
  ORGANIZER_HOME: `/${ROUTE_SEGMENTS.ORGANIZER}`,
  ORGANIZER_CONCERT_CREATE: `/${ROUTE_SEGMENTS.ORGANIZER}/${ROUTE_SEGMENTS.CONCERTS}/${ROUTE_SEGMENTS.CREATE}`,
  ADMIN_HOME: `/${ROUTE_SEGMENTS.ADMIN}`,
  ERRORS_ROOT: `/${ROUTE_SEGMENTS.ERRORS}`,
  ERROR_DETAIL: `/${ROUTE_SEGMENTS.ERRORS}/:statusCode`,
  NOT_FOUND: '*',
} as const

/**
 * Error codes supported by the app error page.
 */
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

/**
 * Route factory helpers to avoid hard-coded URLs in components.
 */
export const ROUTES = {
  /**
   * Home page route.
   */
  root: (): string => ROUTE_PATHS.ROOT,
  /**
   * Role dispatching dashboard route.
   */
  dashboard: (): string => ROUTE_PATHS.DASHBOARD,
  /**
   * Login page route.
   */
  login: (): string => ROUTE_PATHS.LOGIN,
  /**
   * Register page route.
   */
  register: (): string => ROUTE_PATHS.REGISTER,
  /**
   * Organizer concert creation route.
   */
  organizerCreateConcert: (): string => ROUTE_PATHS.ORGANIZER_CONCERT_CREATE,
  /**
   * Customer tickets route.
   */
  customerTickets: (): string => ROUTE_PATHS.CUSTOMER_TICKETS,
  /**
   * Customer concert details route by concert id.
   *
   * @param concertId Concert identifier.
   */
  customerConcertDetails: (concertId: string): string =>
    `/${ROUTE_SEGMENTS.CUSTOMER}/${ROUTE_SEGMENTS.CONCERTS}/${concertId}`,
  /**
   * Landing route for a given role.
   *
   * @param role Current authenticated user role.
   */
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
    /**
     * Error index route.
     */
    root: (): string => ROUTE_PATHS.ERRORS_ROOT,
    /**
     * Error detail route for any known or numeric code.
     *
     * @param code Error code to display.
     */
    byCode: (code: ErrorCodeInput): string => `${ROUTE_PATHS.ERRORS_ROOT}/${code}`,
    /**
     * Shortcut for 401 page.
     */
    unauthorized: (): string => `${ROUTE_PATHS.ERRORS_ROOT}/${ERROR_CODES.UNAUTHORIZED}`,
    /**
     * Shortcut for 403 page.
     */
    forbidden: (): string => `${ROUTE_PATHS.ERRORS_ROOT}/${ERROR_CODES.FORBIDDEN}`,
    /**
     * Shortcut for 404 page.
     */
    notFound: (): string => `${ROUTE_PATHS.ERRORS_ROOT}/${ERROR_CODES.NOT_FOUND}`,
    /**
     * Shortcut for 500 page.
     */
    internal: (): string => `${ROUTE_PATHS.ERRORS_ROOT}/${ERROR_CODES.INTERNAL}`,
    /**
     * Shortcut for 503 page.
     */
    serviceUnavailable: (): string =>
      `${ROUTE_PATHS.ERRORS_ROOT}/${ERROR_CODES.SERVICE_UNAVAILABLE}`,
    /**
     * Shortcut for offline state page.
     */
    offline: (): string => `${ROUTE_PATHS.ERRORS_ROOT}/${ERROR_CODES.OFFLINE}`,
    /**
     * Shortcut for generic unexpected errors.
     */
    unexpected: (): string => `${ROUTE_PATHS.ERRORS_ROOT}/${ERROR_CODES.UNEXPECTED}`,
  },
} as const
