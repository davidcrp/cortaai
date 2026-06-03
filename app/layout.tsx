import { ClerkProvider } from '@clerk/nextjs'
import { ptBR } from '@clerk/localizations'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = { title: 'CortaAí — Agendamento', description: 'Agendamento profissional para barbearias' }

const clerkAppearance = {
  variables: {
    colorPrimary: '#C9A84C',
    colorBackground: '#1A1A2E',
    colorInputBackground: '#1E1E3A',
    colorInputText: '#F5F0E8',
    colorText: '#F5F0E8',
    colorTextSecondary: '#8A8AAA',
    colorNeutral: '#F5F0E8',
    colorDanger: '#c0392b',
    borderRadius: '8px',
    fontFamily: 'Inter, sans-serif',
  },
  elements: {
    card: {
      backgroundColor: '#16213E',
      border: '1px solid #2A2A4A',
      boxShadow: 'none',
    },
    headerTitle: { color: '#F5F0E8' },
    headerSubtitle: { color: '#8A8AAA' },
    formButtonPrimary: {
      backgroundColor: '#C9A84C',
      color: '#1A1A2E',
      fontWeight: '700',
      '&:hover': { backgroundColor: '#D9B85C' },
    },
    formFieldInput: {
      backgroundColor: '#1E1E3A',
      border: '1.5px solid #2A2A4A',
      color: '#F5F0E8',
      '&:focus': { borderColor: '#C9A84C' },
    },
    formFieldLabel: { color: '#F5F0E8' },
    footerActionLink: { color: '#C9A84C' },
    identityPreviewText: { color: '#F5F0E8' },
    identityPreviewEditButton: { color: '#C9A84C' },
    dividerLine: { backgroundColor: '#2A2A4A' },
    dividerText: { color: '#8A8AAA' },
    socialButtonsBlockButton: {
      backgroundColor: '#1E1E3A',
      border: '1.5px solid #2A2A4A',
      color: '#F5F0E8',
      '&:hover': { backgroundColor: '#252545' },
    },
    socialButtonsBlockButtonText: { color: '#F5F0E8' },
    alternativeMethodsBlockButton: {
      backgroundColor: '#1E1E3A',
      border: '1.5px solid #2A2A4A',
      color: '#F5F0E8',
    },
    otpCodeFieldInput: {
      backgroundColor: '#1E1E3A',
      border: '1.5px solid #2A2A4A',
      color: '#F5F0E8',
    },
    navbar: { backgroundColor: '#16213E' },
    navbarButton: { color: '#8A8AAA' },
    userPreviewMainIdentifier: { color: '#F5F0E8' },
    userPreviewSecondaryIdentifier: { color: '#8A8AAA' },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        <ClerkProvider localization={ptBR} appearance={clerkAppearance}>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
