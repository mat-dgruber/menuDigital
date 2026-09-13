<!--
================================================================================
LOG DE MANUTENÇÃO DE DOCUMENTAÇÃO
--------------------------------------------------------------------------------
Data       | Autor          | Descrição
--------------------------------------------------------------------------------
2026-09-13 | Matheus Diniz  | Criação da ADR 0002 formalizando a substituição
           | (Antigravity)  | do Decap CMS por um Painel Administrativo Nativo
           |                | mobile-first integrado ao ecossistema Firebase.
================================================================================
-->

# ADR 0002: Substituição do Decap CMS por Painel Administrativo Nativo Integrado ao Firebase (Auth, Firestore, Storage, Hosting)

| Metadado | Detalhe |
| :--- | :--- |
| **Status** | **Aprovada** (2026-09-13) |
| **Decisores** | Matheus Diniz, Engenharia de Software |
| **Tags** | `[architecture]`, `[firebase]`, `[firestore]`, `[storage]`, `[auth]`, `[admin-nativo]`, `[astro]` |
| **Impacto Sistêmico** | Alto (Gestão de conteúdo, persistência, velocidade de atualização e experiência do operador) |
| **ADRs Relacionadas** | [ADR 0001](file:///Users/matheus.diniz_1/Documents/GitHub/menuDigital/docs/adr/0001-template-reutilizavel-design-tokens-astro-decap.md) |

---

## 1. Contexto & Problema

Na concepção inicial do projeto (ADR 0001), o **Decap CMS** com Git Gateway (Netlify Identity) foi selecionado para gerenciar os itens do cardápio através de commits automáticos no repositório GitHub.

Durante a homologação e análise prática de usabilidade para restaurantes e lanchonetes de pequeno e médio porte (ex: Kaleb's Esfiharia), foram identificadas limitações críticas da abordagem baseada em Git/Decap CMS:

1. **Latência Inaceitável para a Operação Gastronômica:** Cada alteração (ex: esgotamento de um prato ou correção de preço) exige um commit no Git e um novo build no Netlify (1 a 3 minutos). Na rotina de um restaurante, pausas de itens precisam ser instantâneas.
2. **Atrito no Fluxo de Fotos:** Salvar imagens binárias dentro do repositório Git infla o histórico do projeto e depende de rotas estáticas de upload no Decap.
3. **Experiência Mobile Inadequada do Decap CMS:** A interface do Decap é genérica, pesada para smartphones e não oferece controles rápidos (como alternar disponibilidade com 1 toque).
4. **Dependência de Serviços Externos:** O Decap depende de Netlify Identity ou de proxies locais em desenvolvimento (`npx decap-server`), gerando fricção no setup.

---

## 2. Análise Comparativa de Alternativas

| Critério | Decap CMS (Git-based) | Supabase (Postgres BaaS) | Firebase (Firestore + Storage) |
| :--- | :--- | :--- | :--- |
| **Tempo de Atualização** | 1 a 3 minutos (Deploy) | Instantâneo (Tempo real) | **Instantâneo (Tempo real)** |
| **Custo Fixo** | R$ 0,00 | R$ 0,00 | **R$ 0,00 (Plano Spark)** |
| **Armazenamento de Fotos** | No repositório Git | 1 GB no plano Free | **5 GB no plano Free (5x maior)** |
| **Risco de Inatividade** | Nenhum | **Pausa após 7 dias inativo** | **Nunca pausa (24/7 online)** |
| **Cache Offline Móvel** | Não nativo | Requer bibliotecas | **Nativo no SDK (`IndexedDB`)** |
| **Centralização** | Fragmentado | Requer hosting separado | **Hospedagem + Banco + Auth no Google** |

---

## 3. Decisão Arquitetural

Decidiu-se **substituir o Decap CMS por um Painel Administrativo Nativo (`/admin`)** construído diretamente no projeto e integrado ao ecossistema **Firebase**:

1. **Autenticação:** **Firebase Auth** nativo para login do dono por e-mail e senha.
2. **Persistência de Dados:** **Cloud Firestore** para sincronização em tempo real de produtos, categorias e dados do restaurante (`settings`).
3. **Armazenamento de Imagens:** **Firebase Cloud Storage**, permitindo upload direto de fotos da câmera/galeria com cota de 5 GB gratuitos.
4. **Cache & Resiliência:** Habilitação do cache offline (`IndexedDB`) no cliente, garantindo navegação fluida mesmo em redes móveis instáveis.
5. **Hospedagem:** Suporte a **Firebase Hosting** com CDN global e SSL automático, ou deploy estático mantido no Netlify.

---

## 4. Consequências & Benefícios

### Benefícios
- **Zero Latência para o Restaurante:** O dono toca em "Esgotado" e o prato fica esmaecido no cardápio de todos os clientes no mesmo instante.
- **UI Customizada Mobile-First:** O painel `/admin` segue o mesmo design system do restaurante, com botões amplos para uso em telas sensíveis ao toque.
- **Segurança Declarativa:** Regras estritas em `firestore.rules` e `storage.rules` protegem o banco sem necessidade de manter servidor próprio.
- **Custo R$ 0,00 Perpétuo:** O plano Spark do Firebase atende até 50.000 leituras diárias e 5 GB de arquivos sem solicitar cartão de crédito.

### Trade-offs
- Os itens não ficam mais puramente como arquivos Markdown locais no Git para produção (os arquivos `.md` existentes passam a atuar como base de seed inicial).
- Exige configuração inicial de um projeto Firebase no console do Google.
