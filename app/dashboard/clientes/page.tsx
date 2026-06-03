'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Appointment } from '@/lib/types'
import styles from './page.module.css'

interface ClientSummary { name: string; total: number; last: string }

function fmt(iso: string) { const [y,m,d] = iso.split('-'); return `${d}/${m}/${y}` }

export default function ClientesPage() {
  const { user } = useUser()
  const [clients, setClients] = useState<ClientSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetch(`/api/appointments?barberId=${user.id}`)
      .then(r => r.json())
      .then((appts: Appointment[]) => {
        const map = new Map<string, { total: number; last: string }>()
        for (const a of appts) {
          const prev = map.get(a.client)
          map.set(a.client, { total: (prev?.total ?? 0) + 1, last: (!prev || a.date > prev.last) ? a.date : prev.last })
        }
        setClients(Array.from(map.entries()).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.total - a.total))
      })
      .finally(() => setLoading(false))
  }, [user])

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Clientes</h1>
        <p className={styles.sub}>Todos os clientes que já agendaram</p>
      </div>
      {loading && <p className={styles.empty}>Carregando...</p>}
      {!loading && clients.length === 0 && <p className={styles.empty}>Nenhum cliente ainda.</p>}
      {!loading && clients.map(c => (
        <div key={c.name} className={styles.card}>
          <div className={styles.avatar}>{c.name.slice(0,2).toUpperCase()}</div>
          <div className={styles.info}>
            <p className={styles.name}>{c.name}</p>
            <p className={styles.meta}>Último: {fmt(c.last)}</p>
          </div>
          <span className={styles.badge}>{c.total} {c.total === 1 ? 'visita' : 'visitas'}</span>
        </div>
      ))}
    </div>
  )
}
