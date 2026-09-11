# Cardápio Digital — Gemini

> Regras compartilhadas: `.agents/rules/core.md`

## Stack
- Astro (SSG) + Decap CMS + Netlify
- CSS puro com Custom Properties para temas
- Content Collections do Astro com Zod

## Estrutura
- `src/data/settings.json` — config do estabelecimento
- `src/content/menu/*.md` — itens do cardápio
- `src/content/config.ts` — schemas Zod
- `src/components/` — Hero, MenuSection, MenuCard, WhatsAppButton, Nav, Footer
- `public/admin/` — Decap CMS
- `public/uploads/` — imagens

## Referências
- PRD: `docs/PRD.md`
- Plano Geral: `docs/PLAN.md`
- Guias: `docs/guides/**`
