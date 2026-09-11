# Esqueleto do Projeto — Cardápio Digital (Astro + Decap CMS)

Template funcional de cardápio digital estático, mobile-first e customizável, desenvolvido com Astro e integrado com Decap CMS para gerenciamento de conteúdo sem servidor.

---

## 1. Setup Inicial

```bash
npm create astro@latest esfiharia -- --template minimal --typescript strict
cd esfiharia
npm install
npm install @astrojs/sitemap
npm run dev
```

---

## 2. Estrutura de Diretórios

```text
esfiharia/
├── astro.config.mjs
├── src/
│   ├── content/
│   │   ├── config.ts
│   │   └── menu/
│   │       ├── carne.md
│   │       ├── queijo.md
│   │       └── chocolate.md
│   ├── data/
│   │   └── settings.json
│   ├── styles/
│   │   └── global.css
│   ├── layouts/
│   │   └── Base.astro
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Hero.astro
│   │   ├── MenuCard.astro
│   │   ├── MenuSection.astro
│   │   ├── WhatsAppButton.astro
│   │   └── Footer.astro
│   └── pages/
│       └── index.astro
└── public/
    ├── admin/
    │   ├── index.html
    │   └── config.yml
    └── uploads/             # Imagens enviadas via Decap CMS
```

---

## 3. Dados e Schemas

### 3.1. Schema das Coleções (`src/content/config.ts`)

```ts
import { defineCollection, z } from 'astro:content';

const menu = defineCollection({
  type: 'content',
  schema: z.object({
    nome: z.string(),
    descricao: z.string().optional(),
    preco: z.number(),
    categoria: z.string(),
    foto: z.string().optional(),
    destaque: z.boolean().default(false),
    disponivel: z.boolean().default(true),
    ordem: z.number().default(0),
  }),
});

export const collections = { menu };
```

### 3.2. Configurações Globais e Tema (`src/data/settings.json`)

> [!TIP]
> Altere este arquivo para personalizar os dados e identidade de cada cliente.

```json
{
  "nome_local": "Esfiharia Cedro",
  "slogan": "Esfihas abertas e fechadas, feitas na hora",
  "logo": "/uploads/logo.svg",
  "imagem_og": "/uploads/og.jpg",
  "cor_primaria": "#c0392b",
  "cor_secundaria": "#f39c12",
  "whatsapp": "5511999999999",
  "mensagem_padrao": "Olá! Gostaria de fazer um pedido 🙂",
  "endereco": "Rua das Palmeiras, 123 — São Paulo, SP",
  "horarios": ["Ter a Dom: 18h às 23h", "Segunda: fechado"],
  "instagram": "https://instagram.com/exemplo",
  "facebook": "",
  "categorias": ["Esfihas Salgadas", "Esfihas Doces", "Bebidas", "Combos"]
}
```

### 3.3. Exemplos de Itens do Cardápio

#### `src/content/menu/carne.md`

```md
---
nome: Esfiha de Carne
descricao: Carne bovina temperada com limão e cebola
preco: 6.5
categoria: Esfihas Salgadas
foto: /uploads/carne.jpg
destaque: true
disponivel: true
ordem: 1
---
```

#### `src/content/menu/queijo.md`

```md
---
nome: Esfiha de Queijo
descricao: Mussarela derretida na massa fresca
preco: 7
categoria: Esfihas Salgadas
disponivel: true
ordem: 2
---
```

#### `src/content/menu/chocolate.md`

```md
---
nome: Esfiha de Chocolate
descricao: Chocolate ao leite com toque de canela
preco: 8
categoria: Esfihas Doces
destaque: true
disponivel: true
ordem: 1
---
```

---

## 4. Configuração e Estilos

### 4.1. Configuração do Astro (`astro.config.mjs`)

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://seu-dominio.com.br',
  integrations: [sitemap()],
});
```

### 4.2. Layout Base com SEO e Tema (`src/layouts/Base.astro`)

```astro
---
import '../styles/global.css';
import settings from '../data/settings.json';

