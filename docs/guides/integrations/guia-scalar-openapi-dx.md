# Guia de Integracao e Padronizacao Scalar: Documentacao e DX de APIs OpenAPI 3.1

<!-- 
=================================================================================
LOG DE MANUTENCAO E GOVERNANCA INSTITUCIONAL
=================================================================================
Data       | Responsavel                              | Descricao da Alteracao
-----------|------------------------------------------|--------------------------------------------------
2026-09-09 | Comite Corporativo de Arquitetura        | Reestruturacao canonica na categoria de Integracoes
           | & Engenharia de Software                 | com adocao exclusiva dos pacotes oficiais da suite
           |                                          | @scalar (npm, PyPI e CDN jsdelivr), eliminando
           |                                          | dependencias de forks e credenciais privadas.
=================================================================================
-->

> **Este guia define o padrao normativo corporativo para documentacao interativa e Developer Experience (DX) de APIs RESTful baseadas em OpenAPI 3.1**, utilizando a suíte de ferramentas oficiais mantidas pelo projeto **Scalar** (`@scalar/api-reference`, `scalar-fastapi`, `@scalar/express-api-reference`, `@scalar/hono-api-reference` e distribuicao oficial via CDN).

**Regra de ouro de DX:** A qualidade da documentacao gerada e proporcional a precisao da especificacao OpenAPI fornecida pelo servico. O renderizador Scalar reflete com fidelidade os schemas, tipos, sumarios e politicas de seguranca declarados nos contratos da API.

---

## 1. Visao Geral e Arquitetura de Distribuicao

O ecossistema Scalar disponibiliza documentacao interativa com interface moderna de dois paineis, gerador de snippets em dezenas de linguagens, console de testes integrado (Playground HTTP) e busca ultrarrapida.

A adocao corporativa estabelece tres canais oficiais e homologados de distribuicao, todos publicos e auditaveis:

1. **Registro npm Publico:**
   - `@scalar/api-reference` (nucleo de renderizacao universal para browsers e SPAs).
   - `@scalar/express-api-reference` (middleware para aplicacoes Express / Node.js).
   - `@scalar/hono-api-reference` (middleware leve para Hono / Cloudflare Workers / Node.js).
   - `@scalar/openapi-diff` (utilitario CLI e biblioteca para deteccao de breaking changes em pipelines CI/CD).
2. **Registro Python PyPI Oficial:**
   - `scalar-fastapi` (extensao tipada oficial para FastAPI, gerando paginas autocontidas com suporte a temas, enums e multiplas fontes OpenAPI).
3. **Rede de Distribuicao Estatica Oficial (CDN):**
   - `https://cdn.jsdelivr.net/npm/@scalar/api-reference` (bundle JavaScript e folha de estilos CSS para servicos legados, arquiteturas monolíticas baseadas em templates de servidor como Laravel Blade, Django Templates, ou paginas HTML estaticas).

---

## 2. Inicializacao em Projetos Backend (APIs)

### A. FastAPI (Python)

A integracao recomendada utiliza o pacote oficial `scalar-fastapi`, instalado via PyPI.

#### 1. Instalacao

```bash
pip install scalar-fastapi
# ou com gerenciador uv:
uv add scalar-fastapi
```

#### 2. Configuracao da Rota Canonica (`/scalar`)

Configure a rota de documentacao com `include_in_schema=False` para nao poluir o proprio documento OpenAPI exportado:

```python
from fastapi import FastAPI
from scalar_fastapi import Layout, Theme, get_scalar_api_reference

app = FastAPI(
    title="Servico de Pagamentos e Transacoes",
    version="1.0.0",
    description="API corporativa de processamento de pagamentos e liquidacao financeira.",
    openapi_url="/openapi.json",
)


@app.get("/scalar", include_in_schema=False)
async def scalar_docs():
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title=f"{app.title} - Referencia de API",
        layout=Layout.MODERN,
        theme=Theme.KEPLER,
        show_sidebar=True,
        persist_auth=True,
        scalar_proxy_url="https://proxy.scalar.com",
    )
```

#### 3. Suporte a Multiplas APIs em um Unico Painel

Quando o servico disponibiliza diferentes versoes ou contextos de acesso (por exemplo, API de Parceiros e API Administrativa), utilize o parametro `sources`:

```python
from fastapi import FastAPI
from scalar_fastapi import OpenAPISource, get_scalar_api_reference

app = FastAPI(title="Gateway de Servicos")


@app.get("/scalar", include_in_schema=False)
async def scalar_multi_spec():
    return get_scalar_api_reference(
        sources=[
            OpenAPISource(title="API Publica v1", url="/v1/openapi.json", default=True),
            OpenAPISource(title="API Administrativa Interna", url="/admin/openapi.json"),
        ],
        title="Catalogo Central de Servicos",
        theme=Theme.KEPLER,
    )
```

