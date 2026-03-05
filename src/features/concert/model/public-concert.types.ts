import { z } from 'zod'

/**
 * Runtime schema of a public concert row enriched with place details.
 */
export const publicConcertPlaceSchema = z.object({
  concertId: z.uuid(),
  concertTitle: z.string().min(1),
  concertArtist: z.string().nullable(),
  concertDate: z.string().datetime(),
  placeName: z.string().min(1),
  placeAddress: z.string().min(1),
  placeZipCode: z.number().int(),
  placeCity: z.string().min(1),
  placeCapacity: z.number().int().nonnegative(),
  availablePlaces: z.number().int().nonnegative(),
  ticketUnitPrice: z.number().nonnegative(),
})

/**
 * Runtime schema for public concert list responses.
 */
export const publicConcertPlacesSchema = z.array(publicConcertPlaceSchema)

/**
 * DTO inferred from {@link publicConcertPlaceSchema}.
 */
export type PublicConcertPlaceDto = z.infer<typeof publicConcertPlaceSchema>
