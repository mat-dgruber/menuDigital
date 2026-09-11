# ⭐ Guias Técnicos Essenciais

<div align="center">

[![Category](https://img.shields.io/badge/Category-Essentials-F59E0B?style=for-the-badge)](../../README.md)
[![Compliance](https://img.shields.io/badge/Compliance-Mandatory%20Standards-10B981?style=for-the-badge)](../../README.md)

<p align="center">
  <b>Diretrizes obrigatórias recomendadas para qualquer projeto de software assistido por IA: governança operacional, grafos de conhecimento, versionamento semântico, decisões arquiteturais (ADRs) e persistência de memória.</b>
</p>

</div>

---

## 📂 Guias Disponíveis no Diretório

```text
guides/essentials/
├── guia-completo-harness-commit-memoria.md──> Micro-commits em 6 fases, ADRs e memória persistente
├── guia-graph-engineering.md              ──> Navegação por Knowledge Graph via AST (-70% tokens)
├── guia-padrao-criacao-adrs.md            ──> Padrão canônico de ADRs com 6 gatilhos determinísticos
└── semver-versioning-guide.md             ──> Versionamento SemVer 2.0.0, tags e changelog
```

---

## 📋 Detalhamento dos Guias

| Guia Técnico | Descrição & Propósito |
| :--- | :--- |
| [`guia-completo-harness-commit-memoria.md`](guia-completo-harness-commit-memoria.md) | Governança operacional de Harness, micro-commits determinísticos, persistência de memória em dois escopos (privado vs equipe), single source of truth para skills e orquestração do ciclo de desenvolvimento em 6 fases. |
| [`guia-graph-engineering.md`](guia-graph-engineering.md) | Manual canônico de Graph Engineering com Graphify: navegação relacional por AST, exclusão estrita de `docs/`, recálculo forçado do zero em mudanças estruturais e hook-guards determinísticos. |
| [`guia-padrao-criacao-adrs.md`](guia-padrao-criacao-adrs.md) | Padrão canônico para criação de Architecture Decision Records (ADRs), definindo os 6 gatilhos objetivos de decisão arquitetural e o template formal em 8 seções em `docs/adr/`. |
| [`semver-versioning-guide.md`](semver-versioning-guide.md) | Especificação técnica de versionamento semântico (SemVer 2.0.0), fluxo de tags Git, mapeamento com Conventional Commits e padronização do arquivo `CHANGELOG.md` (*Keep a Changelog*). |
