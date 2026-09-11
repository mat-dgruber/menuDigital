---
description: "Universal Security & SAST Auditor: executa análise estática de segurança (SAST), varredura profunda de credenciais/segredos, conformidade OWASP Top 10 e privacidade (LGPD/GDPR/CCPA) para múltiplos ecossistemas com correções automáticas no código.\n"
---
# Universal Security & SAST Auditor (`security-audit`)

Esta skill transforma o agente em um **Especialista Sênior em Segurança de Aplicações (AppSec), SAST e Engenharia Defensiva Zero-Trust**.

Ela automatiza e aprofunda verificações de segurança técnica, boas práticas do **OWASP Top 10**, detecção preventiva de vazamento de credenciais e conformidade com legislações de privacidade de dados (**LGPD / GDPR / CCPA**) em múltiplos ecossistemas de desenvolvimento.

```mermaid
graph TD
    Trigger([🚀 Invocação /security-audit]) --> Phase1[Fase 1: Scanner de Credenciais & SAST Local]
    Phase1 --> Fallback{CLI disponível?}
    Fallback -->|Sim| AutoTools[Executa ferramentas nativas: semgrep, audit, gosec, etc.]
    Fallback -->|Não| StaticRegex[Heurísticas Estáticas via Ripgrep]
    AutoTools & StaticRegex --> Phase2[Fase 2: Auditoria Cognitiva Profunda OWASP Top 10]
    Phase2 --> Triage[Triagem de Riscos & Severidade: CRITICAL a LOW]
    Triage --> Fixes[Aplicação Direta de Correções no Código]
    Fixes --> Report[Fase 3: Emissão do Relatório Executivo no Chat]
```

---

## ⚡ Regras de Ouro de Execução

1. **Correção Direta no Código-Fonte:** Ao identificar uma vulnerabilidade com solução determinística (ex: falta de `rel="noopener noreferrer"`, SQL concatenado, ausência de flags seguras em cookies, `eval()` desnecessário), aplique o patch diretamente nos arquivos do workspace.
2. **Resumo Executivo Estruturado:** Apresente um relatório conciso no chat com scorecard semafórico, tabela detalhada de descobertas e plano de remediação prioritário.
3. **Zero LaTeX:** Nunca utilize sintaxe matemática LaTeX (`$...$`). Utilize texto e operadores simples (`>=`, `<=`, `%`).

---

## 🔄 Fluxo de Trabalho em 3 Fases

### Fase 1: Matriz de Detecção Automática de Testes & SAST no Workspace

Identifique a stack tecnológica do projeto e execute as ferramentas automatizadas disponíveis no ambiente:

| Ecossistema / Linguagem | Ferramentas de Teste, SAST & Vulnerabilidades |
| :--- | :--- |
| **Python** | `bandit -r .`, `semgrep --config=auto`, `safety check`, `pytest tests/security/` |
| **PHP** | `composer audit`, `vendor/bin/psalm --taint-analysis`, `vendor/bin/pest --group=security` |
| **Node.js / TypeScript** | `npm audit` (ou `pnpm audit` / `yarn audit`), `npx eslint` com `eslint-plugin-security` |
| **Go** | `govulncheck ./...`, `gosec ./...` |
| **Rust** | `cargo audit`, `cargo clippy -- -D clippy::all` |
| **Java / Kotlin** | `mvn dependency-check:check` ou `./gradlew check` |
| **C# / .NET** | `dotnet list package --vulnerable`, `dotnet format --verify-no-changes` |
| **Scanner de Credenciais** | `ggshield secret scan repo .` / `gitleaks detect` / `trufflehog filesystem .` |

> [!TIP]
> **Estratégia de Fallback com Heurísticas Estáticas:**
> Se uma ferramenta CLI especializada não estiver instalada no ambiente, o agente deve executar varreduras estáticas via `grep_search` buscando padrões de risco universais:
> - **Chaves e Tokens Hardcoded:** `AKIA[0-9A-Z]{16}`, `ghp_[0-9a-zA-Z]{36}`, `Bearer\s+[A-Za-z0-9\-_=]+\.[A-Za-z0-9\-_=]+`, chaves privadas `BEGIN PRIVATE KEY`.
> - **Execução Perigosa de Código:** `eval\(`, `exec\(`, `new Function\(`, `shell=True`.
> - **Injeção de Comandos / SQL:** `execute\(['"].*%`, `query\(['"].*\+`, `child_process.exec\(.*[+]`.

---

### Fase 2: Auditoria Cognitiva Profunda (OWASP Top 10 & Zero-Trust)

Analise as alterações recentes (`git diff`) e o código-fonte sob as diretrizes estruturais abaixo:

