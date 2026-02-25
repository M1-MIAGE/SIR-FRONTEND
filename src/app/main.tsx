import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrimeReactProvider } from 'primereact/api'
import { RouterProvider } from 'react-router-dom'
import 'primeicons/primeicons.css'
import 'primereact/resources/primereact.min.css'
import '@/app/styles/index.css'
import AppErrorBoundary from '@/app/providers/AppErrorBoundary'
import { AuthProvider } from '@/app/providers/AuthProvider'
import { createAppRouter } from '@/app/router/createAppRouter'
import {
  applyTheme,
  getInitialColorMode,
} from '@/features/theme/toggle-theme/model/theme'

const initialColorMode = getInitialColorMode()
const appRouter = createAppRouter(initialColorMode)

applyTheme(initialColorMode)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <PrimeReactProvider value={{ ripple: true }}>
        <AuthProvider>
          <RouterProvider router={appRouter} />
        </AuthProvider>
      </PrimeReactProvider>
    </AppErrorBoundary>
  </StrictMode>,
)
