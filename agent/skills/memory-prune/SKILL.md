---
description: "Mantém MEMORY.md limpo e eficiente. Remove entradas obsoletas, consolida duplicatas e mantém o índice enxuto para evitar injeção desnecessária de tokens de contexto.\n"
---
`MEMORY.md` é injetado em toda sessão. Entradas obsoletas = tokens de entrada desperdiçados a cada turno.

## Detecção e Gatilhos

- **Automático:** verificado na inicialização da sessão ou na leitura de `MEMORY.md` quando a lista de links/tópicos indexados ultrapassa **20 entradas**.
- **Manual:** via comando `/memory-prune` ou "limpa memory".

## Regras de Varredura

- Ler cada arquivo referenciado no índice
- Marcar para remoção se:
  - Tarefa concluída (PR merged, feature shipped, bug fixed)
  - Pessoa saiu do projeto
  - Informação derivável diretamente do histórico git ou código-fonte
  - Duplicata ou variação de outra entrada
- Consolidar entradas relacionadas em uma só
- **Manter sempre:** preferências explícitas do usuário, convenções de arquitetura, padrões do projeto e regras ativas de CI/CD.

## O que NÃO remover

- Preferências de comunicação ou workflow do usuário
- Decisões de design ativas que influenciam código futuro
- Links para repositórios centrais, Linear, Jira ou Slack de incidentes em aberto
- Regras de build e deploy de produção

## Fluxo de Execução

1. Listar entradas candidatas a remoção
2. Pedir confirmação antes de apagar arquivos
3. Atualizar `MEMORY.md` e remover arquivos `.md` stale
4. Exibir relatório de limpeza

## Exemplo de Relatório Pós-Prune

```markdown
🧹 Memory Prune Executado
───────────────────────────────
Entradas avaliadas:    24
Removidas (stale):     6 (PRs já mergeados em v1.0)
Consolidadas:          4 → 2 (tópicos de layout agrupados)
Preservadas:           14 (decisões arquiteturais + regras)
Tokens economizados:   ~1.800 tokens/sessão
───────────────────────────────
```

## Controle

- Individual: "memory prune on/off"
- Mestre: "token economy on/off" (controla todas as skills)
