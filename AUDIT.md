# AI Agent Sandbox — 監査レポート

> 生成日: 2026-03-24
> 対象ファイル: index.html, linux.html, mac.html, windows.html, isolation-matrix.html, environment-matrix.html, README.md, CLAUDE.md
> 変更: なし（読み取り専用調査）

---

## サマリー

| 項目 | 評価 | 詳細 |
|------|------|------|
| CSS 整合性 | ✅ 優秀 | 全6ファイルで CSS 変数・accent 色が統一 |
| ナビゲーション | ✅ 優秀 | 全リンク正常、active 状態が各ページで正確 |
| Dockerfile 構文 | ✅ 優秀 | ベストプラクティス遵守、L/W 間で一貫 |
| バージョン統一性 | ✅ 優秀 | Node.js 22・CUDA 12.4・NVM v0.40.1 が統一 |
| Google Fonts CDN | ✅ 有効 | HTTP 200 確認済み |
| CLAUDE.md 記述 | ❌ 誤り | フォント名が実装と不一致（後述） |
| Antigravity URL | ⚠️ 未確認 | 公式リリースページ要確認（後述） |
| アクセシビリティ | ⚠️ 不足 | aria 属性・alt 属性がゼロ |
| JS エラー処理 | ⚠️ 軽微 | clipboard API の `.catch()` ハンドラなし |

---

## 1. 指摘事項（要対応）

### 1-1. CLAUDE.md のフォント記述が実装と不一致 ❌

**場所**: `CLAUDE.md` → `## Architecture & Conventions`

```
CLAUDE.md の記載:
  "JetBrains Mono for code blocks, Syne for headings"

実際の実装（全6 HTML ファイル共通）:
  @import: Nunito (400/600/700/800/900) + Klee One (400/600)
  本文:    font-family: 'Nunito', sans-serif
  見出し:  font-family: 'Klee One', cursive
  コード:  font-family: 'Nunito', monospace
```

**対応**: CLAUDE.md の記述を `Klee One for headings, Nunito for body/code` に修正する。

---


### 1-3. JavaScript のエラーハンドラ欠落 ⚠️

**場所**: 全 HTML ファイルの `<script>` 内 `cp()` 関数

```javascript
// 現状（.catch なし）
navigator.clipboard.writeText(text).then(() => {
  btn.textContent = '✓ copied';
  btn.classList.add('ok');
  setTimeout(() => { btn.textContent = 'copy'; btn.classList.remove('ok'); }, 1800);
});

// 推奨（.catch を追加）
navigator.clipboard.writeText(text).then(() => {
  btn.textContent = '✓ copied';
  btn.classList.add('ok');
  setTimeout(() => { btn.textContent = 'copy'; btn.classList.remove('ok'); }, 1800);
}).catch(() => {
  btn.textContent = '✗ failed';
  setTimeout(() => { btn.textContent = 'copy'; }, 1800);
});
```

HTTP 環境（非 HTTPS）や古いブラウザでは Clipboard API が拒否される。現状はサイレント失敗。

---

## 2. アップデート候補（最新バージョン確認）

### 2-1. NVM バージョン

**現状**: `v0.40.1`（全 HTML の Dockerfile 共通）

```bash
# 最新バージョン確認
curl -s https://api.github.com/repos/nvm-sh/nvm/releases/latest | grep tag_name
```

→ 執筆時点で `v0.40.x` が最新系列。定期的に更新を確認すること。

### 2-2. CUDA バージョン

**現状**: `cuda-cudart-12-4 libcublas-12-4`（linux.html・windows.html）

CUDA 12.x 系は定期リリースあり。ドキュメント更新時に最新マイナーバージョンを確認すること。

### 2-3. Node.js バージョン

**現状**: `NODE_VERSION=22`（LTS）

Node.js 22 は 2024年10月に LTS 入り。現時点で適切だが、次の LTS（Node.js 24、2026年4月予定）リリース後に更新を検討。

---

## 3. アクセシビリティ改善（低優先度）

