# AI Agent Sandbox

AI エージェントをホスト環境から隔離して安全に動かすためのセットアップガイド。

> このドキュメントは Claude / GPT / Gemini が共同（？）で生成・改良しました。実環境での検証は一部のみです。

## Docs

**[https://mikalulu.github.io/ai-agent-sandbox/](https://mikalulu.github.io/ai-agent-sandbox/)**

| OS | 構成 | ガイド |
|---|---|---|
| Linux (amd64) | Podman + Xephyr + NVIDIA CDI | [linux.html](./linux.html) |
| macOS (Apple Silicon) | Lima VM + XQuartz + Ollama Metal | [mac.html](./mac.html) |
| Windows | WSL2 + Podman + WSLg + CUDA | [windows.html](./windows.html) |

## 対応ツール

Claude Code / Windsurf / Antigravity / Kiro / Goose / aider / Gemini CLI / Codex CLI / OpenCode

## Files

| ファイル | 内容 |
|---|---|
| `index.html` | ランディングページ |
| `linux.html` | Linux セットアップガイド |
| `mac.html` | macOS セットアップガイド |
| `windows.html` | Windows セットアップガイド |
| `ai-tools-guide.html` | ツール選択ガイド・機能比較 |
| `isolation-matrix.html` | 隔離手法マトリクス（LXC / Docker / Podman 比較含む） |
| `environment-matrix.html` | ホスト・コンテナ環境リファレンス |
| `compose.yml` | Podman / Docker Compose 定義 |
| `COMMIT_LOG_JA.md` | コミットメッセージ日本語意訳 |

## Goals

- ホスト FS 非公開
- Display 分離（Xephyr / XQuartz / WSLg）
- GPU パススルー（NVIDIA CDI / Metal）
- ネットワーク隔離（slirp4netns / NAT）
- API キー・OAuth トークンの安全な注入

## Check

```
python3 scripts/check_docs.py
```
