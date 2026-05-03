import type { EventCard as GameEventCard } from '@/types/game'
import { CategoryIcon } from '@/components/icons'

export default function EventCard({ event }: { event: GameEventCard }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-2 text-lg font-semibold">イベント</h2>
      <div className="mb-1 flex items-center gap-2">
        <CategoryIcon category={event.category} className="h-4 w-4 text-slate-400" />
        <p className="font-medium">{event.title}</p>
      </div>
      <p className="text-sm text-slate-300">{event.description}</p>
      <p className="mt-2 text-xs text-emerald-300">学習ポイント: {event.learningPoint}</p>
    </div>
  )
}
