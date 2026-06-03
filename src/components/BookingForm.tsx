import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Appointment } from '../types'
import styles from './BookingForm.module.css'

const MORNING = ['09:00', '10:00', '11:00', '12:00']
const AFTERNOON = ['13:00', '14:00', '15:00', '16:00', '17:00', '18:00']
const EVENING = ['19:00', '20:00', '21:00']

function todayString() { return new Date().toISOString().slice(0, 10) }
function formatDateBR(iso: string) { const [y,m,d] = iso.split('-'); return `${d}/${m}/${y}` }

export default function BookingForm() {
  const { barber } = useAuth()
  const [date, setDate] = useState(todayString)
  const [time, setTime] = useState('')
  const [client, setClient] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [takenTimes, setTakenTimes] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!barber) return
    fetch(`/api/appointments?date=${date}&barberId=${barber.id}`)
      .then(r => r.json())
      .then((data: Appointment[]) => setTakenTimes(new Set(data.map(a => a.time))))
      .catch(() => setTakenTimes(new Set()))
  }, [date, barber])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!time) { setError('Selecione um horário.'); return }
    if (!client.trim()) { setError('Informe o nome do cliente.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, time, client, barberId: barber!.id }),
      })
      if (!res.ok) { const j = await res.json(); setError(j.error ?? 'Erro ao agendar.'); return }
      setTime(''); setClient('')
      setTakenTimes(prev => new Set([...prev, time]))
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2500)
      window.dispatchEvent(new CustomEvent('appointment-changed'))
    } catch { setError('Servidor indisponível.') }
    finally { setLoading(false) }
  }

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Agende um atendimento</h1>
      <p className={styles.subtitle}>Selecione data, horário e informe o nome do cliente para criar o agendamento.</p>

      <form onSubmit={handleSubmit} noValidate>
        <section className={styles.section}>
          <label className={styles.label} htmlFor="date">Data</label>
          <div className={styles.dateWrapper}>
            <CalendarIcon />
            <span className={styles.dateDisplay}>{formatDateBR(date)}</span>
            <input id="date" type="date" value={date}
              onChange={e => { setDate(e.target.value); setTime('') }}
              className={styles.dateInput} />
            <ChevronIcon />
          </div>
        </section>

        <section className={styles.section}>
          <p className={styles.label}>Horários</p>
          <p className={styles.period}>Manhã</p>
          <div className={styles.slots}>
            {MORNING.map(t => <SlotButton key={t} slot={t} selected={time===t} taken={takenTimes.has(t)} onClick={setTime} />)}
          </div>
          <p className={styles.period}>Tarde</p>
          <div className={styles.slots}>
            {AFTERNOON.map(t => <SlotButton key={t} slot={t} selected={time===t} taken={takenTimes.has(t)} onClick={setTime} />)}
          </div>
          <p className={styles.period}>Noite</p>
          <div className={styles.slots}>
            {EVENING.map(t => <SlotButton key={t} slot={t} selected={time===t} taken={takenTimes.has(t)} onClick={setTime} />)}
          </div>
        </section>

        <section className={styles.section}>
          <label className={styles.label} htmlFor="client">Cliente</label>
          <div className={styles.inputWrapper}>
            <PersonIcon />
            <input id="client" type="text" placeholder="Nome do cliente"
              value={client} onChange={e => setClient(e.target.value)} className={styles.input} />
          </div>
        </section>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.successMsg}>Agendamento criado com sucesso!</p>}
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'AGENDANDO...' : 'AGENDAR'}
        </button>
      </form>
    </div>
  )
}

function SlotButton({ slot, selected, taken, onClick }: { slot: string; selected: boolean; taken: boolean; onClick: (s: string) => void }) {
  return (
    <button type="button" disabled={taken} onClick={() => onClick(slot)}
      className={`${styles.slot} ${selected ? styles.slotSelected : ''} ${taken ? styles.slotTaken : ''}`}>
      {slot}
    </button>
  )
}

function CalendarIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
}
function ChevronIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A8AAA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
}
function PersonIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