---

### B. Express (Node.js / TypeScript)

Para servicos em Node.js com Express, utilize o pacote oficial `@scalar/express-api-reference`:

#### 1. Instalacao

```bash
npm install @scalar/express-api-reference
# ou via pnpm:
pnpm add @scalar/express-api-reference
```

#### 2. Configuracao do Middleware

```typescript
import express from 'express';
import { apiReference } from '@scalar/express-api-reference';

const app = express();

// Rota que expoe a especificacao OpenAPI em JSON
app.get('/openapi.json', (req, res) => {
  res.sendFile('/caminho/para/openapi.json', { root: '.' });
});

// Rota interativa do Scalar
app.use(
  '/scalar',
  apiReference({
    spec: {
      url: '/openapi.json',
    },
    theme: 'kepler',
    layout: 'modern',
    showSidebar: true,
  })
);

app.listen(3000, () => {
  console.log('Servidor em execucao: http://localhost:3000/scalar');
});
```

---

### C. Hono (TypeScript / Edge / Node.js)

Para arquiteturas ultra-leves ou edge runtimes, utilize `@scalar/hono-api-reference`:

#### 1. Instalacao

```bash
npm install @scalar/hono-api-reference
```

#### 2. Configuracao

```typescript
import { Hono } from 'hono';
import { Scalar } from '@scalar/hono-api-reference';

const app = new Hono();

// Documentacao interativa servida diretamente
app.get(
  '/scalar',
  Scalar({
    theme: 'kepler',
    layout: 'modern',
    spec: {
      url: '/openapi.json',
    },
  })
);

export default app;
```

---

### D. PHP / Laravel (Template de Servidor)

Em projetos Laravel, a especificacao OpenAPI pode ser gerada via ferramentas canonicas como Scramble ou Scribe. O Scalar e renderizado por meio de uma view Blade modular utilizando o script standalone oficial via CDN.

#### 1. Rota no Laravel (`routes/web.php`)

```php
use App\Http\Controllers\ScalarDocsController;
use Illuminate\Support\Facades\Route;

Route::get('/scalar', [ScalarDocsController::class, 'index'])
    ->name('scalar.docs');
```

#### 2. Controller Dedicado (`app/Http/Controllers/ScalarDocsController.php`)

```php
namespace App\Http\Controllers;

use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class ScalarDocsController extends Controller
{
    public function index(Request $request): View
    {
        if (App::environment('production') && !config('services.scalar.allow_prod', false)) {
            abort(403, 'Acesso restrito em ambiente de producao.');
        }

        return view('scalar.index', [
            'title' => config('app.name') . ' - Documentacao OpenAPI',
            'specUrl' => url(config('scramble.api_path', '/docs/api.json')),
            'proxyUrl' => 'https://proxy.scalar.com',
            'theme' => 'kepler',
            'layout' => 'modern',
        ]);
    }
}
```

#### 3. View Blade (`resources/views/scalar/index.blade.php`)

```blade
<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title }}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            height: 100vh;
            width: 100vw;
            overflow: hidden;
        }
    </style>
</head>
<body>
    <div id="app"></div>

    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
    <script>
        Scalar.createApiReference('#app', {
            url: '{{ $specUrl }}',
            title: '{{ $title }}',
            layout: '{{ $layout }}',
            theme: '{{ $theme }}',
            showSidebar: true,
            persistAuth: true,
            scalarProxyUrl: '{{ $proxyUrl }}'
        });
    </script>
</body>
</html>
```

---

## 3. Integracao em Aplicacoes Frontend (SPAs & Portais Web)

### A. Vanilla / TypeScript / Universal

Em qualquer aplicacao JavaScript, instale o pacote oficial `@scalar/api-reference`:

```bash
npm install @scalar/api-reference
```

Inicialize o componente acoplado a qualquer elemento HTML da arvore DOM:

```typescript
import { createApiReference } from '@scalar/api-reference';
import '@scalar/api-reference/style.css';

const container = document.getElementById('api-docs-container');

if (container) {
  createApiReference(container, {
    url: 'https://api.empresa.com/openapi.json',
    theme: 'kepler',
    layout: 'modern',
    showSidebar: true,
    persistAuth: true,
  });
}
```

---

### B. Angular (Standalone Component)

