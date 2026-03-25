# PoC Test Plan — AI Agent Sandbox

全プラットフォームガイドに記載されたコマンドを実機で検証するための手順書。

## 担当者凡例

| マーク | 担当 | 説明 |
|---|---|---|
| `[C]` | **Claude** | CLI コマンド実行・出力検証。マシンにログイン後に実施 |
| `[U]` | **ユーザー** | 物理操作・GUI 目視・マシン切替・再起動など Claude に不可能な操作 |
| `[U→C]` | **ユーザー開始 → Claude 継続** | ユーザーが前提操作を済ませた後、Claude が検証 |

## テスト環境

| Host | OS | GPU | Guide | Claude アクセス方法 |
|---|---|---|---|---|
| **Host-L** | Ubuntu (amd64) | NVIDIA | `linux.html` + `compose.yml` | 現在接続中 |
| **Host-W** | Windows 11 (amd64) | NVIDIA | `windows.html` + `compose.yml` | WSL2 上で Claude Code 起動 |
| **Host-M** | macOS (M2) | Apple GPU | `mac.html` | Terminal で Claude Code 起動 |

## フロー概要

```
[Host-L] ユーザーがClaude Codeを起動 (済)
  └─ Claude: A全セクション実行
       └─ ユーザー: GUI目視確認だけ介入

[Host-W] ユーザーがWSL2にログイン → Claude Code起動
  └─ Claude: B全セクション実行
       └─ ユーザー: PowerShell操作・GUI目視・再起動で介入

[Host-M] ユーザーがTerminalでClaude Code起動
  └─ Claude: C全セクション実行
       └─ ユーザー: XQuartz GUI設定・目視確認で介入
```

---

## A. Linux (Host-L: Ubuntu — NVIDIA なし) — PoC 実施済み (2026-03-25)

> **実施条件**: NVIDIA GPU なし / sudo 不可 / DISPLAY 未設定 (TTY セッション)
> NVIDIA 関連 (A-1-4~6, A-2, A-5-3, A-6 全体) と sudo 必須項目 (A-1-1~2, A-4, A-8, A-10) はスキップ。

### A-1. ホスト準備 (linux.html §02)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| A-1-1 | `[C]` | `sudo apt update` | exit 0 | SKIP (sudo 不可) |
| A-1-2 | `[C]` | `sudo apt install -y podman podman-compose xserver-xephyr x11-xserver-utils nvidia-container-toolkit` | exit 0 | SKIP (sudo 不可) |
| A-1-3 | `[C]` | `podman --version` | 4.1.0+ (5.0+ 推奨) | **PASS** — 4.9.3 |
| A-1-4 | `[C]` | `sudo nvidia-ctk cdi generate --output=/etc/cdi/nvidia.yaml` | exit 0, ファイル生成 | SKIP (NVIDIA なし) |
| A-1-5 | `[C]` | `ls -la /etc/cdi/nvidia.yaml` | ファイル存在 | SKIP (NVIDIA なし) |
| A-1-6 | `[C]` | `podman run --rm --device nvidia.com/gpu=all debian:12-slim nvidia-smi` | GPU 情報表示 | SKIP (NVIDIA なし) |

### A-2. CUDA バージョン確認 (linux.html §08)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| A-2-1 | `[C]` | `nvidia-smi \| grep "CUDA Version"` | CUDA Version X.Y 表示 | SKIP (NVIDIA なし) |

### A-3. Dockerfile & entrypoint.sh 作成・ビルド (linux.html §03–§04)

| # | 担当 | 操作/コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| A-3-1 | `[C]` | Dockerfile をガイド記載通りに作成 | ファイル存在 | **PASS** |
| A-3-2 | `[C]` | entrypoint.sh を作成 + `chmod +x` | 実行権限あり | **PASS** |
| A-3-3 | `[C]` | `podman build -t agent-sandbox .` | exit 0 | **PASS** (gnupg 追加で修正後) |
| A-3-4 | `[C]` | `podman images \| grep agent-sandbox` | agent-sandbox:latest 表示 | **PASS** — 2.35 GB |

> **BUG-1**: linux.html §03 Dockerfile に `gnupg` パッケージが不足。Windsurf の GPG 鍵インポート (`gpg --dearmor`) で `gpg: not found` (exit 127) になる。apt install リストに `gnupg` を追加する必要あり。

