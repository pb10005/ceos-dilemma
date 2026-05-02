export default function TutorialPanel({ quarter }: { quarter: number }) {
  const guide = quarter <= 3 ? 'ガイド: 序盤は広告費・在庫・現金残高のバランスを優先しましょう。' : 'ガイド: 成長と財務健全性の両立を意識しましょう。'
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-2 text-lg font-semibold">チュートリアル</h2>
      <p className="text-sm text-slate-300">{guide}</p>
    </div>
  )
}
