import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { resolveErrorDefinition } from '@/entities/error/model/errorCatalog'
import { ROUTES } from '@/shared/config/routes'
import ErrorPageLayout from '@/shared/ui/errors/ErrorPageLayout'

type ErrorPageProps = {
  forcedStatusCode?: string
}

const isServerOrUnavailableError = (code: string): boolean => {
  if (code === 'offline' || code === 'unexpected') {
    return true
  }

  const numericCode = Number(code)
  return Number.isInteger(numericCode) && numericCode >= 500
}

/**
 * Route-level error page resolving status code to user-facing content.
 */
export default function ErrorPage({ forcedStatusCode }: ErrorPageProps) {
  const { statusCode } = useParams<{ statusCode: string }>()
  const navigate = useNavigate()

  const resolvedError = useMemo(
    () => resolveErrorDefinition(forcedStatusCode ?? statusCode),
    [forcedStatusCode, statusCode],
  )

  const shouldRetry = isServerOrUnavailableError(resolvedError.code)

  return (
    <ErrorPageLayout
      code={resolvedError.code}
      title={resolvedError.title}
      message={resolvedError.message}
      icon={resolvedError.icon}
      severity={resolvedError.severity}
      primaryActionLabel={shouldRetry ? 'Réessayer' : "Retour à l'accueil"}
      onPrimaryAction={() => {
        if (shouldRetry) {
          navigate(0)
          return
        }

        navigate(ROUTES.root())
      }}
      secondaryActionLabel={shouldRetry ? "Retour à l'accueil" : 'Page précédente'}
      onSecondaryAction={() => {
        if (shouldRetry) {
          navigate(ROUTES.root())
          return
        }

        navigate(-1)
      }}
    />
  )
}
