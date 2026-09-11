# Design — Rota /menu editorial premium

Data: 2026-09-11

## Objetivo

Criar uma rota `/menu` independente para apresentar o cardápio digital como um cardápio físico elegante, organizado e adequado para uso por QR code em mesa.

A página deve manter a home atual intacta e reaproveitar os dados existentes do projeto.

## Decisão aprovada

Usar a abordagem 1: criar uma rota nova `/menu` reaproveitando `settings.json` e `src/content/menu/*.md`.

A direção visual aprovada é a opção A: editorial premium escuro.

## Escopo

### Entra

- Criar `src/pages/menu.astro`.
- Buscar itens com `getCollection('menu')`.
- Agrupar itens conforme `settings.categorias`.
- Renderizar layout próprio, sem depender de `Hero`, `PromoCombo` ou `MenuCard`.
- Usar visual dark premium com hierarquia de cardápio físico.
- Mostrar cabeçalho compacto com nome, ramo, slogan/status e CTA discreto de WhatsApp.
- Mostrar categorias como seções numeradas.
- Mostrar itens em lista editorial com nome, preço e descrição.
- Marcar destaques/mais pedidos com selo discreto.
- Mostrar itens indisponíveis de forma esmaecida.
- Colocar WhatsApp apenas no topo e/ou rodapé da página.

### Não entra

- Carrinho.
- Checkout.
- Botão “Pedir” por item.
- Fotos por item na rota `/menu`.
- Mudança da home atual.
- Novos campos no CMS.
- Nova dependência.

## Arquitetura

A rota `/menu` será uma página Astro independente.

Ela deve importar:

- `getCollection` de `astro:content`.
- `settings` de `src/data/settings.json`.
- `Base` de `src/layouts/Base.astro`.

A página deve montar os grupos usando a mesma regra da home:

- Para categorias normais, comparar `item.data.categoria` com `categoria.id`.
- Ordenar por `item.data.ordem`.
- Remover categorias sem itens.

Não será criado componente novo inicialmente. O HTML e CSS ficam locais em `menu.astro`, porque esta rota é uma apresentação específica. Se o arquivo crescer ou o layout for reutilizado depois, a extração pode ser feita em uma etapa futura.

## Layout e UX

A página deve parecer um menu editorial escuro, não uma landing page.

Estrutura visual:

1. Cabeçalho centralizado com:
   - status/horário em selo pequeno;
   - nome do restaurante;
   - título “Menu da Casa”;
   - frase curta de posicionamento;
   - botão discreto para WhatsApp.
2. Conteúdo em um painel central com largura controlada.
3. Categorias separadas por título numerado e linha divisória.
4. Itens em linhas legíveis:
   - nome em destaque;
   - preço alinhado à direita;
   - descrição abaixo;
   - selo pequeno para destaque/mais pedido;
   - estado indisponível esmaecido.
5. Rodapé com endereço, horário e CTA final para WhatsApp.

A página deve funcionar bem primeiro em mobile, com adaptação simples para telas maiores.

## Acessibilidade

- Usar `<main>`, `<section>`, headings hierárquicos e links com texto claro.
- Manter contraste adequado no tema escuro.
- Não depender apenas de cor para indicar item indisponível; incluir texto “Esgotado”.
- CTA externo de WhatsApp deve usar `target="_blank"` e `rel="noopener noreferrer"`.

## Dados

Nenhum dado novo é necessário.

Campos usados dos itens:

- `nome`
- `descricao`
- `preco`
- `categoria`
- `destaque`
- `maisPedido`
- `disponivel`
- `ordem`

Campos usados de `settings`:

- `negocio.nome`
- `negocio.ramo`
- `negocio.slogan`
- `atendimento.status_badge`
- `atendimento.horario`
- `atendimento.endereco`
- `atendimento.whatsapp`
- `atendimento.mensagem_padrao`
- `categorias`
- cores de `tema` via variáveis já existentes no layout global

## Verificação

Após implementar:

- Rodar o build do projeto.
- Corrigir qualquer erro de Astro, schema ou CSS bloqueante.
- Fazer checagem visual rápida da rota `/menu` em viewport mobile.

## Critério de aceite

A implementação está pronta quando:

- `/menu` existe e renderiza sem erro.
- A home atual continua intacta.
- Os itens aparecem agrupados e ordenados por categoria.
- O visual transmite cardápio físico premium escuro.
- Não há botão de pedido por item.
- O WhatsApp aparece apenas como CTA discreto no topo/final.
