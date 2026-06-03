import { ClerkProvider } from '@clerk/nextjs'
import { ptBR } from '@clerk/localizations'
import { Inter, Playfair_Display } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display', style: ['normal', 'italic'] })

export const metadata = { title: 'CortaAí', description: 'Agendamento para barbearias' }

const clerkAppearance = {
  variables: {
    colorPrimary: '#D4A853',
    colorBackground: '#0F0D0A',
    colorInputBackground: '#231D14',
    colorInputText: '#F0E4C8',
    colorText: '#F0E4C8',
    colorTextSecondary: '#8B7355',
    colorNeutral: '#F0E4C8',
    colorDanger: '#c0392b',
    borderRadius: '4px',
    fontFamily: 'Inter, sans-serif',
  },
  elements: {
    card: { backgroundColor: '#1A1510', border: '1px solid #3A2E1E', boxShadow: 'none' },
    headerTitle: { color: '#F0E4C8', fontFamily: '"Playfair Display", Georgia, serif' },
    headerSubtitle: { color: '#8B7355' },
    formButtonPrimary: { backgroundColor: '#D4A853', color: '#0F0D0A', fontWeight: '700', borderRadius: '4px' },
    formFieldInput: { backgroundColor: '#231D14', border: '1.5px solid #3A2E1E', color: '#F0E4C8', borderRadius: '4px' },
    formFieldLabel: { color: '#F0E4C8' },
    footerActionLink: { color: '#D4A853' },
    dividerLine: { backgroundColor: '#3A2E1E' },
    dividerText: { color: '#8B7355' },
    socialButtonsBlockButton: { backgroundColor: '#231D14', border: '1.5px solid #3A2E1E', color: '#F0E4C8', borderRadius: '4px' },
    socialButtonsBlockButtonText: { color: '#F0E4C8' },
    otpCodeFieldInput: { backgroundColor: '#231D14', border: '1.5px solid #3A2E1E', color: '#F0E4C8', borderRadius: '4px' },
  },
}

const antiFlash = `
(function(){try{
  var t=JSON.parse(localStorage.getItem('cortaai_theme')||'{}');
  var mode=t.mode||'dark';
  var accent=t.accent||'gold';
  var accents={gold:'#D4A853',emerald:'#27AE60',sapphire:'#2980B9',violet:'#8E44AD',coral:'#E05C3A'};
  var hovers={gold:'#E0B860',emerald:'#2ECC71',sapphire:'#3498DB',violet:'#9B59B6',coral:'#E8724F'};
  var dims={gold:'rgba(212,168,83,0.15)',emerald:'rgba(39,174,96,0.15)',sapphire:'rgba(41,128,185,0.15)',violet:'rgba(142,68,173,0.15)',coral:'rgba(224,92,58,0.15)'};
  var r=document.documentElement;
  r.setAttribute('data-mode',mode);
  if(mode==='light'){
    r.style.setProperty('--bg','#F7F3EC');r.style.setProperty('--surface','#FFFFFF');
    r.style.setProperty('--surface2','#EDE6D8');r.style.setProperty('--cream','#1A1208');
    r.style.setProperty('--muted','#7A6A50');r.style.setProperty('--border','#D4C4A8');
    r.style.setProperty('--border2','#E2D8C4');
  }else{
    r.style.setProperty('--bg','#0F0D0A');r.style.setProperty('--surface','#1A1510');
    r.style.setProperty('--surface2','#231D14');r.style.setProperty('--cream','#F0E4C8');
    r.style.setProperty('--muted','#8B7355');r.style.setProperty('--border','#3A2E1E');
    r.style.setProperty('--border2','#2A2216');
  }
  r.style.setProperty('--gold',accents[accent]||'#D4A853');
  r.style.setProperty('--gold-hover',hovers[accent]||'#E0B860');
  r.style.setProperty('--gold-dim',dims[accent]||'rgba(212,168,83,0.15)');
}catch(e){}})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
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
