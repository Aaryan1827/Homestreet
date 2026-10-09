import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const THEMES = ['day', 'evening', 'night']

/**
 * Derive theme from local time:
 * - before 17:00  → day
 * - 17:00-19:30   → evening
 * - after 19:30   → night
 */
function getAutoTheme() {
  const hour = new Date().getHours()
  const minutes = new Date().getMinutes()
  const totalMinutes = hour * 60 + minutes
  if (totalMinutes < 17 * 60) return 'day'
  if (totalMinutes < 19 * 60 + 30) return 'evening'
  return 'night'
}

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('homestreet_theme_mode') || 'auto'
  })

  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('homestreet_theme')
    const savedMode = localStorage.getItem('homestreet_theme_mode') || 'auto'
    if (savedMode === 'auto') return getAutoTheme()
    return saved || getAutoTheme()
  })

  // Apply data-theme attribute to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Auto mode: re-evaluate every minute
  useEffect(() => {
    if (mode !== 'auto') return
    const tick = () => setThemeState(getAutoTheme())
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [mode])

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
    setThemeState(getAutoTheme())
  }, [])

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
