# 🚀 Banco de Ideias & Futuras Melhorias — Cardápio Digital

Documento gerado a partir de sessão de Brainstorming (`/brainstorm`) em 13 de Setembro de 2026.  
Este arquivo preserva sugestões estratégicas e técnicas categorizadas para implementação em sprints futuras.

---

## 📋 Resumo das Frentes de Melhoria

| Frente | Descrição | Impacto | Esforço | Status |
| :--- | :--- | :---: | :---: | :---: |
| **1. Sacola de Pedidos ("Cart-to-WhatsApp")** | Montagem de pedidos múltiplos e envio estruturado no WhatsApp | Alto | Médio | 🟡 *Em Planejamento Atual* |
| **2. Status Aberto/Fechado em Tempo Real** | Badge visual dinâmico com base nos horários do `settings.json` | Alto | Baixo | 🟡 *Em Planejamento Atual* |
| **3. Admin Nativo Mobile-First + Firebase** | Painel /admin próprio sem Decap, com Firestore, Storage 5GB e Auth | Muito Alto | Médio | 🟡 *Fase 5 Aprovada* |
| **4. Busca Instantânea & Filtros Dietéticos** | Filtros rápidos (Vegano, Sem Glúten, Destaques) e busca por termo | Médio | Baixo | ⚪ *Backlog* |
| **5. Modo Salão (QR Code por Mesa & Comanda)** | Parâmetro de mesa (`?mesa=X`) e mensagem identificando o salão | Médio | Médio | ⚪ *Backlog* |
| **6. Suporte Offline & PWA (Salão)** | Service Worker + Manifest para carregamento instantâneo no 3G | Médio | Médio | ⚪ *Backlog* |
| **7. Presets de Temas & White-label no Admin** | Seletor de temas (Burger, Sushi, Confeitaria) no Admin Nativo | Alto | Médio | ⚪ *Backlog* |
| **8. Analytics & Rastreamento de Conversão** | Eventos GA4/Meta Pixel/GTM parametrizados no Firestore | Médio | Baixo | ⚪ *Backlog* |
| **9. Modal / Lightbox de Fotos em Alta Resolução** | Zoom e galeria detalhada de ingredientes ao tocar no card | Baixo | Baixo | ⚪ *Backlog* |

---

## 🔍 Detalhamento das Ideias do Backlog

### 1. Busca Instantânea & Filtros Dietéticos
- **Conceito:** Barra de busca client-side no topo do cardápio com debounce e filtro em tempo real, combinada com chips de filtro rápido (ex.: *🌱 Vegano*, *🌾 Sem Glúten*, *🔥 Promoção*, *⭐ Mais Pedidos*).
- **Vantagem:** Facilita a localização rápida para cardápios com mais de 30 itens.
- **Implementação Sugerida:** Script leve client-side com busca fuzzy ou filtragem direta no DOM pelas classes dos cards.

---

### 2. Modo Salão com QR Code por Mesa & Comanda
- **Conceito:** Leitura de QR Code específico por mesa no restaurante (ex: `cardapio.com/?mesa=04`).
- **Comportamento:**
  - O sistema armazena a mesa no `sessionStorage`.
  - Ao finalizar o pedido via WhatsApp, inclui automaticamente: `*Mesa: 04 (Consumo no Salão)*`.
  - Opcional: Gerador de QR Codes para impressão disponibilizado no painel `/admin/`.
- **Vantagem:** O estabelecimento pode usar o mesmo cardápio tanto para delivery quanto para atendimento no salão, reduzindo a sobrecarga dos garçons.

---

### 3. PWA (Progressive Web App) & Cache Offline
- **Conceito:** Transformar o cardápio em um Progressive Web App instalável na tela inicial do celular com service worker de cache stale-while-revalidate para assets estáticos.
- **Vantagem:** Dentro de salões de restaurantes onde o sinal de 3G/4G/Wi-Fi costuma oscilar, o cardápio abre instantaneamente sem falhas.

---

### 4. Engine Multi-Tenant / Presets de Temas
- **Conceito:** Permitir que o proprietário ou revendedor escolha entre presets prontos de cores e tipografia no painel do Decap CMS:
  - *Artisanal Ember* (laranja fogo, carvão, madeira) - atual
  - *Dark Burger* (preto fosco, amarelo neon, tipografia bold)
  - *Sushi Zen* (branco, preto e vermelho cereja, estética minimalista)
  - *Sweet Pastry* (tons pastéis rosa/bege, elegância editorial)
- **Vantagem:** Acelera o provisionamento de novos estabelecimentos para menos de 5 minutos.

---

### 5. Rastreamento de Conversão & Analytics (GTM / GA4 / Pixel)
- **Conceito:** Inclusão opcional de IDs de rastreamento no `settings.json` (`gtmId`, `ga4MeasurementId`, `metaPixelId`).
- **Disparo de Eventos:**
  - `view_item` (ao visualizar ou abrir detalhes de um prato)
  - `add_to_cart` (ao adicionar item na sacola)
  - `initiate_checkout` (ao abrir a gaveta da sacola)
  - `conversion_whatsapp` (ao clicar no botão final de envio para o WhatsApp)
- **Vantagem:** Permite aos estabelecimentos avaliarem o retorno de anúncios pagos no Instagram/Facebook que direcionam para o cardápio.

---

### 6. Modal / Lightbox de Detalhes do Prato
- **Conceito:** Ao tocar na imagem ou no card, abre-se uma folha inferior (*bottom sheet*) ou modal com foto ampliada, descrição estendida, lista completa de ingredientes e advertências sobre alérgenos.
- **Vantagem:** Não polui o feed principal e atende clientes curiosos ou com intolerâncias alimentares.
