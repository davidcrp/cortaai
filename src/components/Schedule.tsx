import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Appointment } from '../types'
import styles from './Schedule.module.css'

function todayString() { return new Date().toISOString().slice(0, 10) }
function formatDateBR(iso: string) { const [y,m,d] = iso.split('-'); return `${d}/${m}/${y}` }

export default function Schedule() {
  const { barber } = useAuth()
  const [date, setDate] = useState(todayString)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAppointments = useCallback(async () => {
    if (!barber) return
    setLoading(true)
    try {
      const res = await fetch(`/api/appointments?date=${date}&barberId=${barber.id}`)
      setAppointments(await res.json())
    } catch { setAppointments([]) }
    finally { setLoading(false) }
  }, [date, barber])

  useEffect(() => { fetchAppointments() }, [fetchAppointments])

  useEffect(() => {
    window.addEventListener('appointment-changed', fetchAppointments)
    return () => window.removeEventListener('appointment-changed', fetchAppointments)
  }, [fetchAppointments])

  async function handleRemove(id: string) {
    await fetch(`/api/appointments/${id}`, { method: 'DELETE' })
    setAppointments(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Sua agenda</h2>
          <p className={styles.subtitle}>Consulte os seus cortes de cabelo agendados por dia</p>
        </div>
        <div className={styles.dateWrapper}>
          <CalendarIcon />
          <span className={styles.dateDisplay}>{formatDateBR(date)}</span>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className={styles.dateInput} />
          <ChevronIcon />
        </div>
      </div>

      {loading && <p className={styles.empty}>Carregando...</p>}
      {!loading && appointments.length === 0 && <p className={styles.empty}>Nenhum agendamento encontrado</p>}
      {!loading && appointments.length > 0 && (
        <ul className={styles.list}>
          {appointments.map(appt => (
            <li key={appt.id} className={styles.item}>
              <div className={styles.itemTime}>{appt.time}</div>
              <div className={styles.itemInfo}>
                <span className={styles.itemClient}>{appt.client}</span>
                <span className={styles.itemDate}>{formatDateBR(appt.date)}</span>
              </div>
              <button className={styles.removeBtn} onClick={() => handleRemove(appt.id)} title="Cancelar">
                <TrashIcon />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function CalendarIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
}
function ChevronIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8A8AAA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
}
function TrashIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
}
