import { Appointment } from './types'
import { randomUUID } from 'crypto'

// In-memory store — resets on cold start (add a DB for persistence)
const g = global as typeof global & { _appts?: Appointment[] }
if (!g._appts) g._appts = []

export function getAppointments(barberId?: string, date?: string): Appointment[] {
  let list = [...g._appts!]
  if (barberId) list = list.filter(a => a.barberId === barberId)
  if (date) list = list.filter(a => a.date === date)
  return list.sort((a, b) => a.time.localeCompare(b.time))
}

export function createAppointment(data: Omit<Appointment, 'id'>): Appointment {
  const appt: Appointment = { id: randomUUID(), ...data }
  g._appts!.push(appt)
  return appt
}

export function deleteAppointment(id: string): boolean {
  const idx = g._appts!.findIndex(a => a.id === id)
  if (idx === -1) return false
  g._appts!.splice(idx, 1)
  return true
}

export function hasConflict(barberId: string, date: string, time: string): boolean {
  return g._appts!.some(a => a.barberId === barberId && a.date === date && a.time === time)
}
