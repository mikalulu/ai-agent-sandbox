# AI Agent Sandbox

Podman / Lima / WSL2 を使って AI エージェント（Windsurf・Antigravity・Claude Code 等）をホスト環境から隔離して動かすための構築手順書。Linux・macOS・Windows の 3 プラットフォームに対応し、ホスト FS 非公開・Display 分離・GPU パススルーを目標とする。

> **注意:** この手順書は [Claude Sonnet 4.6](https://www.anthropic.com/claude) により生成されたものであり、実環境での動作検証は行っていません。参考資料としてご利用ください。

---

## Docs

📄 **[https://mikalulu.github.io/ai-agent-sandbox/](https://mikalulu.github.io/ai-agent-sandbox/)**

| | OS | 構成 |
|---|---|---|
| [Linux](./linux.html) | Ubuntu + Wayland | Podman + Xephyr + NVIDIA CDI |
| [macOS](./mac.html) | Apple Silicon | Lima VM + XQuartz + Ollama Metal |
| [Windows](./windows.html) | Windows 11 | WSL2 + Podman + WSLg + CUDA |

---

*Generated with [Claude Sonnet 4.6](https://www.anthropic.com/claude)*
