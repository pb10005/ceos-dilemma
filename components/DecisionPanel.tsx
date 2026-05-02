import type { Decisions } from '@/types/decision'

type Props = {
  decisions: Decisions
  onChange: (next: Decisions) => void
  onNextTurn: () => void
}

const NumberInput = ({
  label,
  value,
  onChange,
  min = 0,
  step = 1
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  step?: number
}) => (
  <label className="flex flex-col gap-1 text-sm">
    <span>{label}</span>
    <input
      className="rounded border border-slate-700 bg-slate-800 p-2"
      type="number"
      inputMode="numeric"
      min={min}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  </label>
)

export default function DecisionPanel({ decisions, onChange, onNextTurn }: Props) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-3 text-lg font-semibold">意思決定</h2>
      <div className="grid gap-2 md:grid-cols-2">
        <NumberInput label="広告費" value={decisions.adSpend} onChange={(v) => onChange({ ...decisions, adSpend: v })} />
        <NumberInput label="生産数量" value={decisions.productionUnits} onChange={(v) => onChange({ ...decisions, productionUnits: v })} />
        <NumberInput label="採用人数" min={-5} value={decisions.hireCount} onChange={(v) => onChange({ ...decisions, hireCount: v })} />
        <NumberInput label="R&D費" value={decisions.rAndDSpend} onChange={(v) => onChange({ ...decisions, rAndDSpend: v })} />
        <NumberInput label="販売価格" value={decisions.price} onChange={(v) => onChange({ ...decisions, price: v })} />
        <NumberInput label="借入額" value={decisions.borrowDebt} onChange={(v) => onChange({ ...decisions, borrowDebt: v })} />
        <NumberInput label="返済額" value={decisions.repayDebt} onChange={(v) => onChange({ ...decisions, repayDebt: v })} />
      </div>
      <label className="mt-3 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={decisions.raiseEquity}
          onChange={(e) => onChange({ ...decisions, raiseEquity: e.target.checked })}
        />
        エクイティ調達を実行
      </label>
      <button className="mt-4 w-full rounded bg-emerald-400 px-4 py-2 font-semibold text-slate-950 md:w-auto" onClick={onNextTurn}>次の四半期へ</button>
    </div>
  )
}
