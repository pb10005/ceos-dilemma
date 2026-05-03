# CEO's Dilemma — デザインガイド

## 1. カラーパレット

### 背景レイヤー

| トークン       | Tailwind クラス    | Hex       | 用途                                        |
|--------------|-------------------|-----------|--------------------------------------------|
| ページ背景    | `bg-slate-950`    | `#020617` | body 全体の背景（globals.css）              |
| カード        | `bg-slate-900`    | `#0f172a` | すべてのカードコンテナ                       |
| 入力 / タイル | `bg-slate-800`    | `#1e293b` | MetricTile・入力欄・ボタン                  |
| 内部セクション | `bg-slate-800/60` | `#1e293b99` | カード内の StatSection など                |

### ボーダートーン

| Tailwind クラス       | 用途                                              |
|-----------------------|--------------------------------------------------|
| `border-slate-700`    | 標準カードボーダー・リストアイテム                 |
| `border-slate-800`    | 控えめなカードボーダー（KPIBoard・DecisionPanel）  |
| `border-{color}-700`  | アラート枠（amber-700 / yellow-700 / red-700）    |

### テキストカラー

| トークン   | Tailwind クラス   | Hex       | 用途                                   |
|----------|-------------------|-----------|----------------------------------------|
| 一次     | `text-slate-100`  | `#f1f5f9` | 見出し・値・主要テキスト                 |
| 二次     | `text-slate-300`  | `#cbd5e1` | 説明文・本文                            |
| ラベル   | `text-slate-400`  | `#94a3b8` | フォームラベル・補足テキスト（xs）        |
| 淡い二次 | `text-slate-200`  | `#e2e8f0` | カード内のサブ見出し                     |

### セマンティックアクセントカラー

| セマンティック役割   | Tailwind クラス      | Hex       | 用途                                        |
|--------------------|---------------------|-----------|---------------------------------------------|
| 正 / 成功          | `text-emerald-300`  | `#6ee7b7` | 健全な現金・Q番号・学習ポイント              |
| 正 ハイライト      | `text-emerald-400`  | `#34d399` | 主要アクションボタンの背景                  |
| 警告 / 負債        | `text-amber-300`    | `#fcd34d` | 負債の値・リスク予兆の見出し                |
| 危険 / 損失        | `text-red-400`      | `#f87171` | 純損失・資金危機・ゲームオーバー             |
| 企業価値           | `text-violet-300`   | `#c4b5fd` | 企業価値のみに使用                          |
| チャート — 売上    | `stroke-cyan-400`   | `#22d3ee` | TrendChart 売上ライン                       |
| チャート — 純利益  | `stroke-emerald-400`| `#34d399` | TrendChart 純利益ライン                     |
| チャート — 現金    | `stroke-violet-400` | `#a78bfa` | TrendChart 現金ライン                       |
| アクティブ状態     | `bg-blue-600`       | `#2563eb` | 選択中の業種プリセットボタン                |

### アラート背景

形式: `bg-{color}-950/40` + `border-{color}-700` の組み合わせ

| 種別    | 背景                | ボーダー              |
|--------|---------------------|----------------------|
| リスク予兆 | `bg-amber-950/40`  | `border-amber-700`   |
| 銀行警告   | `bg-yellow-950/40` | `border-yellow-700`  |
| ゲームオーバー | `bg-red-900`   | —                    |

---

## 2. タイポグラフィスケール

| 役割               | Tailwind クラス                                  | 備考                             |
|------------------|--------------------------------------------------|----------------------------------|
| ページタイトル     | `text-4xl font-bold`                             | `<h1>` — ホームページ            |
| カード見出し       | `text-lg font-semibold`                          | `<h2>` — カード内                |
| セクション見出し   | `text-sm font-semibold text-slate-200`           | StatSection タイトルなど          |
| 年度見出し         | `text-xs font-bold text-slate-200`               | 年度別レポート行                  |
| ラベル             | `text-xs text-slate-400`                         | MetricTile ラベル・フォームラベル |
| 値（メイン）       | `text-sm font-semibold leading-tight`            | MetricTile の値                  |
| 値（表形式）       | `tabular-nums text-xs font-medium`               | 財務数値の行                      |
| 本文 / 説明        | `text-sm text-slate-300`                         | イベント説明・チュートリアル      |
| キャプション       | `text-xs text-slate-300`                         | ゲームログ要約・チャート最新値    |
| 学習ポイント       | `text-xs text-emerald-300`                       | EventCard / GameLog              |
| Q バッジ           | `text-xs font-bold text-emerald-300`             | `rounded bg-slate-700 px-1.5 py-0.5` 内 |