### 3-1. SVG ダイアグラムに代替テキストなし

**場所**: 全プラットフォームページのアーキテクチャ図（`<svg>` 要素）

- `<title>` 要素なし
- `aria-label` なし
- `role="img"` なし

**推奨対応例**:
```html
<svg role="img" aria-label="Linux isolation architecture: Host → Xephyr → Podman container">
  <title>Linux 隔離アーキテクチャ図</title>
  ...
</svg>
```

### 3-2. コピーボタンに `type` 属性なし

**場所**: 全 HTML の `.copy-btn`

```html
<!-- 現状 -->
<button class="copy-btn" onclick="cp(this)">copy</button>

<!-- 推奨 -->
<button type="button" class="copy-btn" onclick="cp(this)" aria-label="コードをコピー">copy</button>
```

---

## 4. 問題なし（確認済み）

- **ナビゲーションリンク**: index ↔ 各プラットフォームページ ↔ 2マトリックスページ、すべて正常
- **CSS accent 色の分離**: Linux=mint, macOS=lavender, Windows=sky で正確に分岐
- **Dockerfile の構成**: `--no-install-recommends` + apt キャッシュ削除 + USER 切り替えで適切
- **entrypoint.sh**: Linux・Windows で完全一致（macOS は Lima VM 内直接実行のため対象外）
- **プラットフォーム別アーキテクチャ対応**: Windsurf を macOS では `arm64`、Linux/Windows では `x86_64` で正しく分岐
- **Google Fonts CDN**: `fonts.googleapis.com` HTTP 200 確認済み
- **相対パス**: 全ファイルで `./filename.html` 形式に統一
- **免責事項**: "Claude 生成・未検証" の注記が README.md・CLAUDE.md に明記済み

---

## 5. 優先度まとめ（既存の問題）

| 優先度 | 対応内容 | 対象ファイル | 状態 |
|--------|----------|-------------|------|
| 高 | CLAUDE.md のフォント記述修正 | `CLAUDE.md` | ✅ 完了 |
| 中 | JS `.catch()` ハンドラ追加 | 全 HTML | ✅ 完了 |
| 中 | 前提条件チェックリスト追加 | 全プラットフォーム HTML | ✅ 完了 |
| 中 | 所要時間・リソース目安追加 | 全プラットフォーム HTML | ✅ 完了 |
| 中 | トラブルシューティング FAQ 追加 | 全プラットフォーム HTML | ✅ 完了 |
| 低 | SVG に `aria-label` / `<title>` 追加 | 全 HTML | 未対応 |
| 低 | コピーボタンに `type="button"` 追加 | 全 HTML | 未対応 |
| 随時 | NVM・CUDA・Node.js バージョンの定期確認 | `linux.html`, `mac.html`, `windows.html` | 随時 |

---

## 6. 実効性評価

各プラットフォームガイドのコマンド・手順を技術的に検証した。

### 合格点

| 手順 | 評価 | 根拠 |
|------|------|------|
| NVIDIA Container Toolkit インストール | ✅ 有効 | 公式推奨形式（dearmor + signed-by）に準拠 |
| CDI 設定（`nvidia-ctk cdi generate`） | ✅ 有効 | 正確なコマンド・出力パス |
| Lima VM（limactl / lima.yaml） | ✅ 有効 | 現行 Lima 仕様に準拠、aarch64 指定も正確 |
| WSL2 + CUDA 統合 | ✅ 有効 | ドライバー=Windows 側、toolkit=WSL2 側の役割分担が正確 |
| `podman run` 引数一式 | ✅ 有効 | ボリューム・DISPLAY・GPU・ネットワーク分離がすべて揃っている |
| NVM インストール URL | ✅ 有効 | `raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh` は有効な GitHub Raw URL |
| Ollama インストール（`ollama.com/install.sh`） | ✅ 有効 | 公式インストーラ・OS/arch 自動検出対応 |
| Goose / aider / Homebrew URL | ✅ 有効 | GitHub releases 標準形式 or 公式インストーラ |

