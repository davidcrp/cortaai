'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { Theme, ThemeMode, AccentColor, DEFAULT_THEME, applyTheme, loadTheme, saveTheme } from '@/lib/theme'

interface ThemeContextType {
  theme: Theme
  setMode: (m: ThemeMode) => void
  setAccent: (a: AccentColor) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME)

  useEffect(() => {
    const saved = loadTheme()
    setTheme(saved)
    applyTheme(saved)
  }, [])

  function setMode(mode: ThemeMode) {
    const next = { ...theme, mode }
    setTheme(next)
    applyTheme(next)
    saveTheme(next)
  }

  function setAccent(accent: AccentColor) {
    const next = { ...theme, accent }
    setTheme(next)
    applyTheme(next)
    saveTheme(next)
  }

  return (
    <ThemeContext.Provider value={{ theme, setMode, setAccent }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme outside ThemeProvider')
  return ctx
}
