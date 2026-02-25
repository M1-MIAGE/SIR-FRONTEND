import { Menubar } from 'primereact/menubar'
import type { MenuItem } from 'primereact/menuitem'
import { Tag } from 'primereact/tag'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import LogoutButton from '@/features/auth/logout/ui/LogoutButton'
import type { ColorMode } from '@/features/theme/toggle-theme/model/theme'
import ThemeToggle from '@/features/theme/toggle-theme/ui/ThemeToggle'
import { ROUTES } from '@/shared/config/routes'

type AdminHeaderProps = {
  initialColorMode: ColorMode
}

export default function AdminHeader({ initialColorMode }: AdminHeaderProps) {
  const navigate = useNavigate()

  const menuItems = useMemo<MenuItem[]>(
    () => [
      {
        label: 'Espace Admin',
        icon: 'pi pi-shield',
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
    <header className="role-header role-header--admin">
      <Menubar
        model={menuItems}
        start={<span className="role-brand">SIR Admin</span>}
        end={
          <div className="header-end">
            <Tag value="ADMIN" severity="danger" />
            <ThemeToggle initialColorMode={initialColorMode} />
            <LogoutButton />
          </div>
        }
      />
    </header>
  )
}
