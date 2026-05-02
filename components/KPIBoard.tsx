type KPIBoardProps = {
  quarter: number
  cash: number
  revenue: number
  debt: number
  valuation: number
}

const yen = (v: number) => new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(v)

export default function KPIBoard({ quarter, cash, revenue, debt, valuation }: KPIBoardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-3 text-lg font-semibold">KPI</h2>
      <ul className="space-y-1 text-sm text-slate-200">
        <li>四半期: Q{quarter}</li>
        <li>現金: {yen(cash)}</li>
        <li>売上: {yen(revenue)}</li>
        <li>有利子負債: {yen(debt)}</li>
        <li>企業価値: {yen(valuation)}</li>
      </ul>
    </div>
  )
}