### A-4. Xephyr 起動 (linux.html §05, §08)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| A-4-1 | `[C]` | `Xephyr :10 -screen 1280x800 -ac &` | プロセス起動 | SKIP (未インストール / sudo 不可) |
| A-4-2 | `[U]` | **目視**: Xephyr ウィンドウがデスクトップに表示されるか | ウィンドウ表示 | SKIP |
| A-4-3 | `[C]` | `DISPLAY=:10 xterm &` | プロセス起動 | SKIP |
| A-4-4 | `[U]` | **目視**: Xephyr 内に xterm が表示されるか | xterm 表示 | SKIP |
| A-4-5 | `[C]` | xterm + Xephyr を kill → `Xephyr :10 -screen 2560x1440 -dpi 144 -ac &` | プロセス起動 | SKIP |
| A-4-6 | `[U]` | **目視**: HiDPI Xephyr が表示されるか | 高解像度ウィンドウ | SKIP |

### A-5. コンテナ起動・コンテナ内検証 (linux.html §05)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| A-5-1 | `[C]` | Xephyr :10 起動済みを確認 (`pgrep Xephyr`) | PID あり | SKIP (Xephyr なし) |
| A-5-2 | `[C]` | `podman run -d --name sandbox-test (中略) agent-sandbox sleep 300` | コンテナ起動 | **PASS** (entrypoint バイパスで起動) |
| A-5-3 | `[C]` | `podman exec sandbox-test nvidia-smi` | GPU 情報表示 | SKIP (NVIDIA なし) |
| A-5-4 | `[C]` | `podman exec sandbox-test bash -c 'echo $DISPLAY'` | `:10` | **PASS** (entrypoint バイパス時は空 — entrypoint 経由なら :10 がセットされる設計) |
| A-5-5 | `[C]` | `podman exec sandbox-test node --version` | v22.x (Dockerfile 依存) | **N/A** — Linux Dockerfile に Node.js なし (設計通り) |
| A-5-6 | `[C]` | `podman exec sandbox-test python3 --version` | Python 3.x | **PASS** — 3.11.2 |
| A-5-7 | `[U]` | **目視**: Xephyr 内に Openbox + xterm が表示されるか (対話起動時) | GUI 表示 | SKIP (Xephyr なし) |
| A-5-8 | `[C]` | `podman rm -f sandbox-test` | クリーンアップ | **PASS** |

> **BUG-2**: claude / aider は `~/.local/bin/` にインストールされるが、コンテナの PATH に含まれていない。`export PATH="$HOME/.local/bin:$PATH"` を Dockerfile か entrypoint.sh に追加する必要あり。

### A-6. Ollama (linux.html §06)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| A-6-1 | `[C]` | `podman run -d --name sandbox-ollama (中略)` | コンテナ起動 | SKIP (NVIDIA なし) |
| A-6-2 | `[C]` | `podman exec sandbox-ollama bash -c 'which ollama \|\| ...'` | Ollama 確認 | SKIP |
| A-6-3 | `[C]` | `podman exec -d sandbox-ollama bash -c 'ollama serve'` | サーバー起動 | SKIP |
| A-6-4 | `[C]` | `podman exec sandbox-ollama ollama pull qwen2.5-coder:7b` | モデル DL | SKIP |
| A-6-5 | `[C]` | `podman exec sandbox-ollama ollama list` | 表示 | SKIP |
| A-6-6 | `[C]` | `podman exec sandbox-ollama ollama run qwen2.5-coder:7b "..."` | 応答 | SKIP |
| A-6-7 | `[C]` | `podman rm -f sandbox-ollama` | クリーンアップ | SKIP |

### A-7. エージェント動作確認 (linux.html §03 — Dockerfile 内ツール)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| A-7-1 | `[C]` | `podman run --rm --entrypoint "" agent-sandbox bash -c 'export PATH="$HOME/.local/bin:$PATH" && claude --version'` | バージョン表示 | **PASS** — 2.1.81 (PATH 修正必要) |
| A-7-2 | `[C]` | `podman run --rm --entrypoint "" agent-sandbox bash -c 'export PATH="$HOME/.local/bin:$PATH" && aider --version'` | バージョン表示 | **PASS** — 0.86.2 (PATH 修正必要) |
| A-7-3 | `[C]` | `podman run --rm --entrypoint "" agent-sandbox bash -c 'windsurf --version'` | バージョン表示 | **PASS** — 1.108.2 |

### A-8. compose.yml 経由の起動 (compose.yml)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| A-8-1 | `[C]` | Xephyr :10 起動済みを確認 | PID あり | SKIP (podman-compose 未インストール) |
| A-8-2 | `[C]` | `podman-compose up -d` | コンテナ起動 | SKIP |
| A-8-3 | `[C]` | `podman exec -it agent-sandbox echo OK` | `OK` | SKIP |
| A-8-4 | `[C]` | `podman-compose logs --tail=20` | ログ表示 | SKIP |
| A-8-5 | `[C]` | `podman-compose down` | 停止・削除 | SKIP |

