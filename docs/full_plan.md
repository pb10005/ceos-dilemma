# 企業経営シミュレーション戦略ゲーム企画・実装計画

## 企画概要

**タイトル仮称：CEO's Dilemma：成長か、破綻か**

プレイヤーはCEOとして企業を経営し、資金調達、会計、サプライチェーン、M&A、採用、研究開発、競争戦略を意思決定しながら企業価値を最大化する。

本作は単なる経営ゲームではなく、プレイを通じて実務的なビジネス知識を学べる**戦略型教育シミュレーションゲーム**とする。

---

## 目的

### プレイヤーのゲーム上の目的

- スタートアップをIPOまで成長させる
- 業界シェア1位を獲得する
- 時価総額・企業価値を最大化する
- M&Aで事業ポートフォリオを拡大する
- 財務健全性と成長性を両立する

### 学習上の目的

- PL / BS / CFの関係を理解する
- 利益とキャッシュフローの違いを体験する
- エクイティ調達、借入、希薄化、バリュエーションを理解する
- 在庫、調達、物流、供給リスクのトレードオフを学ぶ
- M&Aの買収価格、シナジー、PMI、のれん減損を理解する
- 成長投資と倒産リスクのバランスを判断できるようにする

---

## ゲームジャンル

- ターン制経営シミュレーション
- 戦略ゲーム
- 教育ゲーム
- ボードゲーム風UI
- PC / Web / タブレット向け

---

## 基本ゲームループ

1ターン＝1四半期。

```
市場環境の変化
↓
経営会議
↓
投資・採用・調達・販売・資金調達を意思決定
↓
事業結果をシミュレーション
↓
PL / BS / CF とKPIを更新
↓
株主・銀行・従業員・顧客の評価が変化
↓
次ターンへ
```

---

## 主要システム

## 1. 会社ステータス

| 指標 | 意味 |
| --- | --- |
| 現金残高 | 企業の生存力 |
| 売上高 | 市場での販売規模 |
| 粗利益率 | 商品・事業の収益性 |
| 営業利益 | 本業の利益 |
| フリーキャッシュフロー | 実際に残る現金 |
| 企業価値 | 投資家からの評価 |
| 市場シェア | 業界内での地位 |
| ブランド力 | 価格決定力・採用力 |
| 従業員数 | 実行能力 |
| 技術力 | 製品競争力 |
| サプライチェーン安定度 | 欠品・遅延リスク |
| 信用格付け | 借入条件に影響 |

## 2. 財務システム

### PL：損益計算書

```
売上
- 売上原価
= 粗利益
- 人件費
- 広告宣伝費
- 研究開発費
- 管理費
= 営業利益
- 支払利息
= 税引前利益
- 税金
= 純利益
```

### BS：貸借対照表

```
資産：現金、在庫、設備、子会社、のれん
負債：借入金、買掛金、社債
純資産：資本金、利益剰余金
```

### CF：キャッシュフロー計算書

```
営業CF
投資CF
財務CF
現金増減
```

## 3. 資金調達システム

| 手段 | メリット | デメリット |
| --- | --- | --- |
| エクイティ調達 | 返済不要、大型調達可能 | 株式希薄化、経営権低下 |
| 銀行借入 | 希薄化なし | 返済義務、利息、財務制限条項 |
| 社債発行 | 大規模調達可能 | 格付け次第で金利上昇 |
| 補助金 | 低コスト資金 | 用途制限、審査あり |
| IPO | 大型調達・信用向上 | 開示義務、株主圧力 |

## 4. サプライチェーンシステム

| 要素 | 意思決定 |
| --- | --- |
| 仕入先 | 低コストか高信頼か |
| 生産拠点 | 国内生産か海外生産か |
| 在庫 | 欠品リスクと在庫コストのバランス |
| 物流 | コスト、速度、安定性 |
| 品質管理 | 不良率とブランド毀損リスク |

## 5. M&Aシステム

```
候補企業リスト
↓
デューデリジェンス
↓
買収価格交渉
↓
資金調達
↓
買収実行
↓
PMI：統合プロセス
↓
シナジー発現または失敗
```

---

## MVP方針

