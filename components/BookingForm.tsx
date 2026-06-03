'use client'

import { useState, useEffect } from 'react'
import { Appointment } from '@/lib/types'
import styles from './BookingForm.module.css'

const MORNING = ['09:00','10:00','11:00','12:00']
const AFTERNOON = ['13:00','14:00','15:00','16:00','17:00','18:00']
const EVENING = ['19:00','20:00','21:00']

function today() { return new Date().toISOString().slice(0,10) }
function fmt(iso: string) { const [y,m,d] = iso.split('-'); return `${d}/${m}/${y}` }

export default function BookingForm({ barberId }: { barberId: string }) {
  const [date, setDate] = useState(today)
  const [time, setTime] = useState('')
  const [client, setClient] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [taken, setTaken] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch(`/api/appointments?date=${date}&barberId=${barberId}`)
      .then(r => r.json())
      .then((d: Appointment[]) => setTaken(new Set(d.map(a => a.time))))
      .catch(() => setTaken(new Set()))
  }, [date, barberId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!time) { setError('Selecione um horário.'); return }
    if (!client.trim()) { setError('Informe o nome do cliente.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, time, client, barberId }),
      })
      if (!res.ok) { const j = await res.json(); setError(j.error ?? 'Erro.'); return }
      setTime(''); setClient('')
      setTaken(prev => new Set([...prev, time]))
      setSuccess(true); setTimeout(() => setSuccess(false), 2500)
      window.dispatchEvent(new CustomEvent('appointment-changed'))
    } catch { setError('Servidor indisponível.') }
    finally { setLoading(false) }
  }

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Agende um atendimento</h1>
      <p className={styles.sub}>Selecione data, horário e informe o nome do cliente.</p>
      <form onSubmit={handleSubmit} noValidate>
        <section className={styles.section}>
          <label className={styles.label}>Data</label>
          <div className={styles.datePicker}>
            📅 <span>{fmt(date)}</span>
            <input type="date" value={date} onChange={e => { setDate(e.target.value); setTime('') }} className={styles.dateInput} />
          </div>
        </section>
        <section className={styles.section}>
          <p className={styles.label}>Horários</p>
          {[['Manhã', MORNING], ['Tarde', AFTERNOON], ['Noite', EVENING]].map(([label, slots]) => (
            <div key={label as string}>
              <p className={styles.period}>{label as string}</p>
              <div className={styles.slots}>
                {(slots as string[]).map(t => (
                  <button key={t} type="button" disabled={taken.has(t)} onClick={() => setTime(t)}
                    className={`${styles.slot} ${time === t ? styles.slotSelected : ''} ${taken.has(t) ? styles.slotTaken : ''}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>
        <section className={styles.section}>
          <label className={styles.label}>Cliente</label>
          <input type="text" placeholder="Nome do cliente" value={client} onChange={e => setClient(e.target.value)} className={styles.input} />
        </section>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.successMsg}>Agendamento criado!</p>}
        <button type="submit" className={styles.submitBtn} disabled={loading}>{loading ? 'AGENDANDO...' : 'AGENDAR'}</button>
      </form>
    </div>
  )
}
