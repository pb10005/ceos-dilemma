import type { EventCard as GameEventCard } from '@/types/game'

export default function EventCard({ event }: { event: GameEventCard }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-2 text-lg font-semibold">イベント</h2>
      <p className="font-medium">{event.title}</p>
      <p className="text-sm text-slate-300">{event.description}</p>
      <p className="mt-2 text-xs text-emerald-300">学習ポイント: {event.learningPoint}</p>
    </div>
  )
}