const {
  title = settings.nome_local,
  description = settings.slogan,
  image = settings.imagem_og,
} = Astro.props;
---
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    {image && <meta property="og:image" content={image} />}
    <meta property="og:type" content="website" />
    <link rel="icon" href="/favicon.svg" />
    <!-- Tema injetado a partir do settings.json -->
    <style set:html={`:root{--color-primary:${settings.cor_primaria};--color-secondary:${settings.cor_secundaria}}`}></style>
    <!-- Script do Netlify Identity Widget para autenticação no Decap CMS -->
    <script is:inline src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
  </head>
  <body>
    <slot />
    <script is:inline>
      if (window.netlifyIdentity) {
        window.netlifyIdentity.on('init', (user) => {
          if (!user) {
            window.netlifyIdentity.on('login', () => { document.location.href = '/admin/'; });
          }
        });
      }
    </script>
  </body>
</html>
```

### 4.3. Folha de Estilos Global (`src/styles/global.css`)

```css
:root {
  --color-primary: #c0392b;
  --color-secondary: #f39c12;
  --ink: #1e1b18;
  --muted: #6b6560;
  --paper: #fffaf5;
  --line: #ece5dd;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  color: var(--ink);
  background: var(--paper);
  line-height: 1.5;
}

img {
  max-width: 100%;
  display: block;
}

h1, h2, h3 {
  line-height: 1.2;
}

.container {
  width: min(920px, 92vw);
  margin: 0 auto;
}

section {
  scroll-margin-top: 64px;
}
```

---

## 5. Componentes

### 5.1. Botão do WhatsApp (`src/components/WhatsAppButton.astro`)

```astro
---
import settings from '../data/settings.json';

const { label = 'Pedir no WhatsApp', float = false } = Astro.props;
const href = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(settings.mensagem_padrao)}`;
---
<a class:list={["wa", { "wa--float": float }]} href={href} target="_blank" rel="noopener" aria-label={label}>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.9c0 2.1.55 4.06 1.6 5.83L2 22l4.4-1.15a9.86 9.86 0 0 0 5.64 1.72c5.46 0 9.9-4.45 9.9-9.9 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.02c-1.66 0-3.28-.45-4.7-1.29l-.34-.2-2.6.68.7-2.54-.22-.35a8.2 8.2 0 0 1-1.26-4.42c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.24 8.23Z"/>
  </svg>
  <span>{label}</span>
</a>

<style>
  .wa {
    display: inline-flex;
    align-items: center;
    gap: .5rem;
    background: #25D366;
    color: #fff;
    padding: .75rem 1.25rem;
    border-radius: 999px;
    text-decoration: none;
    font-weight: 500;
  }
  .wa--float {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    box-shadow: 0 4px 12px rgba(0,0,0,.25);
    z-index: 50;
  }
</style>
```

### 5.2. Barra de Navegação (`src/components/Nav.astro`)

```astro
---
import settings from '../data/settings.json';
---
<nav class="nav">
  <a class="nav__brand" href="#inicio">{settings.nome_local}</a>
  <div class="nav__links">
    <a href="#cardapio">Cardápio</a>
    <a href="#contato">Contato</a>
  </div>
</nav>

<style>
  .nav {
    position: sticky;
    top: 0;
    z-index: 40;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .75rem 1rem;
    background: var(--paper);
    border-bottom: 1px solid var(--line);
  }
  .nav__brand {
    font-weight: 600;
    text-decoration: none;
    color: var(--color-primary);
  }
  .nav__links a {
    margin-left: 1rem;
    text-decoration: none;
    color: var(--ink);
  }
</style>
```

### 5.3. Hero Header (`src/components/Hero.astro`)

```astro
---
import settings from '../data/settings.json';
import WhatsAppButton from './WhatsAppButton.astro';
---
<header class="hero" id="inicio">
  {settings.logo && <img class="hero__logo" src={settings.logo} alt={settings.nome_local} />}
  <h1 class="hero__title">{settings.nome_local}</h1>
  {settings.slogan && <p class="hero__slogan">{settings.slogan}</p>}
  <WhatsAppButton label="Fazer pedido no WhatsApp" />
</header>

<style>
  .hero {
    text-align: center;
    padding: 4rem 1.5rem 3rem;
    background: var(--color-primary);
    color: #fff;
  }
  .hero__logo {
    width: 96px;
    height: 96px;
    object-fit: contain;
    margin: 0 auto 1rem;
  }
  .hero__title {
    font-size: clamp(2rem, 6vw, 3rem);
    margin: 0 0 .5rem;
  }
  .hero__slogan {
    max-width: 34ch;
    margin: 0 auto 1.5rem;
    opacity: .92;
  }
</style>
```

### 5.4. Card do Item (`src/components/MenuCard.astro`)

