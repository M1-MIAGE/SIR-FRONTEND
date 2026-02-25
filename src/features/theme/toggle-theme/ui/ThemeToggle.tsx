import { useEffect, useState } from 'react'
import { ToggleButton } from 'primereact/togglebutton'
import {
  applyTheme,
  type ColorMode,
} from '@/features/theme/toggle-theme/model/theme'

type ThemeToggleProps = {
  initialColorMode: ColorMode
}

export default function ThemeToggle({ initialColorMode }: ThemeToggleProps) {
  const [mode, setMode] = useState<ColorMode>(initialColorMode)
  const isDark = mode === 'dark'

  useEffect(() => {
    applyTheme(mode)
  }, [mode])

  return (
    <div className="theme-toggle">
      <ToggleButton
        checked={isDark}
        onLabel="Dark"
        offLabel="Light"
        onIcon="pi pi-moon"
        offIcon="pi pi-sun"
        onChange={(event) => setMode(event.value ? 'dark' : 'light')}
        aria-label="Changer le theme"
      />
    </div>
  )
}
