'use client'

import { useState, FormEvent } from 'react'
import { useUser } from '@clerk/nextjs'
import { BarberProfile } from '@/lib/types'
import { useTheme } from '@/components/ThemeProvider'
import { ACCENTS, AccentColor, ThemeMode } from '@/lib/theme'
import styles from './page.module.css'

export default function ConfiguracoesPage() {
  const { user } = useUser()
  const profile = user?.publicMetadata as unknown as BarberProfile | undefined
  const [barbershopName, setBarbershopName] = useState(profile?.barbershopName ?? '')
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)
  const { theme, setMode, setAccent } = useTheme()

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
        <p className={styles.sub}>Atualize os dados e a aparência da sua barbearia</p>
      </div>

      {/* Perfil */}
      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Perfil</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="shopName">Nome da barbearia</label>
            <input id="shopName" type="text" value={barbershopName}
              onChange={e => setBarbershopName(e.target.value)} className={styles.input} />
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
          <button type="submit" className={styles.btn} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      </div>

      {/* Aparência */}
      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Aparência</h2>

        <p className={styles.fieldLabel}>Modo</p>
        <div className={styles.modeRow}>
          {(['dark', 'light'] as ThemeMode[]).map(m => (
            <button key={m} type="button"
              onClick={() => setMode(m)}
              className={`${styles.modeBtn} ${theme.mode === m ? styles.modeBtnActive : ''}`}>
              {m === 'dark' ? <MoonIcon /> : <SunIcon />}
              {m === 'dark' ? 'Escuro' : 'Claro'}
            </button>
          ))}
        </div>

        <p className={styles.fieldLabel} style={{ marginTop: 20 }}>Cor de destaque</p>
        <div className={styles.accentRow}>
          {(Object.keys(ACCENTS) as AccentColor[]).map(key => (
            <button key={key} type="button"
              onClick={() => setAccent(key)}
              className={`${styles.accentBtn} ${theme.accent === key ? styles.accentBtnActive : ''}`}
              title={ACCENTS[key].label}
              style={{ '--accent-color': ACCENTS[key].hex } as React.CSSProperties}>
              <span className={styles.accentSwatch} style={{ backgroundColor: ACCENTS[key].hex }} />
              <span className={styles.accentLabel}>{ACCENTS[key].label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function MoonIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
}

function SunIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
}
