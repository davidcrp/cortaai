import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import styles from './Landing.module.css'

const plans = [
  {
    name: 'Gratuito',
    price: 'R$ 0',
    period: '/mês',
    features: ['50 agendamentos/mês', '1 barbeiro', 'Página pública', 'Suporte por e-mail'],
    cta: 'Começar grátis',
    highlight: false,
  },
  {
    name: 'Pro',
    price: 'R$ 29',
    period: '/mês',
    features: ['Agendamentos ilimitados', 'Até 3 barbeiros', 'Relatórios de clientes', 'Suporte prioritário'],
    cta: 'Assinar Pro',
    highlight: true,
  },
  {
    name: 'Premium',
    price: 'R$ 59',
    period: '/mês',
    features: ['Tudo do Pro', 'Múltiplas unidades', 'API de integração', 'Gerente de conta dedicado'],
    cta: 'Assinar Premium',
    highlight: false,
  },
]

export default function Landing() {
  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <ScissorsIcon />
          <span>CortaAí</span>
        </div>
        <div className={styles.navLinks}>
          <Link to="/login">Entrar</Link>
          <Link to="/register">
            <Button size="sm">Criar conta</Button>
          </Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroBadge}>✂ Agendamento para barbearias</div>
        <h1 className={styles.heroTitle}>
          Seu agendamento<br />
          <span className={styles.heroGold}>profissional</span> em minutos
        </h1>
        <p className={styles.heroSub}>
          Crie sua barbearia online, compartilhe o link com seus clientes e gerencie todos os agendamentos em um só lugar.
        </p>
        <div className={styles.heroCtas}>
          <Link to="/register">
            <Button size="lg">Criar minha barbearia</Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline">Já tenho conta</Button>
          </Link>
        </div>
        <p className={styles.heroNote}>Grátis para começar · Sem cartão de crédito</p>
      </section>

      <section className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>📅</div>
          <h3>Agenda Online</h3>
          <p>Clientes agendam 24h pelo link da sua barbearia, sem ligações.</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>💼</div>
          <h3>Gestão de Serviços</h3>
          <p>Cadastre cortes, barba, relaxamento com preço e duração.</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>📊</div>
          <h3>Histórico de Clientes</h3>
          <p>Veja todos os clientes atendidos e o histórico de agendamentos.</p>
        </div>
      </section>

      <section className={styles.plans}>
        <h2 className={styles.plansTitle}>Planos simples e transparentes</h2>
        <p className={styles.plansSub}>Comece grátis, escale quando precisar.</p>
        <div className={styles.planGrid}>
          {plans.map(plan => (
            <div key={plan.name} className={`${styles.planCard} ${plan.highlight ? styles.planHighlight : ''}`}>
              {plan.highlight && <div className={styles.planBadge}>Mais popular</div>}
              <div className={styles.planName}>{plan.name}</div>
              <div className={styles.planPrice}>
                <span className={styles.planAmount}>{plan.price}</span>
                <span className={styles.planPeriod}>{plan.period}</span>
              </div>
              <ul className={styles.planFeatures}>
                {plan.features.map(f => (
                  <li key={f}><CheckIcon /> {f}</li>
                ))}
              </ul>
              <Link to="/register">
                <Button fullWidth variant={plan.highlight ? 'primary' : 'outline'}>{plan.cta}</Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.logo}>
          <ScissorsIcon />
          <span>CortaAí</span>
        </div>
        <p>© 2026 CortaAí · Agendamento inteligente para barbearias</p>
      </footer>
    </div>
  )
}

function ScissorsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
