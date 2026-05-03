import type { FinancialStatements as FS } from '@/types/finance'

const yen = (v: number) => new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(v)

type AnnualReport = {
  fiscalYear: number
  plRevenue: number
  plNetIncome: number
  bsCash: number
  bsDebt: number
  cfOperating: number
  cfFinancing: number
}

export default function FinancialStatements({ statements, annualReports }: { statements: FS, annualReports: AnnualReport[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-3 text-lg font-semibold">財務諸表</h2>
      <p className="text-sm">PL 売上: {yen(statements.pl.revenue)} / 純利益: {yen(statements.pl.netIncome)}</p>
      <p className="text-sm">BS 現金: {yen(statements.bs.cash)} / 負債: {yen(statements.bs.debt)}</p>
      <p className="text-sm">CF 営業CF: {yen(statements.cf.operatingCashFlow)} / 財務CF: {yen(statements.cf.financingCashFlow)}</p>

      <h3 className="mb-2 mt-4 text-base font-semibold">年度別 財務三表サマリー</h3>
      {annualReports.length === 0 ? (
        <p className="text-xs text-slate-400">四半期を進めると年度集計が表示されます。</p>
      ) : (
        <div className="space-y-2">
          {annualReports.map((report) => (
            <div key={report.fiscalYear} className="rounded border border-slate-700 p-2 text-xs">
              <p className="font-semibold">第{report.fiscalYear}年度</p>
              <p>PL 売上: {yen(report.plRevenue)} / 純利益: {yen(report.plNetIncome)}</p>
              <p>BS 現金: {yen(report.bsCash)} / 負債: {yen(report.bsDebt)}</p>
              <p>CF 営業CF: {yen(report.cfOperating)} / 財務CF: {yen(report.cfFinancing)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
