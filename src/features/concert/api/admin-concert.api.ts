import { z } from 'zod'
import {
  adminConcertModerationListSchema,
  concertDetailsSchema,
  type AdminConcertModerationDto,
  type ConcertDetailsDto,
} from '@/features/concert/model/admin-concert.types'
import { http } from '@/shared/api/http'
import { API_ENDPOINTS } from '@/shared/config/api-routes'

const concertIdSchema = z.uuid()

/**
 * Admin moderation API client for concerts.
 */
export const adminConcertApi = {
  /**
   * Lists concerts waiting for moderation.
   */
  async listPending(): Promise<AdminConcertModerationDto[]> {
    const { data } = await http.get(API_ENDPOINTS.CONCERTS.PENDING)
    return adminConcertModerationListSchema.parse(data)
  },

  /**
   * Lists approved concerts.
   */
  async listApproved(): Promise<AdminConcertModerationDto[]> {
    const { data } = await http.get(API_ENDPOINTS.CONCERTS.APPROVED)
    return adminConcertModerationListSchema.parse(data)
  },

  /**
   * Lists rejected concerts.
   */
  async listRejected(): Promise<AdminConcertModerationDto[]> {
    const { data } = await http.get(API_ENDPOINTS.CONCERTS.REJECTED)
    return adminConcertModerationListSchema.parse(data)
  },

  /**
   * Validates a concert by identifier.
   *
   * @param concertId Concert identifier.
   */
  async validate(concertId: string): Promise<ConcertDetailsDto> {
    const parsedConcertId = concertIdSchema.parse(concertId)
    const { data } = await http.post(API_ENDPOINTS.CONCERTS.VALIDATE(parsedConcertId))
    return concertDetailsSchema.parse(data)
  },

  /**
   * Rejects a concert by identifier.
   *
   * @param concertId Concert identifier.
   */
  async reject(concertId: string): Promise<ConcertDetailsDto> {
    const parsedConcertId = concertIdSchema.parse(concertId)
    const { data } = await http.post(API_ENDPOINTS.CONCERTS.REJECT(parsedConcertId))
    return concertDetailsSchema.parse(data)
  },
}
