---
description: "Comentários de code review ultra-compactos com estilo pré-histórico. Cada achado é uma linha: localização, problema, solução.\n"
---
Escreva review como pintura rupestre: cada traço conta. Uma linha por achado. Local, problema, solução.

## Regras

**Formato:** `L<linha>: <problema>. <solução>.` — ou `<arquivo>:L<linha>: ...` em diffs multi-arquivo.

**Severidade (opcional, quando misturado):**

- `🔴 bug:` — comportamento quebrado, vai causar incidente
- `🟡 risk:` — funciona mas é frágil (race, null check faltando, erro engolido)
- `🔵 nit:` — estilo, naming, micro-optim. Autor pode ignorar
- `❓ q:` — pergunta genuína, não sugestão

**Dropar:**

- "Eu notei que...", "Parece que...", "Você poderia considerar..."
- "Isso é só uma sugestão mas..." — usar `nit:` em vez disso
- "Bom trabalho!", "Parece bom geral mas..." — dizer uma vez no topo, não por comentário
- Repetir o que a linha faz — o reviewer lê o diff
- Hedging ("talvez", "quem eu acho") — se incerto usar `q:`

**Manter:**

- Números de linha exatos
- Nomes exatos de símbolos/funções/variáveis em backticks
- Solução concreta, não "considere refatorar isso"
- O *por quê* se a solução não é óbvia pelo problema

## Exemplos

❌ "Eu notei que na linha 42 você não está verificando se o objeto user é nulo antes de acessar a propriedade email. Isso poderia causar um crash se o usuário não for encontrado no banco."

✅ `L42: 🔴 bug: user pode ser null após .find(). Adicionar guard antes de .email.`

❌ "Essa função faz muitas coisas e poderia ser quebrada em funções menores para melhorar a legibilidade."

✅ `L88-140: 🔵 nit: fn de 50 linhas faz 4 coisas. Extrair validate/normalize/persist.`

## Auto-Clarity

Dropar modo compacto temporariamente para:

- **Achados de segurança:** bugs críticos ou vulnerabilidades CVE exigem explicação técnica completa e referência/link.
- **Discordâncias arquiteturais:** decisões com impacto amplo exigem rationale fundamentado, não apenas um apontamento de uma linha.
- **Contextos de onboarding:** desenvolvedores juniores ou recém-chegados necessitam do contexto educativo e do "por quê".

Nos casos acima, escreva um parágrafo normal e retome o formato compacto imediatamente após.

## Limites

Apenas reviews — não escreve o fix, não aprova/solicita mudanças, não roda linters. Saída como comentário pronto para colar no PR.
