import type { GameLogEntry, EventCard as GameEventCard } from '@/types/game'
import { CategoryIcon } from '@/components/icons'

export default function GameLog({ logs, eventCards }: { logs: GameLogEntry[]; eventCards: GameEventCard[] }) {
  const entries = logs.slice(-8).reverse()

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 md:col-span-2">
      <h2 className="mb-3 text-lg font-semibold">ゲームログ</h2>
      {entries.length === 0 ? (
        <p className="text-sm text-slate-400">四半期を進めるとログが表示されます。</p>
      ) : (
        <ul className="space-y-2">
          {entries.map((log, idx) => {
            const event = eventCards.find((e) => e.id === log.eventId)
            return (
              <li key={`${log.quarter}-${idx}`} className="rounded-lg border border-slate-700 bg-slate-800/60 p-3">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-slate-700 px-1.5 py-0.5 text-xs font-bold text-emerald-300">Q{log.quarter}</span>
                  {event && <CategoryIcon category={event.category} className="h-3 w-3 text-slate-400" />}
                  <span className="text-sm font-medium text-slate-100">{log.eventTitle}</span>
                </div>
                <p className="mt-1 text-xs text-slate-300">{log.summary}</p>
                {log.learningPoint && (
                  <p className="mt-1 text-xs text-emerald-400/80">学習: {log.learningPoint}</p>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
