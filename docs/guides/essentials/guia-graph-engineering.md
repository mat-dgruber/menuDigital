---
title: Guia Oficial de Graph Engineering e Knowledge Graphs para Agentes de IA
description: Manual essencial e universal para transformar repositórios de código em Knowledge Graphs operacionais com Graphify, viabilizando navegação determinística por AST, economia de até 70% de tokens e eliminação de alucinações.
version: 2.0.0
date: 2026-09-09
---

<!-- 
=================================================================================
LOG DE MANUTENÇÃO E ALTERAÇÕES DO DOCUMENTO
=================================================================================
Data       | Autor          | Descrição da Alteração
-----------|----------------|--------------------------------------------------
2026-08-31 | Matheus Diniz  | Criação do guia inicial de Graph Engineering.
2026-09-09 | Eduardo Batista| v2.0.0 — Promoção para Guia Essencial Canônico:
           |                | desacoplamento total de stack; regra mandatória de
           |                | exclusão de docs/ no .graphifyignore; obrigatoriedade
           |                | de recálculo total do grafo do zero (--force --code-only)
           |                | em mudanças estruturais; alinhamento ao Dual-Harness.
=================================================================================
-->

# 🕸️ Guia Oficial de Graph Engineering e Knowledge Graphs para Agentes de IA

Este guia estabelece o padrão normativo e agnóstico de **Graph Engineering (Engenharia de Grafos de Conhecimento)** para repositórios de software operados por assistentes de IA (Claude Code, Gemini CLI, OpenClaude e Codex). 

Ao substituir buscas textuais cegas por navegação relacional baseada em AST (Abstract Syntax Tree), o agente orienta suas ações com precisão cirúrgica, **reduzindo o consumo de tokens em até 70%** e eliminando turnos perdidos com alucinações de contexto.

---

## 🧭 1. O Paradoxo da Varredura Textual vs. Navegação Relacional

Em bases de código médias e grandes, o comportamento padrão dos agentes de IA tende a ser ineficiente e propenso a erros:
- **Varredura Cega (`Grep` / `Glob` / `find`)**: Retorna dezenas de ocorrências dispersas em mocks, fixtures, comentários e arquivos de teste, sobrecarregando a janela de contexto.
- **Leitura Excessiva de Arquivos**: O agente lê múltiplos arquivos inteiros apenas para rastrear o fluxo de uma dependência ou identificar quem consome um serviço.
- **Alucinação de Arquitetura**: Sem uma visão topológica estruturada, o agente cria modelos mentais fragmentados, gerando código incompatível com as convenções vigentes.

### A Solução: Graph Engineering via AST
O Graph Engineering extrai os nós semânticos do código (classes, funções, interfaces, endpoints, schemas) e seus relacionamentos direcionados (`importa`, `chama`, `herda`, `injeta`). O agente passa a consultar primeiro o grafo operacional (`graphify-out/graph.json`), recebendo o subgrafo exato de dependências antes de abrir qualquer arquivo de código-fonte.

---

## 🛠️ 2. A Ferramenta Padrão: Graphify (`graphifyy`)

O **Graphify** é o padrão de referência adotado por sua capacidade de extrair AST localmente sem custo de inferência por LLM:

| Recurso | Detalhes Técnicos |
| :--- | :--- |
| **Pacote CLI** | `graphifyy` (disponível via PyPI: `uv tool install graphifyy` ou `pip install graphifyy`) |
| **Artefatos Gerados** | `graphify-out/graph.json` (grafo para consultas), `graphify-out/graph.html` (visualizador interativo) e `graphify-out/GRAPH_REPORT.md` (relatório de hubs e comunidades) |
| **Compatibilidade** | Universal: Python, TypeScript, JavaScript, Go, Rust, Java, PHP, C# e outros |
| **Integração com Agentes** | Skill nativa `/graphify`, hook-guards de interceptação e comandos CLI diretos |

---

## 🛡️ 3. As Duas Regras de Ouro do Graph Engineering

Para que o Grafo de Conhecimento permaneça determinístico, rápido e sem ruído, duas regras operacionais são estritamente obrigatórias:

### 🚫 Regra de Ouro 1: `docs/` NUNCA Deve Fazer Parte do Grafo
Arquivos de documentação técnica, especificações de design, chats de IA e planos voláteis contêm texto livre, exemplos hipotéticos e termos soltos. Indexar pastas de documentação:
- Cria centenas de **nós fantasmas** e relacionamentos inexistentes na AST de código.
- Confunde os agentes de IA, induzindo-os a editar documentações obsoletas em vez de código de produção.
- Inflaciona desnecessariamente o tamanho do `graph.json` e o tempo de resposta.

