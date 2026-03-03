import { useEffect, useMemo, useState } from 'react'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Chip } from 'primereact/chip'
import { Divider } from 'primereact/divider'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import { Message } from 'primereact/message'
import { Skeleton } from 'primereact/skeleton'
import { Tag } from 'primereact/tag'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/auth-context'
import { publicConcertApi } from '@/features/concert/api/public-concert.api'
import type { PublicConcertPlaceDto } from '@/features/concert/model/public-concert.types'
import { mapApiErrorCode } from '@/shared/api/map-api-error'
import { ROUTES } from '@/shared/config/routes'
import { currencyFormatter, dateTimeFormatter } from '@/shared/lib/formatters'

type ConcertLandingSectionsProps = {
  mode: 'public' | 'customer'
}

const CONCERT_IMAGE_POOL = [
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1280&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1280&q=80',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1280&q=80',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1280&q=80',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1280&q=80',
  'https://images.unsplash.com/photo-1464375117522-1311dd7d0b87?w=1280&q=80',
]

const hashString = (value: string): number =>
  value.split('').reduce((acc, char) => ((acc * 31 + char.charCodeAt(0)) >>> 0), 7)

const pickImage = (concertId: string): string =>
  CONCERT_IMAGE_POOL[hashString(concertId) % CONCERT_IMAGE_POOL.length]

type ConcertCard = PublicConcertPlaceDto & {
  imageUrl: string
  dateLabel: string
  ticketUnitPriceLabel: string
  availabilityLabel: string
  availabilitySeverity: 'success' | 'warning' | 'danger'
}

const toConcertCard = (concert: PublicConcertPlaceDto): ConcertCard => {
  const availabilityRatio =
    concert.placeCapacity > 0 ? concert.availablePlaces / concert.placeCapacity : 0

  let availabilitySeverity: ConcertCard['availabilitySeverity'] = 'success'
  let availabilityLabel = 'Disponible'

  if (concert.availablePlaces <= 0) {
    availabilitySeverity = 'danger'
    availabilityLabel = 'Complet'
  } else if (availabilityRatio <= 0.2) {
    availabilitySeverity = 'warning'
    availabilityLabel = 'Dernieres places'
  }

  return {
    ...concert,
    imageUrl: pickImage(concert.concertId),
    dateLabel: dateTimeFormatter.format(new Date(concert.concertDate)),
    ticketUnitPriceLabel: currencyFormatter.format(concert.ticketUnitPrice),
    availabilityLabel,
    availabilitySeverity,
  }
}

