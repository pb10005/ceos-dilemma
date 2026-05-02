# Netlifyデプロイ計画（CEO's Dilemma）

## 1. 目的
- MVPを外部公開し、URL共有でレビュー可能にする。
- `main` へのマージで自動デプロイし、手動作業を最小化する。

## 2. 前提
- アプリは Next.js 15 系。
- 現状は静的データ中心で、外部DB依存なし。
- 品質ゲート（`typecheck`/`lint`/`test`/`test:e2e`）を通過してから本番反映する。

## 3. デプロイ方式
- Netlify + Git連携（推奨: GitHub連携）
- ブランチ運用
  - Production: `main`
  - Deploy Preview: PRブランチ

## 4. ビルド設定
Netlify Site settings > Build & deploy で次を設定。

- Build command: `npm run build`
- Publish directory: `.next`
- Node version: `22`

※ Next.js運用のため、`@netlify/plugin-nextjs` を利用する。

## 5. リポジトリ設定タスク
1. `netlify.toml` を追加
2. `package.json` に Netlify 用 plugin を devDependencies として追加
3. PR時に Deploy Preview が作成されることを確認
4. `main` へのマージ時に本番URL更新を確認

## 6. 品質ゲートと反映ルール
- PRマージ条件
  - `npm run typecheck` 成功
  - `npm run lint` 成功
  - `npm run test` 成功
  - `npm run test:e2e` 成功
- 失敗時はデプロイ停止（マージ不可）

## 7. ロールバック方針
- Netlifyの Deploys 画面から直前成功デプロイへ即時ロールバック。
- ロールバック後に対象コミットを `git revert` して再発防止。

## 8. 実施手順（初回）
1. Netlifyで「Add new site」→ 対象リポジトリを選択
2. Build command / Publish directory / Node version を設定
3. 初回デプロイ成功を確認
4. `/` と `/game` の表示確認
5. PR作成時の Deploy Preview 生成を確認

## 9. 完了判定
- Production URL でトップページとゲームページが表示できる。
- PRごとに Deploy Preview URL が自動生成される。
- 直近3回連続でデプロイ成功。
