import { z } from 'zod'

const isoDateTimeSchema = z.string().datetime({ offset: true })

const backendAdminConcertModerationSchema = z.object({
  concertId: z.uuid(),
  concertTitle: z.string().min(1),
  concertArtist: z.string().nullable().optional(),
  concertCreatedAt: isoDateTimeSchema,
  concertDate: isoDateTimeSchema,
  placeAddress: z.string().nullable().optional(),
  placeZipCode: z.number().int().nullable().optional(),
  placeCity: z.string().nullable().optional(),
  placeCapacity: z.number().int().nullable().optional(),
  ticketQuantity: z.number().int().nonnegative(),
  organizerFistName: z.string().nullable().optional(),
  organizerFirstName: z.string().nullable().optional(),
  organizerLastName: z.string().nullable().optional(),
})

/**
 * Normalized schema used by admin moderation screens.
 *
 * It also handles the backend typo `organizerFistName` for compatibility.
 */
export const adminConcertModerationSchema = backendAdminConcertModerationSchema.transform((value) => ({
  concertId: value.concertId,
  concertTitle: value.concertTitle,
  concertArtist: value.concertArtist ?? null,
  concertCreatedAt: value.concertCreatedAt,
  concertDate: value.concertDate,
  placeAddress: value.placeAddress ?? null,
  placeZipCode: value.placeZipCode ?? null,
  placeCity: value.placeCity ?? null,
  placeCapacity: value.placeCapacity ?? null,
  ticketQuantity: value.ticketQuantity,
  organizerFirstName: value.organizerFirstName ?? value.organizerFistName ?? null,
  organizerLastName: value.organizerLastName ?? null,
}))

/**
 * Runtime schema for moderation list responses.
 */
export const adminConcertModerationListSchema = z.array(adminConcertModerationSchema)

/**
 * Runtime schema for a single concert after moderation actions.
 */
export const concertDetailsSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1),
  artist: z.string().nullable().optional(),
  date: isoDateTimeSchema,
  status: z.string().min(1),
  organizerId: z.uuid(),
  adminId: z.uuid().nullable().optional(),
  placeId: z.uuid(),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
})

/**
 * DTO inferred from {@link adminConcertModerationSchema}.
 */
export type AdminConcertModerationDto = z.infer<typeof adminConcertModerationSchema>
/**
 * DTO inferred from {@link concertDetailsSchema}.
 */
export type ConcertDetailsDto = z.infer<typeof concertDetailsSchema>