最初は**D2Cブランド経営シミュレーション**として実装する。

理由：

- 在庫、広告、粗利、資金繰りを自然に扱える
- 会計とキャッシュフローの学習に適している
- サプライチェーン要素を小さく始められる
- 後からSaaS、製造業、M&Aシナリオへ拡張しやすい

### MVPで実装する範囲

- ターン制進行
- 会社ステータス
- PL / BS / CFの簡易計算
- 広告投資
- 生産・在庫管理
- 採用
- エクイティ調達
- 銀行借入
- イベントカード
- チュートリアルシナリオ
- ゲーム結果レポート

### MVPで実装しない範囲

- 複雑なM&A
- 海外展開
- 詳細な税務
- 多国籍サプライチェーン
- 敵対的買収
- 株式市場の詳細シミュレーション

---

# AIエージェント向け実装計画

## 実装ゴール

AIエージェントに指示して、まずは**ブラウザで動作するテキスト＋数値中心の経営シミュレーションMVP**を構築する。

### 完成状態

- プレイヤーが四半期ごとに経営判断できる
- 判断結果が財務諸表とKPIに反映される
- 現金が尽きると倒産する
- 12四半期のチュートリアルシナリオを完走できる
- ゲーム終了時に経営成績と学習ポイントが表示される

---

## 推奨技術スタック

### フロントエンド

- Next.js
- TypeScript
- React
- Tailwind CSS

### 状態管理

- Zustand または React Context

### データ管理

- 初期MVP：ローカルJSON
- 将来拡張：SQLite / Supabase / PostgreSQL

### テスト

- Vitest
- Playwright

### デプロイ

- Vercel

---

## ディレクトリ構成案

```
/business-sim-game
  /app
    page.tsx
    /game
      page.tsx
  /components
    Dashboard.tsx
    DecisionPanel.tsx
    FinancialStatements.tsx
    EventCard.tsx
    KPIBoard.tsx
    GameLog.tsx
    TutorialPanel.tsx
  /lib
    gameEngine.ts
    finance.ts
    valuation.ts
    events.ts
    decisions.ts
    tutorial.ts
  /data
    initialCompany.json
    eventCards.json
    scenarios.json
    glossary.json
  /types
    game.ts
    finance.ts
    decision.ts
  /tests
    finance.test.ts
    gameEngine.test.ts
```

---

## データモデル

## 1. CompanyState

```tsx
type CompanyState = {
  quarter: number
  cash: number
  revenue: number
  inventory: number
  debt: number
  equityRaised: number
  sharesOutstanding: number
  valuation: number
  employees: number
  brandPower: number
  productQuality: number
  supplyStability: number
  marketShare: number
  customerBase: number
  cumulativeProfit: number
}
```

## 2. Decisions

```tsx
type Decisions = {
  adSpend: number
  productionUnits: number
  hireCount: number
  rAndDSpend: number
  price: number
  raiseEquity: boolean
  borrowDebt: number
  repayDebt: number
}
```

## 3. FinancialStatements

```tsx
type FinancialStatements = {
  pl: {
    revenue: number
    cogs: number
    grossProfit: number
    payroll: number
    adSpend: number
    rAndD: number
    operatingProfit: number
    interestExpense: number
    netIncome: number
  }
  bs: {
    cash: number
    inventory: number
    assets: number
    debt: number
    equity: number
  }
  cf: {
    operatingCashFlow: number
    investingCashFlow: number
    financingCashFlow: number
    netCashFlow: number
  }
}
```

## 4. EventCard

```tsx
type EventCard = {
  id: string
  title: string
  description: string
  category: 'market' | 'supply' | 'finance' | 'competition' | 'internal'
  effect: {
    demandMultiplier?: number
    cogsMultiplier?: number
    supplyStabilityDelta?: number
    interestRateDelta?: number
    brandPowerDelta?: number
  }
  learningPoint: string
}
```

---

## ゲームエンジン実装仕様

## 1. ターン処理

AIエージェントへの指示：

