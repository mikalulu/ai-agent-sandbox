# エージェント役割分担 — As-Is / To-Be

## As-Is（現状） — 実装の差分から検証した実態

### 調査方法

コミットメッセージの自称ではなく、`git show --stat`・`Co-Authored-By` トレーラー・author email・実際の差分内容から担当を特定した。

### 時系列と担当の実態

| フェーズ | 期間 | コミット | 実担当 |
|---|---|---|---|
| 初期生成 | 3/20 | `db81247` | Claude Sonnet（author: you@example.com、CLAUDE.md に「Claude Sonnet 4.6 が生成」と記載） |
| Gemini 初回 | 3/24 AM | `47f33cc` | Gemini CLI（author: you@example.com、メッセージに「by Gemini」） |
| 監査・拡張 | 3/24 PM | `181ab4d` | Claude Opus（Co-Authored-By: Claude Opus 4.6） |
| compose.yml・SVG 追加 | 3/24 PM | `fbb4d4c` | Claude Opus（Co-Authored-By: Claude Opus 4.6） |
| 2系統分岐 | 3/25 未明 | `2818c8d`〜`1ac7271` | **2本の並行ブランチが存在**（後述） |
| GPT 整備 | 3/25 AM | `452cb36` | GPT（author: you@example.com）— codex.md の作成者も GPT |
| Gemini DRY 化 | 3/25 AM | `ab3c5da` | Gemini CLI（author: you@example.com） |
| Opus 修復・機能追加 | 3/25 PM | `4f6fe92`〜`a63ae98` | Claude Opus |
| 意訳・保守 | 3/25 夜〜 | `88bd515`〜`7d00247` | Claude Opus |

### 発見: 並行ブランチと重複コミット

`fbb4d4c` から2系統に分岐し、同一メッセージのコミットが14組存在する。片方は `Co-Authored-By: Claude Haiku 4.5` 付き、もう片方は `🤖 Generated entirely by Claude Sonnet 4.6` 付き。最終的に main にマージされたのは Sonnet 系統の方。Haiku 系統は孤立ブランチとして残っている。

**つまり:**
- `9815598`, `be74a61`, `e3b1158`（Haiku 自称「夜勤の審査員」）は **main に入っていない**
- main に入った `85c509f`〜`1ac7271` の実担当は **Claude Sonnet 4.6**

---

### エージェント別の実績（差分で検証済み）

#### Claude Sonnet — 初期構築 + 中盤の大量作業

**実際にやったこと:**
- 初期コミット: 3プラットフォームガイド + index.html + README（2,732行）
- `2818c8d`〜`1ac7271`（main 系統、13コミット）:
  - `ai-tools-guide.html` 新規作成（677行）
  - `isolation-matrix.html` / `environment-matrix.html` の復元と増強
  - 全HTMLのナビ統一、メタ情報追加、emoji バグ修正
  - Windsurf apt repo 化、アーキテクチャ制限追記、AUDIT.md 更新
  - `--no-sandbox` 追加 → 即 revert（誤判断と自己修正）

**特徴:** コミットログは英語が多く emoji prefix 付き。差分量は全エージェント中最大。ただし matrix ページの行数減少（787行→181行→再復元）など、破壊と修復を自分で繰り返している面もある。

#### Claude Opus — 監査・PoC・修復・保守

**実際にやったこと:**
- `181ab4d`: AUDIT.md 作成（462行）、チェックリスト・FAQ を全ガイドに追加（+785行）
- `fbb4d4c`: compose.yml 新規作成、index.html 拡張、SVG アニメーション
- `4f6fe92`: PoC テスト計画作成（589行）、linux.html の gnupg / PATH バグ発見・修正
- `53056e5`: 日本語ロケール注入（locales, fonts-noto-cjk, ja_JP.UTF-8）
- `caa2e96`: Gemini が縮小した SVG の復元（780×400 に戻す）
- `c78d62d`: Gemini が消した前提条件チェックリスト復元（+34行）
- `765a367`: Gemini が埋めたプラットフォーム比較表と AI ツールグリッド復元（+121行）
- `a63ae98`: 6件のバグ修正 + OAuth ドキュメント + コンテナランタイム比較表（+287行）
- `88bd515`〜`7d00247`: COMMIT_LOG_JA.md、README 更新、CLAUDE.md 日本語化