---

## 3. コンポーネントパターン

### カード（外側コンテナ）

```tsx
<div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
  <h2 className="mb-3 text-lg font-semibold">カード見出し</h2>
  {/* コンテンツ */}
</div>
```

より強い区切りが必要な場合は `border-slate-700` を使用。

### MetricTile（KPIBoard）

```tsx
<div className="rounded-lg bg-slate-800 px-3 py-2">
  <div className="flex items-center gap-1.5">
    <Icon className="h-3 w-3 text-slate-400" />
    <p className="text-xs text-slate-400">ラベル</p>
  </div>
  <p className="mt-0.5 text-sm font-semibold leading-tight text-slate-100">値</p>
</div>
```

### StatSection（財務諸表の内部）

```tsx
<div className="rounded-lg bg-slate-800/60 px-3 py-2">
  <p className="mb-1 text-xs font-semibold text-slate-300">セクション名</p>
  <div className="flex items-baseline justify-between gap-2 py-0.5">
    <span className="shrink-0 text-xs text-slate-400">ラベル</span>
    <span className="tabular-nums text-xs font-medium">値</span>
  </div>
</div>
```

### ボタン — 主要アクション

```tsx
<button className="rounded bg-emerald-400 px-4 py-2 font-semibold text-slate-950 w-full md:w-auto">
  アクション
</button>
```

### ボタン — セカンダリ / トグル

```tsx
<button className="rounded-md bg-slate-800 px-3 py-1 text-sm text-slate-200">
  ラベル
</button>
{/* アクティブ: bg-blue-600 text-white */}
```

### タブバー

```tsx
<div className="flex rounded-xl border border-slate-700 bg-slate-900 p-1">
  <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors bg-slate-700 text-white">
    <Icon className="h-4 w-4" /> アクティブ
  </button>
  <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors text-slate-400 hover:text-slate-200">
    <Icon className="h-4 w-4" /> 非アクティブ
  </button>
</div>
```

### アラート / コールアウト

```tsx
<div className="rounded-xl border border-amber-700 bg-amber-950/40 p-4 text-sm">
  <div className="flex items-center gap-2">
    <AlertTriangle className="h-4 w-4 text-amber-300" />
    <h2 className="text-lg font-semibold text-amber-300">見出し</h2>
  </div>
  <p className="text-amber-100">本文</p>
</div>
```

### NumberInput（DecisionPanel）

```tsx
<label className="flex flex-col gap-1 text-sm">
  <span className="flex items-center gap-1.5">
    <Icon className="h-4 w-4 text-slate-400" />
    ラベル
  </span>
  <input className="rounded border border-slate-700 bg-slate-800 p-2" type="number" ... />
</label>
```

### ゲームログエントリ

```tsx
<li className="rounded-lg border border-slate-700 bg-slate-800/60 p-3">
  <div className="flex items-center gap-2">
    <span className="rounded bg-slate-700 px-1.5 py-0.5 text-xs font-bold text-emerald-300">Q{n}</span>
    <CategoryIcon className="h-3 w-3 text-slate-400" />
    <span className="text-sm font-medium text-slate-100">イベントタイトル</span>
  </div>
  <p className="mt-1 text-xs text-slate-300">サマリー</p>
  <p className="mt-1 text-xs text-emerald-400/80">学習: ポイント</p>
</li>
```

---

## 4. アイコン使用ガイド

### ライブラリ

`lucide-react` — 名前付きエクスポートで個別インポート。ビルド時にツリーシェイキングされる。

```tsx
import { Calendar, Banknote } from '@/components/icons'
```

### サイズルール

| コンテキスト                 | クラス      | px   |
|--------------------------|------------|------|
| 標準インライン（ほぼすべて）   | `h-4 w-4`  | 16px |
| xs テキスト内（バッジ横など） | `h-3 w-3`  | 12px |

### カラールール

- **ラベル横のアイコン**: 隣接するラベルテキストと同色 → `text-slate-400`
- **値が動的に色変化するメトリクス**: アイコンは `text-slate-400` に固定し、値テキストのみ動的色に
- **アラートアイコン**: アラートテキストと同色（`text-amber-300`・`text-yellow-200`・`text-red-400`）

