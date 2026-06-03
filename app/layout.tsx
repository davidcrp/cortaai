import { ClerkProvider } from '@clerk/nextjs'
import { ptBR } from '@clerk/localizations'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = { title: 'CortaAí — Agendamento', description: 'Agendamento profissional para barbearias' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        <ClerkProvider localization={ptBR}>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
