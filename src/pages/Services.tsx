import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Service } from '../types'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import styles from './Services.module.css'

function emptyForm() {
  return { name: '', duration: '', price: '' }
}

export default function Services() {
  const { barber, updateBarber } = useAuth()
  const services = barber?.services ?? []

  const [form, setForm] = useState(emptyForm())
  const [editId, setEditId] = useState<string | null>(null)
  const [error, setError] = useState('')

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function validate() {
    if (!form.name.trim()) return 'Nome é obrigatório.'
    if (!form.duration || Number(form.duration) <= 0) return 'Duração inválida.'
    if (!form.price || Number(form.price) < 0) return 'Preço inválido.'
    return ''
  }

  function handleSave() {
    const err = validate()
    if (err) { setError(err); return }
    setError('')

    if (editId) {
      const updated = services.map(s =>
        s.id === editId
          ? { ...s, name: form.name.trim(), duration: Number(form.duration), price: Number(form.price) }
          : s
      )
      updateBarber({ services: updated })
      setEditId(null)
    } else {
      const newService: Service = {
        id: crypto.randomUUID(),
        name: form.name.trim(),
        duration: Number(form.duration),
        price: Number(form.price),
      }
      updateBarber({ services: [...services, newService] })
    }
    setForm(emptyForm())
  }

  function handleEdit(s: Service) {
    setEditId(s.id)
    setForm({ name: s.name, duration: String(s.duration), price: String(s.price) })
    setError('')
  }

  function handleCancel() {
    setEditId(null)
    setForm(emptyForm())
    setError('')
  }

  function handleDelete(id: string) {
    updateBarber({ services: services.filter(s => s.id !== id) })
    if (editId === id) handleCancel()
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Serviços</h1>
        <p className={styles.sub}>Gerencie os serviços oferecidos pela sua barbearia</p>
      </div>

      <div className={styles.body}>
        <div className={styles.form}>
          <h2 className={styles.formTitle}>{editId ? 'Editar serviço' : 'Novo serviço'}</h2>
          <Input id="svc-name" label="Nome do serviço" placeholder="Ex: Corte simples"
            value={form.name} onChange={e => set('name', e.target.value)} />
          <div className={styles.row}>
            <Input id="svc-duration" label="Duração (min)" type="number" placeholder="30"
              value={form.duration} onChange={e => set('duration', e.target.value)} />
            <Input id="svc-price" label="Preço (R$)" type="number" placeholder="35"
              value={form.price} onChange={e => set('price', e.target.value)} />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.formActions}>
            <Button onClick={handleSave} fullWidth>{editId ? 'Salvar alterações' : 'Adicionar serviço'}</Button>
            {editId && <Button variant="ghost" onClick={handleCancel} fullWidth>Cancelar</Button>}
          </div>
        </div>

        <div className={styles.list}>
          <h2 className={styles.listTitle}>Serviços cadastrados ({services.length})</h2>
          {services.length === 0 && (
            <p className={styles.empty}>Nenhum serviço cadastrado ainda.</p>
          )}
          {services.map(s => (
            <div key={s.id} className={`${styles.serviceCard} ${editId === s.id ? styles.editing : ''}`}>
              <div className={styles.serviceInfo}>
                <p className={styles.serviceName}>{s.name}</p>
                <div className={styles.serviceMeta}>
                  <span><ClockIcon /> {s.duration} min</span>
                  <span><MoneyIcon /> R$ {s.price.toFixed(2)}</span>
                </div>
              </div>
              <div className={styles.serviceActions}>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(s)}>Editar</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(s.id)}>Excluir</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ClockIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:4}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
}
function MoneyIcon() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:4}}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
}
