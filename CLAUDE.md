# CLAUDE.md

Claude Code がこのリポジトリで作業する際のガイド。

## プロジェクト概要

AIエージェント（Claude Code, Windsurf, Antigravity, Kiro, Goose, aider, Gemini CLI, Codex CLI, OpenCode）をコンテナ／VMでホストから隔離して動かすための**静的ドキュメントサイト**。ビルドシステムやランタイム依存はない。

公開先: `https://mikalulu.github.io/ai-agent-sandbox/`

## ファイル構成

| ファイル | 内容 |
|---|---|
| `index.html` | ランディングページ（プラットフォーム選択UI） |
| `linux.html` | Linux ガイド: Podman + Xephyr + NVIDIA CDI |
| `mac.html` | macOS ガイド: Lima VM + XQuartz + Ollama Metal |
| `windows.html` | Windows ガイド: WSL2 + Podman + WSLg + CUDA |
| `ai-tools-guide.html` | ツール選択ガイド・機能比較 |
| `isolation-matrix.html` | 隔離手法マトリクス（LXC / Docker / Podman 比較含む） |
| `environment-matrix.html` | ホスト・コンテナ環境リファレンス |
| `compose.yml` | Podman / Docker Compose 定義（Linux/Windows） |
| `assets/` | `favicon.svg`, `site.css`, `site.js` |
| `examples/` | `Dockerfile`, `entrypoint.sh` |
| `scripts/check_docs.py` | ドキュメント整合性チェック |
| `README.md` | 日本語の総合インデックス |
| `COMMIT_LOG_JA.md` | コミットメッセージ日本語意訳 |
| `GEMINI.md` | Gemini CLI 用ガイド |
| `codex.md` | Codex CLI 用ガイド |
| `AUDIT.md` / `gemini_audit.md` | 監査・レビュー記録 |
| `POC_TEST_PLAN.md` | PoC テスト計画 |

## 設計・規約

各プラットフォームガイド（`linux.html`, `mac.html`, `windows.html`）は共通構造:
1. アーキテクチャ図
2. ホスト準備（依存パッケージ、ドライバ）
3. Dockerfile 仕様
4. エントリポイントスクリプト
5. モデルキャッシュ用ボリューム
6. ビルド・起動コマンド
7. モデル管理・隔離検証

**HTML/CSS の共通パターン:**
- CSS カスタムプロパティによるダーク/ライト配色
- 見出し: Klee One、本文・コード: Nunito
- レスポンシブグリッド、コールアウトボックス、プラットフォームバッジ

## 注意

> ドキュメントは Claude / GPT / Gemini が共同で生成しており、実環境での検証は一部のみ。参考資料として扱うこと。
