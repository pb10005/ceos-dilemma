# CEO's Dilemma

企業経営シミュレーション戦略ゲーム（Web）プロジェクトです。`plan.md` を基準に、MVPの段階的実装を進めます。

## 現在の状態
- 企画・実装計画: `plan.md`
- 実装管理ドキュメント: `docs/implementation-management.md`
- リポジトリ運用: 初期化済み（ドキュメント整備フェーズ）

## 開発方針（MVP）
- 型定義を先行する
- 財務計算をUIから分離し、純粋関数で実装する
- ゲームバランス値を可能な限りJSONで管理する
- ロジック優先で実装し、UIは後続で統合する

## 直近の実装順序
1. Phase 1: Next.js + TypeScript + Tailwind の初期構築
2. Phase 2: 型定義と初期データ
3. Phase 3: 財務計算ロジック
4. Phase 4: ターン処理エンジン
