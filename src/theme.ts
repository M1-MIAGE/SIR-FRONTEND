import lightThemeUrl from 'primereact/resources/themes/lara-light-blue/theme.css?url'
import darkThemeUrl from 'primereact/resources/themes/lara-dark-blue/theme.css?url'

export type ColorMode = 'light' | 'dark'

const APP_THEME_LINK_ID = 'app-theme'

const getThemeUrl = (mode: ColorMode): string =>
  mode === 'dark' ? darkThemeUrl : lightThemeUrl

export const getInitialColorMode = (): ColorMode => {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export const applyTheme = (mode: ColorMode): void => {
  if (typeof document === 'undefined') {
    return
  }

  let link = document.getElementById(APP_THEME_LINK_ID) as HTMLLinkElement | null

  if (!link) {
    link = document.createElement('link')
    link.setAttribute('id', APP_THEME_LINK_ID)
    link.setAttribute('rel', 'stylesheet')
    document.head.appendChild(link)
  }

  link.setAttribute('href', getThemeUrl(mode))
  document.documentElement.style.colorScheme = mode
  document.documentElement.setAttribute('data-color-mode', mode)
}