### 懸念点

| 手順 | 評価 | 理由 |
|------|------|------|
| Antigravity インストール URL | ✅ 実機確認済み | ユーザーが実環境で動作を確認 |
| `claude.ai/install.sh` | ⚠️ 要確認 | Claude Code CLI の公式インストーラ URL として想定されているが、実在未確認 |
| Windsurf `.deb` URL | ⚠️ 要確認 | `windsurf-stable.codeiumdata.com` は Codeium 社のドメインだが、パスの形式が変更される可能性あり |
| `gpuMemoryFraction=0.8`（.wslconfig） | ⚠️ 参考値 | ドライバー・用途により最適値が異なる。コメントで注記推奨 |

**総合実効性**: セットアップ手順の骨格は正確。ただし Antigravity・Claude Code CLI の URL は AI 生成ドキュメントの限界として、実際に試す前に公式サイトで要確認。

---

## 7. 追加すべきコンテンツ

現在のサイトに存在しない、有用性の高いコンテンツ候補。

### 7-1. トラブルシューティング・FAQ（最優先）

現状はトラブル対応がほぼゼロ。初めて試すユーザーが最も詰まる箇所。

```
想定 FAQ 例:

Q: "DISPLAY not set" エラーが出る
A: macOS → XQuartz が起動しているか確認: open -a XQuartz; echo $DISPLAY
   Linux  → Xephyr :10 が起動しているか確認: ps aux | grep Xephyr

Q: GPU が認識されない（コンテナ内で nvidia-smi が失敗）
A: ホスト側で CDI が生成されているか確認: ls /etc/cdi/nvidia.yaml
   Podman バージョンが 4.1.0+ であるか確認: podman --version

Q: Ollama のモデル呼び出しが遅い / タイムアウト
A: モデルが VRAM に収まっているか確認: nvidia-smi
   コンテナのメモリ制限に引っかかっていないか: podman stats

Q: Lima VM が起動しない（macOS）
A: limactl list でステータス確認
   limactl start --debug agent でログ確認

Q: WSL2 内から Windows 側の GPU が見えない
A: Windows 側の NVIDIA ドライバーが 525.x+ か確認
   PowerShell で: nvidia-smi
```

### 7-2. 前提条件チェックリスト

各プラットフォームページの冒頭に配置すると親切。

```
Linux チェックリスト（例）:
- [ ] Ubuntu 22.04 / 24.04 LTS
- [ ] RAM: 16GB 以上（7B モデル + コンテナ + ホスト）
- [ ] ディスク: 100GB 以上の空き（モデル: 2-30GB + イメージ: 5GB）
- [ ] NVIDIA GPU（CUDA Compute Capability 5.0+）
- [ ] Podman 4.1.0 以上: podman --version
- [ ] インターネット接続（初期ダウンロード: 約 10-20GB）
- [ ] sudo 権限（CUDA ドライバーのインストール用）
```

### 7-3. 所要時間・リソース目安

```
作業時間の目安:
  ホスト準備（CUDA / Podman等）: 30〜60分
  Dockerfile ビルド:             5〜15分（回線・PC 性能次第）
  モデルダウンロード（7B）:       接続速度依存（100Mbps で約 3〜5分）
  モデルダウンロード（13B）:      同上で 10〜15分
  初回起動（キャッシュ作成）:     2〜5分

ディスク使用量:
  Debian slim イメージ:   ~100MB
  フルセットアップ後:     ~3GB（ツール込み）
  Ollama 7B モデル:       ~4GB
  Ollama 13B モデル:      ~8GB
  Ollama 70B モデル:      ~40GB
```

### 7-4. メンテナンス・更新手順

セットアップ後のライフサイクルが一切記述されていない。

