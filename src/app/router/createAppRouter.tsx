import { createBrowserRouter } from 'react-router-dom'
import AdminLayout from '@/app/layouts/AdminLayout'
import CustomerLayout from '@/app/layouts/CustomerLayout'
import OrganizerLayout from '@/app/layouts/OrganizerLayout'
import App from '@/app/App'
import RoleHomeRedirect from '@/app/router/RoleHomeRedirect'
import RoleGuard from '@/shared/lib/guards/RoleGuard'
import type { ColorMode } from '@/features/theme/toggle-theme/model/theme'
import AdminHomePage from '@/pages/admin/AdminHomePage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import CustomerHomePage from '@/pages/customer/CustomerHomePage'
import ErrorPage from '@/pages/ErrorPage/ui/ErrorPage'
import HomePage from '@/pages/home/HomePage'
import OrganizerHomePage from '@/pages/organizer/OrganizerHomePage'
import { ERROR_CODES, ROUTE_PATHS, ROUTE_SEGMENTS } from '@/shared/config/routes'

export const createAppRouter = (initialColorMode: ColorMode) =>
  createBrowserRouter([
    {
      path: ROUTE_PATHS.ROOT,
      element: <App />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: ROUTE_SEGMENTS.DASHBOARD,
          element: <RoleHomeRedirect />,
        },
        {
          path: ROUTE_SEGMENTS.LOGIN,
          element: <LoginPage />,
        },
        {
          path: ROUTE_SEGMENTS.REGISTER,
          element: <RegisterPage />,
        },
        {
          path: ROUTE_SEGMENTS.CUSTOMER,
          element: (
            <RoleGuard allow={['CUSTOMER']}>
              <CustomerLayout initialColorMode={initialColorMode} />
            </RoleGuard>
          ),
          children: [
            {
              index: true,
              element: <CustomerHomePage />,
            },
          ],
        },
        {
          path: ROUTE_SEGMENTS.ORGANIZER,
          element: (
            <RoleGuard allow={['ORGANIZER']}>
              <OrganizerLayout initialColorMode={initialColorMode} />
            </RoleGuard>
          ),
          children: [
            {
              index: true,
              element: <OrganizerHomePage />,
            },
          ],
        },
        {
          path: ROUTE_SEGMENTS.ADMIN,
          element: (
            <RoleGuard allow={['ADMIN']}>
              <AdminLayout initialColorMode={initialColorMode} />
            </RoleGuard>
          ),
          children: [
            {
              index: true,
              element: <AdminHomePage />,
            },
          ],
        },
      ],
    },
    {
      path: ROUTE_PATHS.ERROR_DETAIL,
      element: <ErrorPage />,
    },
    {
      path: ROUTE_PATHS.ERRORS_ROOT,
      element: <ErrorPage forcedStatusCode={ERROR_CODES.UNEXPECTED} />,
    },
    {
      path: ROUTE_PATHS.NOT_FOUND,
      element: <ErrorPage forcedStatusCode={ERROR_CODES.NOT_FOUND} />,
    },
  ])
