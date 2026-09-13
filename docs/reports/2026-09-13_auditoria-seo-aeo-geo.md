# Relatório Técnico de Auditoria SEO, AEO & GEO

- **Data:** 2026-09-13
- **Projeto:** Cardápio Digital (Kaleb's Esfiharia)
- **Status Consolidado:** 🟢 **Otimizado** (100% em conformidade com Google Search Essentials & llmstxt.org)
- **Motores Cobertos:** Google Search, Bing, Perplexity, Google Gemini, Claude Search, ChatGPT Search

---

## 1. Módulos Auditados e Implementados

### Módulo 1: Descoberta por IA (GEO)
- Criado `public/llms.txt` seguindo formalmente a especificação aberta `llmstxt.org`.
- Criado `public/llms-full.txt` detalhando todos os pratos, categorias, ingredientes, preços vigentes e modalidade de entrega.
- Injetada tag `<link rel="describedby" href="/llms.txt" />` no `<head>` de `Base.astro`.

### Módulo 2: Rastreamento & Crawl Budget
- Criado `public/robots.txt` com permissão explícita para agentes de busca generativa:
  - `GPTBot`, `ChatGPT-User`, `ClaudeBot`, `PerplexityBot`, `Bytespider`, `Google-Extended`.
- Bloqueado o diretório `/admin/` para proteger o painel Decap CMS contra indexação pública.

### Módulo 3: Canonicidade & Snippets
- Injetada tag canônica dinâmica `<link rel="canonical" href={Astro.url.href} />`.
- Configurada meta tag de controle de trecho: `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`.

### Módulo 4: Links Rastreáveis & Navegação
- Todos os links usam tags `<a href="...">` reais sem bloqueios de eventos JavaScript.
- Links externos utilizam `rel="noopener noreferrer"`.

### Módulo 5: Identidade e Google Discover
- Favicons configurados em SVG e ICO.
- Declaração de `og:site_name`, `og:title`, `og:description`, `og:image` e `og:url`.

### Módulo 6: Dados Estruturados Schema.org JSON-LD (AEO)
- Bloco `@graph` enriquecido contendo os tipos `Restaurant` e `WebSite`, vinculando dados locais, horários, culinária, telefone e avaliação do estabelecimento.

### Módulo 7: Core Web Vitals & Mobile-First
- Imagens do banner Hero configuradas com `loading="eager"` e `fetchpriority="high"`.
- Imagens de produtos com `loading="lazy"` e dimensões fixas de `width="96"` e `height="96"`.
- Pré-conexão de fontes com Google Fonts (`preconnect`).

### Módulo 8: Headers HTTP do Servidor
- Criado arquivo `public/_headers` (Netlify) configurando tipos MIME para `llms.txt`, `llms-full.txt` e `robots.txt` com `Access-Control-Allow-Origin: *`.
- Cabeçalhos de segurança ativados: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`.
