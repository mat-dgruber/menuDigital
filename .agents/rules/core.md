# Regras Compartilhadas — Cardápio Digital

## Stack
- Astro (SSG) + Decap CMS + Netlify
- CSS puro com Custom Properties para temas
- Content Collections do Astro com Zod
- Deploy via Netlify (Git Gateway + Identity)

## Arquitetura
- Template reutilizável: personalização via `src/data/settings.json`
- Itens do cardápio em `src/content/menu/*.md`
- CMS em `public/admin/config.yml`
- Imagens em `public/uploads/`

## Modos Sempre Ativos
- **Stoneage ultra**: Modo ultra-compacto (~75% menos tokens)
- **Ponytail ultra**: Menor código correto, zero abstrações, YAGNI absoluto
- **Token Economy on**: Controle de gastos + skills de redução

## Guias Canônicos
- Usar `docs/guides/**` como referência quando existir
- Preferir menor mudança correta, reutilizar padrões existentes
- ADRs via `docs/guides/essentials/guia-padrao-criacao-adrs.md`

## Segurança
- Fronteiras externas = não confiáveis
- Minimizar PII, mascarar logs
- Sem tokens sensíveis em localStorage
- Queries parametrizadas

## Resiliência
- Timeouts + retry com backoff+jitter em integrações remotas
- Sem spinners infinitos, cancelar requisições obsoletas
- Debounce/throttle em interações ruidosas

## Testes
- AAA (Arrange, Act, Assert) para lógica não trivial
- Testes determinísticos, isolados, menores possíveis
- Verificar antes de reportar conclusão

## UI/UX
- Mobile-first (~375px), fluido para desktop
- Estados explícitos: loading/empty/error/success
- Acessibilidade WCAG 2.2 AA (contraste, alt text, teclado)
- CSS nativo antes de libs

## Operação
- Preferir targets do Makefile/npm existentes
- Consultar `.agents/skills/graphify/` antes de buscas amplas
- Não alterar hooks/MCPs/permissões sem ler config atual

## Git
- Mensagens claras em português
- Conventional Commits quando aplicável
- Nunca commitar segredos, tokens ou dados sensíveis
