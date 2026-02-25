import { Navigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/auth-context'
import { ERROR_CODES, ROUTES } from '@/shared/config/routes'
import AppLoader from '@/shared/ui/layout/AppLoader'

export default function RoleHomeRedirect() {
  const { isAuthenticated, isLoading, role, bootstrapErrorCode } = useAuth()

  if (isLoading) {
    return <AppLoader />
  }

  if (bootstrapErrorCode && bootstrapErrorCode !== ERROR_CODES.UNAUTHORIZED) {
    return <Navigate to={ROUTES.errors.byCode(bootstrapErrorCode)} replace />
  }

  if (!isAuthenticated || !role) {
    return <Navigate to={ROUTES.errors.unauthorized()} replace />
  }

  return <Navigate to={ROUTES.roleHome(role)} replace />
}
