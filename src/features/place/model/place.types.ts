import { z } from 'zod'

export const placeSchema = z.object({
  placeId: z.uuid(),
  placeName: z.string().min(1),
  placeAddress: z.string().min(1),
  placeCity: z.string().min(1),
  placeZipCode: z.number().int(),
  placeCapacity: z.number().int().positive(),
})

export const placeListSchema = z.array(placeSchema)

export type PlaceDto = z.infer<typeof placeSchema>
