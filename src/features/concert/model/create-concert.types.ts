import { z } from 'zod'

export const createConcertRequestSchema = z.object({
  title: z.string().trim().min(2),
  artist: z.string().trim().min(2),
  date: z.string().datetime(),
  organizerId: z.uuid(),
  placeId: z.uuid(),
  ticketUnitPrice: z.number().positive(),
  ticketQuantity: z.number().int().positive(),
})

export type CreateConcertRequestDto = z.infer<typeof createConcertRequestSchema>