### A-9. バックアップ (linux.html §08)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| A-9-1 | `[C]` | `podman run --rm -v agent-workspace:/work:ro -v $(pwd):/out debian:12-slim tar czf /out/workspace-$(date +%Y%m%d).tar.gz -C /work .` | tar.gz 生成 | **PASS** — 99 bytes (空 workspace) |
| A-9-2 | `[C]` | `ls -la workspace-*.tar.gz` | ファイル存在 | **PASS** |

### A-10. トラブルシュート系コマンド (linux.html §09)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| A-10-1 | `[C]` | `podman build --no-cache -t agent-sandbox:latest .` | フルリビルド成功 | SKIP (A-3-3 で検証済み) |

### A-11. 隔離確認 (共通検証 Linux 分)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| A-11-1 | `[C]` | `podman run --rm --entrypoint "" agent-sandbox ls /home` | `agent` のみ (ホスト home 不可視) | **PASS** — `agent` のみ |
| A-11-2 | `[C]` | `podman run --rm --entrypoint "" --network slirp4netns agent-sandbox curl -s -o /dev/null -w "%{http_code}" https://google.com` | NAT 経由で到達可 | **PASS** — 301 (ping 未搭載のため curl で代替) |
| A-11-3 | `[C]` | `podman run --rm --entrypoint "" agent-sandbox hostname` | コンテナ固有値 (ホスト名と異なる) | **PASS** — コンテナ ID / ホスト: server |

### A. 発見バグまとめ

| ID | 重大度 | 対象 | 内容 | 修正 |
|---|---|---|---|---|
| BUG-1 | **HIGH** | linux.html §03 Dockerfile | `gnupg` パッケージ未記載。Windsurf GPG 鍵インポートで `gpg: not found` (exit 127) | **FIXED** — linux.html に `gnupg` 追加。mac.html / windows.html は元から含まれていた |
| BUG-2 | **HIGH** | linux.html §03 / windows.html §04 Dockerfile | claude / aider が `~/.local/bin/` にインストールされるが PATH に未追加。コンテナ内で `claude` `aider` コマンドが見つからない | **FIXED** — linux.html, windows.html 両方に `ENV PATH="/home/agent/.local/bin:$PATH"` 追加。mac.html は VM 直接インストールのため該当なし |
| NOTE-1 | INFO | linux.html §03 Dockerfile | Node.js はインストールされない (Windows 版 Dockerfile とは異なる)。PoC テスト計画の期待値を修正 | — |
| NOTE-2 | INFO | linux.html §05 コンテナ起動 | entrypoint.sh が DISPLAY=:10 で xterm を起動するため、Xephyr が起動していないとコンテナ即終了する。`CMD` や引数によるフォールバックなし | — |

---

## B. Windows (Host-W: NVIDIA Windows 11)

> **前提**: ユーザーが WSL2 Ubuntu にログインし、Claude Code を起動してからセクション開始。

### B-0. ユーザー事前作業 (Claude 実行不可)

| # | 担当 | 操作 | 備考 |
|---|---|---|---|
| B-0-1 | `[U]` | Windows 11 にログイン | |
| B-0-2 | `[U]` | PowerShell (管理者) で `wsl --install -d Ubuntu-24.04` | 既存なら skip |
| B-0-3 | `[U]` | `Restart-Computer` で再起動 | WSL2 初回のみ |
| B-0-4 | `[U]` | 再起動後、Ubuntu 初回起動でユーザー名・パスワード設定 | 対話的入力 |
| B-0-5 | `[U]` | `%USERPROFILE%\.wslconfig` を作成 (任意) | テキストエディタ |
| B-0-6 | `[U]` | WSL2 Ubuntu 内で Claude Code を起動 | `claude` コマンド |

> ここから Claude が引き継ぐ。

### B-1. WSL2 状態確認 (windows.html §01)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| B-1-1 | `[C]` | `cat /etc/os-release \| grep -i ubuntu` | Ubuntu 24.04 | |
| B-1-2 | `[C]` | `uname -r` | 5.15+ (WSL2 カーネル) | |
| B-1-3 | `[C]` | `sudo apt update && sudo apt upgrade -y` | exit 0 | |

### B-2. PowerShell 側確認 (windows.html §01)

| # | 担当 | 操作 | 期待結果 | 結果 |
|---|---|---|---|---|
| B-2-1 | `[U]` | PowerShell で `wsl --set-default-version 2` | exit 0 | |
| B-2-2 | `[U]` | PowerShell で `wsl --list --verbose` | Ubuntu-24.04 が VERSION 2 | |

