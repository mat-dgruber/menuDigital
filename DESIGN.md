---
version: 1.0.0
name: Artisanal Ember
description: Design System do Cardápio Digital inspirado em fornos artesanais, brasa e calor, focado em alta conversão mobile e leitura rápida.
colors:
  primary: "#f66018"
  secondary: "#ee9800"
  bg: "#19120e"
  surface: "#261e1a"
  surface-card: "#211a16"
  text: "#eee0d8"
  text-muted: "#e2bfb2"
  whatsapp: "#00a74c"
  whatsapp-hover: "#008f40"
  status-open: "#34d399"
  status-closed: "#9ca3af"
  status-warning: "#fbbf24"
  border: "rgba(255, 255, 255, 0.08)"
  border-active: "rgba(246, 96, 24, 0.4)"
typography:
  font-family: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
  headline-xl: "1.35rem, weight 800"
  headline-lg: "1.15rem, weight 800"
  title: "0.98rem, weight 700"
  body: "0.85rem, weight 400"
  body-sm: "0.80rem, weight 400"
  badge: "0.75rem, weight 700"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "0.85rem"
  lg: "1.25rem"
  xl: "2rem"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  full: "9999px"
components:
  cart-drawer:
    bg: "rgba(25, 18, 14, 0.98)"
    backdrop: "rgba(0, 0, 0, 0.75)"
    border: "rgba(255, 255, 255, 0.1)"
    elevation: "0 -8px 32px rgba(0, 0, 0, 0.6)"
  sticky-bar:
    bg: "rgba(25, 18, 14, 0.94)"
    border: "rgba(255, 255, 255, 0.1)"
    elevation: "0 -4px 20px rgba(0, 0, 0, 0.5)"
---

# Cardápio Digital — Artisanal Ember

## Overview

Design System mobile-first desenvolvido para cardápios digitais Jamstack de alta conversão. A estética "Artisanal Ember" utiliza uma paleta escura e acolhedora com tons terrosos, madeira tostada e acentos em laranja brasa (`#f66018`), dourado mel e verde de conversão WhatsApp (`#00a74c`), proporcionando alta legibilidade sob qualquer iluminação.

## Colors

- **Primary (`#f66018`):** Ação primária, botões de adição, preços e destaques de interação.
- **Secondary (`#ee9800`):** Selos especiais, notas de avaliação (estrelas) e combos promocionais.
- **Background (`#19120e`):** Fundo imersivo escuro que reduz cansaço visual e valoriza as fotos dos pratos.
- **Surface (`#261e1a`):** Superfície para containers, barra de navegação e gaveta da sacola.
- **Surface Card (`#211a16`):** Superfície com contraste sutil para cards individuais de produtos.
- **Text (`#eee0d8`):** Branco aquecido de alto contraste para nomes e títulos.
- **Text Muted (`#e2bfb2`):** Rosa-terroso atenuado para descrições, ingredientes e metadados.
- **WhatsApp (`#00a74c`):** Verde oficial para botões de despacho e finalização de pedido.
- **Status Open / Closed (`#34d399` / `#9ca3af`):** Cores semânticas para indicação de horário de funcionamento.

## Typography

Tipografia única e moderna com **Plus Jakarta Sans**, combinando pesos 400/500 para leitura confortável de ingredientes e 700/800 para títulos e numerais monetários de impacto visual.

## Layout

- Layout centralizado mobile-first com largura máxima de contêiner de `640px`.
- Área segura inferior com padding de compensação (`6.5rem`) para a barra fixa de conversão.
- Sistema de gaveta de sacola (*Bottom Sheet* no mobile e modal centralizado em desktop).

## Elevation & Depth

- **Surface Cards:** Borda translúcida de 1px (`rgba(255, 255, 255, 0.07)`) com sombra difusa ao hover.
- **Cart Drawer & Modais:** Backdrop blur de 16px com elevação profunda `0 -8px 32px rgba(0, 0, 0, 0.6)`.
- **Botões Flutuantes:** Glow suave projetado com a cor primária e do WhatsApp.

## Shapes

- Raios de borda proporcionais: `8px` para tags e chips compactos, `12px` para cards de produtos e `16px` para hero e modais, com `9999px` (pílula) para botões de ação e status.

## Components

- **MenuCard:** Card horizontal compacto com miniatura `96x96`, detalhes expansíveis e controle intuitivo de quantidade (`+`, `-`, lixeira).
- **CartDrawer:** Gaveta deslizante com lista de itens scrollável independente, formulário condicional de entrega (Delivery com endereço obrigatório vs Retirada no balcão), seletor de pagamento e fechamento via WhatsApp.
- **StickyWhatsAppBar:** Barra persistente que adapta seu estado dinamicamente entre "contato inicial" e "resumo de pedido/checkout".
- **StatusIndicator:** Badge pulsante com cálculo em tempo real de abertura/fechamento.

## Do's and Don'ts

- **DO:** Manter alto contraste de texto sobre as superfícies escuras (WCAG 2.2 AA).
- **DO:** Garantir áreas de toque mínimas de `44x44px` para todos os botões no mobile.
- **DO:** Truncar observações longas de forma elegante antes de enviar ao WhatsApp para evitar estourar o limite de URL.
- **DON'T:** Usar cores roxas/violetas genéricas (proibido pela identidade de marca).
- **DON'T:** Abrir popups intrusivos sem ação explícita do usuário.
