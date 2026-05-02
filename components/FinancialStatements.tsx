import type { FinancialStatements as FS } from '@/types/finance'

const yen = (v: number) => new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(v)

export default function FinancialStatements({ statements }: { statements: FS }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-3 text-lg font-semibold">財務諸表</h2>
      <p className="text-sm">PL 売上: {yen(statements.pl.revenue)} / 純利益: {yen(statements.pl.netIncome)}</p>
      <p className="text-sm">BS 現金: {yen(statements.bs.cash)} / 負債: {yen(statements.bs.debt)}</p>
      <p className="text-sm">CF 営業CF: {yen(statements.cf.operatingCashFlow)} / 財務CF: {yen(statements.cf.financingCashFlow)}</p>
    </div>
  )
}
