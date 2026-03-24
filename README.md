# AI Agent Sandbox

AI エージェント（Claude Code・Windsurf・Antigravity・Gemini CLI 等）をホスト環境から隔離して安全に動かすためのセットアップガイド。

> **Note:** このドキュメントは AI（Claude Sonnet / Opus）によって生成・改良されました。実環境での検証は一部のみです。

## Docs

**[https://mikalulu.github.io/ai-agent-sandbox/](https://mikalulu.github.io/ai-agent-sandbox/)**

| OS | 構成 | ガイド |
|---|---|---|
| Linux | Podman + Xephyr + NVIDIA CDI | [linux.html](./linux.html) |
| macOS | Lima VM + XQuartz + Ollama Metal | [mac.html](./mac.html) |
| Windows | WSL2 + Podman + WSLg + CUDA | [windows.html](./windows.html) |

## Files

| ファイル | 内容 |
|---|---|
| `index.html` | ランディングページ（OS 選択・クイックスタート） |
| `linux.html` | Linux セットアップガイド |
| `mac.html` | macOS セットアップガイド |
| `windows.html` | Windows セットアップガイド |
| `ai-tools-guide.html` | AI エージェント選択ガイド＆機能比較 |
| `isolation-matrix.html` | プラットフォーム別隔離アーキテクチャ比較 |
| `environment-matrix.html` | ホストシェル＆コンテナ環境リファレンス |
| `compose.yml` | Podman / Docker Compose 定義 |

## Goals

- ホスト FS 非公開
- Display 分離（Xephyr / XQuartz / WSLg）
- GPU パススルー（NVIDIA CDI / Metal）
- ネットワーク隔離（slirp4netns / NAT）
