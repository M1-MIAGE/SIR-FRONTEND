import { z } from 'zod'

/**
 * Runtime schema for a venue entry returned by the places API.
 */
export const placeSchema = z.object({
  placeId: z.uuid(),
  placeName: z.string().min(1),
  placeAddress: z.string().min(1),
  placeCity: z.string().min(1),
  placeZipCode: z.number().int(),
  placeCapacity: z.number().int().positive(),
})

/**
 * Runtime schema for a list of venues.
 */
export const placeListSchema = z.array(placeSchema)

/**
 * Parsed DTO representing one venue.
 */
export type PlaceDto = z.infer<typeof placeSchema>
