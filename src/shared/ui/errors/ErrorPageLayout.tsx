import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Divider } from 'primereact/divider'
import { Tag } from 'primereact/tag'
import type { ErrorTagSeverity } from '@/entities/error/model/errorCatalog'

type ErrorPageLayoutProps = {
  code: string
  title: string
  message: string
  icon: string
  severity: ErrorTagSeverity
  primaryActionLabel: string
  onPrimaryAction: () => void
  secondaryActionLabel?: string
  onSecondaryAction?: () => void
}

const formatCodeLabel = (code: string): string => code.toUpperCase()

/**
 * Presentational layout used by error routes and error boundaries.
 */
export default function ErrorPageLayout({
  code,
  title,
  message,
  icon,
  severity,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
}: ErrorPageLayoutProps) {
  return (
    <section className="error-view">
      <Card className="error-card">
        <div className="error-content">
          <div className="error-header">
            <i className={`error-icon ${icon}`} aria-hidden="true" />
            <Tag value={`Code ${formatCodeLabel(code)}`} severity={severity} />
          </div>

          <h1 className="error-title">{title}</h1>
          <p className="error-description">{message}</p>

          <Divider />

          <div className="error-actions">
            <Button label={primaryActionLabel} icon="pi pi-refresh" onClick={onPrimaryAction} />
            {secondaryActionLabel && onSecondaryAction ? (
              <Button
                label={secondaryActionLabel}
                icon="pi pi-arrow-left"
                severity="secondary"
                outlined
                onClick={onSecondaryAction}
              />
            ) : null}
          </div>
        </div>
      </Card>
    </section>
  )
}
