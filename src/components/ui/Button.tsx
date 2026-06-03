import { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export default function Button({ variant = 'primary', size = 'md', fullWidth, className = '', children, ...rest }: Props) {
  const cls = [styles.btn, styles[variant], styles[size], fullWidth ? styles.full : '', className].filter(Boolean).join(' ')
  return <button className={cls} {...rest}>{children}</button>
}