export default function ConcertLandingSections({ mode }: ConcertLandingSectionsProps) {
  const navigate = useNavigate()
  const { isAuthenticated, role } = useAuth()

  const [search, setSearch] = useState('')
  const [concerts, setConcerts] = useState<ConcertCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const run = async () => {
      setIsLoading(true)
      setApiError(null)

      try {
        const response = await publicConcertApi.listPublicPlaces()
        if (!active) {
          return
        }
        setConcerts(response.map(toConcertCard))
      } catch (error) {
        if (!active) {
          return
        }
        setApiError(mapApiErrorCode(error))
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    void run()

    return () => {
      active = false
    }
  }, [])

  const filteredConcerts = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return concerts
    }

    return concerts.filter((concert) =>
      `${concert.concertTitle} ${concert.concertArtist} ${concert.placeName} ${concert.placeCity}`
        .toLowerCase()
        .includes(query),
    )
  }, [concerts, search])

  const featuredConcerts = useMemo(
    () => [...concerts].sort((a, b) => b.availablePlaces - a.availablePlaces).slice(0, 4),
    [concerts],
  )

  const cities = useMemo(
    () => Array.from(new Set(concerts.map((concert) => concert.placeCity))).slice(0, 12),
    [concerts],
  )

  const goPrimary = () => {
    if (mode === 'customer') {
      navigate(ROUTES.roleHome('CUSTOMER'))
      return
    }

    if (isAuthenticated && role) {
      navigate(ROUTES.dashboard())
      return
    }

    navigate(ROUTES.register())
  }

  const goLogin = () => {
    navigate(ROUTES.login())
  }

  const renderSkeletonGrid = () => (
    <div className="public-home-events-grid">
      {[1, 2, 3, 4].map((key) => (
        <Card key={key} className="public-home-event-card">
          <Skeleton height="10.5rem" borderRadius="0.8rem" />
          <Skeleton height="1.1rem" className="mt-2" />
          <Skeleton height="0.9rem" />
          <Skeleton height="0.9rem" />
          <Skeleton height="0.9rem" width="8rem" />
        </Card>
      ))}
    </div>
  )

  return (
    <main className={`public-home-main ${mode === 'customer' ? 'public-home-main--embedded' : ''}`}>
      <section id="hero" className="public-home-hero">
        <div className="public-home-hero-overlay" />
        <div className="public-home-hero-content">
          <Chip label="Concerts + Billets + Experience" className="public-home-hero-chip" />
          <h1 className="public-home-hero-title">
            Vivez des soirees
            <span>inoubliables</span>
          </h1>
          <p className="public-home-hero-subtitle">
            Découvrez les meilleurs concerts près de chez vous. Réservez vos places en toute sécurité.
          </p>

          <div className="public-home-search">
            <IconField iconPosition="left" className="public-home-search-field">
              <InputIcon className="pi pi-search" />
              <InputText
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher un artiste, un lieu, une ville"
              />
            </IconField>
            <Button label="Explorer" icon="pi pi-arrow-right" onClick={goPrimary} />
          </div>

          <div className="public-home-genre-list">
            {cities.map((city) => (
              <Chip key={city} label={city} />
            ))}
          </div>

          <div className="public-home-hero-actions">
            <Button
              label={
                mode === 'customer' ? 'Mes reservations' : isAuthenticated ? 'Mon espace' : 'Creer un compte'
              }
              icon="pi pi-user-plus"
              onClick={goPrimary}
            />
            {mode === 'public' && !isAuthenticated ? (
              <Button label="Se connecter" icon="pi pi-sign-in" outlined onClick={goLogin} />
            ) : null}
          </div>
        </div>
      </section>

      {apiError ? (
        <section className="public-home-section">
          <Message severity="warn" text={`Erreur API concerts: ${apiError}`} />
        </section>
      ) : null}

      <section id="featured" className="public-home-section">
        <div className="public-home-section-head">
          <h2>Evènements vedettes</h2>
          <Tag value={`${featuredConcerts.length} concerts`} severity="info" />
        </div>

        {isLoading ? (
          renderSkeletonGrid()
        ) : (
          <div className="public-home-events-grid">
            {featuredConcerts.map((concert) => (
              <Card key={concert.concertId} className="public-home-event-card">
                <div className="public-home-event-image-wrap">
                  <img
                    src={concert.imageUrl}
                    alt={concert.concertTitle}
                    className="public-home-event-image"
                  />
                  <Tag value="A LA UNE" severity="warning" className="public-home-event-tag" />
                </div>

                <h3>{concert.concertTitle}</h3>
                <p>
                  <i className="pi pi-microphone" /> {concert.concertArtist ?? "Aucun artist"}
                </p>
                <p>
                  <i className="pi pi-calendar" /> {concert.dateLabel}
                </p>
                <p>
                  <i className="pi pi-map-marker" /> {concert.placeName}, {concert.placeCity}
                </p>
                <p className="public-home-event-price">
                  <i className="pi pi-ticket" /> Prix unitaire: {concert.ticketUnitPriceLabel}
                </p>
                <div className="public-home-event-meta">
                  <Tag value={concert.availabilityLabel} severity={concert.availabilitySeverity} />
                  <small>
                    {concert.availablePlaces}/{concert.placeCapacity} places
                  </small>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section id="upcoming" className="public-home-section public-home-section-muted">
        <div className="public-home-section-head">
          <h2>Evenements a venir</h2>
          <Tag value={`${filteredConcerts.length} resultats`} severity="success" />
        </div>

        {isLoading ? (
          renderSkeletonGrid()
        ) : (
          <div className="public-home-events-grid">
            {filteredConcerts.map((concert) => (
              <Card key={concert.concertId} className="public-home-event-card">
                <div className="public-home-event-image-wrap">
                  <img
                    src={concert.imageUrl}
                    alt={concert.concertTitle}
                    className="public-home-event-image"
                  />
                </div>

                <h3>{concert.concertTitle}</h3>
                <p>
                  <i className="pi pi-microphone" /> {concert.concertArtist}
                </p>
                <p>
                  <i className="pi pi-calendar" /> {concert.dateLabel}
                </p>
                <p>
                  <i className="pi pi-map-marker" /> {concert.placeAddress}, {concert.placeZipCode}{' '}
                  {concert.placeCity}
                </p>
                <p className="public-home-event-price">
                  <i className="pi pi-ticket" /> Prix unitaire: {concert.ticketUnitPriceLabel}
                </p>
                <div className="public-home-event-meta">
                  <Tag value={concert.availabilityLabel} severity={concert.availabilitySeverity} />
                  <small>
                    {concert.availablePlaces}/{concert.placeCapacity} places
                  </small>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="public-home-section">
        <Card className="public-home-cta">
          <h2>Pret a reserver votre prochaine sortie ?</h2>
          <p>Connectez-vous ou accedez a votre espace pour continuer.</p>
          <div className="public-home-cta-actions">
            <Button
              label={mode === 'customer' ? 'Mon espace client' : 'Mon espace'}
              icon="pi pi-th-large"
              onClick={goPrimary}
            />
            {mode === 'public' && !isAuthenticated ? (
              <Button label="Connexion" icon="pi pi-sign-in" outlined onClick={goLogin} />
            ) : null}
          </div>
          <Divider />
          <small>Data source: GET /concerts/public/places</small>
        </Card>
      </section>
    </main>
  )
}
