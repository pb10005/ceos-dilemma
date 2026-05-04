import type { Decisions } from '@/types/decision'
import type { StrategyCoefficients } from '@/types/game'
import { Megaphone, Factory, UserPlus, FlaskConical, Tag, CreditCard, ArrowDownCircle } from '@/components/icons'
import type { LucideIcon } from '@/components/icons'

type Props = {
  decisions: Decisions
  onChange: (next: Decisions) => void
  onNextTurn: () => void
  strategies: StrategyCoefficients[]
  selectedStrategyId: string
  onStrategyChange: (strategyId: string) => void
}

// gameEngine.ts と同値を保つ定数
const UNIT_COST_BASE = 1200
const SALARY_BASE = 900000
const AD_DEMAND_BASE = 50000

function formatPct(multiplier: number): string {
  const delta = Math.round((multiplier - 1) * 100)
  if (delta === 0) return '±0%'
  return delta > 0 ? `+${delta}%` : `${delta}%`
}

function pctClass(multiplier: number, higherIsBetter: boolean): string {
  if (multiplier === 1) return 'text-slate-400'
  return (multiplier > 1) === higherIsBetter ? 'text-emerald-300' : 'text-amber-300'
}

const NumberInput = ({
  label,
  value,
  onChange,
  min = 0,
  step = 1,
  icon: Icon,
  hint,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  step?: number
  icon?: LucideIcon
  hint?: string
}) => (
  <label className="flex flex-col gap-1 text-sm">
    <span className="flex items-center gap-1.5">
      {Icon && <Icon className="h-4 w-4 text-slate-400" />}
      {label}
    </span>
    <input
      className="rounded border border-slate-700 bg-slate-800 p-2"
      type="number"
      inputMode="numeric"
      min={min}
      step={step}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
    />
    {hint && <span className="text-xs text-slate-400">{hint}</span>}
  </label>
)

export default function DecisionPanel({ decisions, onChange, onNextTurn, strategies, selectedStrategyId, onStrategyChange }: Props) {
  const selectedStrategy = strategies.find((strategy) => strategy.id === selectedStrategyId)
  const s = selectedStrategy

  const effectiveAdDemand = s ? Math.floor((decisions.adSpend / AD_DEMAND_BASE) * s.adEffectMultiplier) : 0
  const effectiveUnitCost = s ? Math.floor(UNIT_COST_BASE * s.unitCostMultiplier) : UNIT_COST_BASE
  const grossMarginPerUnit = decisions.price - effectiveUnitCost
  const extraPayroll = s && decisions.hireCount !== 0
    ? Math.abs(decisions.hireCount) * SALARY_BASE * s.payrollMultiplier
    : 0

  const adHint = s ? `→ 需要貢献 +${effectiveAdDemand.toLocaleString()}件` : undefined
  const productionHint = s ? `→ 原価/個 ¥${effectiveUnitCost.toLocaleString()}` : undefined
  const hireHint = s && decisions.hireCount !== 0
    ? `→ 人件費${decisions.hireCount > 0 ? '増' : '減'} ¥${Math.floor(extraPayroll).toLocaleString()}/Q`
    : undefined
  const priceHint = `→ 粗利/個 ¥${grossMarginPerUnit.toLocaleString()}${grossMarginPerUnit < 0 ? ' ⚠️逆ザヤ' : ''}`

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-3 text-lg font-semibold">意思決定</h2>
      <label className="mb-2 flex flex-col gap-1 text-sm">
        <span>戦略プリセット</span>
        <select
          className="rounded border border-slate-700 bg-slate-800 p-2"
          value={selectedStrategyId}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onStrategyChange(e.target.value)}
        >
          {strategies.map((strategy) => (
            <option key={strategy.id} value={strategy.id}>{strategy.name}</option>
          ))}
        </select>
      </label>

      {s && (
        <div className="mb-3 rounded bg-slate-800 p-2">
          <p className="mb-1.5 text-xs font-semibold text-slate-300">戦略の効果（バランス型比）</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <span className={`text-xs ${pctClass(s.adEffectMultiplier, true)}`}>
              広告効率 {formatPct(s.adEffectMultiplier)}
            </span>
            <span className={`text-xs ${pctClass(s.unitCostMultiplier, false)}`}>
              原価 {formatPct(s.unitCostMultiplier)}
            </span>
            <span className={`text-xs ${pctClass(s.payrollMultiplier, false)}`}>
              人件費 {formatPct(s.payrollMultiplier)}
            </span>
            <span className={`text-xs ${pctClass(s.demandBaseMultiplier, true)}`}>
              基礎需要 {formatPct(s.demandBaseMultiplier)}
            </span>
            <span className={`text-xs ${pctClass(s.valuationMultiplier, true)}`}>
              企業価値評価 {formatPct(s.valuationMultiplier)}
            </span>
          </div>
        </div>
      )}

      <div className="grid gap-2 md:grid-cols-2">
        <NumberInput label="広告費" value={decisions.adSpend} icon={Megaphone} hint={adHint} onChange={(v) => onChange({ ...decisions, adSpend: v })} />
        <NumberInput label="生産数量" value={decisions.productionUnits} icon={Factory} hint={productionHint} onChange={(v) => onChange({ ...decisions, productionUnits: v })} />
        <NumberInput label="採用人数" min={-5} value={decisions.hireCount} icon={UserPlus} hint={hireHint} onChange={(v) => onChange({ ...decisions, hireCount: v })} />
        <NumberInput label="R&D費" value={decisions.rAndDSpend} icon={FlaskConical} onChange={(v) => onChange({ ...decisions, rAndDSpend: v })} />
        <NumberInput label="販売価格" value={decisions.price} icon={Tag} hint={priceHint} onChange={(v) => onChange({ ...decisions, price: v })} />
        <NumberInput label="借入額" value={decisions.borrowDebt} icon={CreditCard} onChange={(v) => onChange({ ...decisions, borrowDebt: v })} />
        <NumberInput label="返済額" value={decisions.repayDebt} icon={ArrowDownCircle} onChange={(v) => onChange({ ...decisions, repayDebt: v })} />
      </div>
      <label className="mt-3 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={decisions.raiseEquity}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...decisions, raiseEquity: e.target.checked })}
        />
        エクイティ調達を実行
      </label>
      <button className="mt-4 w-full rounded bg-emerald-400 px-4 py-2 font-semibold text-slate-950 md:w-auto" onClick={onNextTurn}>次の四半期へ</button>
    </div>
  )
}