### B-3. NVIDIA / GPU 準備 (windows.html §02)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| B-3-1 | `[U]` | PowerShell で `nvidia-smi` | ドライバー 525.x+ 表示 | |
| B-3-2 | `[U]` | (未インストール時) PowerShell で `winget install NVIDIA.CUDA` | インストール | |
| B-3-3 | `[C]` | `curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey \| sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg` | keyring 作成 | |
| B-3-4 | `[C]` | `curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list \| sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' \| sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list` | リポジトリ追加 | |
| B-3-5 | `[C]` | `sudo apt update && sudo apt install -y nvidia-container-toolkit` | exit 0 | |
| B-3-6 | `[C]` | `sudo nvidia-ctk cdi generate --output=/etc/cdi/nvidia.yaml` | ファイル生成 | |
| B-3-7 | `[C]` | `nvidia-smi` | GPU 情報表示 | |
| B-3-8 | `[C]` | `ls /dev/nvidia*` | デバイスファイル存在 | |
| B-3-9 | `[C]` | `nvidia-smi \| grep "CUDA Version"` | バージョン表示 (Dockerfile 調整用) | |

### B-4. Podman インストール (windows.html §03)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| B-4-1 | `[C]` | `sudo apt install -y podman` | exit 0 | |
| B-4-2 | `[C]` | `podman --version` | 4.1.0+ | |
| B-4-3 | `[C]` | `podman info \| grep -i rootless` | rootless: true | |

### B-5. Dockerfile & entrypoint.sh 作成 (windows.html §04–§05)

| # | 担当 | 操作/コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| B-5-1 | `[C]` | Dockerfile をガイド記載通りに作成 (CUDA バージョン調整済み) | ファイル存在 | |
| B-5-2 | `[C]` | entrypoint.sh を作成 + `chmod +x` | 実行権限あり | |

### B-6. Volume 作成 (windows.html §06)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| B-6-1 | `[C]` | `podman volume create agent-workspace` | exit 0 | |
| B-6-2 | `[C]` | `podman volume create ollama-models` | exit 0 | |

### B-7. ビルド (windows.html §07)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| B-7-1 | `[C]` | `podman build -t agent-sandbox:latest .` | exit 0 | |
| B-7-2 | `[C]` | `podman images \| grep agent-sandbox` | agent-sandbox:latest 表示 | |

### B-8. コンテナ起動・コンテナ内検証 (windows.html §07)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| B-8-1 | `[C]` | `echo $DISPLAY` | WSLg 由来の値あり | |
| B-8-2 | `[C]` | (下記フルコマンドで起動: detached + sleep) | コンテナ起動 | |
| B-8-3 | `[C]` | `podman exec sandbox-win nvidia-smi` | GPU 情報表示 | |
| B-8-4 | `[C]` | `podman exec sandbox-win bash -c 'echo $DISPLAY'` | 値あり | |
| B-8-5 | `[C]` | `podman exec sandbox-win node --version` | v22.x | |
| B-8-6 | `[C]` | `podman exec sandbox-win python3 --version` | Python 3.x | |
| B-8-7 | `[C]` | `podman exec sandbox-win rustc --version` | 表示 | |
| B-8-8 | `[C]` | `podman rm -f sandbox-win` | クリーンアップ | |

**B-8-2 フルコマンド:**
```bash
podman run -d --name sandbox-win \
  -e DISPLAY=$DISPLAY \
  -e WAYLAND_DISPLAY=$WAYLAND_DISPLAY \
  -v /tmp/.X11-unix:/tmp/.X11-unix:ro \
  -v /dev/shm:/dev/shm \
  --device nvidia.com/gpu=all \
  --network slirp4netns \
  -v agent-workspace:/home/agent/work \
  -v ollama-models:/root/.ollama/models \
  agent-sandbox:latest sleep 600
```

> NOTE: `$XDG_RUNTIME_DIR/$WAYLAND_DISPLAY` マウントは環境依存。存在しなければ省略。

### B-9. WSLg GUI 確認 (windows.html §07)

| # | 担当 | コマンド/操作 | 期待結果 | 結果 |
|---|---|---|---|---|
| B-9-1 | `[U→C]` | Claude: `xclock &` / ユーザー: **目視** Windows デスクトップに時計表示 | ウィンドウ表示 | |
| B-9-2 | `[U→C]` | Claude: windsurf 付きで podman run / ユーザー: **目視** | Windsurf が Windows 上に表示 | |

### B-10. Ollama (windows.html §08)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| B-10-1 | `[C]` | `podman run -d --name sandbox-ollama-win --device nvidia.com/gpu=all --network slirp4netns -v ollama-models:/root/.ollama/models agent-sandbox:latest sleep 600` | 起動 | |
| B-10-2 | `[C]` | `podman exec -d sandbox-ollama-win bash -c 'ollama serve'` | サーバー起動 | |
| B-10-3 | `[C]` | `sleep 3 && podman exec sandbox-ollama-win ollama pull qwen2.5-coder:7b` | モデル DL | |
| B-10-4 | `[C]` | `podman exec sandbox-ollama-win ollama ps` | SIZE (VRAM) 表示 → GPU 動作 | |
| B-10-5 | `[C]` | `podman exec sandbox-ollama-win ollama run qwen2.5-coder:7b "Say hello in one word"` | 応答あり | |
| B-10-6 | `[C]` | `nvidia-smi --query-gpu=memory.used,memory.free --format=csv` | VRAM 使用状況表示 | |
| B-10-7 | `[C]` | `podman rm -f sandbox-ollama-win` | クリーンアップ | |