> ⚠️ **Diretriz**: O diretório `docs/` (bem como `docs/ai/`, `.agents/`, `.claude/`, `.gemini/` e arquivos `.md`) deve constar compulsoriamente no `.graphifyignore`. O grafo deve refletir **exclusivamente a topologia do código-fonte produtivo**.

### 🔄 Regra de Ouro 2: Mudanças Estruturais Demandam Recalcular o Grafo do Zero
O comando `graphify update .` realiza atualizações **estritamente incrementais** em arquivos modificados pontualmente. No entanto:
- Quando módulos são renomeados, fatias verticais são criadas/deletadas ou regras do `.graphifyignore` são alteradas, a topologia geral é rompida.
- Executar apenas `update` mantém arestas órfãs e conexões obsoletas no arquivo `graph.json`.

> 🚨 **Diretriz de Recálculo**: Sempre que houver refatorações arquiteturais, movimentações de diretórios ou modificações no `.graphifyignore`, é **compulsório recalcular o grafo do zero**, purificando a base com o comando:
> ```bash
> graphify extract . --force --code-only
> graphify cluster-only .  # (Opcional: re-clusteriza métricas do relatório)
> ```

---

## ⚙️ 4. Configuração Canônica do `.graphifyignore`

Crie ou atualize o arquivo `.graphifyignore` na raiz do projeto com os filtros canônicos de exclusão:

```gitignore
# Documentação Técnica e Artefatos de IA (Regra de Ouro 1)
docs/
.agents/
.claude/
.gemini/
.openclaude/
.superpowers/
*.md

# Ambientes Virtuais e Gerenciadores de Pacotes
.venv/
venv/
node_modules/
vendor/

# Artefatos de Build, Compilação e Bytecode
__pycache__/
*.pyc
dist/
build/
*.egg-info/
.angular/
.next/
.nuxt/
target/

# Caches e Relatórios de Teste
.pytest_cache/
.ruff_cache/
.coverage
coverage/
htmlcov/
graphify-out/cache/

# Controle de Versão e Worktrees
.git/
.worktrees/
.trunk/
```

---

## 🚀 5. Setup e Comandos Operacionais

### 5.1 Instalação da CLI
```bash
# Via uv (recomendado):
uv tool install graphifyy

# Ou via pip:
pip install graphifyy
```

### 5.2 Geração Inicial ou Recálculo Forçado do Grafo
Na raiz do repositório, gere a topologia completa limpa:
```bash
graphify extract . --force --code-only
```

Os seguintes arquivos serão consolidados em `graphify-out/`:
- `graphify-out/graph.json`: O grafo de conhecimento estruturado consultável pelos agentes.
- `graphify-out/graph.html`: Visualizador web interativo para exploração humana.
- `graphify-out/GRAPH_REPORT.md`: Relatório executivo com hubs, comunidades e pontos críticos de acoplamento.

---

## 💬 6. Comandos Essenciais de Consulta

Durante a interação com o assistente de IA ou via terminal:

| Comando | Finalidade Técnica | Exemplo de Invocação |
| :--- | :--- | :--- |
| `graphify query "<pergunta>"` | Retorna o subgrafo relevante focado na pergunta solicitada. | `graphify query "como funciona o fluxo de autenticação e geração de JWT?"` |
| `graphify path "<A>" "<B>"` | Mapeia o caminho determinístico de chamadas e dependências entre dois nós. | `graphify path "src/api/auth.py" "src/services/token_service.py"` |
| `graphify explain "<conceito>"` | Fornece análise focada de responsabilidades e acoplamento de uma entidade. | `graphify explain "UnitOfWork"` |
| `graphify update .` | Atualização incremental silenciosa após edições pontuais de código. | `graphify update .` |
| `graphify extract . --force --code-only` | **Recálculo total do zero** após mudanças estruturais de arquitetura. | `graphify extract . --force --code-only` |

---

## 🤖 7. Configuração nos Assistentes de IA (Dual-Harness)

### 7.1 Diretriz nos Arquivos de Instrução (`CLAUDE.md` / `GEMINI.md`)
Adicione o seguinte bloco de regras para impor o uso disciplinado do grafo:

