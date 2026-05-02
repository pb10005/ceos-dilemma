# CEO's Dilemma

企業経営シミュレーション戦略ゲーム（Web）プロジェクトです。`plan.md` を基準に、MVPの段階的実装を進めます。

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

## 次の実装順序
1. **Phase 8: 品質改善**（レスポンシブ調整・表示フォーマット統一）
2. E2Eテスト導入（Playwright）と主要導線の自動検証
3. 品質ゲート（`typecheck` / `lint` / `test` / `test:e2e`）をREADMEに反映
