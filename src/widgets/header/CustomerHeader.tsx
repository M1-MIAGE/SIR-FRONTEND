import type { MenuItem } from 'primereact/menuitem'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ColorMode } from '@/features/theme/toggle-theme/model/theme'
import { ROUTES } from '@/shared/config/routes'
import FloatingHeader from '@/widgets/header/FloatingHeader'

type CustomerHeaderProps = {
  initialColorMode: ColorMode
}

export default function CustomerHeader({ initialColorMode }: CustomerHeaderProps) {
  const navigate = useNavigate()

  const menuItems = useMemo<MenuItem[]>(
    () => [
      {
        label: 'Accueil',
        icon: 'pi pi-compass',
        command: () => navigate(ROUTES.root()),
      },
      {
        label: 'Mon Espace',
        icon: 'pi pi-home',
        command: () => navigate(ROUTES.roleHome('CUSTOMER')),
      },
      {
        label: 'Aide',
        icon: 'pi pi-question-circle',
        command: () => navigate(ROUTES.errors.serviceUnavailable()),
      },
    ],
    [navigate],
  )

  return (
    <FloatingHeader
      brand="SIR Customer"
      menuItems={menuItems}
      initialColorMode={initialColorMode}
      showLogout
    />
  )
}