```markdown
## graphify (Knowledge Graph Obrigatório)

Este repositório mantém um Grafo de Conhecimento atualizado em `graphify-out/graph.json`.

Diretrizes Compulsorias para Agentes:
1. **Graphify Antes de Grep/Glob**: Você DEVE OBRIGATORIAMENTE executar consultas estruturadas ao grafo (`graphify query "<pergunta>"`, `graphify path "<A>" "<B>"` ou `graphify explain "<conceito>"`) ANTES de utilizar ferramentas de busca textual ou varreduras de arquivos (`Grep`, `Glob`, `search_file_content`).
2. **Subagent Dispatch Directive**: Ao despachar qualquer subagente para investigação, refatoração ou exploração, injete obrigatoriamente a diretiva de consultar o Graphify como primeira ação de contexto.
3. **Uso Proativo**: Não aguarde solicitações do usuário; consulte o grafo autonomamente para planejar modificações.
4. **Recálculo Estrutural**: Edições pontuais disparam `graphify update .`. Refatorações estruturais ou alterações no `.graphifyignore` exigem `graphify extract . --force --code-only`.
```

### 7.2 Interceptação Determinística via Hooks

#### Claude Code (`.claude/settings.json`):
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash|Grep",
        "hooks": [
          {
            "type": "command",
            "command": "graphify hook-guard search"
          }
        ]
      },
      {
        "matcher": "Read|Glob",
        "hooks": [
          {
            "type": "command",
            "command": "graphify hook-guard read"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "FILE=$(jq -r \".tool_response.filePath // .tool_input.file_path\"); if echo \"$FILE\" | grep -q \"\\.graphifyignore$\"; then graphify extract . --force --code-only; elif echo \"$FILE\" | grep -qE \"\\.(py|ts|js|go|rs|java|php|cs)$\"; then graphify update .; fi || true",
            "statusMessage": "Atualizando Grafo de Conhecimento com Graphify..."
          }
        ]
      }
    ]
  }
}
```

#### Gemini CLI (`.gemini/settings.json`):
```json
{
  "hooks": {
    "BeforeTool": [
      {
        "matcher": "read_file|list_directory|search_file_content|grep_search|run_shell_command",
        "hooks": [
          {
            "type": "command",
            "command": "graphify hook-guard gemini"
          }
        ]
      }
    ],
    "AfterTool": [
      {
        "matcher": "write_file|edit_file",
        "hooks": [
          {
            "type": "command",
            "command": "(jq -r \".tool_response.filePath // .tool_input.file_path\" | grep -E \"\\.(py|ts|js|go|rs|java|php|cs)$\" && graphify update .) || true",
            "statusMessage": "Atualizando Grafo de Conhecimento com Graphify..."
          }
        ]
      }
    ]
  }
}
```

---

## 🗄️ 8. Subagente de Curadoria (`knowledge-graph-curator`)

Para auditorias periódicas ou após grandes releases, configure o subagente em `.claude/agents/knowledge-graph-curator.md` e `.gemini/agents/knowledge-graph-curator.md`:

```markdown
---
name: knowledge-graph-curator
description: Audita e reconstrói o grafo de conhecimento do repositório via Graphify após refatorações estruturais.
---

# Knowledge Graph Curator

Você é o auditor e curador do Grafo de Conhecimento (`graphify-out/`).

## Responsabilidades
1. Inspecionar o arquivo `.graphifyignore` garantindo que `docs/`, caches e artefatos de IA não sejam indexados.
2. Executar o recálculo forçado do grafo após refatorações:
   ```bash
   graphify extract . --force --code-only
   graphify cluster-only .
   ```
3. Verificar a integridade dos artefatos `graph.json`, `graph.html` e `GRAPH_REPORT.md`.
```

---

## 🔗 9. Versionamento e Automação no Git

Instale os hooks nativos do Git para manter o grafo sincronizado entre membros do time:

```bash
graphify hook install
```

O comando registra:
- `.git/hooks/post-commit`: Atualização incremental automática após cada commit.
- `.git/hooks/post-checkout`: Re-indexação rápida ao alternar branches.
- `merge driver`: Resolução determinística de conflitos para o `graphify-out/graph.json`.

### Política de Versionamento no Git:
- **Versionar no repositório (`git add`)**: `graphify-out/graph.json`, `graphify-out/graph.html`, `graphify-out/GRAPH_REPORT.md` e `.graphifyignore`.
- **Ignorar no `.gitignore`**: `graphify-out/cache/`.

Ao clonar o projeto ou puxar novas branches (`git pull`), qualquer desenvolvedor ou agente tem acesso imediato à topologia da arquitetura sem necessidade de reconstruir o grafo do zero.
