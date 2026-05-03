type TrendPoint = { quarter: number; value: number }

const formatSignedYen = (value: number) =>
  new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0, signDisplay: 'exceptZero' }).format(value)

export default function TrendChart({ title, points, tone = 'cyan' }: { title: string; points: TrendPoint[]; tone?: 'cyan' | 'emerald' | 'violet' }) {
  if (points.length === 0) {
    return (
      <div className="rounded-lg border border-slate-700 bg-slate-950/30 p-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-2 text-xs text-slate-400">データが蓄積されると推移を表示します。</p>
      </div>
    )
  }

  const width = 260
  const height = 90
  const values = points.map((point) => point.value)
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = Math.max(1, max - min)

  const path = points
    .map((point, index) => {
      const x = points.length === 1 ? width / 2 : (index / (points.length - 1)) * width
      const y = height - ((point.value - min) / range) * height
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')

  const strokeClass = tone === 'emerald' ? 'stroke-emerald-400' : tone === 'violet' ? 'stroke-violet-400' : 'stroke-cyan-400'
  const latest = points[points.length - 1]

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-950/30 p-3">
      <h3 className="text-sm font-semibold">{title}</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-2 h-24 w-full">
        <path d={path} fill="none" className={`${strokeClass} stroke-2`} />
      </svg>
      <p className="mt-2 text-xs text-slate-300">最新: Q{latest.quarter} {formatSignedYen(latest.value)}</p>
    </div>
  )
}
