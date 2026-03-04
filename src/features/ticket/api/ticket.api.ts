import {
  customerTicketListSchema,
  purchaseTicketRequestSchema,
  ticketDetailsListSchema,
  type CustomerTicketDto,
  type PurchaseTicketRequestDto,
  type TicketDetailsListDto,
} from '@/features/ticket/model/ticket.types'
import { http } from '@/shared/api/http'
import { API_ENDPOINTS } from '@/shared/config/api-routes'

export const ticketApi = {
  async listMine(): Promise<CustomerTicketDto[]> {
    const { data } = await http.get(API_ENDPOINTS.TICKETS.ME)
    return customerTicketListSchema.parse(data)
  },

  async purchase(input: PurchaseTicketRequestDto): Promise<TicketDetailsListDto> {
    const payload = purchaseTicketRequestSchema.parse(input)
    const { data } = await http.post(API_ENDPOINTS.TICKETS.PURCHASE, payload)
    return ticketDetailsListSchema.parse(data)
  },
}
