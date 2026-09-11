#!/usr/bin/env python3
"""
Script de automação para gerar e manter atualizado o sumário do repositório de ADRs
em docs/adr/README.md, ordenado cronologicamente por número e data.
Compatível com qualquer repositório e stack.
"""

import os
import re
import sys
from pathlib import Path


def resolver_diretorio_adrs() -> Path:
    """Localiza o diretório docs/adr relativo ao repositório ou diretório corrente."""
    candidatos = [
        Path.cwd() / "docs" / "adr",
        Path(__file__).resolve().parent.parent.parent.parent / "docs" / "adr",
    ]
    for c in candidatos:
        if c.exists() and c.is_dir():
            return c
    # Default fallback
    return Path.cwd() / "docs" / "adr"


def extrair_metadados_adr(caminho_arquivo: Path) -> dict:
    conteudo = caminho_arquivo.read_text(encoding="utf-8")
    nome_arquivo = caminho_arquivo.name

    # Extrai o número sequencial de 4 dígitos
    num_match = re.match(r"^(\d{4})-", nome_arquivo)
    num = num_match.group(1) if num_match else "0000"

    # Extrai o título principal (# ADR 0000: ...)
    titulo_match = re.search(r"^# ADR \d{4}:\s*(.+)$", conteudo, re.MULTILINE)
    titulo = titulo_match.group(1).strip() if titulo_match else nome_arquivo

    # Extrai o Status e a Data
    status_match = re.search(
        r"\*\*Status\*\*\s*\|\s*(\*\*[^*]+\*\*|\[[^\]]+\]|[A-Za-zÀ-ÿ]+)\s*(?:\(([^)]+)\))?",
        conteudo,
    )
    if status_match:
        status_raw = status_match.group(1).replace("*", "").replace("[", "").replace("]", "").strip()
        data_str = status_match.group(2).strip() if status_match.group(2) else "-"
    else:
        status_raw = "Proposta"
        data_str = "-"

    # Extrai o número de revisões no log de manutenção HTML
    revisoes = len(re.findall(r"^\d{4}-\d{2}-\d{2}\s*\|", conteudo, re.MULTILINE))

    return {
        "numero": num,
        "arquivo": nome_arquivo,
        "titulo": titulo,
        "status": status_raw,
        "data": data_str,
        "revisoes": revisoes,
    }


def gerar_indice(diretorio_adrs: Path = None):
    adr_dir = diretorio_adrs or resolver_diretorio_adrs()
    readme_path = adr_dir / "README.md"

    if not adr_dir.exists():
        adr_dir.mkdir(parents=True, exist_ok=True)

    arquivos_adr = sorted(
        [f for f in adr_dir.glob("*.md") if f.name != "README.md" and re.match(r"^\d{4}-.*\.md$", f.name)]
    )

    linhas = [
        "# 📚 Repositório Canônico de ADRs (Architecture Decision Records)",
        "",
        "> **Governança Arquitetural:** Índice consolidado das decisões arquiteturais tomadas no repositório, ordenadas cronologicamente por data de origem.",
        "",
        "| ADR | Título da Decisão | Status | Data de Origem | Revisões no Changelog |",
        "| :---: | :--- | :---: | :---: | :---: |",
    ]

    for arq in arquivos_adr:
        meta = extrair_metadados_adr(arq)
        badge_status = f"`{meta['status']}`"
        revisoes_str = f"{meta['revisoes']} evento(s)" if meta["revisoes"] > 0 else "Inicial"
        linhas.append(
            f"| [{meta['numero']}]({meta['arquivo']}) | **{meta['titulo']}** | {badge_status} | {meta['data']} | {revisoes_str} |"
        )

    linhas.append("")
    linhas.append("---")
    linhas.append(
        "_Índice gerado automaticamente via skill `forensic-adr-recovery` conforme diretrizes do padrão canônico v2.0.0._"
    )

    readme_path.write_text("\n".join(linhas) + "\n", encoding="utf-8")
    print(f"✅ Índice atualizado com sucesso em {readme_path} ({len(arquivos_adr)} ADRs catalogadas).")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] in ("--help", "-h"):
        print("Uso: python3 generate_adr_index.py [caminho_para_docs_adr]")
        sys.exit(0)
    caminho = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    gerar_indice(caminho)
