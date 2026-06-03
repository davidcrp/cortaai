'use client'

import { useState, FormEvent } from 'react'
import { useUser } from '@clerk/nextjs'
import { BarberProfile } from '@/lib/types'
import styles from './page.module.css'

export default function ConfiguracoesPage() {
  const { user } = useUser()
  const profile = user?.publicMetadata as unknown as BarberProfile | undefined
  const [barbershopName, setBarbershopName] = useState(profile?.barbershopName ?? '')
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!barbershopName.trim()) return
    setSaving(true)
    await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ barbershopName: barbershopName.trim() }),
    })
    await user?.reload()
    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2500)
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Configurações</h1>
        <p className={styles.sub}>Atualize os dados da sua barbearia</p>
      </div>
      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="shopName">Nome da barbearia</label>
            <input id="shopName" type="text" value={barbershopName} onChange={e => setBarbershopName(e.target.value)} className={styles.input} />
          </div>
          <div className={styles.readonly}>
            <span className={styles.readonlyLabel}>Link público</span>
            <span className={styles.readonlyValue}>/b/{profile?.slug}</span>
          </div>
          <div className={styles.readonly}>
            <span className={styles.readonlyLabel}>E-mail</span>
            <span className={styles.readonlyValue}>{user?.primaryEmailAddress?.emailAddress}</span>
          </div>
          {success && <p className={styles.success}>Salvo com sucesso!</p>}
          <button type="submit" className={styles.btn} disabled={saving}>{saving ? 'Salvando...' : 'Salvar alterações'}</button>
        </form>
      </div>
    </div>
  )
}