```astro
---
const { item } = Astro.props;
const { nome, descricao, preco, foto, destaque, disponivel } = item.data;
const precoFmt = `R$ ${Number(preco).toFixed(2).replace('.', ',')}`;
---
<article class:list={["card", { "card--off": disponivel === false }]}>
  {foto && <img class="card__img" src={foto} alt={nome} loading="lazy" />}
  <div class="card__info">
    <div class="card__top">
      <h3 class="card__name">{nome} {destaque && <span class="card__tag" title="Destaque">⭐</span>}</h3>
      <span class="card__price">{precoFmt}</span>
    </div>
    {descricao && <p class="card__desc">{descricao}</p>}
    {disponivel === false && <span class="card__soldout">Esgotado</span>}
  </div>
</article>

<style>
  .card {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid var(--line);
    border-radius: 12px;
    background: #fff;
  }
  .card--off {
    opacity: .5;
  }
  .card__img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    flex: none;
  }
  .card__info {
    flex: 1;
  }
  .card__top {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: baseline;
  }
  .card__name {
    margin: 0;
    font-size: 1.05rem;
  }
  .card__price {
    color: var(--color-primary);
    font-weight: 600;
    white-space: nowrap;
  }
  .card__desc {
    margin: .35rem 0 0;
    color: var(--muted);
    font-size: .92rem;
  }
  .card__soldout {
    display: inline-block;
    margin-top: .4rem;
    font-size: .78rem;
    text-transform: uppercase;
    letter-spacing: .04em;
    color: var(--muted);
  }
</style>
```

### 5.5. Seção de Categoria (`src/components/MenuSection.astro`)

```astro
---
import MenuCard from './MenuCard.astro';

const { categoria, itens } = Astro.props;
---
<section class="menu-section">
  <h2 class="menu-section__title">{categoria}</h2>
  <div class="menu-section__grid">
    {itens.map((item) => <MenuCard item={item} />)}
  </div>
</section>

<style>
  .menu-section {
    margin: 2.5rem 0;
  }
  .menu-section__title {
    border-bottom: 2px solid var(--color-secondary);
    display: inline-block;
    padding-bottom: .25rem;
  }
  .menu-section__grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr;
    margin-top: 1rem;
  }
  @media (min-width: 640px) {
    .menu-section__grid {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>
```

### 5.6. Rodapé (`src/components/Footer.astro`)

```astro
---
import settings from '../data/settings.json';
---
<footer class="footer" id="contato">
  <div class="container">
    {settings.endereco && <p><strong>Endereço:</strong> {settings.endereco}</p>}
    {settings.horarios?.length > 0 && (
      <p><strong>Horário:</strong> {settings.horarios.join(' · ')}</p>
    )}
    <p class="footer__social">
      {settings.instagram && <a href={settings.instagram} target="_blank" rel="noopener">Instagram</a>}
      {settings.facebook && <a href={settings.facebook} target="_blank" rel="noopener">Facebook</a>}
    </p>
    <p class="footer__credit">© {new Date().getFullYear()} {settings.nome_local}</p>
  </div>
</footer>

<style>
  .footer {
    border-top: 1px solid var(--line);
    padding: 2rem 1rem 4rem;
    margin-top: 3rem;
    color: var(--muted);
  }
  .footer a {
    color: var(--color-primary);
    margin-right: 1rem;
  }
  .footer__credit {
    font-size: .85rem;
    margin-top: 1rem;
  }
</style>
```

---

## 6. Página Principal

### 6.1. Index (`src/pages/index.astro`)

```astro
---
import { getCollection } from 'astro:content';
import settings from '../data/settings.json';
import Base from '../layouts/Base.astro';
import Nav from '../components/Nav.astro';
import Hero from '../components/Hero.astro';
import MenuSection from '../components/MenuSection.astro';
import Footer from '../components/Footer.astro';
import WhatsAppButton from '../components/WhatsAppButton.astro';

const itens = await getCollection('menu');
const grupos = settings.categorias
  .map((cat) => ({
    categoria: cat,
    itens: itens
      .filter((i) => i.data.categoria === cat)
      .sort((a, b) => (a.data.ordem ?? 0) - (b.data.ordem ?? 0)),
  }))
  .filter((g) => g.itens.length > 0);
---
<Base>
  <Nav />
  <Hero />
  <main class="container" id="cardapio">
    {grupos.map((g) => <MenuSection categoria={g.categoria} itens={g.itens} />)}
  </main>
  <Footer />
  <WhatsAppButton float={true} label="Pedir" />
</Base>
```

