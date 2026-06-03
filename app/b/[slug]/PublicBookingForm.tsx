'use client'

import { useState, useEffect, FormEvent } from 'react'
import { Service, Appointment } from '@/lib/types'
import DatePicker from '@/components/ui/DatePicker'
import styles from './page.module.css'

const MORNING = ['09:00','10:00','11:00','12:00']
const AFTERNOON = ['13:00','14:00','15:00','16:00','17:00','18:00']
const EVENING = ['19:00','20:00','21:00']

function today() { return new Date().toISOString().slice(0,10) }
function fmt(iso: string) { const [y,m,d] = iso.split('-'); return `${d}/${m}/${y}` }

export default function PublicBookingForm({ barberId, services }: { barberId: string; services: Service[] }) {
  const [date, setDate] = useState(today)
  const [time, setTime] = useState('')
  const [service, setService] = useState<Service | null>(null)
  const [client, setClient] = useState('')
  const [taken, setTaken] = useState<Set<string>>(new Set())
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/appointments?date=${date}&barberId=${barberId}`)
      .then(r => r.json())
      .then((d: Appointment[]) => setTaken(new Set(d.map(a => a.time))))
      .catch(() => setTaken(new Set()))
  }, [date, barberId])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!time) { setError('Selecione um horário.'); return }
    if (!client.trim()) { setError('Informe seu nome.'); return }
    setError(''); setLoading(true)
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, time, client, barberId, serviceId: service?.id }),
      })
      if (!res.ok) { const j = await res.json(); setError(j.error ?? 'Erro.'); return }
      setTime(''); setClient(''); setService(null)
      setTaken(prev => new Set([...prev, time]))
      setSuccess(true); setTimeout(() => setSuccess(false), 4000)
    } catch { setError('Servidor indisponível.') }
    finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {services.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Escolha o serviço</h2>
          {services.map(s => (
            <button key={s.id} type="button" onClick={() => setService(s)}
              className={`${styles.svcBtn} ${service?.id === s.id ? styles.svcBtnActive : ''}`}>
              <span className={styles.svcName}>{s.name}</span>
              <span className={styles.svcMeta}>{s.duration}min · R$ {s.price.toFixed(2)}</span>
            </button>
          ))}
        </section>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Data</h2>
        <DatePicker value={date} onChange={v => { setDate(v); setTime('') }} />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Horários disponíveis</h2>
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
        <h2 className={styles.sectionTitle}>Seu nome</h2>
        <input type="text" placeholder="Como você se chama?" value={client} onChange={e => setClient(e.target.value)} className={styles.nameInput} />
      </section>

      {error && <p className={styles.error}>{error}</p>}
      {success && <div className={styles.successBox}>✓ Agendamento confirmado! Te esperamos.</div>}

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? 'Agendando...' : 'Confirmar agendamento'}
      </button>
    </form>
  )
}
