'use client'

import { useMemo, useState } from 'react'
import DecisionPanel from './DecisionPanel'
import FinancialStatements from './FinancialStatements'
import EventCard from './EventCard'
import KPIBoard from './KPIBoard'
import GameLog from './GameLog'
import TutorialPanel from './TutorialPanel'
import TrendChart from './TrendChart'
import initialState from '@/data/initialCompany.json'
import events from '@/data/eventCards.json'
import scenarios from '@/data/scenarios.json'
import { processTurn } from '@/lib/gameEngine'
import { getNextTurnRiskHint } from '@/lib/gameEngine'
import { calculateMultiAxisScore } from '@/lib/finance'
import type { CompanyState, EventCard as GameEventCard, GameLogEntry, StrategyCoefficients } from '@/types/game'
import type { Decisions } from '@/types/decision'
import type { FinancialStatements as FS } from '@/types/finance'

type QuarterlyStatement = { quarter: number; statements: FS }
type IndustryProfile = { id: string; label: string; description: string; stateOverrides: Partial<CompanyState> }

const initialDecisions: Decisions = { adSpend: 300000, productionUnits: 3000, hireCount: 0, rAndDSpend: 200000, price: 5000, raiseEquity: false, borrowDebt: 0, repayDebt: 0 }
const industryProfiles: IndustryProfile[] = [
  { id: 'saas', label: 'SaaS', description: '高粗利・成長重視。研究開発とブランド投資の影響が大きい。', stateOverrides: { cash: 40000000, valuation: 240000000, customerBase: 1600, productQuality: 70, inventory: 500, supplyStability: 80 } },
  { id: 'retail', label: '小売', description: '在庫と供給安定性が収益に直結。需要変動の影響を受けやすい。', stateOverrides: { cash: 60000000, valuation: 180000000, customerBase: 2500, inventory: 11000, supplyStability: 65, brandPower: 24 } },
  { id: 'manufacturing', label: '製造', description: '設備・在庫・負債管理が重要。供給網ショックに備える。', stateOverrides: { cash: 55000000, valuation: 210000000, customerBase: 1200, inventory: 14000, supplyStability: 72, debt: 20000000 } }
]

const createInitialCompanyState = (profileId: string): CompanyState => {
  const profile = industryProfiles.find((item) => item.id === profileId)
  return { ...(initialState as CompanyState), ...(profile?.stateOverrides ?? {}) }
}

const createBlankStatements = (cash: number, debt: number, valuation: number): FS => ({
  pl: { revenue: 0, cogs: 0, grossProfit: 0, payroll: 0, adSpend: 0, rAndD: 0, operatingProfit: 0, interestExpense: 0, netIncome: 0 },
  bs: { cash, inventory: 0, assets: cash, debt, equity: valuation },
  cf: { operatingCashFlow: 0, investingCashFlow: 0, financingCashFlow: 0, netCashFlow: 0 }
})

const toSafeInt = (value: number, fallback = 0): number => {
  if (!Number.isFinite(value)) return fallback
  return Math.trunc(value)
}

const sanitizeDecisions = (draft: Decisions): Decisions => ({
  ...draft,
  adSpend: Math.max(0, toSafeInt(draft.adSpend)),
  productionUnits: Math.max(0, toSafeInt(draft.productionUnits)),
  hireCount: toSafeInt(draft.hireCount),
  rAndDSpend: Math.max(0, toSafeInt(draft.rAndDSpend)),
  price: Math.max(100, toSafeInt(draft.price, 5000)),
  borrowDebt: Math.max(0, toSafeInt(draft.borrowDebt)),
  repayDebt: Math.max(0, toSafeInt(draft.repayDebt))
})

