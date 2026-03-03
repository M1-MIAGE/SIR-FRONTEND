import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Message } from 'primereact/message'
import { Skeleton } from 'primereact/skeleton'
import { TabPanel, TabView } from 'primereact/tabview'
import { adminConcertApi } from '@/features/concert/api/admin-concert.api'
import type { AdminConcertModerationDto } from '@/features/concert/model/admin-concert.types'
import { mapApiErrorCode } from '@/shared/api/map-api-error'
import { ERROR_CODES, ROUTES } from '@/shared/config/routes'
import PageContainer from '@/shared/ui/layout/PageContainer'

const numberFormatter = new Intl.NumberFormat('fr-FR')
const dateTimeFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const formatOrganizer = (row: AdminConcertModerationDto): string => {
  const fullName = `${row.organizerFirstName ?? ''} ${row.organizerLastName ?? ''}`.trim()
  return fullName.length > 0 ? fullName : 'N/A'
}

const formatLocation = (row: AdminConcertModerationDto): string => {
  const city = row.placeCity ?? ''
  const zip = row.placeZipCode ? String(row.placeZipCode) : ''
  const combined = `${zip} ${city}`.trim()
  return combined.length > 0 ? combined : 'N/A'
}

export default function AdminHomePage() {
  const navigate = useNavigate()

  const [pendingConcerts, setPendingConcerts] = useState<AdminConcertModerationDto[]>([])
  const [approvedConcerts, setApprovedConcerts] = useState<AdminConcertModerationDto[]>([])
  const [rejectedConcerts, setRejectedConcerts] = useState<AdminConcertModerationDto[]>([])

  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isValidatingConcertId, setIsValidatingConcertId] = useState<string | null>(null)
  const [isRejectingConcertId, setIsRejectingConcertId] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const loadModerationData = useCallback(
    async (initialLoad = false) => {
      if (initialLoad) {
        setIsLoading(true)
      } else {
        setIsRefreshing(true)
      }

      setApiError(null)

      try {
        const [pending, approved, rejected] = await Promise.all([
          adminConcertApi.listPending(),
          adminConcertApi.listApproved(),
          adminConcertApi.listRejected(),
        ])

        setPendingConcerts(pending)
        setApprovedConcerts(approved)
        setRejectedConcerts(rejected)
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

  useEffect(() => {
    void loadModerationData(true)
  }, [loadModerationData])

  const moderationCounts = useMemo(
    () => [
      { label: 'En attente', value: pendingConcerts.length },
      { label: 'Approuves', value: approvedConcerts.length },
      { label: 'Rejetés', value: rejectedConcerts.length },
    ],
    [approvedConcerts.length, pendingConcerts.length, rejectedConcerts.length],
  )

  const handleValidateConcert = useCallback(
    async (concertId: string) => {
      setSuccessMessage(null)
      setApiError(null)
      setIsValidatingConcertId(concertId)

      try {
        const validated = await adminConcertApi.validate(concertId)
        setSuccessMessage(`Concert validé: ${validated.title}`)
        setActiveTabIndex(1)
        await loadModerationData(false)
      } catch (error) {
        const code = mapApiErrorCode(error)

        if (code === ERROR_CODES.UNAUTHORIZED || code === ERROR_CODES.FORBIDDEN) {
          navigate(ROUTES.errors.byCode(code), { replace: true })
          return
        }

        setApiError(code)
      } finally {
        setIsValidatingConcertId(null)
      }
    },
    [loadModerationData, navigate],
  )

  const handleRejectConcert = useCallback(
    async (concertId: string) => {
      setSuccessMessage(null)
      setApiError(null)
      setIsRejectingConcertId(concertId)

      try {
        const rejected = await adminConcertApi.reject(concertId)
        setSuccessMessage(`Concert refusé: ${rejected.title}`)
        setActiveTabIndex(2)
        await loadModerationData(false)
      } catch (error) {
        const code = mapApiErrorCode(error)

        if (code === ERROR_CODES.UNAUTHORIZED || code === ERROR_CODES.FORBIDDEN) {
          navigate(ROUTES.errors.byCode(code), { replace: true })
          return
        }

        setApiError(code)
      } finally {
        setIsRejectingConcertId(null)
      }
    },
    [loadModerationData, navigate],
  )

  const renderConcertTable = (rows: AdminConcertModerationDto[], enableValidateAction = false) => (
    <DataTable value={rows} size="small" stripedRows paginator rows={5} emptyMessage="Aucun concert trouve.">
      <Column field="concertTitle" header="Concert" />
      <Column
        field="concertArtist"
        header="Artiste"
        body={(row: AdminConcertModerationDto) => row.concertArtist ?? 'N/A'}
      />
      <Column
        field="concertCreatedAt"
        header="Créé le"
        body={(row: AdminConcertModerationDto) =>
          dateTimeFormatter.format(new Date(row.concertCreatedAt))
        }
      />
      <Column
        field="concertDate"
        header="Date concert"
        body={(row: AdminConcertModerationDto) => dateTimeFormatter.format(new Date(row.concertDate))}
      />
      <Column header="Organisateur" body={(row: AdminConcertModerationDto) => formatOrganizer(row)} />
      <Column header="Ville" body={(row: AdminConcertModerationDto) => formatLocation(row)} />
      <Column
        field="placeCapacity"
        header="Capacité"
        body={(row: AdminConcertModerationDto) =>
          row.placeCapacity === null ? 'N/A' : numberFormatter.format(row.placeCapacity)
        }
      />
      <Column
        field="ticketQuantity"
        header="Billets"
        body={(row: AdminConcertModerationDto) => numberFormatter.format(row.ticketQuantity)}
      />
      {enableValidateAction ? (
        <Column
          header="Action"
          body={(row: AdminConcertModerationDto) => (
            <div className="admin-action-cell">
              <Button
                label="Valider"
                icon="pi pi-check"
                size="small"
                severity="success"
                loading={isValidatingConcertId === row.concertId}
                disabled={Boolean(isValidatingConcertId || isRejectingConcertId)}
                onClick={() => void handleValidateConcert(row.concertId)}
              />
              <Button
                label="Refuser"
                icon="pi pi-times"
                size="small"
                severity="danger"
                loading={isRejectingConcertId === row.concertId}
                disabled={Boolean(isValidatingConcertId || isRejectingConcertId)}
                onClick={() => void handleRejectConcert(row.concertId)}
              />
            </div>
          )}
        />
      ) : null}
    </DataTable>
  )

  return (
    <PageContainer
      title="Dashboard Admin"
      subtitle="Moderation des concerts et supervision des statuts."
      actions={
        <Button
          label="Rafraichir"
          icon="pi pi-refresh"
          onClick={() => void loadModerationData(false)}
          loading={isRefreshing}
        />
      }
    >
      <div className="admin-dashboard">
        {apiError ? <Message severity="warn" text={`Erreur API admin: ${apiError}`} /> : null}
        {successMessage ? <Message severity="success" text={successMessage} /> : null}

        {isLoading ? (
          <Card>
            <div className="stack">
              <Skeleton height="2rem" width="16rem" />
              <Skeleton height="1rem" width="100%" />
              <Skeleton height="1rem" width="100%" />
              <Skeleton height="1rem" width="70%" />
            </div>
          </Card>
        ) : (
          <>
            <section className="admin-kpi-grid">
              {moderationCounts.map((item) => (
                <Card key={item.label} className="admin-kpi-card">
                  <p className="admin-kpi-label">{item.label}</p>
                  <h3 className="admin-kpi-value">{numberFormatter.format(item.value)}</h3>
                  <small className="admin-small-muted">Concerts</small>
                </Card>
              ))}
            </section>

            <Card title="Concerts par statut" className="admin-moderation-card">
              <TabView activeIndex={activeTabIndex} onTabChange={(event) => setActiveTabIndex(event.index)}>
                <TabPanel header={`En attente (${pendingConcerts.length})`}>
                  {renderConcertTable(pendingConcerts, true)}
                </TabPanel>
                <TabPanel header={`Approuvés (${approvedConcerts.length})`}>
                  {renderConcertTable(approvedConcerts)}
                </TabPanel>
                <TabPanel header={`Rejetés (${rejectedConcerts.length})`}>
                  {renderConcertTable(rejectedConcerts)}
                </TabPanel>
              </TabView>
            </Card>
          </>
        )}
      </div>
    </PageContainer>
  )
}
