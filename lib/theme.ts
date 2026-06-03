export type ThemeMode = 'dark' | 'light'
export type AccentColor = 'gold' | 'emerald' | 'sapphire' | 'violet' | 'coral'

export interface Theme {
  mode: ThemeMode
  accent: AccentColor
}

export const DEFAULT_THEME: Theme = { mode: 'dark', accent: 'gold' }
export const STORAGE_KEY = 'cortaai_theme'

export const ACCENTS: Record<AccentColor, { label: string; hex: string; hover: string; dim: string }> = {
  gold:     { label: 'Âmbar',     hex: '#D4A853', hover: '#E0B860', dim: 'rgba(212,168,83,0.15)' },
  emerald:  { label: 'Esmeralda', hex: '#27AE60', hover: '#2ECC71', dim: 'rgba(39,174,96,0.15)' },
  sapphire: { label: 'Safira',    hex: '#2980B9', hover: '#3498DB', dim: 'rgba(41,128,185,0.15)' },
  violet:   { label: 'Violeta',   hex: '#8E44AD', hover: '#9B59B6', dim: 'rgba(142,68,173,0.15)' },
  coral:    { label: 'Coral',     hex: '#E05C3A', hover: '#E8724F', dim: 'rgba(224,92,58,0.15)' },
}

const DARK = {
  '--bg': '#0F0D0A',
  '--surface': '#1A1510',
  '--surface2': '#231D14',
  '--cream': '#F0E4C8',
  '--muted': '#8B7355',
  '--border': '#3A2E1E',
  '--border2': '#2A2216',
  '--red': '#8B2020',
  '--red-hover': '#A02828',
}

const LIGHT = {
  '--bg': '#F7F3EC',
  '--surface': '#FFFFFF',
  '--surface2': '#EDE6D8',
  '--cream': '#1A1208',
  '--muted': '#7A6A50',
  '--border': '#D4C4A8',
  '--border2': '#E2D8C4',
  '--red': '#8B2020',
  '--red-hover': '#A02828',
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
