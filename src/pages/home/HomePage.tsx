import { useMemo } from 'react'
import { Button } from 'primereact/button'
import type { MenuItem } from 'primereact/menuitem'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/auth-context'
import type { ColorMode } from '@/features/theme/toggle-theme/model/theme'
import ConcertLandingSections from '@/pages/home/ui/ConcertLandingSections'
import { ROUTES } from '@/shared/config/routes'
import FloatingHeader from '@/widgets/header/FloatingHeader'

type HomePageProps = {
  initialColorMode: ColorMode
}

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/**
 * Public landing page entrypoint.
 */
export default function HomePage({ initialColorMode }: HomePageProps) {
  const navigate = useNavigate()
  const { isAuthenticated, role } = useAuth()

  const menuItems = useMemo<MenuItem[]>(
    () => [
      { label: 'Accueil', icon: 'pi pi-home', command: () => scrollToSection('hero') },
      { label: 'A la une', icon: 'pi pi-star', command: () => scrollToSection('featured') },
      { label: 'A venir', icon: 'pi pi-calendar', command: () => scrollToSection('upcoming') },
    ],
    [],
  )

  return (
    <div className="public-home">
      <FloatingHeader
        brand="SIR"
        menuItems={menuItems}
        initialColorMode={initialColorMode}
        actionSlot={
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
              navigate(ROUTES.login())
            }}
          />
        }
      />
      <ConcertLandingSections mode="public" />
    </div>
  )
}
