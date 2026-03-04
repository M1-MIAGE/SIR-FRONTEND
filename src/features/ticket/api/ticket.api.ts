import {
  purchaseTicketRequestSchema,
  ticketDetailsListSchema,
  type PurchaseTicketRequestDto,
  type TicketDetailsListDto,
} from '@/features/ticket/model/ticket.types'
import { http } from '@/shared/api/http'
import { API_ENDPOINTS } from '@/shared/config/api-routes'

export const ticketApi = {
  async purchase(input: PurchaseTicketRequestDto): Promise<TicketDetailsListDto> {
    const payload = purchaseTicketRequestSchema.parse(input)
    const { data } = await http.post(API_ENDPOINTS.TICKETS.PURCHASE, payload)
    return ticketDetailsListSchema.parse(data)
  },
}
