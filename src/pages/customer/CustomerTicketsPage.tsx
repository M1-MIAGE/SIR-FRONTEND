import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import JsBarcode from 'jsbarcode'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Dialog } from 'primereact/dialog'
import { Message } from 'primereact/message'
import { Tag } from 'primereact/tag'
import { ticketApi } from '@/features/ticket/api/ticket.api'
import type { CustomerTicketDto } from '@/features/ticket/model/ticket.types'
import { mapApiErrorCode } from '@/shared/api/map-api-error'
import { ERROR_CODES, ROUTES } from '@/shared/config/routes'
import { currencyFormatter, dateTimeFormatter, numberFormatter } from '@/shared/lib/formatters'
import PageContainer from '@/shared/ui/layout/PageContainer'
import StackedCardSkeleton from '@/shared/ui/primereact/StackedCardSkeleton'
import {rowsPerPageOptions} from "@/shared/lib/table.ts";

const isUpcomingConcert = (concertDate: string): boolean => new Date(concertDate).getTime() >= Date.now()

const ticketStatus = (concertDate: string): { label: string; severity: 'success' | 'warning' } =>
  isUpcomingConcert(concertDate)
    ? { label: 'A venir', severity: 'success' }
    : { label: 'Passe', severity: 'warning' }

const formatPlace = (ticket: CustomerTicketDto): string => {
  const name = ticket.placeName ?? 'N/A'
  const city = ticket.placeCity ?? ''
  return city ? `${name} (${city})` : name
}

