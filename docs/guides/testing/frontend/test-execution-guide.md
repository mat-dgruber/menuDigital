# Guia de Execução de Testes Frontend (Modern Angular & SPAs)

## Comandos Essenciais de Execução

Todos os comandos de teste devem ser executados a partir do diretório raiz do projeto frontend (`frontend/` ou raiz do repositório):

---

### 1. Checagem Estática de Tipos (TypeScript)

Antes de rodar a suíte de testes unitários, execute a verificação estática de tipos para garantir integridade e ausência de regressões de tipagem:

```bash
# Executa a verificação estática de tipos sem emitir arquivos compilados
npx tsc --noEmit
```

---

### 2. Execução de Testes Unitários e de Componente

#### Execução Rápida em Modo Watch (Desenvolvimento Local)

Durante o desenvolvimento diário, utilize o modo watch para reexecução automática a cada salvamento:

```bash
# Angular CLI com Karma / Vitest / Webpack
npm test

# Ou explicitamente via CLI
npm test -- --watch=true
```

#### Execução Headless para CI/CD e Pre-commit

Para pipelines de integração contínua e hooks de pre-commit, execute a suíte em modo headless de disparo único:

```bash
# Executa todos os testes e finaliza o processo (exit code 0 para sucesso, 1 para falha)
npm test -- --watch=false --browsers=ChromeHeadless
```

Em ambientes Docker/Linux CI onde o Chrome requer flags de isolamento:

```bash
# Execução com flags sandbox desativadas
CHROME_BIN=/usr/bin/google-chrome npm test -- --watch=false --browsers=ChromeHeadlessNoSandbox
```

---

### 3. Geração de Relatórios de Cobertura de Código

Gere relatórios nos formatos LCOV (para SonarQube / Codecov) e HTML navegável:

```bash
# Execução com coleta de cobertura
npm test -- --watch=false --browsers=ChromeHeadless --code-coverage
```

Os artefatos serão disponibilizados em:
- **LCOV**: `coverage/lcov.info`
- **Relatório HTML**: `coverage/index.html` (abra diretamente no navegador para inspecionar linhas e branches não cobertos)

---

### 4. Execução Focada e Seletiva (Single Spec / Test)

Para depurar um teste específico sem executar toda a suíte:

#### Via Código (Jasmine / Jest)

Substitua `describe` por `fdescribe` ou `it` por `fit`:

```typescript
// Executa exclusivamente esta suíte
fdescribe('UserCardComponent', () => { ... });

// Executa exclusivamente este caso de teste
fit('deve emitir evento de clique com o ID do usuario', () => { ... });
```

#### Via Linha de Comando (Filtro por Nome ou Arquivo)

```bash
# Executa apenas testes que contenham o termo no nome
npm test -- --include="src/app/services/user.service.spec.ts"
```

---

## Metas de Cobertura e Governança de Qualidade

| Camada da Aplicação | Diretório Típico | Cobertura Mínima Recomendada |
| :--- | :--- | :--- |
| **Serviços HTTP e Signals State** | `src/app/services/`, `src/app/state/` | **≥ 85%** |
| **Route Guards e Interceptors** | `src/app/guards/`, `src/app/interceptors/` | **≥ 90%** |
| **Componentes de UI Reutilizáveis** | `src/app/components/`, `src/app/ui/` | **≥ 80%** |
| **Componentes de Página (Containers)** | `src/app/pages/`, `src/app/features/` | **≥ 70%** |

