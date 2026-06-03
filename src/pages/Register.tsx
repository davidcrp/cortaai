import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import styles from './Auth.module.css'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [barbershopName, setBarbershopName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || !barbershopName.trim() || !password) {
      setError('Preencha todos os campos.')
      return
    }
    if (password.length < 6) { setError('Senha mínima: 6 caracteres.'); return }
    setLoading(true)
    const ok = register(name.trim(), email.trim(), barbershopName.trim(), password)
    setLoading(false)
    if (!ok) { setError('E-mail já cadastrado.'); return }
    navigate('/dashboard')
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <ScissorsIcon />
          <span>CortaAí</span>
        </div>
        <h1 className={styles.title}>Criar sua barbearia</h1>
        <p className={styles.sub}>Grátis para sempre · Sem cartão de crédito</p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <Input id="name" label="Seu nome" type="text" placeholder="João Silva"
            value={name} onChange={e => setName(e.target.value)} icon={<PersonIcon />} required />
          <Input id="barbershopName" label="Nome da barbearia" type="text" placeholder="Barbearia do João"
            value={barbershopName} onChange={e => setBarbershopName(e.target.value)} icon={<ShopIcon />} required />
          <Input id="email" label="E-mail" type="email" placeholder="seu@email.com"
            value={email} onChange={e => setEmail(e.target.value)} icon={<MailIcon />} required />
          <Input id="password" label="Senha" type="password" placeholder="Mínimo 6 caracteres"
            value={password} onChange={e => setPassword(e.target.value)} icon={<LockIcon />} required />
          {error && <p className={styles.error}>{error}</p>}
          <Button type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? 'Criando...' : 'Criar minha barbearia'}
          </Button>
        </form>

        <p className={styles.footer}>
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  )
}

function PersonIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
function ShopIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
}
function MailIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
}
function LockIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
}
function ScissorsIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>
}