```
lib/gameEngine.ts に processTurn 関数を実装してください。
入力は CompanyState、Decisions、EventCard。
出力は更新後の CompanyState、FinancialStatements、GameLogEntry。
処理順序は以下にしてください。
1. イベント効果を適用
2. 広告投資とブランド力から需要を計算
3. 生産量と在庫から販売可能数を計算
4. 売上と売上原価を計算
5. 人件費、広告費、研究開発費、利息を計算
6. PLを作成
7. 在庫、現金、借入、株式調達を反映
8. BSを作成
9. CFを作成
10. 企業価値を更新
11. 倒産条件を判定
```

### 疑似コード

```tsx
function processTurn(state, decisions, event) {
  const adjustedDemand = calculateDemand(state, decisions, event)
  const unitsSold = Math.min(adjustedDemand, state.inventory + decisions.productionUnits)
  const revenue = unitsSold * decisions.price
  const cogs = unitsSold * unitCost * event.cogsMultiplier
  const grossProfit = revenue - cogs
  const payroll = state.employees * salaryPerQuarter
  const interestExpense = state.debt * quarterlyInterestRate
  const operatingProfit = grossProfit - payroll - decisions.adSpend - decisions.rAndDSpend
  const netIncome = operatingProfit - interestExpense
  const financingCashFlow = decisions.borrowDebt + equityCashIn - decisions.repayDebt
  const netCashFlow = netIncome - productionCashOut + financingCashFlow
  const nextCash = state.cash + netCashFlow

  return nextState
}
```

---

## 財務計算仕様

## 1. 売上

```
販売数量 = min(需要, 期首在庫 + 生産数量)
売上 = 販売数量 × 販売価格
```

## 2. 売上原価

```
売上原価 = 販売数量 × 1個あたり原価
```

## 3. 在庫

```
期末在庫 = 期首在庫 + 生産数量 - 販売数量
在庫評価額 = 期末在庫 × 1個あたり原価
```

## 4. 営業利益

```
営業利益 = 粗利益 - 人件費 - 広告費 - 研究開発費 - 管理費
```

## 5. 現金

```
現金増減 = 営業CF + 投資CF + 財務CF
期末現金 = 期首現金 + 現金増減
```

## 6. 倒産条件

```
現金 < 0 の場合、ゲームオーバー
借入金 / EBITDA が一定以上の場合、銀行警告
2四半期連続で現金不足の場合、倒産
```

---

## UI実装仕様

## 画面1：トップ画面

表示要素：

- ゲームタイトル
- コンセプト説明
- シナリオ選択
- 難易度選択
- ゲーム開始ボタン

## 画面2：経営ダッシュボード

表示要素：

- 現在の四半期
- 現金残高
- 売上
- 営業利益
- 市場シェア
- 企業価値
- イベントカード
- 意思決定パネル
- 次の四半期へ進むボタン

## 画面3：財務諸表

タブ表示：

- PL
- BS
- CF

各項目にツールチップをつけ、会計用語を説明する。

## 画面4：ゲームログ

表示内容：

- 各四半期の意思決定
- イベント
- 財務結果
- 学習ポイント

## 画面5：結果レポート

表示内容：

- 最終スコア
- 倒産またはIPO到達判定
- 財務健全性評価
- 成長性評価
- 意思決定の振り返り
- 学習ポイント

---

## イベントカード初期案

```json
[
  {
    "id": "viral_sns",
    "title": "SNSで商品がバズる",
    "description": "商品紹介動画が拡散し、需要が急増した。",
    "category": "market",
    "effect": { "demandMultiplier": 1.5, "brandPowerDelta": 5 },
    "learningPoint": "急な需要増には在庫と供給能力が必要。売上機会を逃すこともある。"
  },
  {
    "id": "material_price_hike",
    "title": "原材料価格の高騰",
    "description": "主要原材料の価格が上昇し、売上原価が増加した。",
    "category": "supply",
    "effect": { "cogsMultiplier": 1.25 },
    "learningPoint": "原価上昇は粗利率を圧迫する。価格改定や調達先分散が対策になる。"
  },
  {
    "id": "interest_rate_hike",
    "title": "金利上昇",
    "description": "金融市場の環境悪化により借入金利が上昇した。",
    "category": "finance",
    "effect": { "interestRateDelta": 0.01 },
    "learningPoint": "借入依存度が高い企業は金利上昇に弱い。"
  }
]
```