#### A01: Broken Access Control & IDOR
- **Resolução de Identidade Server-Side:** Mutações e consultas privadas no backend devem inferir a identidade do usuário a partir do token de sessão/JWT validado no servidor. Rejeite parâmetros arbitrários de ID passados pelo cliente (query params ou body) que permitam ID Scraping ou IDOR.
- **RBAC Estrito & Granular:** Rotas administrativas ou de escrita exigem verificação explícita de permissões, roles ou escopos (`requireRole('admin')`).
- **Validação de Posse de Dados (Data Ownership):** Em recursos compartilhados, valide sempre se o registro solicitado pertence ao usuário logado ou ao seu tenant/organização antes de qualquer leitura ou mutação.
- **Reverse Tabnabbing:** Links externos com `target="_blank"` no frontend devem obrigatoriamente conter `rel="noopener noreferrer"`.

#### A02: Cryptographic Failures & PII (Zero-Trust de Dados Pessoais)
- **Proteção de PII:** Dados pessoais sensíveis (documentos, telefones, dados bancários, dados de saúde) nunca devem ser gravados em texto claro em `localStorage`, `sessionStorage` ou expostos em logs de depuração.
- **Armazenamento e Criptografia:** No cliente, dados confidenciais transitórios devem utilizar criptografia simétrica robusta (WebCrypto AES-GCM). No servidor, senhas e credenciais devem utilizar algoritmos de hash com derivação lenta e sal (Argon2id, bcrypt, PBKDF2).
- **Prevenção de Timing Attacks:** Validações de assinaturas criptográficas, tokens, nonces e hashes devem usar comparação em tempo constante (`secrets.compare_digest()`, `hash_equals()`, `crypto.timingSafeEqual()`), nunca operadores de igualdade padrão (`==` / `!=`).

#### A03: Injection & Dynamic Code Execution
- **SQL Parametrizado:** Todas as consultas a banco de dados (ORM ou drivers raw) devem utilizar bind parameters / placeholders preparados. Concatenação de strings e interpolação em queries SQL são terminantemente proibidas.
- **Execução Segura de Subprocessos:** Subprocessos do sistema operacional não devem aceitar entradas de usuário sem sanitização estrita e devem evitar `shell=True` (Python) ou execução em shells não protegidos.
- **Proibição de Execução Dinâmica:** Proibir categoricamente o uso de `eval()`, `exec()`, `new Function()` e equivalentes em todas as linguagens.
- **Formula Injection:** Em exportações tabulares (Excel, CSV), caracteres disparadores de fórmulas (`=`, `+`, `-`, `@`) no início de células devem ser devidamente escapados com apóstrofo prefixado.

#### A05: Security Misconfiguration & Cache Governance
- **Cookies Seguros:** Cookies de sessão e tokens de autenticação devem ser emitidos com as flags `HttpOnly=True`, `Secure=True`, `SameSite="Lax"` (ou `"Strict"`) e caminhos restritos.
- **Blindagem de Documentação em Produção:** Swagger UI, OpenAPI e Scalar DX devem ser desativados ou protegidos por autenticação administrativa estrita em ambientes produtivos.
- **Governança de Cache & Redis:** Isolar privilégios de conexão por ACLs/prefixos de chave e bloquear comandos administrativos perigosos (`FLUSHALL`, `KEYS`, `CONFIG`).
- **Escopo Global Seguro:** Credenciais de autenticação, tokens ou sessões nunca devem ser expostos diretamente em variáveis globais do cliente (`window.*`).

#### A07: Identification and Authentication Failures
- **Proteção contra Brute-Force & Credential Stuffing:** Rotas críticas de autenticação (`/login`, `/reset-password`, `/verify-otp`) devem possuir rate limiting estrito por IP e por conta.
- **Ciclo de Vida do JWT:** Tokens de acesso com tempo de vida curto (ex: 15 minutos), tokens de refresh com rotação obrigatória (*refresh token rotation*) e revogação em banco de dados/cache distribuído.
- **Invalidação Completa de Sessão:** No logout, invalidar a sessão tanto no cliente quanto no servidor (armazenando identificadores de token em denylist / lista de revogação até expiração).

#### A08: Software and Data Integrity Failures
- **Integridade de Uploads e SVGs:** Validar Magic Bytes de arquivos enviados pelo usuário e sanitizar arquivos SVG contra tags `<script>` e event handlers maliciosos (`onload`, `onerror`).
- **Desserialização Insegura:** Proibir a desserialização arbitrária de dados originados do cliente ou rede (ex.: `pickle.loads()`, `unserialize()`, `yaml.load(Loader=Loader)` sem SafeLoader).

#### A09: Security Logging and Monitoring Failures
- **Sanitização de Logs:** Impedir categoricamente que senhas, tokens de autorização (Bearer JWT), dados de cartão (PAN/CVV) ou PII bruta sejam registrados em logs de stdout ou arquivos de trace.
- **Trilhas de Auditoria Imutáveis:** Registrar eventos de segurança essenciais: logins com falha, elevações de privilégio, alterações de permissão e acessos a dados sensíveis com timestamp UTC e identificador de ator.

