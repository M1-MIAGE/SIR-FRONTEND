import { z } from 'zod'

const isoDateTimeSchema = z.string().datetime({ offset: true })

/**
 * Request schema used to buy one or more tickets for a concert.
 */
export const purchaseTicketRequestSchema = z.object({
  concertId: z.uuid(),
  quantity: z.number().int().positive(),
})

/**
 * Schema of one newly issued ticket returned by purchase endpoint.
 */
export const ticketDetailsSchema = z.object({
  ticketId: z.uuid(),
  ticketBarcode: z.string().min(1),
  ticketPrice: z.number().nonnegative(),
})

/**
 * Schema for purchase responses containing multiple tickets.
 */
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

/**
 * Normalized schema for customer tickets list.
 *
 * It maps backend `ticketBarCode` to `ticketBarcode` and fills nullable fields.
 */
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

/**
 * Schema for the authenticated customer's ticket collection.
 */
export const customerTicketListSchema = z.array(customerTicketSchema)

/**
 * DTO inferred from {@link purchaseTicketRequestSchema}.
 */
export type PurchaseTicketRequestDto = z.infer<typeof purchaseTicketRequestSchema>
/**
 * DTO inferred from {@link ticketDetailsSchema}.
 */
export type TicketDetailsDto = z.infer<typeof ticketDetailsSchema>
/**
 * DTO inferred from {@link ticketDetailsListSchema}.
 */
export type TicketDetailsListDto = z.infer<typeof ticketDetailsListSchema>
/**
 * DTO inferred from {@link customerTicketSchema}.
 */
export type CustomerTicketDto = z.infer<typeof customerTicketSchema>
