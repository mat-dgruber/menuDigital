# 🌐 Suíte de Guias de Testes Frontend & UI

<div align="center">

[![Category](https://img.shields.io/badge/Category-Frontend%20Testing-EC4899?style=for-the-badge)](../../../README.md)
[![E2E & Unit](https://img.shields.io/badge/Stack-Playwright%20%7C%20Signals%20%7C%20axe--core-10B981?style=for-the-badge)](test-writing-standards.md)

<p align="center">
  <b>Padrões de engenharia para testes de componentes, reatividade com Signals, testes de acessibilidade com axe-core e testes E2E com Playwright.</b>
</p>

</div>

---

## 📂 Guias Disponíveis no Diretório

```text
guides/testing/frontend/
├── test-writing-standards.md      ──> Padrões para componentes, Signals, mocks HTTP e a11y
├── test-execution-guide.md        ──> Execução de testes unitários (Karma/Vitest) e E2E (Playwright)
├── troubleshooting.md             ──> Resolução de flaky tests, timing issues e problemas de DOM
└── test-modernization-plan.md     ──> Plano de migração de testes legados para stacks modernas
```

---

## 📋 Detalhamento dos Guias

| Guia Técnico | Descrição & Propósito |
| :--- | :--- |
| [`test-writing-standards.md`](test-writing-standards.md) | Padrões de escrita para testes unitários de componentes, diretivas e pipes; testes de reatividade com Signals; interceptação de requisições HTTP (`HttpTestingController`); e testes automatizados de acessibilidade com `axe-core`. |
| [`test-execution-guide.md`](test-execution-guide.md) | Comandos e fluxos de execução: execução headless em CI/CD, modo watch interativo para desenvolvimento, execução de testes E2E com Playwright e geração de relatórios de cobertura. |
| [`troubleshooting.md`](troubleshooting.md) | Guia de diagnóstico para problemas comuns no frontend: testes intermitentes (*flaky tests*), erros de sincronização assíncrona (`fakeAsync`, `tick`), vazamento de listeners de eventos e falhas de renderização de template. |
| [`test-modernization-plan.md`](test-modernization-plan.md) | Roteiro para modernização de suítes frontend legadas, migrando testes baseados em polling para validação reativa determinística e integrando verificações de acessibilidade contínuas. |
