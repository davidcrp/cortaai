import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Appointment } from '../types'
import styles from './Clients.module.css'

interface ClientSummary {
  name: string
  total: number
  last: string
}

export default function Clients() {
  const { barber } = useAuth()
  const [clients, setClients] = useState<ClientSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!barber) return
    fetch(`/api/appointments?barberId=${barber.id}`)
      .then(r => r.json())
      .then((appts: Appointment[]) => {
        const map = new Map<string, { total: number; last: string }>()
        for (const a of appts) {
          const prev = map.get(a.client)
          if (!prev || a.date > prev.last) {
            map.set(a.client, { total: (prev?.total ?? 0) + 1, last: a.date })
          } else {
            map.set(a.client, { total: prev.total + 1, last: prev.last })
          }
        }
        const list: ClientSummary[] = Array.from(map.entries()).map(([name, v]) => ({ name, ...v }))
        list.sort((a, b) => b.total - a.total)
        setClients(list)
      })
      .finally(() => setLoading(false))
  }, [barber])

  function formatDate(iso: string) {
    const [y, m, d] = iso.split('-')
    return `${d}/${m}/${y}`
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Clientes</h1>
        <p className={styles.sub}>Todos os clientes que já agendaram na sua barbearia</p>
      </div>

      {loading && <p className={styles.empty}>Carregando...</p>}
      {!loading && clients.length === 0 && (
        <p className={styles.empty}>Nenhum cliente ainda. Compartilhe seu link de agendamento!</p>
      )}
      {!loading && clients.length > 0 && (
        <div className={styles.grid}>
          {clients.map(c => (
            <div key={c.name} className={styles.card}>
              <div className={styles.avatar}>{c.name.slice(0, 2).toUpperCase()}</div>
              <div className={styles.info}>
                <p className={styles.name}>{c.name}</p>
                <p className={styles.meta}>Último: {formatDate(c.last)}</p>
              </div>
              <div className={styles.badge}>{c.total} {c.total === 1 ? 'visita' : 'visitas'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
