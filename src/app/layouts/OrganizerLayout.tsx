import { Outlet } from 'react-router-dom'
import type { ColorMode } from '@/features/theme/toggle-theme/model/theme'
import OrganizerFooter from '@/widgets/footer/OrganizerFooter'
import OrganizerHeader from '@/widgets/header/OrganizerHeader'

type OrganizerLayoutProps = {
  initialColorMode: ColorMode
}

/**
 * Root layout for organizer pages.
 */
export default function OrganizerLayout({ initialColorMode }: OrganizerLayoutProps) {
  return (
    <div className="role-shell">
      <OrganizerHeader initialColorMode={initialColorMode} />
      <main className="app-main role-main">
        <Outlet />
      </main>
      <OrganizerFooter />
    </div>
  )
}
