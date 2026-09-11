---
description: "Reduz consumo de contexto podando saídas de ferramentas grandes (Bash, Grep, Read, APIs). Extrai apenas os dados essenciais e descarta o payload intermediário não utilizado.\n"
---
Tool results volumosos sobrecarregam a janela de contexto. Extraia dados essenciais e descarte o ruído.

> [!NOTE]
> **Diferença de `silent-tools`:** `context-trim` impede que **grandes blocos de dados brutos** (arquivos lidos, dumps JSON, payloads de API) persistam no contexto do modelo. `silent-tools` atua especificamente na formatação e resumo de comandos interativos do terminal (logs de compilação, testes, git).

## Regras

**Ferramentas com output > 50 linhas:**

- Extrair apenas pontos-chave, erros, primeiros e últimos resultados
- Não re-emitir output completo na resposta
- Resumir em 3-5 bullet points

**Ferramentas com output > 200 linhas:**

- Extrair apenas o primeiro erro (se houver) e contagem de resultados
- Ignorar linhas intermediárias repetitivas
- Nunca mais de 5 linhas de output na resposta

**Exceções (nunca truncar):**

- Usuário pediu explicitamente para ver output completo
- Debugando erro e precisa de stack trace completo
- Output de comandos interativos

## Exemplos Práticos

### Leitura de arquivo volumoso (>500 linhas)
- ❌ Re-injetar arquivo inteiro na resposta: `[500 linhas de código]`
- ✅ `src/types/schema.ts (L140-165): interfaces UserProfile e AuthToken identificadas. O restante do arquivo contém enums legados não alterados.`

### Dump de resposta de API / Banco (JSON de 300 linhas)
- ❌ `[JSON bruto de 300 linhas com todos os registros]`
- ✅ `Resposta da API retornou 48 itens. Amostra do primeiro registro: { id: "usr_1", status: "active" }. Campo relevante 'role' ausente nos demais.`

### Output de build / bundle analyzer (120 linhas)
- ❌ `[Lista completa de 120 módulos empacotados]`
- ✅ `Build finalizado: bundle principal 342 KB (gzip). Maior dependência: lodash (84 KB).`

## Quando Expandir

Se usuário pedir "mostra tudo", "sem filtro", "output completo":

- Forneça o output completo
- Retorne ao modo context-trim na próxima mensagem

## Controle

- Individual: "context trim on/off"
- Mestre: "token economy on/off" (controla todas as skills)
