import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-start justify-center gap-6 p-8">
      <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Business Strategy Simulation</p>
      <h1 className="text-4xl font-bold">CEO&apos;s Dilemma</h1>
      <p className="text-slate-300">資金は有限。市場は変化する。あなたの意思決定で企業を成長させよう。</p>
      <Link className="rounded-lg bg-emerald-400 px-5 py-3 font-semibold text-slate-950" href="/game">
        ゲームを開始する
      </Link>
    </main>
  )
}