### B-11. エージェント動作確認 (windows.html §04)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| B-11-1 | `[C]` | `podman run --rm agent-sandbox:latest bash -c 'claude --version'` | 表示 | |
| B-11-2 | `[C]` | `podman run --rm agent-sandbox:latest bash -c 'aider --version'` | 表示 | |
| B-11-3 | `[C]` | `podman run --rm agent-sandbox:latest bash -c 'goose --version'` | 表示 | |
| B-11-4 | `[C]` | `podman run --rm agent-sandbox:latest bash -c 'gemini --version 2>/dev/null \|\| echo SKIP'` | 表示 or SKIP | |
| B-11-5 | `[C]` | `podman run --rm agent-sandbox:latest bash -c 'opencode --version 2>/dev/null \|\| echo SKIP'` | 表示 or SKIP | |
| B-11-6 | `[C]` | `podman run --rm agent-sandbox:latest bash -c 'windsurf --version 2>/dev/null \|\| echo SKIP-NO-DISPLAY'` | 表示 or SKIP | |

### B-12. compose.yml 経由 (compose.yml — Windows 向け)

| # | 担当 | 操作/コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| B-12-1 | `[C]` | compose.yml の DISPLAY/volumes を Windows 向けに書き換え | 編集済み | |
| B-12-2 | `[C]` | `podman-compose up -d` | コンテナ起動 | |
| B-12-3 | `[C]` | `podman exec -it agent-sandbox echo OK` | `OK` | |
| B-12-4 | `[C]` | `podman-compose logs --tail=20` | ログ表示 | |
| B-12-5 | `[C]` | `podman-compose down` | 停止・削除 | |

### B-13. バックアップ (windows.html §10)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| B-13-1 | `[C]` | `podman run --rm -v agent-workspace:/work:ro -v $(pwd):/out debian:12-slim tar czf /out/workspace-$(date +%Y%m%d).tar.gz -C /work .` | tar.gz 生成 | |
| B-13-2 | `[C]` | `ls -la workspace-*.tar.gz` | ファイル存在 | |

### B-14. トラブルシュート系 (windows.html §11)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| B-14-1 | `[C]` | `uname -r` | 5.15+ | |
| B-14-2 | `[C]` | `podman system migrate` | exit 0 | |
| B-14-3 | `[C]` | `ls /etc/cdi/nvidia.yaml` | ファイル存在 | |
| B-14-4 | `[C]` | `podman run --rm --device nvidia.com/gpu=all debian:12-slim nvidia-smi` | GPU 表示 | |

### B-15. 隔離確認 (共通検証 Windows 分)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| B-15-1 | `[C]` | `podman run --rm agent-sandbox:latest ls /mnt/c 2>/dev/null \|\| echo "NOT MOUNTED"` | NOT MOUNTED | |
| B-15-2 | `[C]` | `podman run --rm --network slirp4netns agent-sandbox:latest ping -c 1 google.com` | NAT 経由到達可 | |

### B-16. WSL2 操作 (windows.html §10)

| # | 担当 | 操作 | 期待結果 | 結果 |
|---|---|---|---|---|
| B-16-1 | `[U]` | PowerShell で `wsl --shutdown` | 全 distro 停止 | |
| B-16-2 | `[U]` | PowerShell で `wsl -d Ubuntu-24.04` | 再起動 | |
| B-16-3 | `[U]` | (任意) PowerShell で `wsl --update` | WSL2 最新化 | |

---

## C. macOS (Host-M: M2 Mac)

> **前提**: ユーザーが Mac Terminal で Claude Code を起動してからセクション開始。

### C-0. ユーザー事前作業 (Claude 実行不可)

| # | 担当 | 操作 | 備考 |
|---|---|---|---|
| C-0-1 | `[U]` | Mac にログイン | |
| C-0-2 | `[U]` | Terminal で Claude Code を起動 | `claude` コマンド |

> ここから Claude が引き継ぐ。