### アイコンマッピング

#### KPI メトリクス

| KPI               | アイコン     | カラー             |
|-------------------|------------|-------------------|
| 四半期            | `Calendar`   | `text-slate-400`  |
| 現金              | `Banknote`   | `text-slate-400`  |
| 売上              | `TrendingUp` | `text-slate-400`  |
| 有利子負債        | `TrendingDown` | `text-slate-400` |
| 企業価値          | `Building2`  | `text-slate-400`  |

#### イベントカテゴリ

| カテゴリ       | アイコン       | カラー            |
|-------------|-------------|------------------|
| `market`    | `Zap`       | `text-slate-400` |
| `supply`    | `Package`   | `text-slate-400` |
| `finance`   | `DollarSign`| `text-slate-400` |
| `competition`| `Swords`   | `text-slate-400` |
| `internal`  | `Users`     | `text-slate-400` |

#### 意思決定入力

| フィールド          | アイコン          | カラー            |
|------------------|----------------|------------------|
| `adSpend`        | `Megaphone`    | `text-slate-400` |
| `productionUnits`| `Factory`      | `text-slate-400` |
| `hireCount`      | `UserPlus`     | `text-slate-400` |
| `rAndDSpend`     | `FlaskConical` | `text-slate-400` |
| `price`          | `Tag`          | `text-slate-400` |
| `borrowDebt`     | `CreditCard`   | `text-slate-400` |
| `repayDebt`      | `ArrowDownCircle` | `text-slate-400` |

#### ナビゲーションタブ

| タブ          | アイコン     |
|-------------|-----------|
| `status`    | `BarChart3` |
| `decision`  | `Lightbulb` |
| `history`   | `History`   |

#### 業種プリセット

| 業種               | アイコン        |
|-----------------|--------------|
| `saas`          | `Cloud`      |
| `retail`        | `ShoppingCart` |
| `manufacturing` | `Wrench`     |

#### アラート

| 種別     | アイコン          | カラー              |
|--------|----------------|-------------------|
| 警告    | `AlertTriangle` | `text-amber-300`  |
| 銀行警告 | `AlertTriangle` | `text-yellow-200` |
| ゲームオーバー | `XCircle`  | `text-red-400`   |

---

## 5. スペーシングシステム

Tailwind のデフォルト 4px ベースユニットのみ使用。カスタムスペーシングトークンは定義しない。

| スケール | px   | 主な用途                                  |
|--------|------|------------------------------------------|
| `0.5`  | 2px  | `mt-0.5` — ラベルと値の密接なスタック     |
| `1`    | 4px  | `gap-1`, `py-0.5` — StatSection 行内密度 |
| `1.5`  | 6px  | `gap-1.5` — アイコン + ラベルのインライン間隔 |
| `2`    | 8px  | `gap-2`, `py-2` — 標準行間隔              |
| `3`    | 12px | `p-3`, `gap-3` — コンパクトカード内パディング |
| `4`    | 16px | `p-4` — 標準カードパディング               |

---

## 6. Do's and Don'ts

### Do ✅
- ラベル横のデコレーティブアイコンには `text-slate-400` を使う
- アイコンとテキストの間隔は `gap-1.5`
- 単一行テキストとアイコンを揃えるときは `items-center`
- 財務行のラベル/値ペアには `items-baseline`（アイコンなし）
- カード見出しは `text-lg font-semibold`（追加カラー不要）
- 動的に更新される数値すべてに `tabular-nums`
- インタラクティブボタンには `transition-colors`
- 主要ボタンのテキストは `text-slate-950`（emerald 背景上）

### Don't ❌
- カスタム CSS や非 Tailwind スタイル属性を追加しない
- 値テキストに `text-white` を使わない → `text-slate-100` を使う
- アイコンサイズは `h-4 w-4` と `h-3 w-3` 以外を使わない
- 隣接テキストと異なるアイコン色を使わない（低プロミネンス装飾を除く）
- `bg-slate-900` カードの中に `bg-slate-900` をネストしない → 内部セクションは `bg-slate-800/60`
- カード内サブ見出しに `font-bold` を使わない → `font-semibold`
- MetricTile に `border` を追加しない（`bg-slate-800` のみ、ボーダーなし）
- アイコン名前空間全体をインポートしない → 個別インポートのみ（ツリーシェイキング）
