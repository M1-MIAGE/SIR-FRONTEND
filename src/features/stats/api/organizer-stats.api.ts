import { ZodError } from 'zod'
import { http } from '@/shared/api/http'
import { API_ENDPOINTS } from '@/shared/config/api-routes'
import {
  organizerConcertStatsQuerySchema,
  organizerConcertStatsResponseSchema,
  type OrganizerConcertStatsQueryDto,
  type OrganizerConcertStatsResponseDto,
} from '@/features/stats/model/organizer-stats.types'

type StatsSchemaStage = 'query' | 'response'

/**
 * Error thrown when organizer stats query or response fails schema validation.
 */
export class OrganizerStatsSchemaError extends Error {
  readonly stage: StatsSchemaStage
  readonly issues: ZodError['issues']
  readonly payload: unknown

  constructor(stage: StatsSchemaStage, error: ZodError, payload: unknown) {
    super(`[stats/${stage}] schema validation failed`)
    this.name = 'OrganizerStatsSchemaError'
    this.stage = stage
    this.issues = error.issues
    this.payload = payload
  }
}

/**
 * Type guard for {@link OrganizerStatsSchemaError}.
 */
export const isOrganizerStatsSchemaError = (
  value: unknown,
): value is OrganizerStatsSchemaError => value instanceof OrganizerStatsSchemaError

/**
 * Organizer statistics API client.
 */
export const organizerStatsApi = {
  /**
   * Retrieves statistics for concerts owned by the authenticated organizer.
   *
   * @param input Date range and options for aggregation.
   * @throws {OrganizerStatsSchemaError} When query or response validation fails.
   */
  async getMyConcertsStats(
    input: OrganizerConcertStatsQueryDto,
  ): Promise<OrganizerConcertStatsResponseDto> {
    const parsedQuery = organizerConcertStatsQuerySchema.safeParse(input)
    if (!parsedQuery.success) {
      throw new OrganizerStatsSchemaError('query', parsedQuery.error, input)
    }

    if (import.meta.env.DEV) {
      console.info('[stats] query params', parsedQuery.data)
    }

    const { data } = await http.get(API_ENDPOINTS.STATS.ME_CONCERTS, {
      params: parsedQuery.data,
    })

    const parsedResponse = organizerConcertStatsResponseSchema.safeParse(data)
    if (!parsedResponse.success) {
      throw new OrganizerStatsSchemaError('response', parsedResponse.error, data)
    }

    return parsedResponse.data
  },
}
