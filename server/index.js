import express from 'express'
import cors from 'cors'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { randomUUID } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_FILE = join(__dirname, 'data.json')
const IS_VERCEL = !!process.env.VERCEL

// In-memory fallback for Vercel (serverless has no writable filesystem)
let _mem = []

function loadData() {
  if (IS_VERCEL) return [..._mem]
  if (!existsSync(DATA_FILE)) return []
  try { return JSON.parse(readFileSync(DATA_FILE, 'utf-8')) } catch { return [] }
}

function saveData(appointments) {
  if (IS_VERCEL) { _mem = appointments; return }
  writeFileSync(DATA_FILE, JSON.stringify(appointments, null, 2))
}

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/appointments', (req, res) => {
  let data = loadData()
  const { date, barberId } = req.query
  if (barberId) data = data.filter(a => a.barberId === barberId)
  if (date) data = data.filter(a => a.date === date)
  res.json(data.sort((a, b) => a.time.localeCompare(b.time)))
})

app.post('/api/appointments', (req, res) => {
  const { date, time, client, barberId, serviceId } = req.body
  if (!date || !time || !client?.trim() || !barberId) {
    return res.status(400).json({ error: 'date, time, client e barberId são obrigatórios.' })
  }
  const data = loadData()
  if (data.find(a => a.barberId === barberId && a.date === date && a.time === time)) {
    return res.status(409).json({ error: 'Horário já agendado.' })
  }
  const appt = { id: randomUUID(), date, time, client: client.trim(), barberId, serviceId: serviceId ?? null }
  data.push(appt)
  saveData(data)
  res.status(201).json(appt)
})

app.delete('/api/appointments/:id', (req, res) => {
  const data = loadData()
  const idx = data.findIndex(a => a.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Agendamento não encontrado.' })
  data.splice(idx, 1)
  saveData(data)
  res.status(204).end()
})

// Export for Vercel serverless
export default app

// Local dev only
if (!IS_VERCEL) {
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => console.log(`CortaAí API → http://localhost:${PORT}`))
}
