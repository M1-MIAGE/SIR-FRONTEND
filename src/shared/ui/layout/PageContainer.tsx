import type { PropsWithChildren, ReactNode } from 'react'

type PageContainerProps = PropsWithChildren<{
  title: string
  subtitle?: string
  actions?: ReactNode
}>

/**
 * Shared page layout wrapper with title, subtitle and action slot.
 */
export default function PageContainer({
  title,
  subtitle,
  actions,
  children,
}: PageContainerProps) {
  return (
    <section className="stack">
      <header className="page-header">
        <div className="stack">
          <h1 className="page-title">{title}</h1>
          {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
        </div>
        {actions}
      </header>
      {children}
    </section>
  )
}
