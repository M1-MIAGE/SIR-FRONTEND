import axios from 'axios'
import { ERROR_CODES } from '@/shared/config/routes'

export type ApiErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]

const STATUS_TO_ERROR_CODE: Record<number, ApiErrorCode> = {
  400: ERROR_CODES.BAD_REQUEST,
  401: ERROR_CODES.UNAUTHORIZED,
  403: ERROR_CODES.FORBIDDEN,
  404: ERROR_CODES.NOT_FOUND,
  405: ERROR_CODES.METHOD_NOT_ALLOWED,
  408: ERROR_CODES.REQUEST_TIMEOUT,
  409: ERROR_CODES.CONFLICT,
  410: ERROR_CODES.GONE,
  413: ERROR_CODES.PAYLOAD_TOO_LARGE,
  415: ERROR_CODES.UNSUPPORTED_MEDIA_TYPE,
  422: ERROR_CODES.UNPROCESSABLE_ENTITY,
  429: ERROR_CODES.TOO_MANY_REQUESTS,
  500: ERROR_CODES.INTERNAL,
  501: ERROR_CODES.NOT_IMPLEMENTED,
  502: ERROR_CODES.BAD_GATEWAY,
  503: ERROR_CODES.SERVICE_UNAVAILABLE,
  504: ERROR_CODES.GATEWAY_TIMEOUT,
}

export const mapApiErrorCode = (error: unknown): ApiErrorCode => {
  if (!axios.isAxiosError(error)) {
    return ERROR_CODES.UNEXPECTED
  }

  if (!error.response) {
    return ERROR_CODES.OFFLINE
  }

  const mappedCode = STATUS_TO_ERROR_CODE[error.response.status]

  if (mappedCode) {
    return mappedCode
  }

  return error.response.status >= 500 ? ERROR_CODES.INTERNAL : ERROR_CODES.UNEXPECTED
}