export default function CustomerTicketsPage() {
  const navigate = useNavigate()

  const [tickets, setTickets] = useState<CustomerTicketDto[]>([])
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [barcodeDialogTicket, setBarcodeDialogTicket] = useState<CustomerTicketDto | null>(null)
  const [barcodeRenderError, setBarcodeRenderError] = useState<string | null>(null)
  const barcodeSvgRef = useRef<SVGSVGElement | null>(null)

  const loadTickets = useCallback(
    async (initialLoad = false) => {
      if (initialLoad) {
        setIsLoading(true)
      } else {
        setIsRefreshing(true)
      }

      setApiError(null)

      try {
        const response = await ticketApi.listMine()
        setTickets(response)
      } catch (error) {
        const code = mapApiErrorCode(error)

        if (code === ERROR_CODES.UNAUTHORIZED || code === ERROR_CODES.FORBIDDEN) {
          navigate(ROUTES.errors.byCode(code), { replace: true })
          return
        }

        setApiError(code)
      } finally {
        if (initialLoad) {
          setIsLoading(false)
        } else {
          setIsRefreshing(false)
        }
      }
    },
    [navigate],
  )

  const renderBarcode = useCallback(() => {
    if (!barcodeDialogTicket || !barcodeSvgRef.current) return

    try {
      barcodeSvgRef.current.innerHTML = ''

      JsBarcode(barcodeSvgRef.current, barcodeDialogTicket.ticketBarcode, {
        format: 'CODE128',
        width: 2,
        height: 96,
        margin: 8,
        displayValue: true,
        fontSize: 16,
        lineColor: '#111827',
        background: '#ffffff',
      })

      setBarcodeRenderError(null)
    } catch {
      setBarcodeRenderError('Impossible de generer le code-barres pour ce ticket.')
    }
  }, [barcodeDialogTicket])

  useEffect(() => {
    void loadTickets(true)
  }, [loadTickets])

  const totalSpent = useMemo(
    () => tickets.reduce((accumulator, ticket) => accumulator + ticket.ticketPrice, 0),
    [tickets],
  )

  const upcomingTicketsCount = useMemo(
    () => tickets.filter((ticket) => isUpcomingConcert(ticket.concertDate)).length,
    [tickets],
  )

  return (
    <PageContainer
      title="Mes tickets"
      subtitle="Retrouvez tous vos billets achetes."
      actions={
        <Button
          label="Rafraichir"
          icon="pi pi-refresh"
          loading={isRefreshing}
          onClick={() => void loadTickets(false)}
        />
      }
    >
      <div className="customer-ticket-page">
        {apiError ? <Message severity="warn" text={`Erreur API tickets: ${apiError}`} /> : null}

        {isLoading ? (
          <StackedCardSkeleton titleWidth="14rem" tailWidth="75%" />
        ) : (
          <>
            <section className="customer-ticket-kpi-grid">
              <Card className="customer-ticket-kpi-card">
                <p className="customer-ticket-small-muted">Tickets achetés</p>
                <h3>{numberFormatter.format(tickets.length)}</h3>
              </Card>
              <Card className="customer-ticket-kpi-card">
                <p className="customer-ticket-small-muted">Concerts à venir</p>
                <h3>{numberFormatter.format(upcomingTicketsCount)}</h3>
              </Card>
              <Card className="customer-ticket-kpi-card">
                <p className="customer-ticket-small-muted">Depense totale</p>
                <h3>{currencyFormatter.format(totalSpent)}</h3>
              </Card>
            </section>

            <Card title="Liste des tickets">
              {tickets.length === 0 ? (
                <Message severity="info" text="Aucun ticket achete pour le moment." />
              ) : (
                <DataTable
                    value={tickets}
                    size="small"
                    stripedRows
                    paginator
                    rows={10}
                    rowsPerPageOptions={rowsPerPageOptions}
                >
                  <Column field="concertTitle" header="Concert" sortable/>
                  <Column
                    field="concertArtist"
                    header="Artiste"
                    sortable
                    body={(row: CustomerTicketDto) => row.concertArtist ?? 'N/A'}
                  />
                  <Column
                    field="concertDate"
                    header="Date"
                    sortable
                    body={(row: CustomerTicketDto) =>
                      dateTimeFormatter.format(new Date(row.concertDate))
                    }
                  />
                  <Column
                    header="Lieu"
                    body={(row: CustomerTicketDto) => formatPlace(row)}
                  />
                  <Column
                    field="ticketPrice"
                    header="Prix"
                    sortable
                    body={(row: CustomerTicketDto) => currencyFormatter.format(row.ticketPrice)}
                  />
                  <Column
                    header="Barcode"
                    body={(row: CustomerTicketDto) => (
                      <Button
                        type="button"
                        size="small"
                        outlined
                        icon="pi pi-qrcode"
                        label="Voir code-barres"
                        onClick={() => setBarcodeDialogTicket(row)}
                      />
                    )}
                  />
                  <Column
                    header="Statut"
                    body={(row: CustomerTicketDto) => {
                      const status = ticketStatus(row.concertDate)
                      return <Tag value={status.label} severity={status.severity} />
                    }}
                  />
                </DataTable>
              )}
            </Card>
          </>
        )}

        <Dialog
          header={barcodeDialogTicket ? `Ticket ${barcodeDialogTicket.ticketId}` : 'Code-barres ticket'}
          visible={Boolean(barcodeDialogTicket)}
          style={{ width: 'min(92vw, 38rem)' }}
          modal
          dismissableMask
          onShow={renderBarcode}
          onHide={() => {
            setBarcodeDialogTicket(null)
            setBarcodeRenderError(null)
          }}
        >
          {barcodeDialogTicket ? (
            <div className="customer-ticket-barcode-modal">
              <p className="customer-ticket-small-muted">
                {barcodeDialogTicket.concertTitle} -{' '}
                {dateTimeFormatter.format(new Date(barcodeDialogTicket.concertDate))}
              </p>
              <p className="customer-ticket-small-muted">
                Prix: {currencyFormatter.format(barcodeDialogTicket.ticketPrice)}
              </p>
              {barcodeRenderError ? <Message severity="warn" text={barcodeRenderError} /> : null}
              <div className="customer-ticket-barcode-wrap">
                <svg ref={barcodeSvgRef} />
              </div>
            </div>
          ) : null}
        </Dialog>
      </div>
    </PageContainer>
  )
}