Em aplicacoes Angular modernas (v17+ com standalone components), encapsule o Scalar em um componente isolado utilizando `AfterViewInit`, `ElementRef` e `ViewEncapsulation.None` para correta aplicacao dos estilos globais do tema:

```typescript
import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { createApiReference } from '@scalar/api-reference';
import '@scalar/api-reference/style.css';

@Component({
  selector: 'app-scalar-docs',
  standalone: true,
  template: `
    <div #scalarContainer class="scalar-host-wrapper"></div>
  `,
  styles: [`
    .scalar-host-wrapper {
      width: 100%;
      height: 100vh;
      overflow-y: auto;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class ScalarDocsComponent implements AfterViewInit {
  @ViewChild('scalarContainer', { static: true })
  scalarContainer!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    if (this.scalarContainer?.nativeElement) {
      createApiReference(this.scalarContainer.nativeElement, {
        url: '/openapi.json',
        theme: 'kepler',
        layout: 'modern',
        showSidebar: true,
        persistAuth: true,
      });
    }
  }
}
```

---

### C. React / Next.js

Para aplicacoes React, renderize o container em um `useEffect`:

```tsx
import React, { useEffect, useRef } from 'react';
import { createApiReference } from '@scalar/api-reference';
import '@scalar/api-reference/style.css';

interface ApiReferenceProps {
  specUrl: string;
}

export const ApiDocsViewer: React.FC<ApiReferenceProps> = ({ specUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      createApiReference(containerRef.current, {
        url: specUrl,
        theme: 'kepler',
        layout: 'modern',
        showSidebar: true,
        persistAuth: true,
      });
    }
  }, [specUrl]);

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />;
};
```

---

## 4. Distribuicao Estatica Agnóstica via CDN Oficial

Para portais de documentacao desacoplados ou servicos sem runtime Node/Python no frontend, utilize o bundle standalone oficial servido via jsdelivr:

```html
<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Referencia de API Corporativa</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            height: 100vh;
            width: 100vw;
            overflow: hidden;
        }
    </style>
</head>
<body>
    <div id="scalar-app"></div>

    <!-- Bundle oficial da suite Scalar -->
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
    <script>
        Scalar.createApiReference('#scalar-app', {
            url: '/openapi.json',
            layout: 'modern',
            theme: 'kepler',
            showSidebar: true,
            persistAuth: true,
            scalarProxyUrl: 'https://proxy.scalar.com'
        });
    </script>
</body>
</html>
```

---

## 5. Matriz de Parametros e Configuracoes Homologadas

A tabela abaixo sintetiza os parametros suportados no nucleo JS (`@scalar/api-reference`) e mapeados para Python (`scalar-fastapi` em snake_case):

| Parametro JS | Parametro Python | Tipo | Valor Padrao | Finalidade |
| :--- | :--- | :--- | :--- | :--- |
| `url` | `openapi_url` | string | `undefined` | URL absoluta ou relativa do documento OpenAPI. |
| `content` | `content` | string / dict | `undefined` | Objeto ou string serializada da especificacao JSON/YAML. |
| `sources` | `sources` | array | `[]` | Colecao de fontes OpenAPI para alternancia de APIs. |
| `title` | `title` | string | `'Scalar'` | Titulo exibido na aba do navegador e no topo da doc. |
| `layout` | `layout` | Layout enum | `'modern'` | Estilo de layout: `modern` (dois paineis) ou `classic` (estilo Swagger). |
| `theme` | `theme` | Theme enum | `'default'` | Tema de cores: `default`, `kepler`, `mars`, `deepSpace`, `moon`, `purple`, `solarized`, `none`. |
| `darkMode` | `dark_mode` | boolean | `true` | Estado inicial do modo escuro. |
| `showSidebar` | `show_sidebar` | boolean | `true` | Exibe barra lateral com hierarquia de tags e endpoints. |
| `hideModels` | `hide_models` | boolean | `false` | Oculta a secao de esquemas de dados (Models / Schemas). |
| `hideSearch` | `hide_search` | boolean | `false` | Remove o campo de busca global. |
| `searchHotKey` | `search_hot_key` | string | `'k'` | Atalho para abertura da busca (Cmd+K / Ctrl+K). |
| `persistAuth` | `persist_auth` | boolean | `false` | Salva credenciais de autenticacao de sandbox no localStorage do navegador. |
| `scalarProxyUrl` | `scalar_proxy_url` | string | `undefined` | URL de proxy para intermediar requisicoes do console e mitigar bloqueios de CORS. |
| `overrides` | `overrides` | dict | `{}` | Injecao direta de propriedades avancadas de configuracao no objeto JS final. |

### Configuracao do Cliente HTTP Padrao via `overrides`

Para padronizar qual linguagem/snippet de codigo e selecionado por padrao quando o desenvolvedor abre um endpoint, utilize a chave `defaultHttpClient`:

```python
get_scalar_api_reference(
    openapi_url=app.openapi_url,
    overrides={
        "defaultHttpClient": {
            "targetKey": "python",
            "clientKey": "httpx",
        }
    },
)
```

---

## 6. Boas Praticas de Especificacao OpenAPI (DX First)

A interface do Scalar atua como um espelho da especificacao formal. Para garantir a melhor experiencia para engenheiros integradores:

### A. Estruturacao de Tags e Grupos de Rotas

As tags do OpenAPI determinam as secoes da navegacao lateral. Defina metadados claros para cada tag no nivel raiz da especificacao:

```python
tags_metadata = [
    {
        "name": "Autenticacao & Tokens",
        "description": "Emissao, renovacao e revogacao de tokens corporativos JWT.",
    },
    {
        "name": "Faturamento",
        "description": "Cobranca, split de pagamentos e consulta de faturas.",
    },
]

