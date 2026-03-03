import { z } from 'zod'

const isoDateTimeSchema = z.string().datetime({ offset: true })
const nullableNumberSchema = z.number().nullable()

export const statsGranularitySchema = z.enum(['DAY', 'WEEK', 'MONTH'])

export const organizerConcertStatsQuerySchema = z.object({
  from: isoDateTimeSchema,
  to: isoDateTimeSchema,
  granularity: statsGranularitySchema.default('MONTH'),
  top: z.number().int().min(1).max(100).default(10),
  includeConcerts: z.boolean().default(true),
})

export const statsBreakdownRowSchema = z.object({
  key: z.string(),
  label: z.string(),
  concertCount: z.number(),
  ticketQuantity: z.number(),
  ticketSold: z.number(),
  ticketAvailable: z.number(),
  sellThroughRatePct: z.number(),
  grossRevenue: z.number(),
  sharePct: z.number(),
})

export const statsTimelineRowSchema = z.object({
  bucketStart: isoDateTimeSchema,
  bucketEnd: isoDateTimeSchema,
  bucketLabel: z.string(),
  concertsCreated: z.number(),
  ticketQuantity: z.number(),
  ticketSold: z.number(),
  revenueGross: z.number(),
})

export const statsRankingRowSchema = z.object({
  concertId: z.uuid(),
  concertTitle: z.string(),
  concertArtist: z.string().nullable().optional(),
  concertDate: isoDateTimeSchema,
  concertStatus: z.string(),
  ticketQuantity: z.number(),
  ticketSold: z.number(),
  sellThroughRatePct: z.number(),
  grossRevenue: z.number(),
})

export const statsConcertRowSchema = z.object({
  concertId: z.uuid(),
  concertTitle: z.string(),
  concertArtist: z.string().nullable().optional(),
  concertCreatedAt: isoDateTimeSchema,
  concertDate: isoDateTimeSchema,
  concertStatus: z.string(),
  placeName: z.string(),
  placeAddress: z.string(),
  placeZipCode: z.number().int(),
  placeCity: z.string(),
  placeCapacity: z.number().int(),
  ticketQuantity: z.number(),
  ticketSold: z.number(),
  ticketAvailable: z.number(),
  sellThroughRatePct: z.number(),
  grossRevenue: z.number(),
  ticketUnitPrice: z.number(),
  isPublished: z.boolean(),
  isPast: z.boolean(),
  daysUntilConcert: z.number(),
})

export const organizerConcertStatsResponseSchema = z.object({
  generatedAt: isoDateTimeSchema,
  period: z.object({
    from: isoDateTimeSchema,
    to: isoDateTimeSchema,
    granularity: statsGranularitySchema,
    top: z.number().int(),
    includeConcerts: z.boolean(),
  }),
  overview: z.object({
    totalConcerts: z.number(),
    publishedConcerts: z.number(),
    pendingConcerts: z.number(),
    rejectedConcerts: z.number(),
    upcomingConcerts: z.number(),
    pastConcerts: z.number(),
    totalTicketQuantity: z.number(),
    totalTicketSold: z.number(),
    totalTicketAvailable: z.number(),
    globalSellThroughRatePct: z.number(),
    averageConcertSellThroughRatePct: z.number(),
    grossRevenue: z.number(),
    averageTicketPrice: z.number(),
    averageRevenuePerConcert: z.number(),
  }),
  overviewVsPreviousPeriod: z.object({
    concertsDeltaPct: nullableNumberSchema,
    soldTicketsDeltaPct: nullableNumberSchema,
    revenueDeltaPct: nullableNumberSchema,
    sellThroughDeltaPct: nullableNumberSchema,
  }),
  statusBreakdown: z.array(statsBreakdownRowSchema),
  cityBreakdown: z.array(statsBreakdownRowSchema),
  placeBreakdown: z.array(statsBreakdownRowSchema),
  timeline: z.array(statsTimelineRowSchema),
  rankings: z.object({
    topByRevenue: z.array(statsRankingRowSchema),
    topBySellThrough: z.array(statsRankingRowSchema),
    topByTicketsSold: z.array(statsRankingRowSchema),
    worstBySellThrough: z.array(statsRankingRowSchema),
  }),
  concerts: z.array(statsConcertRowSchema).default([]),
})

export type StatsGranularity = z.infer<typeof statsGranularitySchema>
export type OrganizerConcertStatsQueryDto = z.infer<typeof organizerConcertStatsQuerySchema>
export type OrganizerConcertStatsResponseDto = z.infer<typeof organizerConcertStatsResponseSchema>
export type OrganizerStatsBreakdownRowDto = z.infer<typeof statsBreakdownRowSchema>
export type OrganizerStatsTimelineRowDto = z.infer<typeof statsTimelineRowSchema>
export type OrganizerStatsRankingRowDto = z.infer<typeof statsRankingRowSchema>
export type OrganizerStatsConcertRowDto = z.infer<typeof statsConcertRowSchema>
