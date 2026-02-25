import { useState } from 'react'
import { z } from 'zod'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { Message } from 'primereact/message'
import { Password } from 'primereact/password'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/auth-context'
import { loginRequestSchema } from '@/features/auth/model/auth.types'
import { mapApiErrorCode } from '@/shared/api/map-api-error'
import { ERROR_CODES, ROUTES } from '@/shared/config/routes'
import AppLoader from '@/shared/ui/layout/AppLoader'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isLoading) {
    return <AppLoader label="Checking session..." />
  }

  if (!isLoading && isAuthenticated) {
    return <Navigate to={ROUTES.root()} replace />
  }

  const submit = async () => {
    setFormError(null)
    setIsSubmitting(true)

    try {
      const payload = loginRequestSchema.parse({ email, password })
      await login(payload)
      navigate(ROUTES.root(), { replace: true })
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFormError('Please provide a valid email and password.')
        return
      }

      const apiErrorCode = mapApiErrorCode(error)

      if (apiErrorCode === ERROR_CODES.UNAUTHORIZED) {
        setFormError('Invalid email or password.')
        return
      }

      navigate(ROUTES.errors.byCode(apiErrorCode), { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-login-page">
      <Card className="auth-login-card" title="Sign In">
        <div className="auth-login-content">
          {formError ? <Message severity="error" text={formError} /> : null}

          <FloatLabel>
            <InputText
              id="email"
              value={email}
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
            />
            <label htmlFor="email">Email</label>
          </FloatLabel>

          <FloatLabel>
            <Password
              inputId="password"
              value={password}
              autoComplete="current-password"
              feedback={false}
              toggleMask
              onChange={(event) => setPassword(event.target.value)}
            />
            <label htmlFor="password">Password</label>
          </FloatLabel>

          <Button
            label="Login"
            icon="pi pi-sign-in"
            loading={isSubmitting}
            onClick={() => {
              void submit()
            }}
          />
        </div>
      </Card>
    </section>
  )
}
