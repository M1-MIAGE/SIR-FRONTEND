import { Outlet } from 'react-router-dom'
import type { ColorMode } from '@/features/theme/toggle-theme/model/theme'
import CustomerFooter from '@/widgets/footer/CustomerFooter'
import CustomerHeader from '@/widgets/header/CustomerHeader'

type CustomerLayoutProps = {
  initialColorMode: ColorMode
}

export default function CustomerLayout({ initialColorMode }: CustomerLayoutProps) {
  return (
    <div className="role-shell">
      <CustomerHeader initialColorMode={initialColorMode} />
      <main className="app-main role-main">
        <Outlet />
      </main>
      <CustomerFooter />
    </div>
  )
}
