import type { ReactNode } from 'react'
import { Menubar } from 'primereact/menubar'
import type { MenuItem } from 'primereact/menuitem'
import LogoutButton from '@/features/auth/logout/ui/LogoutButton'
import type { ColorMode } from '@/features/theme/toggle-theme/model/theme'
import ThemeToggle from '@/features/theme/toggle-theme/ui/ThemeToggle'

type FloatingHeaderProps = {
  brand: string
  menuItems: MenuItem[]
  initialColorMode: ColorMode
  showLogout?: boolean
  actionSlot?: ReactNode
}

export default function FloatingHeader({
  brand,
  menuItems,
  initialColorMode,
  showLogout = false,
  actionSlot,
}: FloatingHeaderProps) {
  return (
    <header className="app-floating-header">
      <Menubar
        model={menuItems}
        start={<span className="public-home-brand">{brand}</span>}
        end={
          <div className="header-end">
            {actionSlot}
            <ThemeToggle initialColorMode={initialColorMode} />
            {showLogout ? <LogoutButton /> : null}
          </div>
        }
      />
    </header>
  )
}
