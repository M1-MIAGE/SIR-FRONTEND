import { placeListSchema, type PlaceDto } from '@/features/place/model/place.types'
import { http } from '@/shared/api/http'
import { API_ENDPOINTS } from '@/shared/config/api-routes'

export const placeApi = {
  async listAll(): Promise<PlaceDto[]> {
    const { data } = await http.get(API_ENDPOINTS.PLACES.ALL)
    return placeListSchema.parse(data)
  },
}
