export type ThemeMode = 'dark' | 'light'
export type AccentColor = 'gold' | 'emerald' | 'sapphire' | 'violet' | 'coral'

export interface Theme {
  mode: ThemeMode
  accent: AccentColor
}

export const DEFAULT_THEME: Theme = { mode: 'dark', accent: 'gold' }
export const STORAGE_KEY = 'cortaai_theme'

export const ACCENTS: Record<AccentColor, { label: string; hex: string; hover: string; dim: string }> = {
  gold:     { label: 'Dourado',   hex: '#C9A84C', hover: '#D9B85C', dim: 'rgba(201,168,76,0.15)' },
  emerald:  { label: 'Esmeralda', hex: '#27AE60', hover: '#2ECC71', dim: 'rgba(39,174,96,0.15)' },
  sapphire: { label: '2980B9',    hex: '#2980B9', hover: '#3498DB', dim: 'rgba(41,128,185,0.15)' },
  violet:   { label: 'Violeta',   hex: '#8E44AD', hover: '#9B59B6', dim: 'rgba(142,68,173,0.15)' },
  coral:    { label: 'Coral',     hex: '#E05C3A', hover: '#E8724F', dim: 'rgba(224,92,58,0.15)' },
}

const DARK = {
  '--bg': '#1A1A2E',
  '--surface': '#16213E',
  '--surface2': '#1E1E3A',
  '--cream': '#F5F0E8',
  '--muted': '#8A8AAA',
  '--border': '#2A2A4A',
  '--border2': '#1E1E38',
  '--red': '#8B0000',
  '--red-hover': '#A00000',
}

const LIGHT = {
  '--bg': '#F4F2EE',
  '--surface': '#FFFFFF',
  '--surface2': '#ECEAE4',
  '--cream': '#1A1A2E',
  '--muted': '#6B6B8A',
  '--border': '#D8D5CC',
  '--border2': '#E5E2DA',
  '--red': '#8B0000',
  '--red-hover': '#A00000',
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  const mode = theme.mode === 'light' ? LIGHT : DARK
  const accent = ACCENTS[theme.accent]

  Object.entries(mode).forEach(([k, v]) => root.style.setProperty(k, v))
  root.style.setProperty('--gold', accent.hex)
  root.style.setProperty('--gold-hover', accent.hover)
  root.style.setProperty('--gold-dim', accent.dim)
  root.setAttribute('data-mode', theme.mode)
}

export function loadTheme(): Theme {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_THEME, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return DEFAULT_THEME
}

export function saveTheme(theme: Theme) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(theme))
}