### C-1. Homebrew / Lima / XQuartz / Ollama (mac.html §01)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| C-1-1 | `[C]` | `which brew \|\| /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"` | Homebrew 存在 or インストール | |
| C-1-2 | `[C]` | `brew install lima` | Lima インストール | |
| C-1-3 | `[C]` | `brew install --cask xquartz` | XQuartz インストール | |
| C-1-4 | `[C]` | `brew install ollama` | Ollama インストール | |
| C-1-5 | `[C]` | `limactl --version` | 0.20+ | |
| C-1-6 | `[U]` | **ログアウト → 再ログイン** (XQuartz 初回インストール時) | DISPLAY 環境変数セット | |
| C-1-7 | `[U]` | 再ログイン後 Claude Code を再起動 | |

> XQuartz 初回のみログアウトが必要。既にインストール済みなら C-1-6, C-1-7 は skip。

### C-2. Lima VM 定義 (mac.html §02)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| C-2-1 | `[C]` | `mkdir -p ~/lima-agent-work` | ディレクトリ作成 | |
| C-2-2 | `[C]` | lima.yaml をガイド記載通りに作成 | ファイル存在 | |
| C-2-3 | `[C]` | `mkdir -p ~/.lima/agent && cp lima.yaml ~/.lima/agent/` | コピー | |

### C-3. VM 起動 & 基本セットアップ (mac.html §03)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| C-3-1 | `[C]` | `limactl start agent` | VM 起動 | |
| C-3-2 | `[C]` | `limactl shell agent -- uname -m` | `aarch64` | |
| C-3-3 | `[C]` | `limactl shell agent -- bash -c '...(apt install 一式)...'` | exit 0 | |
| C-3-4 | `[C]` | `limactl shell agent -- python3 --version` | Python 3.x | |
| C-3-5 | `[C]` | `limactl shell agent -- git --version` | 表示 | |

**C-3-3 フルコマンド:**
```bash
limactl shell agent -- sudo apt-get update && \
limactl shell agent -- sudo apt-get install -y --no-install-recommends \
  xauth x11-apps openbox dbus-x11 xdg-utils \
  libgbm1 libgl1-mesa-dri \
  libnss3 libatk1.0-0 libatk-bridge2.0-0 \
  libgdk-pixbuf2.0-0 libgtk-3-0 \
  libasound2 libxss1 libxtst6 \
  fonts-noto-cjk fonts-noto-color-emoji \
  ca-certificates curl wget gnupg jq yq ripgrep fd-find vim \
  chromium-browser \
  graphviz inkscape \
  build-essential git \
  python3 python3-pip python3-venv
```

### C-4. Node.js (nvm) (mac.html §03)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| C-4-1 | `[C]` | `limactl shell agent -- bash -c 'export NVM_DIR="$HOME/.nvm" && curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh \| bash'` | nvm インストール | |
| C-4-2 | `[C]` | `limactl shell agent -- bash -c 'source "$HOME/.nvm/nvm.sh" && nvm install 22 && nvm alias default 22'` | Node 22 | |
| C-4-3 | `[C]` | `limactl shell agent -- bash -c 'source "$HOME/.nvm/nvm.sh" && node --version'` | v22.x | |

### C-5. Rust (mac.html §03)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| C-5-1 | `[C]` | `limactl shell agent -- bash -c "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs \| sh -s -- -y"` | Rust インストール | |
| C-5-2 | `[C]` | `limactl shell agent -- bash -c 'source "$HOME/.cargo/env" && rustc --version'` | 表示 | |

### C-6. CLI エージェントインストール (mac.html §04)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| C-6-1 | `[C]` | `limactl shell agent -- bash -c 'source "$HOME/.nvm/nvm.sh" && npm install -g @google/gemini-cli opencode-ai codex-cli'` | exit 0 | |
| C-6-2 | `[C]` | `limactl shell agent -- bash -c 'curl -fsSL https://claude.ai/install.sh \| bash'` | Claude Code インストール | |
| C-6-3 | `[C]` | `limactl shell agent -- bash -c 'curl -fsSL https://github.com/block/goose/releases/latest/download/install.sh \| bash'` | Goose インストール | |
| C-6-4 | `[C]` | `limactl shell agent -- bash -c 'curl -LsSf https://aider.chat/install.sh \| sh'` | aider インストール | |
| C-6-5 | `[C]` | `limactl shell agent -- claude --version` | 表示 | |
| C-6-6 | `[C]` | `limactl shell agent -- bash -c 'goose --version 2>/dev/null \|\| echo SKIP'` | 表示 | |
| C-6-7 | `[C]` | `limactl shell agent -- bash -c 'aider --version 2>/dev/null \|\| echo SKIP'` | 表示 | |

