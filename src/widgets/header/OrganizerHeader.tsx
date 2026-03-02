import type { MenuItem } from 'primereact/menuitem'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ColorMode } from '@/features/theme/toggle-theme/model/theme'
import { ROUTES } from '@/shared/config/routes'
import FloatingHeader from '@/widgets/header/FloatingHeader'

type OrganizerHeaderProps = {
  initialColorMode: ColorMode
}

export default function OrganizerHeader({ initialColorMode }: OrganizerHeaderProps) {
  const navigate = useNavigate()

  const menuItems = useMemo<MenuItem[]>(
    () => [
      {
        label: 'Accueil',
        icon: 'pi pi-compass',
        command: () => navigate(ROUTES.root()),
      },
      {
        label: 'Dashboard',
        icon: 'pi pi-calendar',
        command: () => navigate(ROUTES.roleHome('ORGANIZER')),
      },
      {
        label: 'Evenements',
        icon: 'pi pi-ticket',
        command: () => navigate(ROUTES.roleHome('ORGANIZER')),
      },
    ],
    [navigate],
  )

  return (
    <FloatingHeader
      brand="SIR Organizer"
      menuItems={menuItems}
      initialColorMode={initialColorMode}
      showLogout
    />
  )
}
