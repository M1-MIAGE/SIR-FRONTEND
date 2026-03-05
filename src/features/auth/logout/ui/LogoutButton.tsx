import { useState } from 'react'
import { Button } from 'primereact/button'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/auth-context'
import { ROUTES } from '@/shared/config/routes'

/**
 * Button that logs out the current user and redirects to login.
 */
export default function LogoutButton() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Button
      label="Logout"
      icon="pi pi-sign-out"
      severity="secondary"
      outlined
      loading={isLoading}
      onClick={() => {
        void (async () => {
          setIsLoading(true)

          try {
            await logout()
          } finally {
            setIsLoading(false)
            navigate(ROUTES.login(), { replace: true })
          }
        })()
      }}
    />
  )
}
