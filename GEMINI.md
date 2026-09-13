# Cardápio Digital — Gemini

> Regras compartilhadas: `.agents/rules/core.md`

## Stack
- Astro (SSG/Frontend) + Firebase (Auth, Firestore, Storage, Hosting)
- CSS puro com Custom Properties para temas
- Content Collections do Astro com Zod (dados iniciais/seed) + Firestore (persistência em tempo real)

## Estrutura
- `src/data/settings.json` — config inicial do estabelecimento
- `src/content/menu/*.md` — itens do cardápio iniciais (seed para o Firestore)
- `src/content/config.ts` — schemas Zod
- `src/lib/firebase.ts` — inicialização do SDK modular do Firebase
- `src/components/` — Hero, MenuSection, MenuCard, WhatsAppButton, Nav, Footer, CartDrawer
- `src/pages/admin/` — Admin Nativo mobile-first (Login, Dashboard, Itens, Config)
- `firestore.rules` & `storage.rules` — regras declarativas de segurança do Firebase
- `firebase.json` — configuração de hosting e emuladores do Firebase


## Referências
- PRD: `docs/PRD.md`
- Plano Geral: `docs/PLAN.md`
- Guias: `docs/guides/**`
