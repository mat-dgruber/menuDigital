#!/usr/bin/env python3
"""
Linter de conformidade arquitetural para ADRs.
Valida:
1. Padrão estrito de nomenclatura: docs/adr/[0001-9999]-[kebab-case].md
2. Sequenciamento cronológico ininterrupto sem lacunas numéricas.
3. Presença obrigatória do cabeçalho HTML 'LOG DE MANUTENÇÃO DE DOCUMENTAÇÃO'.
4. Presença das seções canônicas mínimas e tabela de metadados.
Compatível com qualquer CI/CD (GitHub Actions, GitLab CI, CloudBuild, Azure Pipelines).
"""

import os
import re
import sys
from pathlib import Path


def resolver_diretorio_adrs() -> Path:
    candidatos = [
        Path.cwd() / "docs" / "adr",
        Path(__file__).resolve().parent.parent.parent.parent / "docs" / "adr",
    ]
    for c in candidatos:
        if c.exists() and c.is_dir():
            return c
    return Path.cwd() / "docs" / "adr"


def validar_conformidade_adrs(diretorio_adrs: Path = None):
    adr_dir = diretorio_adrs or resolver_diretorio_adrs()

    if not adr_dir.exists():
        print(f"❌ Diretório de ADRs {adr_dir} não existe.")
        sys.exit(1)

    arquivos = [f for f in adr_dir.glob("*.md") if f.name != "README.md"]

    if not arquivos:
        print("ℹ️ Nenhuma ADR encontrada para validar no diretório.")
        sys.exit(0)

    erros = []
    numeros_encontrados = []

    for arq in sorted(arquivos):
        nome = arq.name

        # 1. Validação de Nomenclatura (4 dígitos + kebab-case)
        match_nome = re.match(r"^(\d{4})-([a-z0-9-]+)\.md$", nome)
        if not match_nome:
            erros.append(
                f"[{nome}] Nomenclatura inválida. Deve seguir o padrão '0000-kebab-case.md' em minúsculas e sem caracteres especiais."
            )
            continue

        numero = int(match_nome.group(1))
        numeros_encontrados.append(numero)

        conteudo = arq.read_text(encoding="utf-8")

        # 2. Cabeçalho HTML de Log de Manutenção
        if "LOG DE MANUTENÇÃO DE DOCUMENTAÇÃO" not in conteudo:
            erros.append(f"[{nome}] Cabeçalho HTML 'LOG DE MANUTENÇÃO DE DOCUMENTAÇÃO' ausente no topo.")

        # 3. Título Canônico (# ADR 0000:)
        if not re.search(r"^# ADR \d{4}:", conteudo, re.MULTILINE):
            erros.append(f"[{nome}] Título principal não segue o padrão '# ADR {match_nome.group(1)}: [Título]'.")

        # 4. Tabela de Metadados
        if "**Status**" not in conteudo or "**Decisores**" not in conteudo:
            erros.append(f"[{nome}] Tabela de metadados incompleta (Status e Decisores são obrigatórios).")

        # 5. Seção Decisão de Arquitetura
        if "## 2. Decisão de Arquitetura" not in conteudo:
            erros.append(f"[{nome}] Seção obrigatória '## 2. Decisão de Arquitetura' ausente.")

    # 6. Validação de Sequenciamento Numérico Ininterrupto
    if numeros_encontrados:
        numeros_ordenados = sorted(numeros_encontrados)
        primeiro = numeros_ordenados[0]
        ultimo = numeros_ordenados[-1]
        esperados = list(range(primeiro, ultimo + 1))
        faltantes = set(esperados) - set(numeros_ordenados)

        if faltantes:
            formatados = [f"{n:04d}" for n in sorted(faltantes)]
            erros.append(f"Lacuna na numeração sequencial de ADRs! Números faltantes: {formatados}")

    if erros:
        print("\n❌ Foram encontradas inconformidades no repositório de ADRs:")
        for e in erros:
            print(f"  - {e}")
        sys.exit(1)

    print(f"✅ Todas as {len(arquivos)} ADRs estão em estrita conformidade com o padrão canônico!")
    sys.exit(0)


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] in ("--help", "-h"):
        print("Uso: python3 validate_adrs.py [caminho_para_docs_adr]")
        sys.exit(0)
    caminho = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    validar_conformidade_adrs(caminho)
