import {
  createConcertRequestSchema,
  type CreateConcertRequestDto,
} from '@/features/concert/model/create-concert.types'
import { http } from '@/shared/api/http'
import { API_ENDPOINTS } from '@/shared/config/api-routes'

/**
 * Organizer concerts API client.
 */
export const organizerConcertApi = {
  /**
   * Creates a new concert draft.
   *
   * @param input Concert creation payload.
   */
  async create(input: CreateConcertRequestDto): Promise<void> {
    const payload = createConcertRequestSchema.parse(input)
    await http.post(API_ENDPOINTS.CONCERTS.CREATE, payload)
  },
}
