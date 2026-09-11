# Menu Editorial Premium Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar a rota `/menu` como cardápio editorial premium escuro, mantendo a home atual intacta.

**Architecture:** A implementação cria uma página Astro independente em `src/pages/menu.astro`. A rota consome `settings.json` e `getCollection('menu')`, monta grupos por categoria e renderiza HTML/CSS local para evitar abstração antes de haver reutilização real.

**Tech Stack:** Astro 7, Content Collections, CSS puro com Custom Properties, SSG.

## Global Constraints

- Não alterar a home atual em `src/pages/index.astro`.
- Não adicionar dependência.
- Não criar novos campos no CMS ou no schema.
- Não renderizar fotos por item em `/menu`.
- Não renderizar botão “Pedir” por item em `/menu`.
- WhatsApp deve aparecer apenas como CTA discreto no topo e/ou no rodapé.
- Item indisponível deve ter texto “Esgotado”, não apenas cor/opacidade.
- CTA externo de WhatsApp deve usar `target="_blank"` e `rel="noopener noreferrer"`.
- Verificação mínima: `npm run build`.

---

## File Structure

- Create: `src/pages/menu.astro`
  - Responsável por buscar dados, agrupar categorias, formatar preço e renderizar a experiência editorial premium.
  - CSS local no próprio arquivo para manter a mudança isolada.
- No modify: `src/pages/index.astro`
  - A home continua usando os componentes atuais.
- No modify: `src/components/MenuCard.astro`
  - O componente atual tem foto e pedido por item; reutilizá-lo criaria hacks contra o design aprovado.
- No modify: `src/data/settings.json`
  - A rota usa os dados existentes.

---

### Task 1: Criar rota `/menu` editorial premium

**Files:**
- Create: `src/pages/menu.astro`

**Interfaces:**
- Consumes:
  - `getCollection('menu')` de `astro:content`.
  - `settings.negocio.nome`, `settings.negocio.ramo`, `settings.negocio.slogan`.
  - `settings.atendimento.status_badge`, `settings.atendimento.horario`, `settings.atendimento.endereco`, `settings.atendimento.whatsapp`, `settings.atendimento.mensagem_padrao`.
  - `settings.categorias` com `{ id: string; nome: string; icone?: string }`.
  - Item da coleção `menu` com `data.nome`, `data.descricao`, `data.preco`, `data.categoria`, `data.destaque`, `data.maisPedido`, `data.disponivel`, `data.ordem`.
- Produces:
  - Rota estática `/menu` gerada pelo Astro.
  - Lista `grupos` com categorias não vazias e itens ordenados por `ordem`.
  - Função local `formatPrice(preco: number): string`.

- [ ] **Step 1: Criar a página com busca, agrupamento e estrutura HTML**

Create `src/pages/menu.astro` with this content:

```astro
---
import { getCollection } from 'astro:content';
import settings from '../data/settings.json';
import Base from '../layouts/Base.astro';

const allItems = await getCollection('menu');
const { negocio, atendimento, categorias } = settings;

const formatPrice = (preco: number) => `R$ ${preco.toFixed(2).replace('.', ',')}`;
const whatsappUrl = `https://wa.me/${atendimento.whatsapp}?text=${encodeURIComponent(atendimento.mensagem_padrao)}`;

const grupos = categorias
  .map((categoria) => ({
    ...categoria,
    itens: allItems
      .filter((item) => item.data.categoria.toLowerCase() === categoria.id.toLowerCase())
      .sort((a, b) => (a.data.ordem ?? 0) - (b.data.ordem ?? 0)),
  }))
  .filter((grupo) => grupo.itens.length > 0);
---

