'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './DatePicker.module.css'

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const WEEKDAYS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function formatBR(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
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

interface Props {
  value: string
  onChange: (value: string) => void
  min?: string
}

export default function DatePicker({ value, onChange, min }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = parseISO(value)
  const [viewYear, setViewYear] = useState(selected.getFullYear())
  const [viewMonth, setViewMonth] = useState(selected.getMonth())

  const todayISO = toISO(new Date())
  const minISO = min ?? todayISO

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const days = getCalendarDays(viewYear, viewMonth)

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  function selectDay(day: Date) {
    const iso = toISO(day)
    if (iso < minISO) return
    onChange(iso)
    setOpen(false)
  }

  return (
    <div className={styles.wrapper} ref={ref}>
      <button type="button" className={`${styles.trigger} ${open ? styles.triggerOpen : ''}`} onClick={() => setOpen(o => !o)}>
        <CalIcon />
        <span>{formatBR(value)}</span>
        <ChevDown />
      </button>

      {open && (
        <div className={styles.popover}>
          <div className={styles.header}>
            <button type="button" className={styles.navBtn} onClick={prevMonth}><ChevLeft /></button>
            <span className={styles.monthLabel}>{MONTHS[viewMonth]} {viewYear}</span>
            <button type="button" className={styles.navBtn} onClick={nextMonth}><ChevRight /></button>
          </div>

          <div className={styles.grid}>
            {WEEKDAYS.map(w => (
              <div key={w} className={styles.weekday}>{w}</div>
            ))}
            {days.map(day => {
              const iso = toISO(day)
              const isSelected = iso === value
              const isToday = iso === todayISO
              const isDisabled = iso < minISO
              const isCurrent = day.getMonth() === viewMonth

              return (
                <button
                  key={iso}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => selectDay(day)}
                  className={[
                    styles.day,
                    !isCurrent ? styles.dayOther : '',
                    isToday && !isSelected ? styles.dayToday : '',
                    isSelected ? styles.daySelected : '',
                    isDisabled ? styles.dayDisabled : '',
                  ].join(' ')}
                >
                  {day.getDate()}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function CalIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
}
function ChevDown() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
}
function ChevLeft() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
}
function ChevRight() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
}
