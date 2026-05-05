import type { OperationalMetrics } from '@/types/game'

const yen = (v: number) => new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(v)

function Row({ label, value, valueClass = 'text-slate-100' }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 py-0.5">
      <span className="shrink-0 text-xs text-slate-400">{label}</span>
      <span className={`tabular-nums text-xs font-medium ${valueClass}`}>{value}</span>
    </div>
  )
}

function DeltaRow({ label, before, after, decimals = 0 }: { label: string; before: number; after: number; decimals?: number }) {
  const delta = after - before
  const sign = delta >= 0 ? '+' : ''
  const fmt = (v: number) => v.toFixed(decimals)
  const deltaClass = delta > 0 ? 'text-emerald-300' : delta < 0 ? 'text-amber-300' : 'text-slate-400'
  return (
    <div className="flex items-baseline justify-between gap-2 py-0.5">
      <span className="shrink-0 text-xs text-slate-400">{label}</span>
      <div className="flex items-baseline gap-1.5">
        <span className={`text-xs font-medium ${deltaClass}`}>({sign}{fmt(delta)})</span>
        <span className="tabular-nums text-xs font-medium text-slate-100">{fmt(after)}</span>
      </div>
    </div>
  )
}

export default function TurnResult({ metrics }: { metrics: OperationalMetrics }) {
  const inventoryDelta = metrics.endingInventoryUnits - metrics.beginningInventory
  const isInventoryConstrained = metrics.unitsSold < metrics.demand
  const hireLabel =
    metrics.hireCount === 0 ? '変動なし' :
    metrics.hireCount > 0 ? `+${metrics.hireCount}人採用` :
    `${metrics.hireCount}人削減`
  const hireClass =
    metrics.hireCount > 0 ? 'text-emerald-300' :
    metrics.hireCount < 0 ? 'text-red-400' :
    'text-slate-400'
  const grossMarginClass =
    metrics.grossMarginPct >= 40 ? 'text-emerald-300' :
    metrics.grossMarginPct >= 20 ? 'text-yellow-300' :
    'text-red-400'
  const costReductionPct = Math.round((1 - metrics.qualityCostMultiplier) * 100)

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-3 text-lg font-semibold">今期の結果</h2>
      <div className="space-y-2">

        {/* 需要・販売 */}
        <div className="rounded-lg bg-slate-800/60 px-3 py-2">
          <p className="mb-1 text-xs font-semibold text-slate-300">需要・販売</p>
          <Row label="基礎需要" value={`${Math.floor(metrics.demand - metrics.adDemandEffect - metrics.repeatDemand - metrics.qualityDemandBoost).toLocaleString()}件`} />
          <Row
            label="広告効果"
            value={`+${Math.floor(metrics.adDemandEffect).toLocaleString()}件 (${yen(metrics.adSpend)})`}
            valueClass="text-cyan-300"
          />
          {metrics.repeatDemand > 0 && (
            <Row label="リピート需要（LTV）" value={`+${metrics.repeatDemand.toLocaleString()}件`} valueClass="text-violet-300" />
          )}
          {metrics.qualityDemandBoost > 0 && (
            <Row label="品質需要増" value={`+${metrics.qualityDemandBoost.toLocaleString()}件`} valueClass="text-emerald-300" />
          )}
          <div className="flex items-baseline justify-between gap-2 py-0.5">
            <span className="shrink-0 text-xs text-slate-400">販売数</span>
            <div className="flex items-center gap-1.5">
              {isInventoryConstrained && (
                <span className="rounded bg-amber-900/60 px-1.5 py-0.5 text-xs font-medium text-amber-300">在庫制約あり</span>
              )}
              <span className="tabular-nums text-xs font-medium text-slate-100">
                {metrics.unitsSold.toLocaleString()}件
              </span>
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2 py-0.5">
            <span className="shrink-0 text-xs text-slate-400">在庫残</span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-xs font-medium ${inventoryDelta >= 0 ? 'text-emerald-300' : 'text-amber-300'}`}>
                {inventoryDelta >= 0 ? `↑ +${inventoryDelta.toLocaleString()}` : `↓ ${inventoryDelta.toLocaleString()}`}件
              </span>
              <span className="tabular-nums text-xs font-medium text-slate-100">
                {metrics.endingInventoryUnits.toLocaleString()}件
              </span>
            </div>
          </div>
        </div>

        {/* 組織 */}
        <div className="rounded-lg bg-slate-800/60 px-3 py-2">
          <p className="mb-1 text-xs font-semibold text-slate-300">組織</p>
          <div className="flex items-baseline justify-between gap-2 py-0.5">
            <span className="shrink-0 text-xs text-slate-400">社員数</span>
            <div className="flex items-baseline gap-1.5">
              <span className="tabular-nums text-xs font-medium text-slate-100">
                {metrics.employeesBefore}人 → {metrics.employeesAfter}人
              </span>
              <span className={`text-xs font-medium ${hireClass}`}>（{hireLabel}）</span>
            </div>
          </div>
        </div>

        {/* 粗利率 */}
        <div className="rounded-lg bg-slate-800/60 px-3 py-2">
          <p className="mb-1 text-xs font-semibold text-slate-300">粗利率</p>
          <Row label="当期" value={`${metrics.grossMarginPct.toFixed(1)}%`} valueClass={grossMarginClass} />
          {costReductionPct > 0 && (
            <Row label="品質による原価低減" value={`-${costReductionPct}%`} valueClass="text-emerald-300" />
          )}
        </div>

        {/* 成長指標 */}
        <div className="rounded-lg bg-slate-800/60 px-3 py-2">
          <p className="mb-1 text-xs font-semibold text-slate-300">成長指標</p>
          <DeltaRow label="ブランド力" before={metrics.brandPowerBefore} after={metrics.brandPowerBefore + metrics.brandGain} decimals={1} />
          <DeltaRow label="製品品質" before={metrics.productQualityBefore} after={metrics.productQualityBefore + metrics.qualityGain} decimals={1} />
          <DeltaRow label="顧客数" before={metrics.customerBaseBefore} after={metrics.customerBaseBefore + metrics.customerGain} decimals={0} />
        </div>

      </div>
    </div>
  )
}
