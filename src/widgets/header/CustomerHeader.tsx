import { Menubar } from 'primereact/menubar'
import type { MenuItem } from 'primereact/menuitem'
import { Tag } from 'primereact/tag'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import LogoutButton from '@/features/auth/logout/ui/LogoutButton'
import type { ColorMode } from '@/features/theme/toggle-theme/model/theme'
import ThemeToggle from '@/features/theme/toggle-theme/ui/ThemeToggle'
import { ROUTES } from '@/shared/config/routes'

type CustomerHeaderProps = {
  initialColorMode: ColorMode
}

export default function CustomerHeader({ initialColorMode }: CustomerHeaderProps) {
  const navigate = useNavigate()

  const menuItems = useMemo<MenuItem[]>(
    () => [
      {
        label: 'Espace Client',
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
    <header className="role-header role-header--customer">
      <Menubar
        model={menuItems}
        start={<span className="role-brand">SIR Customer</span>}
        end={
          <div className="header-end">
            <Tag value="CUSTOMER" severity="success" />
            <ThemeToggle initialColorMode={initialColorMode} />
            <LogoutButton />
          </div>
        }
      />
    </header>
  )
}
