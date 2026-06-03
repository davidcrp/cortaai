export interface Appointment {
  id: string
  date: string
  time: string
  client: string
  barberId: string
  serviceId?: string | null
}

export interface Service {
  id: string
  name: string
  duration: number
  price: number
}

export interface BarberProfile {
  barbershopName: string
  slug: string
  services: Service[]
}