**特徴:** 他エージェントの破壊的変更の修復を3回実施。PoC の実機テストと監査レポートが最大の独自貢献。コミットメッセージの皮肉度が最も高い。

#### Claude Haiku — 夜間の整合性チェック（main 未マージ）

**実際にやったこと:**
- `9815598`〜`41d0307`（Haiku ブランチ、14コミット）: Sonnet と同内容だが独立して作業
- `Co-Authored-By: Claude Haiku 4.5 (the night shift reviewer)` 等の署名

**注意:** これらは **main に入っていない孤立コミット**。Sonnet 系統と同時並行で同じ作業をしたが、採用されなかった。

#### GPT — インフラ整備 + 計画策定

**実際にやったこと（`452cb36` — 1コミット、+942/-427行）:**
- `assets/site.css`（54行）、`assets/site.js`（249行）新規作成
- `scripts/check_docs.py`（152行）新規作成
- `.github/workflows/docs-check.yml`（18行）新規作成
- `assets/favicon.svg`（14行）新規作成
- `examples/Dockerfile`（25行）、`examples/entrypoint.sh`（10行）新規作成
- `codex.md`（169行）新規作成 — 改善タスクの優先度付きロードマップ
- 全7HTMLの冗長な inline CSS/JS を外部ファイルに移行

**特徴:** コミットメッセージは「Sonnet のやりっぱなしを片付けた」だが、実態は**プロジェクトのインフラ基盤をほぼ全部作った**。CI、共通 CSS/JS、検証スクリプト、Dockerfile サンプル、favicon — 全部このコミット。codex.md の名前だが Codex CLI が書いたわけではなく、GPT が書いた改善計画。

#### Gemini CLI — DRY 化リファクタ + 監査レポート

**実際にやったこと（`47f33cc` + `ab3c5da` — 2コミット）:**
- `47f33cc`: CLAUDE.md 作成、`isolation-matrix.html`（787行）・`environment-matrix.html`（577行）新規作成、全 HTML リファクタ（+2,615/-1,599行）
- `ab3c5da`: CSS/JS DRY 化（`site.css` に93行追加、`site.js` に10行追加）、`GEMINI.md`・`gemini_audit.md` 作成

**副作用（差分で確認済み）:**
- `ab3c5da` で HTML 合計 -584 行（index: 561→243、linux: 750→424）。CSS 外出しによる正当な削減もあるが、Opus が後で復元した内容（SVG 縮小、前提条件チェックリスト消失、比較表埋没）はこのコミットが原因。

#### Codex CLI — 関与なし

codex.md は GPT が作成。Codex CLI が実際にコミットした痕跡はない。

---

### 検証済み役割マトリクス（As-Is）

| 役割 | mikau | Opus | Sonnet | Haiku | GPT | Gemini |
|------|:-----:|:----:|:------:|:-----:|:---:|:------:|
| 方針決定 | **主** | | | | | |
| 初期構築 | | | **主** | | | |
| インフラ整備（CI/共通CSS/JS/検証） | | | | | **主** | |
| 新ページ作成 | | | **主** | | | **主** |
| 機能追加（HTML ガイド） | | **主** | **主** | | | |
| バグ修正 | | **主** | **主** | | | |
| DRY リファクタ | | | | | | **主** |
| 破壊的変更の修復 | | **主** | | | | |
| 監査レポート | | **主** | | | | **主** |
| PoC テスト | 目視 | **主** | | | | |
| 改善計画策定 | | | | | **主** | |
| ドキュメント保守 | | **主** | | | | |
| レビュー | **主** | | | | | |

### コミットログ vs 実態の乖離