#### A10: Server-Side Request Forgery (SSRF)
- **Whitelisting de Destinos:** Requisições HTTP externas originadas pelo backend devem ter seus destinos validados contra listas de permissão (whitelists) estritas.
- **Bloqueio de Redes Internas:** Bloquear requisições direcionadas para endereços de loopback, instâncias de metadados de nuvem (`169.254.169.254`) ou faixas de IP privadas locais (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`).

#### Conformidade com LGPD / GDPR / CCPA
- **Minimização de Dados:** Coletar e trafegar apenas os campos estritamente necessários para a finalidade da operação. Tokens JWT devem ser minimalistas, sem carregar PII sensível em claims abertas.
- **Expurgo e Retenção Segura:** Garantir mecanismos para anonimização ou expurgo de dados pessoais conforme os prazos legais de retenção.

---

## 🎯 Critérios Objetivos de Severidade

| Severidade | Critério de Classificação | Exemplo Típico | Ação Requerida |
| :--- | :--- | :--- | :--- |
| **🔴 CRITICAL** | Vulnerabilidade explorável remotamente sem autenticação; vazamento maciço de dados ou execução remota de código (RCE). | SQL Injection sem bind, Credencial de AWS/banco hardcoded, IDOR em rota de exclusão de usuário. | **Bloqueio imediato de deploy.** Correção no código prioritária. |
| **🟠 HIGH** | Falha de controle de acesso ou segurança de sessão que exige autenticação prévia ou condições específicas. | Falta de verificação de permissão administrativa, ausência de rate limit no login, SSRF parcial. | Correção obrigatória antes da release em produção. |
| **🟡 MEDIUM** | Configuração insegura, ausência de cabeçalhos defensivos ou vazamento de metadados em logs. | Cookie sem flag `HttpOnly`, documentação Swagger aberta em produção, ausência de `rel="noopener"`. | Agendar correção na sprint corrente. |
| **🔵 LOW / INFO** | Oportunidade de hardening, boas práticas defensivas ou documentação de regras de segurança. | Versão de framework exibida em header `X-Powered-By`, falta de rate limit em rota pública estática. | Melhoria contínua de código. |

---

## 📊 Fase 3: Formato do Relatório de Saída no Chat

Apresente um sumário executivo profissional estruturado no chat:

````markdown
# 🛡️ Relatório de Auditoria de Segurança & SAST

> [!NOTE]
> **Escopo da Análise:** [ex: Análise estática do repositório completo e rotas de API]  
> **Status Consolidado:** 🟢 Aprovado / 🟡 Requer Ajustes / 🔴 Bloqueado por Vulnerabilidades Críticas  
> **Data da Auditoria:** [Data atual em UTC]

---

### 📊 Scorecard de Conformidade por Dimensão

| Dimensão de Segurança | Status | Avaliação Rápida |
| :--- | :---: | :--- |
| **A01: Controle de Acesso & IDOR** | 🟢 OK | Validação server-side de ownership implementada |
| **A02: Criptografia & PII (LGPD/GDPR)** | 🟡 WARN | Dados pessoais identificados em logs transitórios |
| **A03: Prevenção de Injeção & Execução** | 🟢 OK | Consultas SQL parametrizadas; sem eval/exec |
| **A05: Configurações Seguras & Cookies** | 🟢 OK | Cookies com HttpOnly, Secure e SameSite configurados |
| **A07: Autenticação & Gestão de Sessão** | 🟡 WARN | Rate limiting ausente na rota de login |
| **A08: Integridade de Dados & Uploads** | 🟢 OK | Magic bytes validados no upload de imagens |
| **A09: Logging Defensivo & Monitoramento** | 🟢 OK | Logs sanitizados sem dados confidenciais |
| **A10: Proteção contra SSRF** | 🟢 OK | Destinos externos validados contra whitelist |
| **Scanner de Credenciais & Segredos** | 🟢 OK | Nenhuma chave ou token hardcoded encontrado |

---

### 🚨 Descobertas & Plano de Remediação

| ID | Severidade | Categoria | Localização (`arquivo:linha`) | Descrição do Risco | Status / Ação Corretiva |
| :--- | :---: | :--- | :--- | :--- | :--- |
| **SEC-01** | `🔴 CRITICAL` | A01 IDOR | `src/api/orders.ts:42` | Endpoint de cancelamento recebia `orderId` sem checar proprietário. | 🛠️ *Corrigido no código com guard de tenant.* |
| **SEC-02** | `🟡 MEDIUM` | A07 Auth | `src/routes/auth.py:88` | Rota de login sem limitador de requisições consecutivas. | ⚠️ *Recomendado aplicar middleware de rate limit.* |

> [!CAUTION]
> **Alerta de Bloqueio:** [Destaque claro caso exista alguma vulnerabilidade CRITICAL pendente que impeça deploy ou release].

---

## ⚡ Próximos Passos & Remediação Imediata

- [ ] Validar compilação e testes automatizados após correções aplicadas.
- [ ] Executar `/architecture-review` para avaliar isolamento de camadas e resiliência.
- [ ] Mapear entidades e campos com dados sensíveis (LGPD) no banco via `/db-documentar`.
````
