import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { BarberProfile } from '@/lib/types'
import DashboardSidebar from '@/components/DashboardSidebar'
import styles from './layout.module.css'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const profile = user.publicMetadata as unknown as BarberProfile
  if (!profile?.barbershopName) redirect('/onboarding')

  return (
    <div className={styles.layout}>
      <DashboardSidebar
        barbershopName={profile.barbershopName}
        slug={profile.slug}
        initials={profile.barbershopName.slice(0, 2).toUpperCase()}
      />
      <main className={styles.content}>{children}</main>
    </div>
  )
}
