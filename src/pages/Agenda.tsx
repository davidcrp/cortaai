import BookingForm from '../components/BookingForm'
import Schedule from '../components/Schedule'
import styles from './Agenda.module.css'

export default function Agenda() {
  return (
    <div className={styles.layout}>
      <BookingForm />
      <Schedule />
    </div>
  )
}
