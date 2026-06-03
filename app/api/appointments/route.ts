import { NextRequest, NextResponse } from 'next/server'
import { getAppointments, createAppointment, hasConflict } from '@/lib/appointments'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const barberId = searchParams.get('barberId') ?? undefined
  const date = searchParams.get('date') ?? undefined
  return NextResponse.json(getAppointments(barberId, date))
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { date, time, client, barberId, serviceId } = body

  if (!date || !time || !client?.trim() || !barberId) {
    return NextResponse.json({ error: 'date, time, client e barberId são obrigatórios.' }, { status: 400 })
  }
  if (hasConflict(barberId, date, time)) {
    return NextResponse.json({ error: 'Horário já agendado.' }, { status: 409 })
  }

  const appt = createAppointment({ date, time, client: client.trim(), barberId, serviceId: serviceId ?? null })
  return NextResponse.json(appt, { status: 201 })
}
