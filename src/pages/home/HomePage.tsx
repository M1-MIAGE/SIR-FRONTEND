import { useMemo, useState } from 'react'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Chip } from 'primereact/chip'
import { Divider } from 'primereact/divider'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import { Menubar } from 'primereact/menubar'
import type { MenuItem } from 'primereact/menuitem'
import { Tag } from 'primereact/tag'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/auth-context'
import { ROUTES } from '@/shared/config/routes'

type EventPreview = {
  id: string
  title: string
  city: string
  date: string
  genre: string
  priceFrom: number
  imageUrl: string
  featured?: boolean
}

const featuredEvents: EventPreview[] = [
  {
    id: 'f1',
    title: 'Neon Nights Festival',
    city: 'Paris',
    date: '12 Jun 2026',
    genre: 'Electro',
    priceFrom: 49,
    imageUrl:
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1280&q=80',
    featured: true,
  },
  {
    id: 'f2',
    title: 'Urban Pulse Live',
    city: 'Lyon',
    date: '21 Jun 2026',
    genre: 'Hip-Hop',
    priceFrom: 39,
    imageUrl:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1280&q=80',
    featured: true,
  },
  {
    id: 'f3',
    title: 'Symphonic Lights',
    city: 'Rennes',
    date: '03 Jul 2026',
    genre: 'Pop',
    priceFrom: 55,
    imageUrl:
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1280&q=80',
    featured: true,
  },
  {
    id: 'f4',
    title: 'Jazz Under Stars',
    city: 'Nantes',
    date: '18 Jul 2026',
    genre: 'Jazz',
    priceFrom: 29,
    imageUrl:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1280&q=80',
    featured: true,
  },
]

const upcomingEvents: EventPreview[] = [
  ...featuredEvents,
  {
    id: 'u1',
    title: 'Rock Arena Tour',
    city: 'Marseille',
    date: '24 Jul 2026',
    genre: 'Rock',
    priceFrom: 42,
    imageUrl:
      'https://images.unsplash.com/photo-1501612780327-45045538702b?w=1280&q=80',
  },
  {
    id: 'u2',
    title: 'Sunset Stage',
    city: 'Bordeaux',
    date: '02 Aug 2026',
    genre: 'Indie',
    priceFrom: 31,
    imageUrl:
      'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1280&q=80',
  },
  {
    id: 'u3',
    title: 'Golden Beats',
    city: 'Lille',
    date: '11 Aug 2026',
    genre: 'Electro',
    priceFrom: 36,
    imageUrl:
      'https://images.unsplash.com/photo-1464375117522-1311dd7d0b87?w=1280&q=80',
  },
  {
    id: 'u4',
    title: 'Echoes Live',
    city: 'Toulouse',
    date: '27 Aug 2026',
    genre: 'Pop',
    priceFrom: 34,
    imageUrl:
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1280&q=80',
  },
]

const genres = ['Rock', 'Pop', 'Jazz', 'Electro', 'Hip-Hop', 'Indie']

