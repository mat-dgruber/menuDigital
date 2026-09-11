---
description: "Sistema de controle de gastos de tokens por sessão. Escala automaticamente os modos stoneage (lite → full → ultra) conforme a sessão avança e o histórico cresce.\n"
---
## Como funciona

O budget é uma pontuação acumulada que monitora o consumo da sessão atual:

- **+1** por turno (mensagem do usuário)
- **+0.5** extra se prompt do usuário > 500 caracteres
- **+0.5** extra se resposta anterior > 2000 tokens estimados

## Thresholds de Escala

| Score acumulado | Modo stoneage | O que muda                                        |
| --------------- | ------------- | ------------------------------------------------- |
| < 10            | (normal)      | Comportamento padrão de respostas                 |
| 10–25           | `lite`        | Sem preenchimento/hedging, frases completas       |
| 25–50           | `full`        | Fragmentos OK, artigos omitidos, sinônimos curtos |
| 50+             | `ultra`       | Máxima compressão, mínimo absoluto de tool calls  |

## Comportamento cooperativo

Quando stoneage escala por budget:

- **lite:** manter respostas diretas, pular preâmbulos
- **full:** fragmentos OK, agrupar tool calls quando possível
- **ultra:** respostas mínimas, evitar tool calls redundantes, uma palavra quando basta

## Transparência

O budget ajusta os modos de forma silenciosa. Caso o usuário pergunte:

- "Por que tão curto?" / "Mudou algo?" → responder: "Session budget atingiu score X; stoneage escalou para modo Y."
- "Como vejo o budget?" → indicar: `cat ~/.config/stoneage/session-budget.json 2>/dev/null`
- "Resetar budget?" → responder: "Use 'stop budget' ou 'stop stoneage' para resetar a pontuação a 0."

## Override do usuário

- O usuário pode sobrescrever a qualquer momento com `/stoneage lite|full|ultra`
- "stop stoneage" ou "stop budget" reseta o score acumulado para 0
- Thresholds configuráveis em `~/.config/stoneage/config.json`:
  ```json
  {
    "budgetThresholds": {
      "lite": 10,
      "full": 25,
      "ultra": 50
    }
  }
  ```

## Controle

- Individual: `session budget on/off` ou `stop budget`
- Mestre: `token economy on/off` (controla todas as skills)
