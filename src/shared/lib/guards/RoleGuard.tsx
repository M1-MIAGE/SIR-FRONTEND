import type { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/auth-context'
import type { Role } from '@/entities/user/model/role'
import { ERROR_CODES, ROUTES } from '@/shared/config/routes'
import AppLoader from '@/shared/ui/layout/AppLoader'

type RoleGuardProps = PropsWithChildren<{
  allow: Role[]
}>

export default function RoleGuard({ allow, children }: RoleGuardProps) {
  const { isAuthenticated, isLoading, role, bootstrapErrorCode } = useAuth()

  if (isLoading) {
    return <AppLoader />
  }

  if (bootstrapErrorCode && bootstrapErrorCode !== ERROR_CODES.UNAUTHORIZED) {
    return <Navigate to={ROUTES.errors.byCode(bootstrapErrorCode)} replace />
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login()} replace />
  }

  if (!role || !allow.includes(role)) {
    return <Navigate to={ROUTES.errors.forbidden()} replace />
  }

  return <>{children}</>
}