```bash
# イメージの再ビルド（Dockerfile 更新後）
podman build --no-cache -t agent-sandbox:latest .

# Ollama のアップデート
ollama pull qwen2.5-coder:7b   # モデルを最新版に更新

# CUDA バージョン更新時
# 1. linux.html の Dockerfile を CUDA xx-y に更新
# 2. ホスト: sudo apt update && sudo apt upgrade nvidia-container-toolkit
# 3. CDI 再生成: sudo nvidia-ctk cdi generate --output=/etc/cdi/nvidia.yaml
# 4. コンテナ再ビルド

# ボリューム確認・クリーンアップ
podman volume ls
podman volume rm agent-workspace   # 作業内容を削除してリセット
podman system prune                # 未使用イメージ・キャッシュ削除
```

### 7-5. ログ確認方法

```bash
# コンテナのログ確認
podman logs agent-sandbox
podman logs -f agent-sandbox          # リアルタイム追従
podman logs --tail 200 agent-sandbox  # 最後 200 行

# Ollama のログ（コンテナ内）
journalctl -u ollama -f

# コンテナ実行中の状態確認
podman ps
podman stats agent-sandbox
podman exec agent-sandbox nvidia-smi  # GPU 使用状況
```

### 7-6. ボリューム管理・バックアップ

```bash
# 作業ディレクトリのバックアップ
podman volume export agent-workspace | gzip > workspace-backup-$(date +%Y%m%d).tar.gz

# リストア
gzip -dc workspace-backup-20260101.tar.gz | podman volume import agent-workspace -

# モデルキャッシュは再ダウンロードで復元可能なので通常バックアップ不要
# 必要なら同様に export/import

# 完全削除（環境リセット）
podman volume rm agent-workspace ollama-models
podman image rm agent-sandbox:latest
```

### 7-7. セキュリティ強化オプション

現状は基本的な隔離のみ。より厳格にしたいユーザー向け。

```bash
# CPU・メモリの上限設定
podman run \
  --memory 8g \
  --memory-swap 8g \
  --cpus 4 \
  --pids-limit 512 \
  ...

# read-only ルートファイルシステム（作業ディレクトリ以外を書き込み禁止）
podman run \
  --read-only \
  --tmpfs /tmp \
  --tmpfs /run \
  -v agent-workspace:/home/agent/work \
  ...

# ネットワーク完全遮断（ローカル LLM のみ使用する場合）
podman run \
  --network none \
  ...
```

### 7-8. 複数エージェント同時起動

```bash
# 例: Claude Code + Windsurf + 共有 Ollama
podman volume create ollama-models  # 共有モデルボリューム

# Claude Code コンテナ
podman run -d --name claude-sandbox \
  -v claude-workspace:/home/agent/work \
  -v ollama-models:/root/.ollama/models \
  --network slirp4netns \
  agent-sandbox:latest

# Windsurf コンテナ（別 DISPLAY でもOK）
podman run -d --name windsurf-sandbox \
  -v windsurf-workspace:/home/agent/work \
  -v ollama-models:/root/.ollama/models \  # 同じモデルを共有
  -e DISPLAY=:11 \
  --network slirp4netns \
  agent-sandbox:latest

# 注意: Ollama が同時に2つのコンテナから呼ばれるとメモリが倍消費される
```

### 7-9. 各 AI エージェントの特徴比較

`index.html` にエージェント選択の判断材料がほぼない。

| エージェント | 形態 | GUI | ローカル LLM | 主用途 |
|------------|------|-----|------------|--------|
| Claude Code | CLI | なし | ❌（Anthropic API） | コード生成・リファクタ |
| Windsurf | Electron IDE | あり | ✅（Ollama 連携可） | フル IDE 開発 |
| Antigravity | ブラウザ操作型 | あり | 未確認 | Web 自動化 |
| aider | CLI | なし | ✅（Ollama 連携可） | Git 統合・コードレビュー |
| Goose | CLI/GUI | 両方 | ✅（Ollama 連携可） | 汎用エージェント |

### 7-10. コスト比較（クラウド API vs ローカル LLM）

