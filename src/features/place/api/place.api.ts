import { placeListSchema, type PlaceDto } from '@/features/place/model/place.types'
import { http } from '@/shared/api/http'
import { API_ENDPOINTS } from '@/shared/config/api-routes'

/**
 * Places API client.
 */
export const placeApi = {
  /**
   * Retrieves all places available for concert creation.
   */
  async listAll(): Promise<PlaceDto[]> {
    const { data } = await http.get(API_ENDPOINTS.PLACES.ALL)
    return placeListSchema.parse(data)
  },
}
