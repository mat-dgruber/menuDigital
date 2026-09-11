---
name: token-economy
description: >
  Skill mestra de economia de tokens. Controla todas as 14 skills de redução de tokens e a suíte Stoneage.
  Ative/desative todas de uma vez ou individualmente. Use sempre que quiser controlar
  o consumo de tokens da sessão.
user-invocable: true
triggers:
  - token economy on
  - token economy off
  - liga token economy
  - desliga token economy
  - /token-economy
output_format: concise
---

# Token Economy Controller (`token-economy`)

Sistema de controle de gastos de tokens. Gerencia todas as 14 skills de economia e compressão.

## Skills controladas

| Skill | Default | O que faz |
| :--- | :--- | :--- |
| `answer-first` | ON | Respostas diretas, sem preâmbulo |
| `task-batch` | ON | Agrupa tool calls de tasks no mesmo turno |
| `session-budget` | ON | Escala stoneage conforme a sessão avança |
| `code-only` | OFF | Código puro, sem narração |
| `silent-tools` | OFF | Comprime output visual de ferramentas no chat |
| `context-trim` | OFF | Poda e resume tool results volumosos de entrada |
| `memory-prune` | OFF | Limpa e desduplica entradas obsoletas em MEMORY.md |
| `stoneage` | OFF | Engine de comunicação pré-histórica (~75% economia) |
| `stoneage-commit` | OFF | Mensagens de commit ultra-curtas (Conventional) |
| `stoneage-review` | OFF | Code review denso de 1 linha por apontamento |
| `stoneage-compress` | OFF | Comprime arquivos de texto e documentação (.md, .txt) |
| `stoneage-stats` | OFF | Relatório e estimativas de tokens salvos |
| `stoneage-help` | OFF | Cartão de referência rápida da suíte |

## Controle mestre

```text
token economy on      → ativa todas as skills recomendadas
token economy off     → desativa todas (mantém preferências individuais)
liga token economy    → mesmo que on
desliga token economy → mesmo que off
```

## Controle individual

```text
answer first on/off     / liga/desliga answer first
code only on/off        / liga/desliga code only
silent tools on/off     / liga/desliga silent tools
context trim on/off     / liga/desliga context trim
task batch on/off       / liga/desliga task batch
session budget on/off   / liga/desliga session budget
memory prune on/off     / liga/desliga memory prune
stoneage on/off         / liga/desliga stoneage
stoneage-commit on/off  / liga/desliga stoneage commit
stoneage-review on/off  / liga/desliga stoneage review
```

## Estado

Armazenamento persistente em `~/.config/stoneage/token-economy.json` (ou equivalente no runtime):

```json
{
  "master": true,
  "skills": {
    "answer-first": true,
    "task-batch": true,
    "session-budget": true,
    "code-only": false,
    "silent-tools": false,
    "context-trim": false,
    "memory-prune": false,
    "stoneage": false,
    "stoneage-commit": false,
    "stoneage-review": false,
    "stoneage-compress": false,
    "stoneage-stats": false,
    "stoneage-help": false
  }
}
```

## Quando usar

- **Sessão rápida** (< 10 turnos): `token economy off` — overhead desnecessário
- **Sessão longa**: `token economy on` — ativa o conjunto base e deixa `session-budget` escalar
- **Debug**: desative `silent-tools` e `context-trim` — necessário ver logs completos
- **Feature dev**: ative `code-only` e `answer-first` — foco estrito em código

## Ver estado atual

```bash
cat ~/.config/stoneage/token-economy.json 2>/dev/null || echo "Usando defaults em memória"
```
