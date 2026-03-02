import { z } from 'zod'

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

export const publicConcertPlacesSchema = z.array(publicConcertPlaceSchema)

export type PublicConcertPlaceDto = z.infer<typeof publicConcertPlaceSchema>
