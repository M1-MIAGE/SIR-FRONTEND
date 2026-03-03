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

export const adminConcertApi = {
  async listPending(): Promise<AdminConcertModerationDto[]> {
    const { data } = await http.get(API_ENDPOINTS.CONCERTS.PENDING)
    return adminConcertModerationListSchema.parse(data)
  },

  async listApproved(): Promise<AdminConcertModerationDto[]> {
    const { data } = await http.get(API_ENDPOINTS.CONCERTS.APPROVED)
    return adminConcertModerationListSchema.parse(data)
  },

  async listRejected(): Promise<AdminConcertModerationDto[]> {
    const { data } = await http.get(API_ENDPOINTS.CONCERTS.REJECTED)
    return adminConcertModerationListSchema.parse(data)
  },

  async validate(concertId: string): Promise<ConcertDetailsDto> {
    const parsedConcertId = concertIdSchema.parse(concertId)
    const { data } = await http.post(API_ENDPOINTS.CONCERTS.VALIDATE(parsedConcertId))
    return concertDetailsSchema.parse(data)
  },

  async reject(concertId: string): Promise<ConcertDetailsDto> {
    const parsedConcertId = concertIdSchema.parse(concertId)
    const { data } = await http.post(API_ENDPOINTS.CONCERTS.REJECT(parsedConcertId))
    return concertDetailsSchema.parse(data)
  },
}
