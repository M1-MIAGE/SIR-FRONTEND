import {
  publicConcertPlacesSchema,
  type PublicConcertPlaceDto,
} from '@/features/concert/model/public-concert.types'
import { http } from '@/shared/api/http'
import { API_ENDPOINTS } from '@/shared/config/api-routes'

/**
 * Public concerts API client.
 */
export const publicConcertApi = {
  /**
   * Lists published concerts with remaining places and venue information.
   */
  async listPublicPlaces(): Promise<PublicConcertPlaceDto[]> {
    const { data } = await http.get(API_ENDPOINTS.CONCERTS.PUBLIC_PLACES)
    return publicConcertPlacesSchema.parse(data)
  },
}