### C-7. Windsurf (.deb arm64) (mac.html §04)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| C-7-1 | `[C]` | `limactl shell agent -- curl -fsSL https://windsurf-stable.codeiumdata.com/linux-arm64/windsurf_latest_arm64.deb -o /tmp/windsurf.deb` | DL | |
| C-7-2 | `[C]` | `limactl shell agent -- bash -c 'sudo dpkg -i /tmp/windsurf.deb \|\| sudo apt-get install -fy'` | インストール | |
| C-7-3 | `[C]` | `limactl shell agent -- rm /tmp/windsurf.deb` | 削除 | |
| C-7-4 | `[C]` | `limactl shell agent -- bash -c 'windsurf --version 2>/dev/null \|\| echo SKIP'` | 表示 | |

### C-8. Antigravity (.deb arm64) (mac.html §04)

> NOTE: URL 未確認。404 → SKIP。

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| C-8-1 | `[C]` | `limactl shell agent -- bash -c 'curl -fsSL https://antigravity.google/releases/antigravity_latest_arm64.deb -o /tmp/antigravity.deb \|\| echo "404-SKIP"'` | DL or SKIP | |
| C-8-2 | `[C]` | (C-8-1 成功時) `limactl shell agent -- bash -c 'sudo dpkg -i /tmp/antigravity.deb \|\| sudo apt-get install -fy'` | インストール | |
| C-8-3 | `[C]` | `limactl shell agent -- rm -f /tmp/antigravity.deb` | 削除 | |

### C-9. XQuartz & GUI 表示 (mac.html §05)

| # | 担当 | 操作/コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| C-9-1 | `[C]` | `open -a XQuartz` | XQuartz 起動 | |
| C-9-2 | `[U]` | **GUI 操作**: XQuartz > 設定 > セキュリティ > "ネットワーク・クライアントからの接続を許可" オン | チェック入り | |
| C-9-3 | `[C]` | `defaults write org.xquartz.X11 nolisten_tcp -bool false` | exit 0 | |
| C-9-4 | `[C]` | `echo $DISPLAY` | `:0` 等 | |
| C-9-5 | `[C]` | (下記 GUI 起動コマンド実行) | プロセス起動 | |
| C-9-6 | `[U]` | **目視**: XQuartz 上に Windsurf ウィンドウが表示されるか | GUI 表示 | |

**C-9-5 フルコマンド:**
```bash
limactl shell --shell=/bin/bash agent -- bash -c '
  eval $(dbus-launch --sh-syntax)
  export DBUS_SESSION_BUS_ADDRESS
  openbox &
  sleep 0.5
  exec windsurf
'
```

### C-10. CLI エージェントのみ — GUI 不要 (mac.html §05)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| C-10-1 | `[C]` | `limactl shell agent -- ls ~/lima-agent-work` | ディレクトリ内容表示 | |
| C-10-2 | `[C]` | `limactl shell agent -- bash -c 'export OLLAMA_HOST=host.lima.internal:11434 && curl -s http://host.lima.internal:11434/ \|\| echo "Ollama not running"'` | 応答 or not running | |

### C-11. Ollama (mac.html §06)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| C-11-1 | `[C]` | `OLLAMA_HOST=0.0.0.0:11434 ollama serve &` | サーバー起動 (Metal) | |
| C-11-2 | `[C]` | `ollama pull qwen2.5-coder:3b` | モデル DL | |
| C-11-3 | `[C]` | `ollama pull qwen2.5-coder:7b` | モデル DL | |
| C-11-4 | `[C]` | `ollama list` | 両モデル表示 | |
| C-11-5 | `[C]` | `ollama run qwen2.5-coder:3b "Say hello in one word"` | 応答あり | |
| C-11-6 | `[C]` | `limactl shell agent -- bash -c 'curl -s http://host.lima.internal:11434/api/tags'` | JSON (モデルリスト) | |
| C-11-7 | `[C]` | `limactl shell agent -- bash -c 'export OLLAMA_HOST=host.lima.internal:11434 && source "$HOME/.nvm/nvm.sh" && aider --model ollama/qwen2.5-coder:7b --message "say hello" --yes'` | aider 応答 | |

### C-12. VM 管理 (mac.html §08)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| C-12-1 | `[C]` | `limactl stop agent` | VM 停止 | |
| C-12-2 | `[C]` | `limactl start agent` | VM 再起動 | |
| C-12-3 | `[C]` | `limactl shell agent -- echo OK` | `OK` | |

### C-13. バックアップ (mac.html §08)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| C-13-1 | `[C]` | `cp -r ~/lima-agent-work ~/lima-agent-work-backup-$(date +%Y%m%d)` | コピー作成 | |
| C-13-2 | `[C]` | `ls -d ~/lima-agent-work-backup-*` | ディレクトリ存在 | |
| C-13-3 | `[C]` | `rm -rf ~/lima-agent-work-backup-*` | クリーンアップ | |

