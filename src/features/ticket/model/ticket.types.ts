import { z } from 'zod'

export const purchaseTicketRequestSchema = z.object({
  concertId: z.uuid(),
  quantity: z.number().int().positive(),
})

export const ticketDetailsSchema = z.object({
  ticketId: z.uuid(),
  ticketBarcode: z.string().min(1),
  ticketPrice: z.number().nonnegative(),
})

export const ticketDetailsListSchema = z.array(ticketDetailsSchema)

export type PurchaseTicketRequestDto = z.infer<typeof purchaseTicketRequestSchema>
export type TicketDetailsDto = z.infer<typeof ticketDetailsSchema>
export type TicketDetailsListDto = z.infer<typeof ticketDetailsListSchema>
