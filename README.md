# CortaAí — agendamento para barbearias

SaaS de agendamento online para barbearias. O dono da barbearia cria a conta,
cadastra serviços e horários e recebe um link público onde os clientes marcam
horário sozinhos.

## Funcionalidades

- Cadastro e login com Clerk, com onboarding da barbearia
- Página pública de agendamento por barbearia (`/b/[slug]`)
- Painel com calendário, lista de clientes, serviços e configurações
- API REST para agendamentos e perfil (`app/api`)

## Stack

- Next.js (App Router) + React + TypeScript
- Clerk (autenticação, em português)
- CSS Modules
- Deploy na Vercel

## Estrutura

| Caminho | O que é |
|---|---|
| `app/b/[slug]` | Página pública de agendamento |
| `app/dashboard` | Painel do dono: calendário, clientes, serviços, configurações |
| `app/onboarding` | Configuração inicial da barbearia |
| `app/api` | Rotas de agendamentos e perfil |
| `lib/` | Regras de agendamento, tipos e tema |

## Rodar localmente

```bash
cp .env.local.example .env.local   # preencher as chaves do Clerk
npm install
npm run dev
```
