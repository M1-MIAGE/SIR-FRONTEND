import { Card } from 'primereact/card'
import { ProgressSpinner } from 'primereact/progressspinner'

type AppLoaderProps = {
  label?: string
}

/**
 * Full-page loading indicator for async route bootstrapping.
 */
export default function AppLoader({ label = 'Chargement...' }: AppLoaderProps) {
  return (
    <section className="app-loader">
      <Card>
        <div className="app-loader-content">
          <ProgressSpinner strokeWidth="4" animationDuration=".8s" />
          <p className="app-loader-label">{label}</p>
        </div>
      </Card>
    </section>
  )
}
