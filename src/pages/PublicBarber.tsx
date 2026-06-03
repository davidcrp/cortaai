import { useState, useEffect, FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { getBarberBySlug } from '../contexts/AuthContext'
import { Barber, Service, Appointment } from '../types'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import styles from './PublicBarber.module.css'

const MORNING = ['09:00', '10:00', '11:00', '12:00']
const AFTERNOON = ['13:00', '14:00', '15:00', '16:00', '17:00', '18:00']
const EVENING = ['19:00', '20:00', '21:00']

function todayString() { return new Date().toISOString().slice(0, 10) }
function formatDateBR(iso: string) { const [y,m,d] = iso.split('-'); return `${d}/${m}/${y}` }

export default function PublicBarber() {
  const { slug } = useParams<{ slug: string }>()
  const [barber] = useState<Barber | null>(() => getBarberBySlug(slug ?? ''))

  const [date, setDate] = useState(todayString)
  const [time, setTime] = useState('')
  const [service, setService] = useState<Service | null>(null)
  const [client, setClient] = useState('')
  const [takenTimes, setTakenTimes] = useState<Set<string>>(new Set())
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!barber) return
    fetch(`/api/appointments?date=${date}&barberId=${barber.id}`)
      .then(r => r.json())
      .then((data: Appointment[]) => setTakenTimes(new Set(data.map(a => a.time))))
      .catch(() => setTakenTimes(new Set()))
  }, [date, barber])

  if (!barber) {
    return (
      <div className={styles.notFound}>
        <div className={styles.nfIcon}>✂</div>
        <h1>Barbearia não encontrada</h1>
        <p>O link que você acessou não existe ou foi removido.</p>
      </div>
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!time) { setError('Selecione um horário.'); return }
    if (!client.trim()) { setError('Informe seu nome.'); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, time, client, barberId: barber!.id, serviceId: service?.id }),
      })
      if (!res.ok) { const j = await res.json(); setError(j.error ?? 'Erro.'); return }
      setTime('')
      setClient('')
      setService(null)
      setTakenTimes(prev => new Set([...prev, time]))
      setSuccess(true)
      setTimeout(() => setSuccess(false), 4000)
    } catch { setError('Servidor indisponível.') }
    finally { setLoading(false) }
  }

  const initials = barber.barbershopName.slice(0, 2).toUpperCase()

  return (
    <div className={styles.page}>
      <div className={styles.shopHeader}>
        <div className={styles.shopAvatar}>{initials}</div>
        <div>
          <h1 className={styles.shopName}>{barber.barbershopName}</h1>
          <p className={styles.shopSub}>Agendamento online · Sem precisar ligar</p>
        </div>
      </div>

      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Escolha o serviço</h2>
            <div className={styles.serviceList}>
              {barber.services.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setService(s)}
                  className={`${styles.serviceBtn} ${service?.id === s.id ? styles.serviceBtnActive : ''}`}
                >
                  <span className={styles.svcName}>{s.name}</span>
                  <div className={styles.svcMeta}>
                    <span>{s.duration}min</span>
                    <span>R$ {s.price.toFixed(2)}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Data</h2>
            <div className={styles.datePicker}>
              <CalendarIcon />
              <span>{formatDateBR(date)}</span>
              <input type="date" value={date} min={todayString()}
                onChange={e => { setDate(e.target.value); setTime('') }}
                className={styles.dateInput} />
              <ChevronIcon />
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Horários disponíveis</h2>

            <p className={styles.period}>Manhã</p>
            <div className={styles.slots}>
              {MORNING.map(t => <Slot key={t} slot={t} selected={time===t} taken={takenTimes.has(t)} onClick={setTime} />)}
            </div>
            <p className={styles.period}>Tarde</p>
            <div className={styles.slots}>
              {AFTERNOON.map(t => <Slot key={t} slot={t} selected={time===t} taken={takenTimes.has(t)} onClick={setTime} />)}
            </div>
            <p className={styles.period}>Noite</p>
            <div className={styles.slots}>
              {EVENING.map(t => <Slot key={t} slot={t} selected={time===t} taken={takenTimes.has(t)} onClick={setTime} />)}
            </div>
          </section>

          <section className={styles.section}>
            <Input id="pub-client" label="Seu nome" placeholder="Como você se chama?"
              value={client} onChange={e => setClient(e.target.value)} icon={<PersonIcon />} />
          </section>

          {error && <p className={styles.error}>{error}</p>}
          {success && (
            <div className={styles.successBox}>
              <span>✓</span> Agendamento confirmado! Te esperamos.
            </div>
          )}

          <Button type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? 'Agendando...' : 'Confirmar agendamento'}
          </Button>
        </form>
      </div>

      <footer className={styles.footer}>
        Powered by <strong>CortaAí</strong> · Crie sua barbearia em <a href="/register">cortaai.app</a>
      </footer>
    </div>
  )
}

function Slot({ slot, selected, taken, onClick }: { slot: string; selected: boolean; taken: boolean; onClick: (s: string) => void }) {
  return (
    <button type="button" disabled={taken} onClick={() => onClick(slot)}
      className={`${styles.slot} ${selected ? styles.slotSelected : ''} ${taken ? styles.slotTaken : ''}`}>
      {slot}
    </button>
  )
}

function CalendarIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
}
function ChevronIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
}
function PersonIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
