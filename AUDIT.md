# AI Agent Sandbox — 監査レポート

> 最終更新: 2026-03-25
> 対象ファイル: index.html, linux.html, mac.html, windows.html, isolation-matrix.html, environment-matrix.html, ai-tools-guide.html, README.md, CLAUDE.md

---

## サマリー

| 項目 | 評価 | 詳細 |
|------|------|------|
| CSS 整合性 | ✅ 優秀 | 全ファイルで CSS 変数・accent 色が統一 |
| ナビゲーション | ✅ 優秀 | 全リンク正常、active 状態が各ページで正確 |
| Dockerfile 構文 | ✅ 優秀 | ベストプラクティス遵守 |
| バージョン統一性 | ✅ 優秀 | Node.js 22・CUDA 12.4・NVM v0.40.1 が統一 |
| install.sh スクリプト | ✅ 修正済 | `claude.ai/install.sh \| bash` に修正（bash-only 構文）|
| zstd パッケージ | ✅ 修正済 | apt-get install に追加（Ollama インストーラ必須） |
| マトリックスページ | ✅ 修正済 | 801749b から包括的バージョン（787/577行）を復元 |
| スタックアイコン | ✅ 修正済 | ⬡ → 適切な emoji に置換（📦 🎮 🖥️ / 🍺 🐧 🦙） |
| h2 見出し emoji | ✅ 修正済 | `-webkit-text-fill-color:transparent` バグ修正 |
| Windsurf .deb URL | ⚠️ 404 | 公式ページ確認要（URL 変更済み） |
| アクセシビリティ | ⚠️ 不足 | aria 属性・alt 属性がゼロ（低優先） |

---

## 1. 解決済み問題

### 1-1. claude.ai/install.sh が sh で失敗 ✅ 修正済

**発見**: `podman run --rm debian:12-slim` でコンテナテスト実施。`| sh` では bash-only 構文でエラー。

```
sh: 9: Syntax error: "(" unexpected
```

**修正**: linux.html, mac.html, windows.html で `| sh` → `| bash` に変更。

---

### 1-2. Ollama インストーラが zstd を要求 ✅ 修正済

**発見**: コンテナテストで発見。

```
ERROR: This version requires zstd for extraction.
```

**修正**: linux.html, windows.html の `apt-get install` に `zstd` を追加。

---

### 1-3. isolation-matrix / environment-matrix のコンテンツが大幅削減されていた ✅ 修正済

**発見**: コミット `0309573` で 787行 → 181行 に削減されていた。

**修正**: `git show 801749b:isolation-matrix.html` から包括的バージョン（787行、28行のデータ、強度バー、9カラム）を復元。environment-matrix.html も 577行版を復元。両ページに `🤖 AI Tools` ナビピルを追加。

---

### 1-4. スタックカードの ⬡ アイコンが黒く表示 ✅ 修正済

**原因**: `⬡` (U+2B21 WHITE HEXAGON) はテキスト文字のため、フォントによっては CSS color とは無関係に黒いアウトラインで描画される。

**修正**: 適切な emoji に置換:
- linux.html: Podman → 📦、nvidia-container-toolkit → 🎮、Xephyr → 🖥️
- mac.html: Homebrew → 🍺、Lima → 🐧、XQuartz → 🖥️、Ollama → 🦙

---

### 1-5. h2 見出し内 emoji が黒く表示（実装バグ） ✅ 修正済

**原因（動的実装ミス）**: CSS の shimmer アニメーション実装で使用していた:

```css
.section-head h2 {
  background: linear-gradient(90deg, var(--text) 40%, var(--accent) 50%, var(--text) 60%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;  /* ← これが犯人 */
  background-clip: text;
}
.section-head h2:hover { animation: shimmer 2s linear; }
```

`-webkit-text-fill-color: transparent` + `background-clip: text` の組み合わせはテキスト文字には意図通り動くが、h2 内の emoji（🔧 🏗️ 📦 etc.）にも適用されてしまい、ダークグラデーションが emoji の形を通して見えた結果、黒っぽく見えた。

**修正**: linux.html, mac.html, windows.html でグラデーションテキスト効果を除去:

```css
.section-head h2 { color: var(--accent); }
.section-head h2:hover { opacity: .8; transition: opacity .2s; }
```

---

### 1-6. Windsurf .deb URL が 404 ⚠️ 未解決

**発見**: `curl -fsSIL` で確認。

```
HTTP/2 404
```

**状況**: Codeium/Windsurf の CDN URL `windsurf-stable.codeiumdata.com/linux-x86_64/windsurf_latest_amd64.deb` が 404。Windsurf は OpenAI に買収済みで配布インフラが変更された可能性あり。

**対応**: Dockerfile にコメントで注記追加:
```dockerfile
# ⚠️ URLは公式サイト https://codeium.com/windsurf/download から最新版を確認してください
```

**アクション必要**: 実際に試す際は公式ダウンロードページで最新 URL を確認すること。

---

### 1-7. compose.yml の GitHub リンクなし ✅ 修正済

**修正**: linux.html, windows.html のコールアウトで「リポジトリのルート」に GitHub URL リンクを追加。

---

## 2. コンテナ実地テスト結果（2026-03-25）

`podman run --rm debian:12-slim bash -c "..."` で各インストールスクリプトを検証。

| パッケージ / スクリプト | 結果 | 備考 |
|------------------------|------|------|
| `claude.ai/install.sh \| bash` | ✅ 成功 | `\| sh` は失敗（bash-only 構文） |
| `aider.chat/install.sh \| sh` | ✅ 成功 | uv ベース、sh でも動作 |
| `ollama.com/install.sh` | ⚠️ zstd 要 | zstd インストール後は正常 |
| Windsurf .deb | ❌ 404 | URL 変更済み、要確認 |
| debian:12 の apt パッケージ | ✅ 全31個確認済 | 前回テストで確認 |

---

## 3. 既存の問題（低優先度）

### 3-1. SVG ダイアグラムに代替テキストなし

**場所**: 全プラットフォームページのアーキテクチャ図

**推奨**: `role="img"` と `aria-label` / `<title>` 要素を追加（一部ページは既に対応済み）。

### 3-2. コピーボタンに `type` 属性なし

```html
<!-- 推奨 -->
<button type="button" class="copy-btn" onclick="cp(this)">copy</button>
```

---

## 4. バージョン追跡

| ツール | 現状 | 状態 |
|--------|------|------|
| Node.js | 22（LTS） | ✅ 適切 |
| NVM | v0.40.1 | ✅ 最新系列 |
| CUDA | 12.4 | ✅ 適切（12.x 系） |
| debian base | 12-slim | ✅ Bookworm（現行 LTS） |

---

## 5. 優先度まとめ

| 優先度 | 項目 | 状態 |
|--------|------|------|
| 🔴 高 | claude install.sh bash 修正 | ✅ 完了 |
| 🔴 高 | h2 emoji 黒表示バグ修正 | ✅ 完了 |
| 🔴 高 | zstd 追加（Ollama 必須） | ✅ 完了 |
| 🔴 高 | matrix ページ内容復元 | ✅ 完了 |
| 🟠 中 | ⬡ アイコン修正 | ✅ 完了 |
| 🟠 中 | Windsurf .deb URL 確認 | ⚠️ 要確認 |
| 🟡 低 | SVG aria-label 追加 | 未対応 |
| 🟡 低 | コピーボタン type 属性 | 未対応 |
| 🔵 随時 | NVM・CUDA バージョン確認 | 随時 |
