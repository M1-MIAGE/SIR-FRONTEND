import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrimeReactProvider } from 'primereact/api'
import 'primeicons/primeicons.css'
import 'primereact/resources/primereact.min.css'
import './index.css'
import App from '@/App'
import { applyTheme, getInitialColorMode } from '@/theme'

const initialColorMode = getInitialColorMode()

applyTheme(initialColorMode)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider value={{ ripple: true }}>
      <App initialColorMode={initialColorMode} />
    </PrimeReactProvider>
  </StrictMode>,
)
