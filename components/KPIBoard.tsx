import { Calendar, Banknote, TrendingUp, TrendingDown, Building2, Users, Package } from '@/components/icons'
import type { LucideIcon } from '@/components/icons'

type KPIBoardProps = {
  quarter: number
  cash: number
  revenue: number
  debt: number
  valuation: number
  employees: number
  inventory: number
}

const yen = (v: number) => new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(v)

const cashColor = (cash: number) => {
  if (cash < 5000000) return 'text-red-400'
  if (cash < 20000000) return 'text-yellow-300'
  return 'text-emerald-300'
}

function MetricTile({
  label,
  value,
  valueClass = 'text-slate-100',
  icon: Icon,
}: {
  label: string
  value: string
  valueClass?: string
  icon?: LucideIcon
}) {
  return (
    <div className="rounded-lg bg-slate-800 px-3 py-2">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="h-3 w-3 text-slate-400" />}
        <p className="text-xs text-slate-400">{label}</p>
      </div>
      <p className={`mt-0.5 text-sm font-semibold leading-tight ${valueClass}`}>{value}</p>
    </div>
  )
}

export default function KPIBoard({ quarter, cash, revenue, debt, valuation, employees, inventory }: KPIBoardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-3 text-lg font-semibold">KPI</h2>
      <div className="grid grid-cols-2 gap-2">
        <MetricTile label="四半期" value={`Q${quarter}`} valueClass="text-emerald-300 text-base font-bold" icon={Calendar} />
        <MetricTile label="現金" value={yen(cash)} valueClass={cashColor(cash)} icon={Banknote} />
        <MetricTile label="売上" value={yen(revenue)} icon={TrendingUp} />
        <MetricTile label="有利子負債" value={yen(debt)} valueClass={debt > 0 ? 'text-amber-300' : 'text-slate-100'} icon={TrendingDown} />
        <MetricTile label="社員数" value={`${employees}人`} icon={Users} />
        <MetricTile label="在庫数" value={`${inventory.toLocaleString()}件`} icon={Package} />
        <div className="col-span-2 rounded-lg bg-slate-800 px-3 py-2">
          <div className="flex items-center gap-1.5">
            <Building2 className="h-3 w-3 text-slate-400" />
            <p className="text-xs text-slate-400">企業価値</p>
          </div>
          <p className="mt-0.5 text-sm font-semibold text-violet-300">{yen(valuation)}</p>
        </div>
      </div>
    </div>
  )
}