---

## チュートリアルシナリオ

## シナリオ：D2Cブランドを黒字化せよ

### 初期条件

```json
{
  "cash": 50000000,
  "inventory": 5000,
  "debt": 0,
  "valuation": 200000000,
  "employees": 8,
  "brandPower": 20,
  "productQuality": 60,
  "supplyStability": 70,
  "marketShare": 1,
  "customerBase": 1000
}
```

### 期間

- 12四半期

### 目標

- 営業黒字化
- 現金残高1,000万円以上
- 累計売上2億円以上

### 学習テーマ

- 広告投資と需要創出
- 在庫切れと過剰在庫
- 粗利率
- 資金調達タイミング
- 黒字倒産

---

## AIエージェントへのタスク分解

## Phase 1：プロジェクト初期化

### 指示

```
Next.js + TypeScript + Tailwind CSSで新規プロジェクトを作成してください。
トップページ、ゲーム画面、基本コンポーネントの空実装を作ってください。
```

### 完了条件

- `npm run dev` で起動できる
- トップ画面が表示される
- `/game` に遷移できる
- Tailwind CSSが適用されている

---

## Phase 2：型定義と初期データ

### 指示

```
types/game.ts、types/finance.ts、types/decision.tsを作成してください。
CompanyState、Decisions、FinancialStatements、EventCard、GameLogEntryの型を定義してください。
data/initialCompany.json、data/eventCards.json、data/scenarios.json、data/glossary.jsonを作成してください。
```

### 完了条件

- 型エラーがない
- 初期会社データを読み込める
- イベントカードを最低10個定義している
- 用語集を最低20語定義している

---

## Phase 3：財務計算ロジック

### 指示

```
lib/finance.tsを実装してください。
売上、売上原価、粗利益、営業利益、純利益、営業CF、財務CF、期末現金、在庫評価額を計算する純粋関数を作ってください。
各関数にはVitestで単体テストを書いてください。
```

### 完了条件

- 財務計算関数が純粋関数になっている
- 主要ケースのテストが通る
- 現金、在庫、利益の計算が一貫している

---

## Phase 4：ターン処理エンジン

### 指示

```
lib/gameEngine.tsを実装してください。
processTurn(state, decisions, event) を中心に、1四半期分のゲーム進行を処理してください。
倒産判定、企業価値更新、ゲームログ生成も含めてください。
```

### 完了条件

- 1ターン進めると四半期が1増える
- 意思決定が財務諸表に反映される
- 現金不足でゲームオーバーになる
- イベント効果が需要、原価、金利などに反映される

---

## Phase 5：ゲームUI

### 指示

```
Dashboard、DecisionPanel、FinancialStatements、EventCard、KPIBoard、GameLogを実装してください。
プレイヤーが広告費、生産数量、採用人数、研究開発費、価格、借入額、返済額を入力できるようにしてください。
```

### 完了条件

- 入力値を変更できる
- 次ターンへ進める
- KPIが更新される
- PL / BS / CFが表示される
- イベントカードが表示される

---

## Phase 6：学習体験

### 指示

```
用語ツールチップ、学習ポイント、失敗理由の表示を実装してください。
ゲームログには各ターンの意思決定と結果に加え、学習コメントを含めてください。
```

### 完了条件

- 財務項目に説明が表示される
- イベントごとに学習ポイントが表示される
- 倒産時に理由が説明される
- 結果画面で改善提案が表示される

---

## Phase 7：チュートリアル完成

### 指示

```
12四半期のD2Cブランド黒字化シナリオを実装してください。
序盤3ターンはガイド付きにし、プレイヤーに広告、在庫、資金調達の基本を説明してください。
```

### 完了条件

- チュートリアルが12ターン完走できる
- 初心者向けガイドが表示される
- クリア条件と失敗条件が判定される

---

## Phase 8：品質改善

### 指示

```
UIの見やすさ、レスポンシブ対応、数値フォーマット、エラーハンドリングを改善してください。
Playwrightで主要導線のE2Eテストを書いてください。
```