---

## 7. Decap CMS

### 7.1. Ponto de Entrada do Admin (`public/admin/index.html`)

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Painel — Cardápio</title>
  </head>
  <body>
    <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
  </body>
</html>
```

### 7.2. Configuração do CMS (`public/admin/config.yml`)

```yaml
backend:
  name: git-gateway
  branch: main

media_folder: "public/uploads"
public_folder: "/uploads"

collections:
  - name: "cardapio"
    label: "Cardápio"
    label_singular: "Item"
    folder: "src/content/menu"
    create: true
    slug: "{{slug}}"
    extension: "md"
    format: "frontmatter"
    fields:
      - { name: "nome", label: "Nome", widget: "string" }
      - { name: "descricao", label: "Descrição", widget: "text", required: false }
      - { name: "preco", label: "Preço (R$)", widget: "number", value_type: "float", step: 0.5 }
      - { name: "categoria", label: "Categoria", widget: "select", options: ["Esfihas Salgadas", "Esfihas Doces", "Bebidas", "Combos"] }
      - { name: "foto", label: "Foto", widget: "image", required: false }
      - { name: "destaque", label: "Destaque", widget: "boolean", default: false }
      - { name: "disponivel", label: "Disponível", widget: "boolean", default: true }
      - { name: "ordem", label: "Ordem", widget: "number", default: 0, value_type: "int" }
      - { name: "body", label: "Detalhes (opcional)", widget: "markdown", required: false }

  - name: "config"
    label: "Configurações"
    files:
      - name: "settings"
        label: "Dados do local"
        file: "src/data/settings.json"
        fields:
          - { name: "nome_local", label: "Nome do local", widget: "string" }
          - { name: "slogan", label: "Slogan", widget: "string", required: false }
          - { name: "logo", label: "Logo", widget: "image", required: false }
          - { name: "imagem_og", label: "Imagem de compartilhamento", widget: "image", required: false }
          - { name: "cor_primaria", label: "Cor primária", widget: "color" }
          - { name: "cor_secundaria", label: "Cor secundária", widget: "color" }
          - { name: "whatsapp", label: "WhatsApp (com DDI, só números)", widget: "string", hint: "Ex: 5511999999999" }
          - { name: "mensagem_padrao", label: "Mensagem padrão", widget: "string" }
          - { name: "endereco", label: "Endereço", widget: "string", required: false }
          - { name: "horarios", label: "Horários", widget: "list", field: { name: "linha", widget: "string" } }
          - { name: "instagram", label: "Instagram (URL)", widget: "string", required: false }
          - { name: "facebook", label: "Facebook (URL)", widget: "string", required: false }
          - { name: "categorias", label: "Categorias (na ordem)", widget: "list", field: { name: "nome", widget: "string" } }
```

---

## 8. Execução e Notas Técnicas

Após criar os arquivos, execute o ambiente de desenvolvimento local:

```bash
npm run dev
```

O mock estará disponível em `http://localhost:4321` com os itens de demonstração, tema dinâmico e integração do botão de WhatsApp ativa.

### Considerações Importantes

1. **Autenticação do Decap CMS**:
   - Em produção na Netlify, a autenticação utiliza `git-gateway` em conjunto com o **Netlify Identity** (**Site configuration** → **Identity**).
   - Em ambiente local (`localhost`), para testar o painel sem conexão com a Netlify, configure temporariamente em `public/admin/config.yml`:
     ```yaml
     backend:
       name: proxy
       proxy_url: http://localhost:8081/api/v1
       branch: main
     local_backend: true
     ```
     E execute em outro terminal:
     ```bash
     npx decap-server
     ```

2. **Gerenciamento de Imagens**:
   - Imagens carregadas via Decap CMS são armazenadas em `public/uploads/` e servidas diretamente sem processamento prévio do `astro:assets`.
   - Instrua o cliente a carregar imagens previamente comprimidas com largura máxima recomendada de ~1200px.

3. **Sincronização de Categorias**:
   - A lista do seletor `options` do campo `categoria` em `public/admin/config.yml` e o array `categorias` em `src/data/settings.json` devem manter correspondência exata. Ao cadastrar novas categorias, atualize ambos os arquivos.
