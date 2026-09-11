---
name: task-batch
description: >
  Agrupa TaskCreate e TaskUpdate em chamadas paralelas no mesmo turno.
  Menos turnos = menos tokens de overhead em requisições consecutivas.
  Use quando criar ou completar 2+ tasks.
user-invocable: true
triggers:
  - task batch
  - agrupar tasks
  - batch tasks
  - /task-batch
output_format: concise
---

Tasks separadas = múltiplos turnos desperdiçados. Batching paralelo = menor consumo de contexto e execução mais rápida.

## Regras

**Criar tasks:**

- Se 2+ tasks forem independentes, criar todas no mesmo turno via chamadas paralelas
- Definir dependências (`addBlockedBy`) no mesmo turno de criação das tasks

**Completar tasks:**

- Se 2+ tasks estiverem finalizadas, marcar todas como `completed` no mesmo turno
- Garante sincronização atômica do status no task manager

**Exceções:**

- Task que depende estritamente do resultado de outra → turno separado (necessário avaliar o output intermediário)
- Apenas 1 task → sem benefício de batch

## Exemplo

```
// ❌ 5 turnos separados (alto overhead de tokens de sistema)
Turno 1: TaskCreate("fix auth")
Turno 2: TaskUpdate("1", in_progress)
Turno 3: [edita código]
Turno 4: TaskUpdate("1", completed)
Turno 5: TaskCreate("add tests")

// ✅ 2 turnos (mínimo overhead)
Turno 1: TaskCreate("fix auth") + TaskCreate("add tests") + TaskCreate("update docs")
Turno 2: [edita código] + TaskUpdate("1", completed) + TaskUpdate("2", completed) + TaskUpdate("3", completed)
```

## Controle

- Individual: "task batch on/off"
- Mestre: "token economy on/off" (controla todas as skills)
