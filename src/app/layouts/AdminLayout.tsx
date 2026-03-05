import { Outlet } from 'react-router-dom'
import type { ColorMode } from '@/features/theme/toggle-theme/model/theme'
import AdminFooter from '@/widgets/footer/AdminFooter'
import AdminHeader from '@/widgets/header/AdminHeader'

type AdminLayoutProps = {
  initialColorMode: ColorMode
}

/**
 * Root layout for admin pages.
 */
export default function AdminLayout({ initialColorMode }: AdminLayoutProps) {
  return (
    <div className="role-shell">
      <AdminHeader initialColorMode={initialColorMode} />
      <main className="app-main role-main">
        <Outlet />
      </main>
      <AdminFooter />
    </div>
  )
}
