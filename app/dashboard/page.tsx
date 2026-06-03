import { currentUser } from '@clerk/nextjs/server'
import BookingForm from '@/components/BookingForm'
import Schedule from '@/components/Schedule'
import styles from './page.module.css'

export default async function AgendaPage() {
  const user = await currentUser()
  return (
    <div className={styles.layout}>
      <BookingForm barberId={user!.id} />
      <Schedule barberId={user!.id} />
    </div>
  )
}
