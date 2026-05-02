# CEO's Dilemma

企業経営シミュレーション戦略ゲーム（Web）プロジェクトです。`plan.md` を基準に、MVPの段階的実装を進めます。

## 現在の状態
- 企画・実装計画: `plan.md`
- 実装管理ドキュメント: `docs/implementation-management.md`
- Phase 1: Next.js + TypeScript + Tailwind の骨組み構築済み
- Phase 2: 型定義・初期データを追加済み

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
1. Phase 3: 財務計算ロジック（`lib/finance.ts`）
2. Phase 4: ターン処理エンジン（`lib/gameEngine.ts`）
3. Phase 5: UIへ実ロジック接続