| 主張 | 実態 |
|------|------|
| 「claude opus fixed six bugs」 | 確認済み — 差分に6件の修正が実在 |
| 「gemini swept the floor」 | 掃除したが家具も一緒に捨てた（SVG 縮小、コンテンツ消失） |
| 「gpt single-handedly cleaned up」 | 過小評価 — CI/共通基盤/検証スクリプト/codex.md を**全部作った** |
| 「Haiku (the night shift reviewer)」 | main に入っていない — Sonnet と同時並行で同じ作業をして不採用 |
| Codex CLI が codex.md を書いた | GPT が書いた（`452cb36` の差分に含まれている） |
| 「Claude Sonnet 4.6 が生成」（CLAUDE.md 旧記述） | 初期構築は正しいが、中盤の大量作業も Sonnet |

---

## To-Be（提案）

### 現状の問題点

1. **GPT の貢献が過小評価されている** — インフラ基盤を全部作ったのにコミットログでは「後始末」扱い
2. **Sonnet の中盤作業が不可視** — emoji prefix のコミット群（13件）が誰の作業か外からわからない
3. **Gemini のリファクタが検証なしで main に入る** — 結果として Opus が3回修復
4. **Haiku が無駄になっている** — Sonnet と同じ作業を並行してやり、片方が捨てられた
5. **Codex CLI の出番がゼロ** — 名前だけ借りられている
6. **CI が内容量の減少を検知できない** — check_docs.py はメタ情報とリンクのみ

### 提案する役割分担

#### mikau — プロダクトオーナー（変更なし）
- 方針決定、優先度判断、最終承認
- PoC の物理操作・GUI 目視

#### Claude Opus — テックリード
- アーキテクチャ判断、他エージェントの成果物レビュー
- PoC テスト実行、監査レポート更新
- 複雑なバグ修正、クロスページ影響がある変更

#### Claude Sonnet — メイン開発
- 機能追加・日常的な修正の主担当（デフォルトモデル設定済み）
- HTML ガイドの内容更新、新ページ作成
- COMMIT_LOG_JA.md / README 保守

#### Gemini CLI — 監査特化（リファクタは要レビュー）
- 定期的な品質監査（gemini_audit.md 更新）
- DRY 化・リファクタの**提案**（実施前に Opus か mikau がレビュー）
- GEMINI.md の自己保守

#### GPT — インフラ・CI・計画策定
- `check_docs.py` の機能拡張（行数チェック、バージョン整合性）
- GitHub Actions ワークフローの保守
- `assets/site.css` / `assets/site.js` の保守
- 改善ロードマップの更新

#### Claude Haiku — 廃止または明確な差別化
- 現状: Sonnet と同じ作業をして不採用。リソースの無駄。
- 案A: 使わない
- 案B: コードレビュー専用（変更は書かず、差分チェックだけ行う）

### 運用ルール案

1. **Gemini のリファクタは直接 push 禁止** — ブランチで作業 → diff の行数変化を確認 → レビュー後マージ
2. **行数チェックを CI に追加** — リファクタで意図せずコンテンツが消えた場合に検知
3. **Co-Authored-By またはコミットメッセージで実担当を正確に記録** — 「codex.md だから Codex が書いた」のような誤解を防ぐ
4. **同一作業の並行実行を禁止** — Haiku/Sonnet の重複を防ぐ

### 提案する役割マトリクス（To-Be）

| 役割 | mikau | Opus | Sonnet | GPT | Gemini |
|------|:-----:|:----:|:------:|:---:|:------:|
| 方針決定 | **主** | 助言 | | | |
| 機能追加 | | レビュー | **主** | | |
| バグ修正 | | 複雑 | 日常 | | |
| インフラ・CI | | | | **主** | |
| リファクタ | | レビュー | | | **提案** |
| 監査 | | **主** | | | **主** |
| PoC テスト | 目視 | **主** | | | |
| 計画策定 | | 助言 | | **主** | |
| ドキュメント保守 | | | **主** | | |
| レビュー | **主** | **主** | | | |