app = FastAPI(openapi_tags=tags_metadata)
```

### B. Respostas Tipadas e Status Codes Canonicos

Evite documentar apenas o caso de sucesso (`200 OK`). Declare explicitamente todas as respostas de falha tratadas pela aplicacao (`400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `422 Unprocessable Entity`):

- Cada status code deve conter um schema tipado de erro, preferencialmente seguindo o padrao RFC 7807 / RFC 9457 (`ProblemDetails`).
- Inclua exemplos reais (`examples`) para payloads de sucesso e falha, permitindo execucao no playground com um clique.

### C. Declaracao de Seguranca (Security Schemes)

Declare explicitamente esquemas de autenticacao na raiz do OpenAPI e associe-os as rotas correspondentes:

```yaml
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: "Insira o token JWT corporativo emitido pelo Servico de Autenticacao."
security:
  - BearerAuth: []
```

---

## 7. Ambientes, Seguranca e Politica de Seguranca de Conteudo (CSP)

### A. Diferenciacao por Ambiente

1. **Desenvolvimento / Staging:**
   - Acesso liberado para desenvolvedores e integradores.
   - Ferramentas de inspecao e documentacao habilitadas.
2. **Producao:**
   - Avalie se a documentacao deve ser publica ou restrita a rede corporativa/VPN ou middleware de autenticacao.
   - Oculte paineis de depuracao interna (`show_developer_tools="never"`).
   - Nao inclua segredos ou tokens sensiveis em exemplos padrao de autenticacao.

### B. Content Security Policy (CSP)

Ao habilitar cabecalhos rigorosos de CSP na aplicacao que serve a documentacao:

1. **`script-src`:**
   - Permita a origem oficial caso utilize o bundle da CDN:
     `script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;`
2. **`connect-src`:**
   - Permita o proxy oficial se estiver habilitado para chamadas do playground:
     `connect-src 'self' https://proxy.scalar.com;`
3. **`style-src` e `font-src`:**
   - `style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;`
   - `font-src 'self' data: https://cdn.jsdelivr.net;`

---

## 8. Prevencao de Breaking Changes em CI/CD (`@scalar/openapi-diff`)

Para proteger clientes consumidores contra quebras inadvertidas de contrato durante pull requests, utilize o pacote oficial `@scalar/openapi-diff`:

```bash
npm install @scalar/openapi-diff
```

Exemplo de script de validacao para pipeline de CI:

```typescript
import { diffOpenApi, formatDiffMarkdown } from '@scalar/openapi-diff';
import { readFileSync } from 'node:fs';

const specProducao = JSON.parse(readFileSync('./openapi.prod.json', 'utf-8'));
const specProposta = JSON.parse(readFileSync('./openapi.dev.json', 'utf-8'));

const diff = diffOpenApi(specProducao, specProposta);

console.log(`Recomendacao de Versionamento SemVer: ${diff.recommendedBump.toUpperCase()}`);

if (diff.breaking.length > 0) {
  console.error('Falha de Integracao: Breaking changes detectadas no contrato da API!');
  console.log(formatDiffMarkdown(diff));
  process.exit(1); // Interrompe o pipeline de merge/deploy
}
```

---

## 9. Governanca do Guia

- **Mantenedor:** Comite Corporativo de Arquitetura & Engenharia de Software
- **Ciclo de Revisao:** Semestral ou mediante atualizacao maior de versao da suite Scalar
- **Conformidade:** Auditoria de zero acoplamento a forks pessoais e credenciais privadas
