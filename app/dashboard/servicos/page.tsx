'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Service, BarberProfile } from '@/lib/types'
import styles from './page.module.css'

function emptyForm() { return { name: '', duration: '', price: '' } }

export default function ServicosPage() {
  const { user } = useUser()
  const profile = user?.publicMetadata as unknown as BarberProfile | undefined
  const services: Service[] = profile?.services ?? []

  const [form, setForm] = useState(emptyForm())
  const [editId, setEditId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function set(k: string, v: string) { setForm(p => ({ ...p, [k]: v })) }

  async function saveServices(updated: Service[]) {
    setSaving(true)
    await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ services: updated }),
    })
    await user?.reload()
    setSaving(false)
  }

  async function handleSave() {
    if (!form.name.trim()) { setError('Nome obrigatório.'); return }
    if (!form.duration || Number(form.duration) <= 0) { setError('Duração inválida.'); return }
    if (form.price === '' || Number(form.price) < 0) { setError('Preço inválido.'); return }
    setError('')
    if (editId) {
      const updated = services.map(s => s.id === editId ? { ...s, name: form.name.trim(), duration: Number(form.duration), price: Number(form.price) } : s)
      await saveServices(updated)
      setEditId(null)
    } else {
      const novo: Service = { id: crypto.randomUUID(), name: form.name.trim(), duration: Number(form.duration), price: Number(form.price) }
      await saveServices([...services, novo])
    }
    setForm(emptyForm())
  }

  async function handleDelete(id: string) {
    await saveServices(services.filter(s => s.id !== id))
    if (editId === id) { setEditId(null); setForm(emptyForm()) }
  }

  function startEdit(s: Service) {
    setEditId(s.id)
    setForm({ name: s.name, duration: String(s.duration), price: String(s.price) })
    setError('')
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Serviços</h1>
        <p className={styles.sub}>Gerencie os serviços da sua barbearia</p>
      </div>
      <div className={styles.body}>
        <div className={styles.form}>
          <h2 className={styles.formTitle}>{editId ? 'Editar serviço' : 'Novo serviço'}</h2>
          <div className={styles.field}><label>Nome</label><input placeholder="Corte simples" value={form.name} onChange={e => set('name', e.target.value)} className={styles.input} /></div>
          <div className={styles.row}>
            <div className={styles.field}><label>Duração (min)</label><input type="number" placeholder="30" value={form.duration} onChange={e => set('duration', e.target.value)} className={styles.input} /></div>
            <div className={styles.field}><label>Preço (R$)</label><input type="number" placeholder="35" value={form.price} onChange={e => set('price', e.target.value)} className={styles.input} /></div>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.btnPrimary} onClick={handleSave} disabled={saving}>{saving ? 'Salvando...' : editId ? 'Salvar alterações' : 'Adicionar'}</button>
          {editId && <button className={styles.btnGhost} onClick={() => { setEditId(null); setForm(emptyForm()) }}>Cancelar</button>}
        </div>

        <div>
          <h2 className={styles.listTitle}>Cadastrados ({services.length})</h2>
          {services.length === 0 && <p className={styles.empty}>Nenhum serviço ainda.</p>}
          {services.map(s => (
            <div key={s.id} className={`${styles.card} ${editId === s.id ? styles.editing : ''}`}>
              <div>
                <p className={styles.svcName}>{s.name}</p>
                <p className={styles.svcMeta}>{s.duration}min · R$ {s.price.toFixed(2)}</p>
              </div>
              <div className={styles.actions}>
                <button className={styles.btnGhost} onClick={() => startEdit(s)}>Editar</button>
                <button className={styles.btnDanger} onClick={() => handleDelete(s.id)}>Excluir</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
