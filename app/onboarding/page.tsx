'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import styles from './page.module.css'

function slugify(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function OnboardingPage() {
  const { user } = useUser()
  const router = useRouter()
  const [barbershopName, setBarbershopName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!barbershopName.trim()) { setError('Nome da barbearia é obrigatório.'); return }
    setLoading(true); setError('')
    try {
      const slug = slugify(barbershopName.trim())
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barbershopName: barbershopName.trim(),
          slug,
          services: [
            { id: crypto.randomUUID(), name: 'Corte simples', duration: 30, price: 35 },
            { id: crypto.randomUUID(), name: 'Corte + Barba', duration: 60, price: 55 },
          ],
        }),
      })
      if (!res.ok) { setError('Erro ao salvar. Tente novamente.'); return }
      await user?.reload()
      router.push('/dashboard')
    } catch { setError('Erro de conexão.') }
    finally { setLoading(false) }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>✂ CortaAí</div>
        <h1 className={styles.title}>Configure sua barbearia</h1>
        <p className={styles.sub}>Só mais um passo antes de começar</p>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor="shop">Nome da barbearia</label>
            <input
              id="shop"
              type="text"
              placeholder="Ex: Barbearia do João"
              value={barbershopName}
              onChange={e => setBarbershopName(e.target.value)}
              className={styles.input}
              autoFocus
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Salvando...' : 'Entrar no dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
}
