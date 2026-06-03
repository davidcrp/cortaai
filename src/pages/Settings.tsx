import { useState, FormEvent } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import styles from './Settings.module.css'

export default function Settings() {
  const { barber, updateBarber } = useAuth()
  const [name, setName] = useState(barber?.name ?? '')
  const [barbershopName, setBarbershopName] = useState(barber?.barbershopName ?? '')
  const [success, setSuccess] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !barbershopName.trim()) return
    updateBarber({ name: name.trim(), barbershopName: barbershopName.trim() })
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2500)
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Configurações</h1>
        <p className={styles.sub}>Atualize as informações da sua barbearia</p>
      </div>

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <Input id="cfg-name" label="Seu nome" value={name} onChange={e => setName(e.target.value)} />
          <Input id="cfg-shop" label="Nome da barbearia" value={barbershopName} onChange={e => setBarbershopName(e.target.value)} />

          <div className={styles.info}>
            <span className={styles.infoLabel}>Link público</span>
            <a href={`/b/${barber?.slug}`} target="_blank" rel="noreferrer" className={styles.infoValue}>
              /b/{barber?.slug}
            </a>
          </div>

          <div className={styles.info}>
            <span className={styles.infoLabel}>E-mail</span>
            <span className={styles.infoValue}>{barber?.email}</span>
          </div>

          {success && <p className={styles.success}>Informações salvas!</p>}
          <Button type="submit" size="lg">Salvar alterações</Button>
        </form>
      </div>
    </div>
  )
}