export default function Dashboard() {
  const [selectedIndustryId, setSelectedIndustryId] = useState(industryProfiles[0].id)
  const [state, setState] = useState(() => createInitialCompanyState(industryProfiles[0].id))
  const [decisions, setDecisions] = useState(initialDecisions as Decisions)
  const [statements, setStatements] = useState(() => createBlankStatements(state.cash, state.debt, state.valuation))
  const [logs, setLogs] = useState([] as GameLogEntry[])
  const [statementHistory, setStatementHistory] = useState([] as QuarterlyStatement[])
  const [selectedStrategyId, setSelectedStrategyId] = useState('balanced')
  const eventCards = events as GameEventCard[]
  const strategies = scenarios.strategies as StrategyCoefficients[]

  const currentEvent = useMemo(() => eventCards[(state.quarter - 1) % eventCards.length], [eventCards, state.quarter])
  const nextRiskHint = useMemo(() => getNextTurnRiskHint(eventCards, state.quarter), [eventCards, state.quarter])
  const selectedStrategy = useMemo(
    () => strategies.find((strategy) => strategy.id === selectedStrategyId) ?? strategies[0],
    [selectedStrategyId, strategies]
  )
  const selectedIndustry = useMemo(
    () => industryProfiles.find((profile) => profile.id === selectedIndustryId) ?? industryProfiles[0],
    [selectedIndustryId]
  )

  const annualReports = useMemo(() => {
    const byYear = new Map<number, {
      plRevenue: number
      plNetIncome: number
      bsCash: number
      bsDebt: number
      cfOperating: number
      cfFinancing: number
    }>()

    statementHistory.forEach((entry: QuarterlyStatement) => {
      const fiscalYear = Math.ceil(entry.quarter / 4)
      const current = byYear.get(fiscalYear)
      if (!current) {
        byYear.set(fiscalYear, {
          plRevenue: entry.statements.pl.revenue,
          plNetIncome: entry.statements.pl.netIncome,
          bsCash: entry.statements.bs.cash,
          bsDebt: entry.statements.bs.debt,
          cfOperating: entry.statements.cf.operatingCashFlow,
          cfFinancing: entry.statements.cf.financingCashFlow
        })
        return
      }

      current.plRevenue += entry.statements.pl.revenue
      current.plNetIncome += entry.statements.pl.netIncome
      current.bsCash = entry.statements.bs.cash
      current.bsDebt = entry.statements.bs.debt
      current.cfOperating += entry.statements.cf.operatingCashFlow
      current.cfFinancing += entry.statements.cf.financingCashFlow
    })

    return Array.from(byYear.entries())
      .sort(([a], [b]) => a - b)
      .map(([fiscalYear, values]) => ({ fiscalYear, ...values }))
  }, [statementHistory])


  const trendPoints = useMemo(() => ({
    revenue: statementHistory.map((entry: QuarterlyStatement) => ({ quarter: entry.quarter, value: entry.statements.pl.revenue })),
    netIncome: statementHistory.map((entry: QuarterlyStatement) => ({ quarter: entry.quarter, value: entry.statements.pl.netIncome })),
    cash: statementHistory.map((entry: QuarterlyStatement) => ({ quarter: entry.quarter, value: entry.statements.bs.cash }))
  }), [statementHistory])

  const multiAxisScore = useMemo(() => calculateMultiAxisScore({
    revenueGrowthRate: state.revenue <= 0 ? 0 : (statements.pl.revenue - state.revenue) / Math.max(state.revenue, 1),
    debtToAssetRatio: statements.bs.assets <= 0 ? 1 : statements.bs.debt / statements.bs.assets,
    operatingMargin: statements.pl.revenue <= 0 ? 0 : statements.pl.operatingProfit / statements.pl.revenue,
    decisionQuality: Math.min(1, logs.length / 12)
  }), [logs.length, state.revenue, statements])

  const resetGame = (industryId: string) => {
    const nextState = createInitialCompanyState(industryId)
    setSelectedIndustryId(industryId)
    setState(nextState)
    setDecisions(initialDecisions)
    setStatements(createBlankStatements(nextState.cash, nextState.debt, nextState.valuation))
    setLogs([])
    setStatementHistory([])
    setSelectedStrategyId('balanced')
  }

  const nextTurn = () => {
    if (state.isGameOver) return

    const result = processTurn(state, sanitizeDecisions(decisions), currentEvent, selectedStrategy)
    setState(result.nextState)
    setStatements(result.statements)
    setLogs((prev: GameLogEntry[]) => [...prev, result.log])
    setStatementHistory((prev: QuarterlyStatement[]) => [...prev, { quarter: result.log.quarter, statements: result.statements }])
  }

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 md:col-span-2">
        <h2 className="mb-3 text-lg font-semibold">業種プリセット</h2>
        <div className="mb-2 flex flex-wrap gap-2">
          {industryProfiles.map((profile) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => resetGame(profile.id)}
              className={`rounded-md px-3 py-1 text-sm ${profile.id === selectedIndustryId ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}
            >
              {profile.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-slate-300">現在の業種: {selectedIndustry.label} — {selectedIndustry.description}</p>
      </div>
      <KPIBoard quarter={state.quarter} cash={state.cash} revenue={state.revenue} debt={state.debt} valuation={state.valuation} />
      <EventCard event={currentEvent} />
      {nextRiskHint && (
        <div className="rounded-xl border border-amber-700 bg-amber-950/40 p-4 text-sm">
          <h2 className="mb-1 text-lg font-semibold text-amber-300">次ターンリスク予兆</h2>
          <p className="text-amber-100">{nextRiskHint.hint}</p>
          <p className="mt-1 text-xs text-amber-200">リスク帯: {nextRiskHint.riskBand} / 影響領域: {nextRiskHint.impactArea}</p>
        </div>
      )}
      <DecisionPanel
        decisions={decisions}
        onChange={(next) => setDecisions(sanitizeDecisions(next))}
        onNextTurn={nextTurn}
        strategies={strategies}
        selectedStrategyId={selectedStrategyId}
        onStrategyChange={setSelectedStrategyId}
      />
      <FinancialStatements statements={statements} annualReports={annualReports} />

      <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 md:col-span-2">
        <h2 className="mb-3 text-lg font-semibold">経営状況の可視化</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <TrendChart title="売上推移" points={trendPoints.revenue} tone="cyan" />
          <TrendChart title="純利益推移" points={trendPoints.netIncome} tone="emerald" />
          <TrendChart title="現金残高推移" points={trendPoints.cash} tone="violet" />
        </div>
      </div>

      <TutorialPanel quarter={state.quarter} />
      <GameLog logs={logs} />
      {state.quarter > 12 && (
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm md:col-span-2">
          <h2 className="mb-2 text-lg font-semibold">4軸スコア</h2>
          <p>成長: {multiAxisScore.growth} / 安定: {multiAxisScore.stability} / 収益: {multiAxisScore.profitability} / 学習: {multiAxisScore.learning}</p>
        </div>
      )}
      {state.bankWarning && (
        <div className="rounded-xl border border-yellow-700 bg-yellow-950/40 p-4 text-sm text-yellow-100 md:col-span-2">{state.bankWarning}</div>
      )}
      {state.isGameOver && <div className="rounded bg-red-900 p-3 text-sm text-red-100 md:col-span-2">Game Over: {state.gameOverReason}</div>}
    </section>
  )
}