<Base title={`${negocio.nome} — Menu da Casa`} description={negocio.slogan}>
  <main class="menu-page animate-fade-in" aria-labelledby="menu-title">
    <header class="menu-hero">
      <span class="menu-eyebrow">{atendimento.status_badge} · {atendimento.horario}</span>
      <p class="menu-kicker">{negocio.nome}</p>
      <h1 id="menu-title">Menu da Casa</h1>
      <p class="menu-subtitle">{negocio.ramo} · {negocio.slogan}</p>
      <a class="menu-whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        Chamar no WhatsApp
      </a>
    </header>

    <div class="menu-panel">
      {grupos.map((grupo, index) => (
        <section class="menu-section" aria-labelledby={`menu-section-${grupo.id}`}>
          <div class="section-heading">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h2 id={`menu-section-${grupo.id}`}>{grupo.nome}</h2>
          </div>

          <div class="menu-items">
            {grupo.itens.map((item) => {
              const indisponivel = item.data.disponivel === false;
              const destaque = item.data.destaque || item.data.maisPedido;

              return (
                <article class:list={["menu-item", { "menu-item--soldout": indisponivel }]}>
                  <div class="item-main">
                    <div>
                      <h3>{item.data.nome}</h3>
                      {destaque && <span class="item-badge">Mais pedido</span>}
                    </div>
                    <strong>{formatPrice(item.data.preco)}</strong>
                  </div>
                  {item.data.descricao && <p>{item.data.descricao}</p>}
                  {indisponivel && <span class="soldout-label">Esgotado</span>}
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>

    <footer class="menu-footer">
      <p>{atendimento.endereco}</p>
      <p>{atendimento.horario}</p>
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Falar com a casa</a>
    </footer>
  </main>
</Base>
```

- [ ] **Step 2: Adicionar CSS local no mesmo arquivo**

Append this CSS to `src/pages/menu.astro`:

```astro
<style>
  .menu-page {
    padding: 2rem 0 1rem;
  }

  .menu-hero {
    text-align: center;
    padding: 1.5rem 0 2rem;
  }

  .menu-eyebrow,
  .item-badge,
  .soldout-label {
    display: inline-flex;
    width: fit-content;
    border: 1px solid rgba(238, 152, 0, 0.34);
    border-radius: var(--radius-full);
    color: var(--color-secondary);
    background: rgba(238, 152, 0, 0.08);
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0.35rem 0.7rem;
  }

  .menu-kicker {
    margin-top: 1.35rem;
    color: var(--color-secondary);
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 0.83rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }

  .menu-hero h1 {
    margin-top: 0.6rem;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(2.8rem, 15vw, 5rem);
    font-weight: 500;
    line-height: 0.95;
    letter-spacing: -0.06em;
  }

  .menu-subtitle {
    max-width: 28rem;
    margin: 1rem auto 0;
    color: var(--color-text-muted);
    font-size: 0.95rem;
  }

  .menu-whatsapp,
  .menu-footer a {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-height: 44px;
    margin-top: 1.35rem;
    border: 1px solid rgba(238, 224, 216, 0.18);
    border-radius: var(--radius-full);
    padding: 0 1.05rem;
    color: var(--color-text);
    background: rgba(255, 255, 255, 0.04);
    font-size: 0.86rem;
    font-weight: 800;
  }

  .menu-panel {
    border: 1px solid rgba(238, 224, 216, 0.12);
    border-radius: 1.75rem;
    padding: 1.1rem;
    background:
      radial-gradient(circle at top, rgba(246, 96, 24, 0.12), transparent 34rem),
      rgba(255, 255, 255, 0.025);
    box-shadow: var(--shadow-lg);
  }

  .menu-section + .menu-section {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(238, 224, 216, 0.12);
  }

  .section-heading {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .section-heading span {
    color: var(--color-secondary);
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 1.5rem;
  }

  .section-heading h2 {
    color: var(--color-text);
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 1.55rem;
    font-weight: 500;
  }

  .section-heading::after {
    content: '';
    height: 1px;
    flex: 1;
    background: rgba(238, 224, 216, 0.14);
  }

  .menu-items {
    display: grid;
    gap: 1rem;
  }

  .menu-item {
    padding-bottom: 1rem;
    border-bottom: 1px dashed rgba(238, 224, 216, 0.14);
  }

  .menu-item:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }

  .menu-item--soldout {
    opacity: 0.54;
  }

  .item-main {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  .item-main h3 {
    color: var(--color-text);
    font-size: 1rem;
    line-height: 1.25;
  }

  .item-main strong {
    color: var(--color-secondary);
    white-space: nowrap;
  }

  .menu-item p {
    margin-top: 0.35rem;
    color: var(--color-text-muted);
    font-size: 0.86rem;
    line-height: 1.55;
  }

  .item-badge,
  .soldout-label {
    margin-top: 0.45rem;
    font-size: 0.58rem;
    padding: 0.24rem 0.5rem;
  }

  .soldout-label {
    color: var(--color-text-muted);
    border-color: rgba(238, 224, 216, 0.18);
    background: rgba(255, 255, 255, 0.04);
  }

  .menu-footer {
    padding: 1.75rem 0 0;
    text-align: center;
    color: var(--color-text-muted);
    font-size: 0.85rem;
  }

  .menu-footer p + p {
    margin-top: 0.25rem;
  }

  @media (min-width: 600px) {
    .menu-page {
      padding-top: 3rem;
    }

    .menu-panel {
      padding: 1.75rem;
    }
  }
</style>
```

- [ ] **Step 3: Executar build**

Run:

```bash
npm run build
```

Expected: command exits successfully and includes Astro build output for static pages.

- [ ] **Step 4: Verificar rota localmente se o build passar**

Run:

```bash
npm run dev
```

Open `/menu` in the browser and check:

- Header shows business name, “Menu da Casa”, status/hours, WhatsApp CTA.
- Menu items are grouped under category headings.
- Prices are aligned to the right.
- No item image is rendered.
- No per-item “Pedir” button is rendered.
- Sold out item, if present in content, shows “Esgotado”.

- [ ] **Step 5: Commit**

Only commit if the user explicitly asks for a commit.

Suggested commit message:

```bash
git add src/pages/menu.astro docs/superpowers/specs/2026-09-11-menu-editorial-premium-design.md docs/superpowers/plans/2026-09-11-menu-editorial-premium.md
git commit -m "feat: add editorial menu route"
```

---

## Self-Review

- Spec coverage: covered route creation, existing data reuse, dark premium layout, no home changes, no per-item ordering CTA, no item photos, grouped categories, sold-out label, and build verification.
- Placeholder scan: no TBD/TODO/fill-in placeholders.
- Type consistency: `settings` paths and item fields match current `settings.json` and `src/content.config.ts`; `ordem` is optional in usage even though not declared in current schema, matching existing home behavior.
