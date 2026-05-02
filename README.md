# CEO's Dilemma

企業経営シミュレーション戦略ゲーム（Web）プロジェクトです。`plan.md` を基準に、MVPの段階的実装を進めます。

## セットアップ / 起動方法
```bash
npm install
npm run dev
```

- ブラウザで `http://localhost:3000` を開く
- 本番ビルド確認:

```bash
npm run build
npm run start
```

## 現在の状態
- 企画・実装計画: `plan.md`
- 実装管理ドキュメント: `docs/implementation-management.md`
- Phase 1: Next.js + TypeScript + Tailwind の骨組み構築済み
- Phase 2: 型定義・初期データを追加済み
- Phase 3: 財務計算ロジックと単体テストを追加済み
- Phase 4: ターン処理エンジン（`processTurn`）を追加済み
- Phase 5: ダッシュボード/意思決定/財務表示UIを統合済み
- Phase 6: 用語集・学習ログなど学習体験機能を追加済み
- Phase 7: 12四半期チュートリアルシナリオを追加済み
- Phase 8: 品質改善（型チェック/ユニットテスト/E2E到達確認）を実施済み

## 開発方針（MVP）
- 型定義を先行する
- 財務計算をUIから分離し、純粋関数で実装する
- ゲームバランス値を可能な限りJSONで管理する
- ロジック優先で実装し、UIは後続で統合する

## ディレクトリ
- `app/`: 画面ルーティング
- `components/`: UIコンポーネント
- `types/`: ゲーム/財務/意思決定型
- `data/`: 初期データ・イベント・シナリオ・用語集

## 品質ゲート（現行）
```bash
npm run typecheck
npm run lint
npm run test
npm run test:e2e
```

## 次の実装候補（MVP後）
1. Playwright への移行（現状は Node ベースE2E）
2. レスポンシブ詳細調整（モバイル時の情報密度最適化）
3. 表示フォーマット共通化（通貨・比率フォーマッタの集約）


## デプロイ計画
- Netlifyデプロイ計画を `docs/netlify-deployment-plan.md` に追加
- 初回は手動セットアップ後、`main` マージで自動デプロイ運用へ移行
- PRごとに Deploy Preview を有効化し、UIレビューをURLで実施
