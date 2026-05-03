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

type StatItem = { label: string; value: string; valueClass?: string }

function StatSection({ title, items }: { title: string; items: StatItem[] }) {
  return (
    <div className="rounded-lg bg-slate-800/60 px-3 py-2">
      <p className="mb-1 text-xs font-semibold text-slate-300">{title}</p>
      {items.map((item) => (
        <div key={item.label} className="flex items-baseline justify-between gap-2 py-0.5">
          <span className="shrink-0 text-xs text-slate-400">{item.label}</span>
          <span className={`tabular-nums text-xs font-medium ${item.valueClass ?? ''}`}>{item.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function FinancialStatements({ statements, annualReports }: { statements: FS, annualReports: AnnualReport[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-3 text-lg font-semibold">財務諸表</h2>
      <div className="space-y-2">
        <StatSection
          title="PL 損益計算書"
          items={[
            { label: '売上', value: yen(statements.pl.revenue) },
            { label: '純利益', value: yen(statements.pl.netIncome), valueClass: statements.pl.netIncome >= 0 ? 'text-emerald-300' : 'text-red-400' },
          ]}
        />
        <StatSection
          title="BS 貸借対照表"
          items={[
            { label: '現金', value: yen(statements.bs.cash) },
            { label: '負債', value: yen(statements.bs.debt), valueClass: statements.bs.debt > 0 ? 'text-amber-300' : '' },
          ]}
        />
        <StatSection
          title="CF キャッシュフロー"
          items={[
            { label: '営業CF', value: yen(statements.cf.operatingCashFlow), valueClass: statements.cf.operatingCashFlow >= 0 ? 'text-emerald-300' : 'text-red-400' },
            { label: '財務CF', value: yen(statements.cf.financingCashFlow) },
          ]}
        />
      </div>

      <h3 className="mb-2 mt-4 text-sm font-semibold text-slate-200">年度別サマリー</h3>
      {annualReports.length === 0 ? (
        <p className="text-xs text-slate-400">四半期を進めると年度集計が表示されます。</p>
      ) : (
        <div className="space-y-2">
          {annualReports.map((report) => (
            <div key={report.fiscalYear} className="rounded-lg border border-slate-700 bg-slate-800/40 px-3 py-2">
              <p className="mb-1 text-xs font-bold text-slate-200">第{report.fiscalYear}年度</p>
              <div className="grid grid-cols-2 gap-x-6">
                <div className="flex items-baseline justify-between gap-1 py-0.5">
                  <span className="shrink-0 text-xs text-slate-400">売上</span>
                  <span className="tabular-nums text-xs font-medium">{yen(report.plRevenue)}</span>
                </div>
                <div className="flex items-baseline justify-between gap-1 py-0.5">
                  <span className="shrink-0 text-xs text-slate-400">純利益</span>
                  <span className={`tabular-nums text-xs font-medium ${report.plNetIncome >= 0 ? 'text-emerald-300' : 'text-red-400'}`}>{yen(report.plNetIncome)}</span>
                </div>
                <div className="flex items-baseline justify-between gap-1 py-0.5">
                  <span className="shrink-0 text-xs text-slate-400">期末現金</span>
                  <span className="tabular-nums text-xs font-medium">{yen(report.bsCash)}</span>
                </div>
                <div className="flex items-baseline justify-between gap-1 py-0.5">
                  <span className="shrink-0 text-xs text-slate-400">負債</span>
                  <span className={`tabular-nums text-xs font-medium ${report.bsDebt > 0 ? 'text-amber-300' : ''}`}>{yen(report.bsDebt)}</span>
                </div>
                <div className="flex items-baseline justify-between gap-1 py-0.5">
                  <span className="shrink-0 text-xs text-slate-400">営業CF</span>
                  <span className={`tabular-nums text-xs font-medium ${report.cfOperating >= 0 ? 'text-emerald-300' : 'text-red-400'}`}>{yen(report.cfOperating)}</span>
                </div>
                <div className="flex items-baseline justify-between gap-1 py-0.5">
                  <span className="shrink-0 text-xs text-slate-400">財務CF</span>
                  <span className="tabular-nums text-xs font-medium">{yen(report.cfFinancing)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
