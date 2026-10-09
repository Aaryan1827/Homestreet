import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useTime } from './TimeContext'

const THEMES = ['day', 'evening', 'night']

function getThemeForHour(hour) {
  if (hour >= 6 && hour < 17) return 'day'
  if (hour >= 17 && hour < 19.5) return 'evening'
  return 'night'
}

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const { hour } = useTime()
  
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('homestreet_theme_mode') || 'auto'
  })

  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('homestreet_theme')
    const savedMode = localStorage.getItem('homestreet_theme_mode') || 'auto'
    if (savedMode === 'auto') return getThemeForHour(hour)
    return saved || getThemeForHour(hour)
  })

  // Apply data-theme attribute to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Auto mode: update whenever time changes
  useEffect(() => {
    if (mode === 'auto') {
      setThemeState(getThemeForHour(hour))
    }
  }, [mode, hour])

  /** Cycle through: day → evening → night → day (manual override, disables auto) */
  const cycleTheme = useCallback(() => {
    setThemeState((current) => {
      const idx = THEMES.indexOf(current)
      const next = THEMES[(idx + 1) % THEMES.length]
      localStorage.setItem('homestreet_theme', next)
      return next
    })
    setMode('manual')
    localStorage.setItem('homestreet_theme_mode', 'manual')
  }, [])

  /** Switch to auto mode */
  const enableAuto = useCallback(() => {
    setMode('auto')
    localStorage.setItem('homestreet_theme_mode', 'auto')
    setThemeState(getThemeForHour(hour))
  }, [hour])

  return (
    <ThemeContext.Provider value={{ theme, mode, cycleTheme, enableAuto, THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
