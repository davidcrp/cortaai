import { createContext, useContext, useState, ReactNode } from 'react'
import { Barber, Service } from '../types'

interface AuthContextType {
  barber: Barber | null
  login: (email: string, password: string) => boolean
  register: (name: string, email: string, barbershopName: string, password: string) => boolean
  logout: () => void
  updateBarber: (updated: Partial<Barber>) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function getBarbers(): Barber[] {
  try { return JSON.parse(localStorage.getItem('cortaai_barbers') ?? '[]') } catch { return [] }
}

function saveBarbers(barbers: Barber[]) {
  localStorage.setItem('cortaai_barbers', JSON.stringify(barbers))
}

function getCurrentBarber(): Barber | null {
  try {
    const id = localStorage.getItem('cortaai_current')
    if (!id) return null
    return getBarbers().find(b => b.id === id) ?? null
  } catch { return null }
}

export function getBarberBySlug(slug: string): Barber | null {
  return getBarbers().find(b => b.slug === slug) ?? null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [barber, setBarber] = useState<Barber | null>(getCurrentBarber)

  function login(email: string, password: string): boolean {
    const found = getBarbers().find(b => b.email === email && b.password === password)
    if (!found) return false
    localStorage.setItem('cortaai_current', found.id)
    setBarber(found)
    return true
  }

  function register(name: string, email: string, barbershopName: string, password: string): boolean {
    const barbers = getBarbers()
    if (barbers.find(b => b.email === email)) return false

    let slug = slugify(barbershopName)
    if (barbers.find(b => b.slug === slug)) slug = `${slug}-${Date.now()}`

    const defaultServices: Service[] = [
      { id: crypto.randomUUID(), name: 'Corte simples', duration: 30, price: 35 },
      { id: crypto.randomUUID(), name: 'Corte + Barba', duration: 60, price: 55 },
    ]

    const newBarber: Barber = { id: crypto.randomUUID(), name, email, password, barbershopName, slug, services: defaultServices }
    barbers.push(newBarber)
    saveBarbers(barbers)
    localStorage.setItem('cortaai_current', newBarber.id)
    setBarber(newBarber)
    return true
  }

  function logout() {
    localStorage.removeItem('cortaai_current')
    setBarber(null)
  }

  function updateBarber(updated: Partial<Barber>) {
    if (!barber) return
    const barbers = getBarbers()
    const idx = barbers.findIndex(b => b.id === barber.id)
    if (idx === -1) return
    const merged = { ...barbers[idx], ...updated }
    barbers[idx] = merged
    saveBarbers(barbers)
    setBarber(merged)
  }

  return (
    <AuthContext.Provider value={{ barber, login, register, logout, updateBarber }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