const valueProps = [
  {
    icon: 'pi pi-ticket',
    title: 'Reservation instantanee',
    description: 'Choix du billet et confirmation rapide en quelques clics.',
  },
  {
    icon: 'pi pi-shield',
    title: 'Paiement securise',
    description: 'Flux de paiement protege avec suivi des transactions.',
  },
  {
    icon: 'pi pi-star',
    title: 'Selection premium',
    description: 'Concerts populaires, artistes majeurs et experiences exclusives.',
  },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated, role } = useAuth()
  const [search, setSearch] = useState('')

  const menuItems = useMemo<MenuItem[]>(
    () => [
      { label: 'Accueil', url: '#hero' },
      { label: 'A la une', url: '#featured' },
      { label: 'A venir', url: '#upcoming' },
      { label: 'Pourquoi nous', url: '#why' },
    ],
    [],
  )

  const filteredUpcoming = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return upcomingEvents
    }

    return upcomingEvents.filter((event) =>
      `${event.title} ${event.city} ${event.genre}`.toLowerCase().includes(query),
    )
  }, [search])

  const roleSeverity =
    role === 'ADMIN' ? 'danger' : role === 'ORGANIZER' ? 'info' : 'success'

  const goPrimary = () => {
    if (isAuthenticated && role) {
      navigate(ROUTES.dashboard())
      return
    }

    navigate(ROUTES.register())
  }

  const goLogin = () => {
    navigate(ROUTES.login())
  }

  return (
    <div className="public-home">
      <header className="public-home-header">
        <Menubar
          model={menuItems}
          start={<span className="public-home-brand">SIR Tickets</span>}
          end={
            <div className="public-home-menubar-end">
              {isAuthenticated && role ? <Tag value={role} severity={roleSeverity} /> : null}
              <Button
                label={isAuthenticated ? 'Mon espace' : 'Connexion'}
                size="small"
                icon={isAuthenticated ? 'pi pi-th-large' : 'pi pi-sign-in'}
                outlined={!isAuthenticated}
                onClick={() => {
                  if (isAuthenticated && role) {
                    navigate(ROUTES.dashboard())
                    return
                  }
                  goLogin()
                }}
              />
            </div>
          }
        />
      </header>

      <main className="public-home-main">
        <section id="hero" className="public-home-hero">
          <div className="public-home-hero-overlay" />
          <div className="public-home-hero-content">
            <Chip label="Concerts + Billets + Experience" className="public-home-hero-chip" />
            <h1 className="public-home-hero-title">
              Vivez des soirees
              <span>inoubliables</span>
            </h1>
            <p className="public-home-hero-subtitle">
              Decouvrez les meilleurs evenements musicaux, comparez les offres et accedez
              rapidement a votre espace.
            </p>

            <div className="public-home-search">
              <IconField iconPosition="left" className="public-home-search-field">
                <InputIcon className="pi pi-search" />
                <InputText
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Rechercher un artiste, une ville ou un genre"
                />
              </IconField>
              <Button label="Explorer" icon="pi pi-arrow-right" onClick={goPrimary} />
            </div>

            <div className="public-home-genre-list">
              {genres.map((genre) => (
                <Chip key={genre} label={genre} />
              ))}
            </div>

            <div className="public-home-hero-actions">
              <Button
                label={isAuthenticated ? 'Acceder a mon espace' : 'Creer un compte'}
                icon={isAuthenticated ? 'pi pi-user' : 'pi pi-user-plus'}
                onClick={goPrimary}
              />
              {!isAuthenticated ? (
                <Button label="Se connecter" icon="pi pi-sign-in" outlined onClick={goLogin} />
              ) : null}
            </div>
          </div>
        </section>

        <section id="featured" className="public-home-section">
          <div className="public-home-section-head">
            <h2>Evenements vedettes</h2>
            <Button
              label="Voir mes espaces"
              text
              icon="pi pi-arrow-right"
              onClick={() => {
                if (isAuthenticated && role) {
                  navigate(ROUTES.dashboard())
                  return
                }
                navigate(ROUTES.login())
              }}
            />
          </div>

          <div className="public-home-events-grid">
            {featuredEvents.map((event) => (
              <Card key={event.id} className="public-home-event-card">
                <div className="public-home-event-image-wrap">
                  <img src={event.imageUrl} alt={event.title} className="public-home-event-image" />
                  {event.featured ? (
                    <Tag value="A LA UNE" severity="warning" className="public-home-event-tag" />
                  ) : null}
                </div>
                <h3>{event.title}</h3>
                <p>
                  <i className="pi pi-map-marker" /> {event.city}
                </p>
                <p>
                  <i className="pi pi-calendar" /> {event.date}
                </p>
                <p className="public-home-event-price">A partir de {event.priceFrom} EUR</p>
                <Button
                  label={isAuthenticated ? 'Mon espace' : 'Connexion pour reserver'}
                  size="small"
                  icon="pi pi-ticket"
                  outlined
                  onClick={() => {
                    if (isAuthenticated && role) {
                      navigate(ROUTES.dashboard())
                      return
                    }
                    navigate(ROUTES.login())
                  }}
                />
              </Card>
            ))}
          </div>
        </section>

        <section id="upcoming" className="public-home-section public-home-section-muted">
          <div className="public-home-section-head">
            <h2>Evenements a venir</h2>
            <Tag value={`${filteredUpcoming.length} resultats`} severity="info" />
          </div>

          <div className="public-home-events-grid">
            {filteredUpcoming.map((event) => (
              <Card key={event.id} className="public-home-event-card">
                <div className="public-home-event-image-wrap">
                  <img src={event.imageUrl} alt={event.title} className="public-home-event-image" />
                </div>
                <h3>{event.title}</h3>
                <p>
                  <i className="pi pi-map-marker" /> {event.city}
                </p>
                <p>
                  <i className="pi pi-tag" /> {event.genre}
                </p>
                <p className="public-home-event-price">A partir de {event.priceFrom} EUR</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="public-home-section">
          <div className="public-home-section-head public-home-section-head-center">
            <h2>Explorez par genre</h2>
          </div>
          <div className="public-home-genre-grid">
            {genres.map((genre, index) => (
              <Card key={genre} className="public-home-genre-card">
                <div className="public-home-genre-card-content">
                  <span>{genre}</span>
                  <Tag value={`${6 + index} events`} />
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section id="why" className="public-home-section">
          <div className="public-home-section-head public-home-section-head-center">
            <h2>Pourquoi SIR Tickets ?</h2>
            <p>Une experience claire pour les clients, organisateurs et administrateurs.</p>
          </div>

          <div className="public-home-values-grid">
            {valueProps.map((value) => (
              <Card key={value.title} className="public-home-value-card">
                <div className="public-home-value-icon">
                  <i className={value.icon} />
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="public-home-section">
          <Card className="public-home-cta">
            <h2>Pret a reserver votre prochaine sortie ?</h2>
            <p>Connectez-vous ou creez un compte pour acceder a votre espace personnalise.</p>
            <div className="public-home-cta-actions">
              <Button
                label={isAuthenticated ? 'Mon espace' : 'Creer un compte'}
                icon={isAuthenticated ? 'pi pi-th-large' : 'pi pi-user-plus'}
                onClick={goPrimary}
              />
              {!isAuthenticated ? (
                <Button label="Connexion" icon="pi pi-sign-in" outlined onClick={goLogin} />
              ) : null}
            </div>
            <Divider />
            <small>Plateforme responsive: mobile, tablette, laptop et grand ecran.</small>
          </Card>
        </section>
      </main>
    </div>
  )
}
