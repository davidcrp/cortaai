import { InputHTMLAttributes, ReactNode } from 'react'
import styles from './Input.module.css'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: ReactNode
  error?: string
}

export default function Input({ label, icon, error, id, className = '', ...rest }: Props) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label} htmlFor={id}>{label}</label>}
      <div className={`${styles.field} ${error ? styles.hasError : ''}`}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input id={id} className={`${styles.input} ${className}`} {...rest} />
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