### 完了条件

- モバイル幅でも操作できる
- 金額が日本円形式で表示される
- 不正な入力が防止される
- トップ画面からゲーム終了までのE2Eテストが通る

---

## 実装優先順位

| 優先度 | 実装項目 | 理由 |
| --- | --- | --- |
| 最高 | 財務計算ロジック | ゲームの学習価値の中核 |
| 最高 | ターン処理 | ゲーム成立に必須 |
| 高 | 意思決定UI | プレイヤー体験の中心 |
| 高 | PL / BS / CF表示 | 教育価値の中心 |
| 中 | イベントカード | リプレイ性と現実感を高める |
| 中 | チュートリアル | 初心者向け体験に必要 |
| 低 | M&A | MVP後の拡張要素 |
| 低 | IPO・株式市場詳細 | MVP後の拡張要素 |

---

## AIエージェントへの共通実装ルール

```
1. まず型定義を作り、型に合わせて実装してください。
2. 財務計算はUIから分離し、純粋関数として実装してください。
3. 1つの関数に複数責務を持たせないでください。
4. 金額は内部的にはnumberで扱い、表示時に日本円形式へ変換してください。
5. ゲームバランス値はコードに直書きせず、可能な限りdata配下のJSONに置いてください。
6. 主要ロジックには単体テストを追加してください。
7. UIよりも先にゲームエンジンと財務計算の正しさを優先してください。
8. プレイヤーが失敗したときは、必ず原因と学習ポイントを表示してください。
9. 実装ごとにREADMEへ仕様と起動方法を追記してください。
10. 変更後は型チェック、Lint、テストを実行してください。
```

---

## 最初にAIエージェントへ渡すプロンプト

```
あなたはTypeScript / Next.jsに精通したゲーム開発エージェントです。
ブラウザで動く経営シミュレーションゲームMVPを実装してください。

目的は、プレイヤーがD2CブランドのCEOとなり、12四半期で黒字化を目指すゲームです。
プレイヤーは広告費、生産数量、採用人数、研究開発費、価格、借入、返済、エクイティ調達を意思決定します。
意思決定の結果は、PL、BS、CF、現金残高、企業価値、市場シェアに反映されます。

最初の実装ではM&AやIPOの詳細は不要です。
最優先は、財務計算ロジック、ターン処理、財務諸表表示、倒産判定です。

以下の順番で実装してください。
1. Next.js + TypeScript + Tailwind CSSの初期構築
2. 型定義
3. 初期データJSON
4. 財務計算ロジック
5. ターン処理エンジン
6. 経営ダッシュボードUI
7. PL / BS / CF表示
8. イベントカード
9. チュートリアル
10. テスト

実装時のルール：
- 財務計算は純粋関数にする
- UIとゲームロジックを分離する
- 金額表示は日本円形式にする
- ゲームバランス値はJSONで管理する
- 主要ロジックにはVitestで単体テストを書く
- 現金がマイナスになったらゲームオーバーにする
- ゲームオーバー時には倒産理由と学習ポイントを表示する
```

---

## 将来拡張ロードマップ

## Version 0.2

- SaaS企業シナリオ
- ARR、チャーン、LTV/CAC
- サブスクリプション収益モデル

## Version 0.3

- M&Aシステム
- 買収価格交渉
- PMI
- のれん減損

## Version 0.4

- サプライチェーン詳細化
- 複数サプライヤー
- 品質リスク
- 物流遅延

## Version 0.5

- IPOシステム
- 株価
- 株主圧力
- 四半期決算イベント

## Version 1.0

- 複数業界対応
- 難易度選択
- 実績システム
- シナリオエディタ
- 教材モード

---

## 成功判定

MVPは以下を満たせば成功とする。

- 10分以内に1プレイを完了できる
- プレイヤーが「利益」と「現金」の違いを理解できる
- 広告投資、在庫、生産、資金調達のトレードオフが体験できる
- 倒産しても納得感のある説明が出る
- もう一度プレイして改善したくなる

---

## コアコピー

> 資金は有限。市場は変化する。
> 

> あなたの決断が、企業をユニコーンにも、倒産にも導く。
>