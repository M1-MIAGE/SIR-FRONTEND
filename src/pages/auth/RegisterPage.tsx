import { useState } from 'react'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { Message } from 'primereact/message'
import { Password } from 'primereact/password'
import { SelectButton } from 'primereact/selectbutton'
import { Navigate, useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/app/providers/auth-context'
import { createUserRequestSchema, type CreateUserRequestDto } from '@/features/auth/model/auth.types'
import { mapApiErrorCode } from '@/shared/api/map-api-error'
import { ERROR_CODES, ROUTES } from '@/shared/config/routes'
import AppLoader from '@/shared/ui/layout/AppLoader'

const roleOptions = [
  { label: 'Customer', value: 'CUSTOMER' },
  { label: 'Organizer', value: 'ORGANIZER' },
]

type RegisterFormValues = CreateUserRequestDto

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerAccount, isAuthenticated, isLoading } = useAuth()

  const [formError, setFormError] = useState<string | null>(null)
  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(createUserRequestSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'CUSTOMER',
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
  })

  if (isLoading) {
    return <AppLoader label="Checking session..." />
  }

  if (!isLoading && isAuthenticated) {
    return <Navigate to={ROUTES.dashboard()} replace />
  }

  const submit = handleSubmit(async (values) => {
    setFormError(null)

    try {
      await registerAccount(values)

      navigate(ROUTES.login(), {
        replace: true,
        state: {
          registrationStatus: 'success',
          registeredEmail: values.email,
        },
      })
    } catch (error) {
      const apiErrorCode = mapApiErrorCode(error)

      if (apiErrorCode === ERROR_CODES.CONFLICT) {
        setError('email', {
          type: 'server',
          message: 'Un compte existe deja avec cette adresse e-mail.',
        })
        return
      }

      if (
        apiErrorCode === ERROR_CODES.BAD_REQUEST ||
        apiErrorCode === ERROR_CODES.UNPROCESSABLE_ENTITY
      ) {
        setFormError('Les donnees envoyees sont invalides.')
        return
      }

      navigate(ROUTES.errors.byCode(apiErrorCode), { replace: true })
    }
  })

  return (
    <section className="auth-register-page">
      <Card className="auth-register-card" title="Creer un compte">
        <form className="auth-register-content" onSubmit={submit} noValidate>
          {formError ? <Message severity="error" text={formError} /> : null}

          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <div className="auth-field">
                <FloatLabel>
                  <InputText
                    id="register-email"
                    autoComplete="email"
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={(event) => field.onChange(event.target.value)}
                    className={fieldState.invalid ? 'p-invalid' : undefined}
                  />
                  <label htmlFor="register-email">Email</label>
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
                    inputId="register-password"
                    autoComplete="new-password"
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={(event) => field.onChange(event.target.value)}
                    feedback={false}
                    toggleMask
                    className={fieldState.invalid ? 'p-invalid' : undefined}
                    inputClassName={fieldState.invalid ? 'p-invalid' : undefined}
                  />
                  <label htmlFor="register-password">Password</label>
                </FloatLabel>
                {fieldState.error?.message ? (
                  <small className="p-error">{fieldState.error.message}</small>
                ) : null}
              </div>
            )}
          />

          <Controller
            name="firstName"
            control={control}
            render={({ field, fieldState }) => (
              <div className="auth-field">
                <FloatLabel>
                  <InputText
                    id="register-first-name"
                    autoComplete="given-name"
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={(event) => field.onChange(event.target.value)}
                    className={fieldState.invalid ? 'p-invalid' : undefined}
                  />
                  <label htmlFor="register-first-name">First name</label>
                </FloatLabel>
                {fieldState.error?.message ? (
                  <small className="p-error">{fieldState.error.message}</small>
                ) : null}
              </div>
            )}
          />

          <Controller
            name="lastName"
            control={control}
            render={({ field, fieldState }) => (
              <div className="auth-field">
                <FloatLabel>
                  <InputText
                    id="register-last-name"
                    autoComplete="family-name"
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={(event) => field.onChange(event.target.value)}
                    className={fieldState.invalid ? 'p-invalid' : undefined}
                  />
                  <label htmlFor="register-last-name">Last name</label>
                </FloatLabel>
                {fieldState.error?.message ? (
                  <small className="p-error">{fieldState.error.message}</small>
                ) : null}
              </div>
            )}
          />

          <Controller
            name="role"
            control={control}
            render={({ field, fieldState }) => (
              <div className="auth-field">
                <SelectButton
                  className={`auth-role-select ${fieldState.invalid ? 'p-invalid' : ''}`.trim()}
                  value={field.value}
                  options={roleOptions}
                  allowEmpty={false}
                  onChange={(event) => field.onChange(event.value as CreateUserRequestDto['role'])}
                />
                {fieldState.error?.message ? (
                  <small className="p-error">{fieldState.error.message}</small>
                ) : null}
              </div>
            )}
          />

          <Button
            type="submit"
            label="Creer le compte"
            icon="pi pi-user-plus"
            loading={isSubmitting}
          />

          <Button
            type="button"
            label="Deja inscrit ? Se connecter"
            severity="secondary"
            text
            onClick={() => navigate(ROUTES.login())}
          />
        </form>
      </Card>
    </section>
  )
}
