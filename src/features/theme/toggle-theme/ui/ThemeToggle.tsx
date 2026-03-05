import { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import {
  applyTheme,
  type ColorMode,
} from '@/features/theme/toggle-theme/model/theme'

type ThemeToggleProps = {
  initialColorMode: ColorMode
}

/**
 * UI toggle to switch between light and dark color modes.
 */
export default function ThemeToggle({ initialColorMode }: ThemeToggleProps) {
  const [mode, setMode] = useState<ColorMode>(initialColorMode)
  const isDark = mode === 'dark'
  const nextModeLabel = isDark ? 'Activer le mode clair' : 'Activer le mode sombre'

  useEffect(() => {
    applyTheme(mode)
  }, [mode])

  return (
    <div className="theme-toggle">
      <Button
        type="button"
        icon={isDark ? 'pi pi-moon' : 'pi pi-sun'}
        rounded
        text
        aria-label={nextModeLabel}
        onClick={() => setMode((currentMode) => (currentMode === 'dark' ? 'light' : 'dark'))}
      />
    </div>
  )
}
