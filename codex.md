# codex.md

## 概要

このリポジトリは静的HTMLだけで構成されたドキュメントサイトで、現時点の大きな不具合は [`AUDIT.md`](./AUDIT.md) にある通り概ね解消済み。
一方で、保守性・検証性・公開品質の面ではまだ手を入れられる余地がある。

このファイルは「今このリポジトリに対して Codex が対応できそうなこと」を、実行しやすい単位で整理したメモ。

## 現状把握

- HTML 7 ファイル + ドキュメント数本の小規模構成だが、総行数は約 5,500 行あり、単一HTML内に CSS と JS が重複している
- ビルドシステムやテスト基盤は存在しない
- `.github/workflows` や自動検証スクリプトはない
- `README.md` は概要中心で、更新フローや検証方法の記述が薄い
- `index.html` を含む全HTMLで Google Fonts の `@import` を直接使っている
- 主要HTMLに `meta description`、OGP、canonical などの公開向けメタ情報が入っていない
- `linux.html` / `mac.html` / `windows.html` は UI と JS の構造がかなり近く、共通化余地が大きい
- `compose.yml` は補助資料として置かれているが、実ファイルとして必要になる `Dockerfile` / `entrypoint.sh` はリポジトリに含まれていない

## 優先度高

### 1. 共通CSS / 共通JSの外出し

対象:
- `linux.html`
- `mac.html`
- `windows.html`
- `index.html`
- `ai-tools-guide.html`
- `isolation-matrix.html`
- `environment-matrix.html`

やること:
- 共通スタイルを `assets/site.css` のような単一ファイルへ寄せる
- コピー機能、チェックリスト、スクロール連動、FAQ周辺の共通JSを `assets/site.js` に寄せる
- ページ固有のアクセント色だけを各HTML側に残す

効果:
- 修正漏れの防止
- デザイン変更の反映速度向上
- HTMLの可読性改善

### 2. 最低限の自動検証を追加

やること:
- リンク切れ確認
- HTML構文の簡易チェック
- `compose.yml` のYAMLチェック
- GitHub Actions で pull request / push 時に自動実行

候補:
- 軽量なシェルスクリプト
- `lychee` などのリンクチェッカー
- `html-validate` か `tidy` 系の静的チェック

効果:
- 静的サイトでも破壊的変更を防げる
- 外部リンク更新の検知がしやすくなる

### 3. 公開ページ向けメタ情報の整備

やること:
- 各HTMLに `meta name="description"` を追加
- OGP / Twitter Card / `canonical` を追加
- 必要なら `theme-color` と favicon も追加

効果:
- GitHub Pages 公開物としての完成度向上
- SNS共有時の見え方改善
- 検索流入時の情報品質向上

## 優先度中

### 4. ドキュメント生成元を持つ構成へ寄せる

現状の課題:
- 似たHTMLを手で並行更新する必要がある
- ナビゲーション、フッター、共通部品の同期が人力

やること:
- Nunjucks / 11ty / 単純なテンプレート生成スクリプトのどれかを導入
- 共通パーツを partial 化
- 生成物としてHTMLを吐く構成にする

効果:
- ページ追加や文言修正のコスト削減
- 見た目を維持したまま運用しやすくなる

### 5. `compose.yml` とガイド本文の関係を整理

現状の課題:
- `compose.yml` はあるが、コメント上で前提にしている `Dockerfile` / `entrypoint.sh` は同梱されていない
- 利用者によっては「そのまま動くサンプル」と誤認しやすい

やること:
- `examples/` に最小構成の `Dockerfile` / `entrypoint.sh` を追加
- あるいは `compose.yml` を「擬似コード例」と明記
- OS別の差分を compose override で分けるか検討

効果:
- 誤読防止
- 実際に試せるリポジトリへ近づく

### 6. README を運用者向けに強化

やること:
- ローカルプレビュー方法を追記
- 更新対象ファイルの対応表を追記
- 検証手順を追記
- `AUDIT.md` と `codex.md` の役割分担を明記

効果:
- 将来の更新者が入りやすい
- 単発の修正が属人化しにくい

## 優先度低

### 7. フォント配信方式の見直し

現状:
- 全HTMLで Google Fonts を `@import` している

やること:
- `@import` を `<link rel="preconnect">` + `<link href=...>` に変更
- あるいはフォントを自己ホスト化

効果:
- 初期表示改善
- 外部依存の明確化

### 8. アクセシビリティの追加改善

やること:
- 各ページに `main` を追加
- ナビゲーションに `aria-label` を付与
- 現在ページのリンクに `aria-current="page"` を付与
- コピーボタンの成功状態をスクリーンリーダー向けに伝える

効果:
- 構造が明確になる
- キーボード・支援技術利用時の品質向上

### 9. 外部リンクポリシーの統一

現状:
- `target="_blank"` はあるが、`rel="noopener noreferrer"` の付与を統一確認したい

やること:
- 外部リンクの記法を統一
- 必要ならスタイルも共通class化

## 具体的にすぐ着手できる作業案

1. `assets/site.css` と `assets/site.js` を追加して、3つのOSガイドから共通部分を切り出す
2. `README.md` を更新して、編集フロー・確認フロー・ファイル責務を明記する
3. `meta description` / OGP / canonical を全HTMLに追加する
4. `.github/workflows/docs-check.yml` を追加して、リンクチェックとHTML検証を回す
5. `examples/` 配下に最小の `Dockerfile` と `entrypoint.sh` を追加して `compose.yml` と整合させる

## 着手順の推奨

1. 自動検証追加
2. README 強化
3. メタ情報追加
4. 共通CSS / JS 化
5. 必要ならテンプレート化

この順番なら、先に安全網を張ってから構造改善に入れる。
