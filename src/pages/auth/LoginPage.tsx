import { useState } from 'react'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { Message } from 'primereact/message'
import { Password } from 'primereact/password'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/app/providers/auth-context'
import { loginRequestSchema, type LoginRequestDto } from '@/features/auth/model/auth.types'
import { mapApiErrorCode } from '@/shared/api/map-api-error'
import { ERROR_CODES, ROUTES } from '@/shared/config/routes'
import AppLoader from '@/shared/ui/layout/AppLoader'

type LoginLocationState = {
  registrationStatus?: 'success'
  registeredEmail?: string
}

type LoginFormValues = LoginRequestDto

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, isLoading } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  })
  const locationState = (location.state ?? null) as LoginLocationState | null
  const registerSuccessMessage =
    locationState?.registrationStatus === 'success'
      ? `Compte créé pour ${locationState.registeredEmail ?? 'cet e-mail'}. Connecte-toi maintenant.`
      : null

  if (isLoading) {
    return <AppLoader label="Session de vérification..." />
  }

  if (!isLoading && isAuthenticated) {
    return <Navigate to={ROUTES.dashboard()} replace />
  }

  const submit = handleSubmit(async (values) => {
    setFormError(null)

    try {
      await login(values)
      navigate(ROUTES.dashboard(), { replace: true })
    } catch (error) {
      const apiErrorCode = mapApiErrorCode(error)

      if (apiErrorCode === ERROR_CODES.UNAUTHORIZED) {
        setError('password', {
          type: 'server',
          message: 'Adresse e-mail ou mot de passe invalide.',
        })
        return
      }

      navigate(ROUTES.errors.byCode(apiErrorCode), { replace: true })
    }
  })

  return (
    <section className="auth-login-page">
      <Card className="auth-login-card" title="Se connecter">
        <form className="auth-login-content" onSubmit={submit} noValidate>
          {registerSuccessMessage ? <Message severity="success" text={registerSuccessMessage} /> : null}
          {formError ? <Message severity="error" text={formError} /> : null}

          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <div className="auth-field">
                <FloatLabel>
                  <InputText
                    id="email"
                    value={field.value}
                    autoComplete="email"
                    onBlur={field.onBlur}
                    onChange={(event) => field.onChange(event.target.value)}
                    className={fieldState.invalid ? 'p-invalid' : undefined}
                  />
                  <label htmlFor="email">Email</label>
                </FloatLabel>
                {fieldState.error?.message ? (
                  <small className="p-error">{fieldState.error.message}</small>
                ) : null}
              </div>
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <div className="auth-field">
                <FloatLabel>
                  <Password
                    inputId="password"
                    value={field.value}
                    autoComplete="current-password"
                    onBlur={field.onBlur}
                    onChange={(event) => field.onChange(event.target.value)}
                    feedback={false}
                    toggleMask
                    className={fieldState.invalid ? 'p-invalid' : undefined}
                    inputClassName={fieldState.invalid ? 'p-invalid' : undefined}
                  />
                  <label htmlFor="password">Password</label>
                </FloatLabel>
                {fieldState.error?.message ? (
                  <small className="p-error">{fieldState.error.message}</small>
                ) : null}
              </div>
            )}
          />

          <Button
            type="submit"
            label="Connexion"
            icon="pi pi-sign-in"
            loading={isSubmitting}
          />

          <Button
            type="button"
            label="Creer un compte"
            severity="secondary"
            text
            onClick={() => navigate(ROUTES.register())}
          />
        </form>
      </Card>
    </section>
  )
}
