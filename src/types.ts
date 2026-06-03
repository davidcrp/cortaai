export interface Appointment {
  id: string
  date: string
  time: string
  client: string
  barberId: string
  serviceId?: string
}

export interface Service {
  id: string
  name: string
  duration: number
  price: number
}

export interface Barber {
  id: string
  name: string
  email: string
  password: string
  barbershopName: string
  slug: string
  services: Service[]
}