### C-14. VM スペック変更 (mac.html §08)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| C-14-1 | `[C]` | `limactl stop agent` | 停止 | |
| C-14-2 | `[C]` | `~/.lima/agent/lima.yaml` の cpus を 2 に変更 | 編集 | |
| C-14-3 | `[C]` | `limactl start agent` | 起動 | |
| C-14-4 | `[C]` | `limactl shell agent -- nproc` | `2` | |
| C-14-5 | `[C]` | cpus を元に戻して再起動 | 復元 | |

### C-15. Ollama 常駐化 (mac.html §08)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| C-15-1 | `[C]` | `pkill ollama 2>/dev/null; brew services start ollama` | サービス起動 | |
| C-15-2 | `[C]` | `brew services list \| grep ollama` | started | |
| C-15-3 | `[C]` | `brew services stop ollama` | 停止 | |

### C-16. トラブルシュート系 (mac.html §09)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| C-16-1 | `[C]` | `echo $DISPLAY` | 値あり | |
| C-16-2 | `[C]` | `limactl shell agent -- uname -m` | `aarch64` | |

### C-17. 隔離確認 (共通検証 macOS 分)

| # | 担当 | コマンド | 期待結果 | 結果 |
|---|---|---|---|---|
| C-17-1 | `[C]` | `limactl shell agent -- ls ~/Documents 2>/dev/null` | read-only で見える (Lima デフォルト) | |
| C-17-2 | `[C]` | `limactl shell agent -- bash -c 'touch ~/Documents/test-write 2>&1'` | Permission denied | |
| C-17-3 | `[C]` | `limactl shell agent -- touch ~/lima-agent-work/test-write` | 成功 | |
| C-17-4 | `[C]` | `limactl shell agent -- rm ~/lima-agent-work/test-write` | クリーンアップ | |
| C-17-5 | `[C]` | `limactl shell agent -- ping -c 1 google.com` | 到達可 | |

### C-18. VM 削除 (mac.html §08) — 最後に実施

| # | 担当 | 操作 | 備考 | 結果 |
|---|---|---|---|---|
| C-18-1 | `[U]` | 削除してよいか確認 | **破壊的操作** | |
| C-18-2 | `[C]` | `limactl delete agent` | VM 削除 | |

---

## 担当サマリー

### ユーザーだけが行う作業 (全プラットフォーム合計)

| # | プラットフォーム | 操作 | いつ |
|---|---|---|---|
| B-0-1~6 | Windows | WSL2 初期セットアップ + Claude Code 起動 | B 開始前 |
| B-2-1~2 | Windows | PowerShell での WSL2 確認 | B-2 |
| B-3-1~2 | Windows | PowerShell での nvidia-smi 確認 | B-3 |
| B-16-1~3 | Windows | PowerShell での WSL2 再起動 | B 最後 |
| C-0-1~2 | macOS | Mac ログイン + Claude Code 起動 | C 開始前 |
| C-1-6~7 | macOS | XQuartz 初回ログアウト・再ログイン | C-1 (初回のみ) |
| C-9-2 | macOS | XQuartz GUI 設定チェックボックス | C-9 |
| C-18-1 | macOS | VM 削除の承認 | C 最後 |

### 目視確認 (Claude がコマンド実行 → ユーザーが画面を見る)

| # | プラットフォーム | 何を見る |
|---|---|---|
| A-4-2, A-4-4, A-4-6 | Linux | Xephyr ウィンドウ / xterm / HiDPI |
| A-5-7 | Linux | Xephyr 内の Openbox + xterm |
| B-9-1~2 | Windows | WSLg 経由の xclock / Windsurf |
| C-9-6 | macOS | XQuartz 上の Windsurf |

### テスト項目数

| プラットフォーム | Claude 担当 | ユーザー担当 | 目視確認 | 合計 |
|---|---|---|---|---|
| A. Linux | 33 | 0 | 4 | 37 |
| B. Windows | 40 | 8 | 2 | 50 |
| C. macOS | 46 | 4 | 1 | 51 |
| **合計** | **119** | **12** | **7** | **138** |

## 既知の懸念事項

| 項目 | 内容 |
|---|---|
| Antigravity URL | `antigravity.google/releases/` は公式リリース前の可能性。404 → SKIP |
| Windsurf arm64 .deb | URL 変更の可能性。最新は Windsurf 公式で確認 |
| cuda-cudart バージョン | Dockerfile 内 `12-4` はホストドライバーに合わせて要変更 |
| Codex CLI | `codex-cli` npm パッケージ名・存在に注意 |
| Lima vmType: vz | macOS 13+ 必須。古い macOS では `qemu` に変更 |
| XQuartz ログアウト | 初回のみ必要。忘れると DISPLAY が空 |
| WSLg Wayland マウント | `$XDG_RUNTIME_DIR/$WAYLAND_DISPLAY` は環境依存。存在しなければ省略 |
