import type { GameLogEntry } from '@/types/game'

export default function GameLog({ logs }: { logs: GameLogEntry[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 md:col-span-2">
      <h2 className="mb-3 text-lg font-semibold">ゲームログ</h2>
      <ul className="space-y-2 text-sm text-slate-300">
        {logs.slice(-5).reverse().map((log, idx) => (
          <li key={`${log.quarter}-${idx}`}>Q{log.quarter}: {log.eventTitle} / {log.summary}</li>
        ))}
      </ul>
    </div>
  )
}
