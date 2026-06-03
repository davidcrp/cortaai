import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { deleteAppointment } from '@/lib/appointments'

export const runtime = 'nodejs'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const deleted = deleteAppointment(id)
  if (!deleted) return NextResponse.json({ error: 'Não encontrado.' }, { status: 404 })
  return new NextResponse(null, { status: 204 })
}
