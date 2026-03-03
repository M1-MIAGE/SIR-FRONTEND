import { z } from 'zod'

export const createConcertRequestSchema = z.object({
  title: z.string().trim().min(2, "Trop court, au moins 2 caractères"),
  description: z.string().trim().min(12, "Trop court, au moins 12 caractères"),
  artist: z.string().trim().min(2, "Trop court, au moins 2 caractères"),
  date: z.string().datetime(),
  organizerId: z.uuid(),
  placeId: z.uuid(),
  ticketUnitPrice: z.number().positive(),
  ticketQuantity: z.number().int().positive(),
})

export type CreateConcertRequestDto = z.infer<typeof createConcertRequestSchema>
