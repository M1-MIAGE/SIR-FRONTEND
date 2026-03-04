import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { InputNumber } from 'primereact/inputnumber'
import { Message } from 'primereact/message'
import { Tag } from 'primereact/tag'
import type { PublicConcertPlaceDto } from '@/features/concert/model/public-concert.types'
import { ticketApi } from '@/features/ticket/api/ticket.api'
import type { TicketDetailsDto } from '@/features/ticket/model/ticket.types'
import { mapApiErrorCode } from '@/shared/api/map-api-error'
import { ERROR_CODES, ROUTES } from '@/shared/config/routes'
import { currencyFormatter, dateTimeFormatter, numberFormatter } from '@/shared/lib/formatters'
import PageContainer from '@/shared/ui/layout/PageContainer'

type CustomerConcertDetailsLocationState = {
  concert?: PublicConcertPlaceDto
}

const availabilitySeverity = (
  availablePlaces: number,
  placeCapacity: number,
): 'success' | 'warning' | 'danger' => {
  if (availablePlaces <= 0) {
    return 'danger'
  }

  if (placeCapacity > 0 && availablePlaces / placeCapacity <= 0.2) {
    return 'warning'
  }

  return 'success'
}

const availabilityLabel = (availablePlaces: number): string => {
  if (availablePlaces <= 0) {
    return 'Complet'
  }

  return 'Disponible'
}

export default function CustomerConcertDetailsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { concertId } = useParams<{ concertId: string }>()

  const [concert, setConcert] = useState<PublicConcertPlaceDto | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [purchaseResult, setPurchaseResult] = useState<TicketDetailsDto[] | null>(null)
  const [purchaseError, setPurchaseError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const state = location.state as CustomerConcertDetailsLocationState | null
    const concertFromState = state?.concert

    if (!concertId || !concertFromState || concertFromState.concertId !== concertId) {
      setConcert(null)
      return
    }

    setConcert(concertFromState)
  }, [concertId, location.state])

  useEffect(() => {
    if (!concert) {
      return
    }

    const maxAllowed = Math.max(1, concert.availablePlaces)
    setQuantity((previous) => Math.max(1, Math.min(previous, maxAllowed)))
  }, [concert])

  const canPurchase = Boolean(concert && concert.availablePlaces > 0)

  const purchaseTotal = useMemo(() => {
    if (!purchaseResult) {
      return 0
    }

    return purchaseResult.reduce((accumulator, ticket) => accumulator + ticket.ticketPrice, 0)
  }, [purchaseResult])

  const handlePurchase = useCallback(async () => {
    if (!concertId || !concert) {
      return
    }

    setPurchaseError(null)
    setPurchaseResult(null)
    setIsSubmitting(true)

    try {
      const result = await ticketApi.purchase({
        concertId,
        quantity,
      })

      setPurchaseResult(result)
      setConcert((previous) =>
        previous
          ? {
              ...previous,
              availablePlaces: Math.max(previous.availablePlaces - result.length, 0),
            }
          : previous,
      )
      setQuantity(1)
    } catch (error) {
      const code = mapApiErrorCode(error)

      if (code === ERROR_CODES.UNAUTHORIZED || code === ERROR_CODES.FORBIDDEN) {
        navigate(ROUTES.errors.byCode(code), { replace: true })
        return
      }

      setPurchaseError(code)
    } finally {
      setIsSubmitting(false)
    }
  }, [concert, concertId, navigate, quantity])

  return (
    <PageContainer
      title={concert?.concertTitle ?? 'Details concert'}
      subtitle="Informations detaillees et achat de billets."
      actions={
        <Button
          label="Retour"
          icon="pi pi-arrow-left"
          severity="secondary"
          outlined
          onClick={() => navigate(ROUTES.roleHome('CUSTOMER'))}
        />
      }
    >
      <div className="customer-concert-details">
        {!concert ? (
          <Card>
            <Message
              severity="warn"
              text="Concert indisponible depuis cet acces direct. Ouvrez-le depuis le dashboard customer."
            />
          </Card>
        ) : (
          <div className="grid-12">
            <div className="col-12 col-lg-8">
              <Card title="Details du concert" className="customer-concert-card">
                <div className="customer-concert-metrics">
                  <Tag
                    value={availabilityLabel(concert.availablePlaces)}
                    severity={availabilitySeverity(concert.availablePlaces, concert.placeCapacity)}
                  />
                  <Tag value={`${numberFormatter.format(concert.availablePlaces)} places disponibles`} />
                </div>

                <div className="customer-concert-rows">
                  <div className="customer-concert-row">
                    <span className="customer-concert-label">Titre</span>
                    <span>{concert.concertTitle}</span>
                  </div>
                  <div className="customer-concert-row">
                    <span className="customer-concert-label">Artiste</span>
                    <span>{concert.concertArtist ?? 'N/A'}</span>
                  </div>
                  <div className="customer-concert-row">
                    <span className="customer-concert-label">Date</span>
                    <span>{dateTimeFormatter.format(new Date(concert.concertDate))}</span>
                  </div>
                  <div className="customer-concert-row">
                    <span className="customer-concert-label">Lieu</span>
                    <span>{concert.placeName}</span>
                  </div>
                  <div className="customer-concert-row">
                    <span className="customer-concert-label">Adresse</span>
                    <span>
                      {concert.placeAddress}, {concert.placeZipCode} {concert.placeCity}
                    </span>
                  </div>
                  <div className="customer-concert-row">
                    <span className="customer-concert-label">Capacité lieu</span>
                    <span>{numberFormatter.format(concert.placeCapacity)}</span>
                  </div>
                  <div className="customer-concert-row">
                    <span className="customer-concert-label">Billets disponibles</span>
                    <span>{numberFormatter.format(concert.availablePlaces)}</span>
                  </div>
                  <div className="customer-concert-row">
                    <span className="customer-concert-label">Prix unitaire</span>
                    <span>{currencyFormatter.format(concert.ticketUnitPrice)}</span>
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-12 col-lg-4">
              <Card title="Achat de billet" className="customer-purchase-card">
                {!canPurchase ? (
                  <Message severity="warn" text="Ce concert est complet." />
                ) : (
                  <div className="customer-purchase-form">
                    <label htmlFor="ticket-quantity">Quantite</label>
                      <InputNumber
                        inputId="ticket-quantity"
                        value={quantity}
                        min={1}
                        max={concert.availablePlaces}
                        showButtons
                        useGrouping={false}
                        onValueChange={(event) =>
                          setQuantity(Math.min(concert.availablePlaces, Math.max(1, event.value ?? 1)))
                        }
                      />
                    <Button
                      label="Acheter"
                      icon="pi pi-ticket"
                      onClick={() => void handlePurchase()}
                      loading={isSubmitting}
                    />
                  </div>
                )}

                {purchaseError ? (
                  <Message severity="warn" text={`Erreur achat ticket: ${purchaseError}`} />
                ) : null}

                {purchaseResult ? (
                  <Message
                    severity="success"
                    text={`Achat confirme. ${purchaseResult.length} ticket(s) acheté(s). Total: ${currencyFormatter.format(
                      purchaseTotal,
                    )}`}
                  />
                ) : null}
              </Card>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
