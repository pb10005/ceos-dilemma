import type { LucideIcon } from '@/components/icons'

type StartScreenProfile = {
  id: string
  label: string
  icon: LucideIcon
  companyName: string
  productName: string
  productTag: string
  productDescription: string
  challenge: string
  startingCash: number
  startingDebt: number
  startingEmployees: number
}

type Props = {
  profiles: StartScreenProfile[]
  selectedId: string
  onSelect: (id: string) => void
  onStart: () => void
}

const yen = (v: number) =>
  new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(v)

export default function StartScreen({ profiles, selectedId, onSelect, onStart }: Props) {
  const selected = profiles.find((p) => p.id === selectedId) ?? profiles[0]
  const SelectedIcon = selected.icon

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-12">
      <div className="text-center">
        <p className="mb-2 text-xs uppercase tracking-widest text-emerald-400">Business Strategy Simulation</p>
        <h1 className="text-3xl font-bold">CEO&apos;s Dilemma</h1>
        <p className="mt-2 text-sm text-slate-400">業種を選んでゲームを開始してください</p>
      </div>

      {/* Industry selection cards */}
      <div className="grid w-full max-w-xl gap-3 sm:grid-cols-3">
        {profiles.map((profile) => {
          const ProfileIcon = profile.icon
          const isSelected = profile.id === selectedId
          return (
            <button
              key={profile.id}
              type="button"
              onClick={() => onSelect(profile.id)}
              className={`flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors ${
                isSelected
                  ? 'border-emerald-500 bg-slate-800 ring-2 ring-emerald-500/30'
                  : 'border-slate-700 bg-slate-900 hover:border-slate-500'
              }`}
            >
              <div className={`rounded-lg p-2 ${isSelected ? 'bg-emerald-500/20' : 'bg-slate-800'}`}>
                <ProfileIcon className={`h-5 w-5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
              </div>
              <div>
                <p className={`font-semibold ${isSelected ? 'text-emerald-300' : 'text-slate-200'}`}>{profile.label}</p>
                <p className="text-xs text-slate-500">{profile.productTag}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Selected profile detail */}
      <div className="w-full max-w-xl rounded-xl border border-slate-700 bg-slate-900 p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-emerald-500/10 p-2.5">
            <SelectedIcon className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-slate-400">{selected.productTag}</p>
            <h2 className="text-lg font-bold text-slate-100">{selected.companyName}</h2>
            <p className="text-sm font-medium text-emerald-300">{selected.productName}</p>
          </div>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-slate-300">{selected.productDescription}</p>

        <div className="mb-4 rounded-lg border border-amber-800/40 bg-amber-950/30 p-3">
          <p className="mb-1 text-xs font-semibold text-amber-300">経営課題</p>
          <p className="text-sm text-amber-100">{selected.challenge}</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-slate-800 px-3 py-2">
            <p className="text-xs text-slate-400">初期資金</p>
            <p className="text-sm font-semibold text-emerald-300">{yen(selected.startingCash)}</p>
          </div>
          <div className="rounded-lg bg-slate-800 px-3 py-2">
            <p className="text-xs text-slate-400">有利子負債</p>
            <p className={`text-sm font-semibold ${selected.startingDebt > 0 ? 'text-amber-300' : 'text-slate-400'}`}>
              {selected.startingDebt > 0 ? yen(selected.startingDebt) : 'なし'}
            </p>
          </div>
          <div className="rounded-lg bg-slate-800 px-3 py-2">
            <p className="text-xs text-slate-400">初期社員数</p>
            <p className="text-sm font-semibold text-slate-100">{selected.startingEmployees}人</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="rounded-lg bg-emerald-400 px-8 py-3 font-semibold text-slate-950 transition-colors hover:bg-emerald-300"
      >
        このシナリオで開始する
      </button>
    </div>
  )
}
