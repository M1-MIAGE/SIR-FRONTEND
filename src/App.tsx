import { useEffect, useState } from 'react'
import { Card } from 'primereact/card'
import { Divider } from 'primereact/divider'
import { Tag } from 'primereact/tag'
import { ToggleButton } from 'primereact/togglebutton'
import './App.css'
import { applyTheme, type ColorMode } from '@/theme'

type AppProps = {
  initialColorMode: ColorMode
}

function App({ initialColorMode }: AppProps) {
  const [colorMode, setColorMode] = useState<ColorMode>(initialColorMode)

  useEffect(() => {
    applyTheme(colorMode)
  }, [colorMode])

  const isDarkMode = colorMode === 'dark'

  return (
    <main className="app-shell">
      <div className="theme-card-container">
        <Card title="Theme Manager" subTitle="PrimeReact Light / Dark">
          <div className="theme-content">
            <Tag
              value={isDarkMode ? 'Dark Mode' : 'Light Mode'}
              severity={isDarkMode ? 'contrast' : 'info'}
            />

            <Divider />

            <ToggleButton
              checked={isDarkMode}
              onLabel="Dark"
              offLabel="Light"
              onIcon="pi pi-moon"
              offIcon="pi pi-sun"
              onChange={(event) => {
                setColorMode(event.value ? 'dark' : 'light')
              }}
              aria-label="Changer le mode d'affichage"
            />
          </div>
        </Card>
      </div>
    </main>
  )
}

export default App
