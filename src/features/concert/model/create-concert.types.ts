import { z } from 'zod'

/**
 * API payload schema used when creating a concert.
 */
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

/**
 * Form schema used in UI before mapping to backend payload shape.
 */
export const createConcertFormSchema = z.object({
  title: z.string().trim().min(2, 'Titre requis (min 2 caracteres).'),
  description: z.string().trim().min(12, 'Description requise (min 12 caracteres).'),
  artist: z.string().trim().min(2, 'Artiste requis (min 2 caracteres).'),
  date: z.date().refine((value) => !Number.isNaN(value.getTime()), 'Date et heure requises.'),
  placeId: z.uuid('Lieu requis.'),
  ticketUnitPrice: z.number().positive('Prix unitaire invalide.'),
  ticketQuantity: z.number().int('Quantité invalide.').positive('Quantite invalide.'),
})

/**
 * Form values inferred from {@link createConcertFormSchema}.
 */
export type CreateConcertFormValues = z.infer<typeof createConcertFormSchema>
/**
 * API request DTO inferred from {@link createConcertRequestSchema}.
 */
export type CreateConcertRequestDto = z.infer<typeof createConcertRequestSchema>
