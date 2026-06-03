import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server'
import { BarberProfile } from '@/lib/types'

export async function PATCH(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const user = await currentUser()
  const existing = (user?.publicMetadata ?? {}) as Partial<BarberProfile>

  const merged: BarberProfile = {
    barbershopName: body.barbershopName ?? existing.barbershopName ?? '',
    slug: body.slug ?? existing.slug ?? '',
    services: body.services ?? existing.services ?? [],
  }

  const client = await clerkClient()
  await client.users.updateUser(userId, { publicMetadata: merged as unknown as Record<string, unknown> })

  return NextResponse.json({ ok: true })
}
