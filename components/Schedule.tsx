'use client'

import { useState, useEffect, useCallback } from 'react'
import { Appointment } from '@/lib/types'
import styles from './Schedule.module.css'

function today() { return new Date().toISOString().slice(0,10) }
function fmt(iso: string) { const [y,m,d] = iso.split('-'); return `${d}/${m}/${y}` }

export default function Schedule({ barberId }: { barberId: string }) {
  const [date, setDate] = useState(today)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAppts = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch(`/api/appointments?date=${date}&barberId=${barberId}`)
      setAppointments(await r.json())
    } catch { setAppointments([]) }
    finally { setLoading(false) }
  }, [date, barberId])

  useEffect(() => { fetchAppts() }, [fetchAppts])
  useEffect(() => {
    window.addEventListener('appointment-changed', fetchAppts)
    return () => window.removeEventListener('appointment-changed', fetchAppts)
  }, [fetchAppts])

  async function handleRemove(id: string) {
    await fetch(`/api/appointments/${id}`, { method: 'DELETE' })
    setAppointments(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Sua agenda</h2>
          <p className={styles.sub}>Agendamentos por dia</p>
        </div>
        <div className={styles.datePicker}>
          📅 <span>{fmt(date)}</span>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className={styles.dateInput} />
        </div>
      </div>
      {loading && <p className={styles.empty}>Carregando...</p>}
      {!loading && appointments.length === 0 && <p className={styles.empty}>Nenhum agendamento</p>}
      {!loading && appointments.length > 0 && (
        <ul className={styles.list}>
          {appointments.map(a => (
            <li key={a.id} className={styles.item}>
              <div className={styles.time}>{a.time}</div>
              <div className={styles.info}>
                <span className={styles.client}>{a.client}</span>
                <span className={styles.date}>{fmt(a.date)}</span>
              </div>
              <button className={styles.del} onClick={() => handleRemove(a.id)}>✕</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
