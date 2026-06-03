import { clerkClient } from '@clerk/nextjs/server'
import { BarberProfile, Service } from '@/lib/types'
import PublicBookingForm from './PublicBookingForm'
import styles from './page.module.css'

interface Props { params: Promise<{ slug: string }> }

export default async function PublicBarberPage({ params }: Props) {
  const { slug } = await params
  const client = await clerkClient()
  const { data: users } = await client.users.getUserList({ limit: 200 })
  const barberUser = users.find(u => (u.publicMetadata as unknown as BarberProfile)?.slug === slug)

  if (!barberUser) {
    return (
      <div className={styles.notFound}>
        <div className={styles.nfIcon}>✂</div>
        <h1>Barbearia não encontrada</h1>
        <p>O link que você acessou não existe.</p>
      </div>
    )
  }

  const profile = barberUser.publicMetadata as unknown as BarberProfile

  return (
    <div className={styles.page}>
      <div className={styles.shopHeader}>
        <div className={styles.shopAvatar}>{profile.barbershopName.slice(0,2).toUpperCase()}</div>
        <div>
          <h1 className={styles.shopName}>{profile.barbershopName}</h1>
          <p className={styles.shopSub}>Agendamento online · Sem precisar ligar</p>
        </div>
      </div>
      <PublicBookingForm barberId={barberUser.id} services={profile.services ?? []} />
      <footer className={styles.footer}>
        Powered by <strong>CortaAí</strong>
      </footer>
    </div>
  )
}