```
クラウド API:
  Anthropic Claude Sonnet: ~$0.003 / 1K input tokens
  OpenAI GPT-4o:           ~$0.005 / 1K input tokens
  → 1日 100 往復の開発なら月 $10〜$50 程度

ローカル LLM（Ollama）:
  初期投資: GPU（RTX 4090: 約 20 万円 / Mac M2 Pro 搭載機など）
  ランニングコスト: 電気代のみ（GPU 300W × 8h/日 × 30日 ≒ 720円/月）
  → 長期・大量利用ほどコスト優位

推奨戦略:
  開発中・プロトタイプ: ローカル Ollama（コスト0、オフライン可）
  本番品質が必要な場面: クラウド API（最新モデル）
```

### 7-11. アンインストール手順

環境を完全にクリーンアップする手順がない。

```bash
# === Linux 完全削除 ===
# コンテナ・ボリューム・イメージ
podman rm -f agent-sandbox
podman volume rm agent-workspace ollama-models
podman image rm agent-sandbox:latest
podman system prune -a

# Podman 本体
sudo apt remove podman

# Xephyr
sudo apt remove xserver-xephyr

# NVIDIA Container Toolkit
sudo apt remove nvidia-container-toolkit
sudo rm /etc/apt/sources.list.d/nvidia-container-toolkit.list
sudo rm /etc/cdi/nvidia.yaml

# === macOS 完全削除 ===
limactl stop agent
limactl delete agent
brew uninstall lima xquartz

# === Windows 完全削除 ===
# WSL2 内で上記 Linux 手順を実行してから:
wsl --unregister Ubuntu-24.04   # WSL ディストリビューション削除
```

### 7-12. ワンコマンド環境チェックスクリプト

セットアップ前後の確認用。現在は存在しない。

```bash
#!/bin/bash
# check-env.sh — 環境前提条件チェック
echo "=== AI Agent Sandbox 環境チェック ==="
echo "OS:      $(uname -s) $(uname -m)"
echo "Podman:  $(podman --version 2>/dev/null || echo 'NOT FOUND')"
echo "GPU:     $(nvidia-smi --query-gpu=name --format=csv,noheader 2>/dev/null || echo 'なし / 確認不可')"
echo "RAM:     $(free -h | awk '/Mem:/{print $2}')"
echo "ディスク: $(df -h . | awk 'NR==2{print $4 " 空き"}')"
echo "DISPLAY: ${DISPLAY:-未設定}"
echo "Ollama:  $(ollama --version 2>/dev/null || echo 'NOT FOUND')"
echo "======================================"
```

---

## 8. 追加コンテンツ 優先度まとめ

| 優先度 | コンテンツ | 新規ページ or 既存ページへの追記 |
|--------|-----------|-------------------------------|
| ⭐⭐⭐ 高 | トラブルシューティング・FAQ | 新規 `troubleshoot.html` or 各ページ末尾 |
| ⭐⭐⭐ 高 | 前提条件チェックリスト | 各プラットフォームページ冒頭 |
| ⭐⭐⭐ 高 | 所要時間・リソース目安 | 各プラットフォームページ冒頭 |
| ⭐⭐ 中 | メンテナンス・更新手順 | 各プラットフォームページ末尾 |
| ⭐⭐ 中 | ログ確認・ボリューム管理 | 各プラットフォームページ末尾 |
| ⭐⭐ 中 | セキュリティ強化オプション | 各プラットフォームページ or `isolation-matrix.html` |
| ⭐⭐ 中 | アンインストール手順 | 各プラットフォームページ末尾 |
| ⭐⭐ 中 | エージェント特徴比較表 | `index.html` or 新規 |
| ⭐ 低 | 複数エージェント同時起動 | 新規 `multi-agent.html` |
| ⭐ 低 | コスト比較 | `index.html` の補足 |
| ⭐ 低 | ワンコマンド診断スクリプト | 各プラットフォームページ or `check-env.sh` として配布 |
| ⭐ 低 | テスト済み環境の明記 | 各プラットフォームページ冒頭 |
