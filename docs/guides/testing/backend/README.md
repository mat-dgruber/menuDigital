# 🐍 Suíte de Guias de Testes Backend

<div align="center">

[![Category](https://img.shields.io/badge/Category-Backend%20Testing-3B82F6?style=for-the-badge)](../../../README.md)
[![Pattern](https://img.shields.io/badge/Pattern-AAA%20%7C%20In--Memory%20Fixtures-10B981?style=for-the-badge)](test-writing-standards.md)

<p align="center">
  <b>Padrões de engenharia para testes unitários, testes de integração, fixtures assíncronas em memória e execução determinística para Backend.</b>
</p>

</div>

---

## 📂 Guias Disponíveis no Diretório

```text
guides/testing/backend/
├── test-writing-standards.md      ──> Padrões de escrita AAA, nomenclatura e estratégias de mock
├── test-execution-guide.md        ──> Comandos de execução, filtros, paralelismo e relatórios
├── troubleshooting.md             ──> Diagnóstico e resolução de falhas comuns em testes
└── test-modernization-plan.md     ──> Roteiro de modernização de testes legados
```

---

## 📋 Detalhamento dos Guias

| Guia Técnico | Descrição & Propósito |
| :--- | :--- |
| [`test-writing-standards.md`](test-writing-standards.md) | Padrões canônicos para escrita de testes backend: estrutura AAA (Arrange-Act-Assert), nomenclatura descritiva em pt-BR/EN-US, isolamento total de estado, injeção de dependências e uso defensivo de mocks/fakes. |
| [`test-execution-guide.md`](test-execution-guide.md) | Manual prático de execução da suíte de testes: execução paralela com `pytest-xdist`, filtros por markers (`@pytest.mark.unit`, `@pytest.mark.integration`), geração de cobertura e flags de depuração (`-vv`, `--pdb`, `-s`). |
| [`troubleshooting.md`](troubleshooting.md) | Catálogo de erros comuns e soluções rápidas: poluição de estado entre testes, deadlocks em conexões de banco de dados, falhas em loops assíncronos `asyncio`, e mocks não restaurados em teardown. |
| [`test-modernization-plan.md`](test-modernization-plan.md) | Estratégia passo a passo para refatoração e modernização de bases legadas de testes, migrando testes lentos contra bancos físicos para fixtures assíncronas em memória (SQLite in-memory / transações atômicas). |
