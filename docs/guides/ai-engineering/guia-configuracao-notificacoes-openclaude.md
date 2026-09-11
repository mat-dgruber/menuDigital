# 🔔 Guia de Configuração: Notificações Desktop no OpenClaude e Claude Code via `terminal-notifier`

Este guia documenta a configuração de **notificações de desktop nativas e clicáveis no macOS** para o **OpenClaude** e **Claude Code**, utilizando **exclusivamente o `terminal-notifier` diretamente no `settings.json`**, sem necessidade de scripts Bash auxiliares (`.sh`).

---

## 1. Pré-Requisitos

Instale o `terminal-notifier` e o `jq` via Homebrew:

```bash
brew install terminal-notifier jq
```

---

## 2. Configuração Direta no `settings.json` (Sem Scripts)

Tanto o OpenClaude quanto o Claude Code possuem o hook de evento `Notification`. Quando o agente finaliza uma tarefa ou solicita permissão/atenção do usuário, ele emite um payload JSON no `stdin` contendo o campo `message`.

Configure diretamente no seu arquivo de preferências:
- **Global:** `~/.claude/settings.json` ou `~/.openclaude/settings.json`
- **Por Projeto:** `.claude/settings.json` (na raiz do repositório)

### Configuração Padrão (Notificação Sonora e Clicável)

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.message // \"OpenClaude requer atenção\"' | terminal-notifier -title 'OpenClaude' -sound default"
          }
        ]
      }
    ]
  }
}
```

---

## 3. Foco Automático da Janela ao Clicar (`-activate`)

Para que ao clicar no banner da notificação o macOS foque imediatamente no seu editor ou terminal preferido, adicione a flag `-activate <bundle-id>` diretamente no comando:

### Opções por IDE / Terminal:

| Ferramenta | Bundle ID (`-activate`) | Comando Inline no `settings.json` |
| :--- | :--- | :--- |
| **VS Code** | `com.microsoft.VSCode` | `jq -r '.message // \"Atenção\"' \| terminal-notifier -title 'OpenClaude' -sound default -activate com.microsoft.VSCode` |
| **Cursor** | `com.todesktop.23031312ki9naea` | `jq -r '.message // \"Atenção\"' \| terminal-notifier -title 'OpenClaude' -sound default -activate com.todesktop.23031312ki9naea` |
| **Ghostty** | `com.mitchellh.ghostty` | `jq -r '.message // \"Atenção\"' \| terminal-notifier -title 'OpenClaude' -sound default -activate com.mitchellh.ghostty` |
| **iTerm2** | `com.googlecode.iterm2` | `jq -r '.message // \"Atenção\"' \| terminal-notifier -title 'OpenClaude' -sound default -activate com.googlecode.iterm2` |
| **Apple Terminal** | `com.apple.Terminal` | `jq -r '.message // \"Atenção\"' \| terminal-notifier -title 'OpenClaude' -sound default -activate com.apple.Terminal` |

### Exemplo Completo com Ativação do VS Code:

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.message // \"OpenClaude requer atenção\"' | terminal-notifier -title 'OpenClaude' -sound default -activate com.microsoft.VSCode"
          }
        ]
      }
    ]
  }
}
```

---

## 4. Personalizações Úteis do `terminal-notifier`

Você pode combinar argumentos nativos do `terminal-notifier` no próprio comando inline:

- `-sound <nome>`: Altera o efeito sonoro do macOS (ex: `Glass`, `Ping`, `Submarine`, `Hero`, `default`).
- `-subtitle <texto>`: Adiciona um subtítulo fixo ao banner (ex: `-subtitle 'Sessão de IA'`).
- `-group <id>`: Agrupa notificações com o mesmo identificador substituindo as anteriores para evitar acúmulo no Centro de Notificações (ex: `-group openclaude`).

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.message // \"Ação concluída\"' | terminal-notifier -title 'OpenClaude' -subtitle 'Aviso de Agente' -group 'openclaude' -sound 'Glass' -activate com.microsoft.VSCode"
          }
        ]
      }
    ]
  }
}
```

---

## 5. Como Testar no Terminal

Para simular o disparo de uma notificação do hook sem precisar esperar o agente falar:

```bash
echo '{"message": "Tarefa executada com sucesso! Teste de notificação direta."}' | jq -r '.message' | terminal-notifier -title 'OpenClaude' -sound default -activate com.apple.Terminal
```
