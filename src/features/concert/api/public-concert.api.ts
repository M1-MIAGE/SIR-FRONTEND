import {
  publicConcertPlacesSchema,
  type PublicConcertPlaceDto,
} from '@/features/concert/model/public-concert.types'
import { http } from '@/shared/api/http'
import { API_ENDPOINTS } from '@/shared/config/api-routes'

export const publicConcertApi = {
  async listPublicPlaces(): Promise<PublicConcertPlaceDto[]> {
    const { data } = await http.get(API_ENDPOINTS.CONCERTS.PUBLIC_PLACES)
    return publicConcertPlacesSchema.parse(data)
  },
}
