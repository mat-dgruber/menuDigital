---
description: "Exibe estatísticas de economia de tokens da sessão stoneage. Mostra tokens salvos estimados, custo USD economizado, e histórico.\n"
---
# Stoneage Stats

## Propósito

Mostrar quanto o stoneage economizou nesta sessão e no histórico acumulado.

## Processo

1. Ler dados da sessão atual (turnos e tokens de output utilizados)
2. Calcular economia estimada baseada no benchmark do modo ativo (baseline configurável: ~65%)
3. Calcular USD economizado com base no preço do modelo
4. Exibir resumo formatado

## Formato de Saída

```
🪨 Stoneage Stats
──────────────────────
Turnos:           X
Output tokens:    X
Economia est.:    X (~65%)
USD economizado:  ~$X.XX
──────────────────────
```

## Cálculo

- `taxa_compressao = 0.65` (ou 0.40 para lite, 0.75 para full, 0.85 para ultra)
- `tokens_sem_stoneage = output_tokens / (1 - taxa_compressao)`
- `tokens_economizados = tokens_sem_stoneage - output_tokens`
- `preco_modelo = 15.00` (USD por 1M output tokens padrão frontier; ajustar conforme modelo em uso)
- `usd_economizado = (tokens_economizados / 1_000_000) * preco_modelo`

> [!NOTE]
> Os valores apresentados são **estimativas estatísticas** baseadas em médias de redução sintática, não telemetria exata de hardware.

## Limites

Apenas exibe dados calculados. Não modifica contexto nem altera arquivos.
