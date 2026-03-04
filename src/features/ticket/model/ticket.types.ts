import { z } from 'zod'

const isoDateTimeSchema = z.string().datetime({ offset: true })

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

const backendCustomerTicketSchema = z.object({
  ticketId: z.uuid(),
  ticketPrice: z.number().nonnegative(),
  ticketBarCode: z.string().min(1).optional(),
  concertTitle: z.string().min(1),
  concertArtist: z.string().nullable().optional(),
  concertDate: isoDateTimeSchema,
  placeName: z.string().nullable().optional(),
  placeAddress: z.string().nullable().optional(),
  placeZipCode: z.number().int().nullable().optional(),
  placeCity: z.string().nullable().optional(),
  placeCapacity: z.number().int().nullable().optional(),
})

export const customerTicketSchema = backendCustomerTicketSchema.transform((value) => ({
  ticketId: value.ticketId,
  ticketPrice: value.ticketPrice,
  ticketBarcode: value.ticketBarCode ?? 'N/A',
  concertTitle: value.concertTitle,
  concertArtist: value.concertArtist ?? null,
  concertDate: value.concertDate,
  placeName: value.placeName ?? null,
  placeAddress: value.placeAddress ?? null,
  placeZipCode: value.placeZipCode ?? null,
  placeCity: value.placeCity ?? null,
  placeCapacity: value.placeCapacity ?? null,
}))

export const customerTicketListSchema = z.array(customerTicketSchema)

export type PurchaseTicketRequestDto = z.infer<typeof purchaseTicketRequestSchema>
export type TicketDetailsDto = z.infer<typeof ticketDetailsSchema>
export type TicketDetailsListDto = z.infer<typeof ticketDetailsListSchema>
export type CustomerTicketDto = z.infer<typeof customerTicketSchema>
