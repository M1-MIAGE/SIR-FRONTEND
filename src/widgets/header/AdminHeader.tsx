import type { MenuItem } from 'primereact/menuitem'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ColorMode } from '@/features/theme/toggle-theme/model/theme'
import { ROUTES } from '@/shared/config/routes'
import FloatingHeader from '@/widgets/header/FloatingHeader'

type AdminHeaderProps = {
  initialColorMode: ColorMode
}

export default function AdminHeader({ initialColorMode }: AdminHeaderProps) {
  const navigate = useNavigate()

  const menuItems = useMemo<MenuItem[]>(
    () => [
      {
        label: 'Accueil',
        icon: 'pi pi-compass',
        command: () => navigate(ROUTES.root()),
      },
      {
        label: 'Administration',
        icon: 'pi pi-cog',
        command: () => navigate(ROUTES.roleHome('ADMIN')),
      },
      {
        label: 'Erreurs',
        icon: 'pi pi-exclamation-triangle',
        command: () => navigate(ROUTES.errors.internal()),
      },
    ],
    [navigate],
  )

  return (
    <FloatingHeader
      brand="SIR Admin"
      menuItems={menuItems}
      initialColorMode={initialColorMode}
      showLogout
    />
  )
}
