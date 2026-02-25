import { Menubar } from 'primereact/menubar'
import type { MenuItem } from 'primereact/menuitem'
import { Tag } from 'primereact/tag'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import LogoutButton from '@/features/auth/logout/ui/LogoutButton'
import type { ColorMode } from '@/features/theme/toggle-theme/model/theme'
import ThemeToggle from '@/features/theme/toggle-theme/ui/ThemeToggle'
import { ROUTES } from '@/shared/config/routes'

type OrganizerHeaderProps = {
  initialColorMode: ColorMode
}

export default function OrganizerHeader({ initialColorMode }: OrganizerHeaderProps) {
  const navigate = useNavigate()

  const menuItems = useMemo<MenuItem[]>(
    () => [
      {
        label: 'Espace Organizer',
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
    <header className="role-header role-header--organizer">
      <Menubar
        model={menuItems}
        start={<span className="role-brand">SIR Organizer</span>}
        end={
          <div className="header-end">
            <Tag value="ORGANIZER" severity="info" />
            <ThemeToggle initialColorMode={initialColorMode} />
            <LogoutButton />
          </div>
        }
      />
    </header>
  )
}
