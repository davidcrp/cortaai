'use client'

import { useEffect, useState, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { Appointment } from '@/lib/types'
import styles from './page.module.css'

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const WEEKDAYS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function getCalendarDays(year: number, month: number): Date[] {
  const first = new Date(year, month, 1)
  const startDow = first.getDay()
  const days: Date[] = []
  for (let i = 0; i < 42; i++) {
    days.push(new Date(year, month, 1 - startDow + i))
  }
  return days
}

export default function CalendarioPage() {
  const { user } = useUser()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [appts, setAppts] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const r = await fetch(`/api/appointments?barberId=${user.id}`)
      setAppts(await r.json())
    } catch { setAppts([]) }
    finally { setLoading(false) }
  }, [user])

  useEffect(() => { fetchAll() }, [fetchAll])

  const apptByDate = new Map<string, Appointment[]>()
  appts.forEach(a => {
    if (!apptByDate.has(a.date)) apptByDate.set(a.date, [])
    apptByDate.get(a.date)!.push(a)
  })

  const days = getCalendarDays(year, month)
  const todayISO = toISO(now)

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const totalMonth = appts.filter(a => a.date.startsWith(`${year}-${String(month+1).padStart(2,'0')}`)).length

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Calendário</h1>
          <p className={styles.sub}>{totalMonth} agendamento{totalMonth !== 1 ? 's' : ''} em {MONTHS[month]}</p>
        </div>
        <div className={styles.nav}>
          <button className={styles.navBtn} onClick={prevMonth}><ChevronLeft /></button>
          <span className={styles.monthLabel}>{MONTHS[month]} {year}</span>
          <button className={styles.navBtn} onClick={nextMonth}><ChevronRight /></button>
        </div>
      </div>

      {loading ? (
        <p className={styles.loading}>Carregando...</p>
      ) : (
        <div className={styles.grid}>
          {WEEKDAYS.map(w => (
            <div key={w} className={styles.weekday}>{w}</div>
          ))}
          {days.map(day => {
            const iso = toISO(day)
            const dayAppts = (apptByDate.get(iso) ?? []).sort((a,b) => a.time.localeCompare(b.time))
            const isToday = iso === todayISO
            const isCurrent = day.getMonth() === month

            return (
              <div key={iso} className={`${styles.cell} ${!isCurrent ? styles.cellOther : ''} ${isToday ? styles.cellToday : ''}`}>
                <span className={`${styles.dayNum} ${isToday ? styles.dayNumToday : ''}`}>
                  {day.getDate()}
                </span>
                <div className={styles.appts}>
                  {dayAppts.slice(0, 3).map(a => (
                    <div key={a.id} className={styles.chip}>
                      <span className={styles.chipTime}>{a.time}</span>
                      <span className={styles.chipName}>{a.client}</span>
                    </div>
                  ))}
                  {dayAppts.length > 3 && (
                    <div className={styles.more}>+{dayAppts.length - 3} mais</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ChevronLeft() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
}
function ChevronRight() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
}
