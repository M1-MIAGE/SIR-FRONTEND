import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrimeReactProvider } from 'primereact/api'
import 'primeicons/primeicons.css'
import 'primereact/resources/primereact.min.css'
import '@/app/styles/index.css'
import App from '@/app/App'
import {
  applyTheme,
  getInitialColorMode,
} from '@/features/theme/toggle-theme/model/theme'

const initialColorMode = getInitialColorMode()

applyTheme(initialColorMode)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider value={{ ripple: true }}>
      <App initialColorMode={initialColorMode} />
    </PrimeReactProvider>
  </StrictMode>,
)
