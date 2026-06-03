import { ClerkProvider } from '@clerk/nextjs'
import { ptBR } from '@clerk/localizations'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
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
    card: { backgroundColor: '#16213E', border: '1px solid #2A2A4A', boxShadow: 'none' },
    headerTitle: { color: '#F5F0E8' },
    headerSubtitle: { color: '#8A8AAA' },
    formButtonPrimary: { backgroundColor: '#C9A84C', color: '#1A1A2E', fontWeight: '700' },
    formFieldInput: { backgroundColor: '#1E1E3A', border: '1.5px solid #2A2A4A', color: '#F5F0E8' },
    formFieldLabel: { color: '#F5F0E8' },
    footerActionLink: { color: '#C9A84C' },
    dividerLine: { backgroundColor: '#2A2A4A' },
    dividerText: { color: '#8A8AAA' },
    socialButtonsBlockButton: { backgroundColor: '#1E1E3A', border: '1.5px solid #2A2A4A', color: '#F5F0E8' },
    socialButtonsBlockButtonText: { color: '#F5F0E8' },
    otpCodeFieldInput: { backgroundColor: '#1E1E3A', border: '1.5px solid #2A2A4A', color: '#F5F0E8' },
  },
}

// Anti-flash: apply saved theme before first paint
const antiFlash = `
(function(){
  try{
    var t=JSON.parse(localStorage.getItem('cortaai_theme')||'{}');
    var mode=t.mode||'dark';
    var accent=t.accent||'gold';
    var accents={gold:'#C9A84C',emerald:'#27AE60',sapphire:'#2980B9',violet:'#8E44AD',coral:'#E05C3A'};
    var hovers={gold:'#D9B85C',emerald:'#2ECC71',sapphire:'#3498DB',violet:'#9B59B6',coral:'#E8724F'};
    var dims={gold:'rgba(201,168,76,0.15)',emerald:'rgba(39,174,96,0.15)',sapphire:'rgba(41,128,185,0.15)',violet:'rgba(142,68,173,0.15)',coral:'rgba(224,92,58,0.15)'};
    var r=document.documentElement;
    r.setAttribute('data-mode',mode);
    if(mode==='light'){
      r.style.setProperty('--bg','#F4F2EE');
      r.style.setProperty('--surface','#FFFFFF');
      r.style.setProperty('--surface2','#ECEAE4');
      r.style.setProperty('--cream','#1A1A2E');
      r.style.setProperty('--muted','#6B6B8A');
      r.style.setProperty('--border','#D8D5CC');
      r.style.setProperty('--border2','#E5E2DA');
    }
    r.style.setProperty('--gold',accents[accent]||'#C9A84C');
    r.style.setProperty('--gold-hover',hovers[accent]||'#D9B85C');
    r.style.setProperty('--gold-dim',dims[accent]||'rgba(201,168,76,0.15)');
  }catch(e){}
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: antiFlash }} />
      </head>
      <body>
        <ClerkProvider localization={ptBR} appearance={clerkAppearance}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
