'use client'

import { useMemo, useState } from 'react'
import DecisionPanel from './DecisionPanel'
import FinancialStatements from './FinancialStatements'
import EventCard from './EventCard'
import KPIBoard from './KPIBoard'
import GameLog from './GameLog'
import TutorialPanel from './TutorialPanel'
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

const initialDecisions: Decisions = { adSpend: 300000, productionUnits: 3000, hireCount: 0, rAndDSpend: 200000, price: 5000, raiseEquity: false, borrowDebt: 0, repayDebt: 0 }
const blankStatements: FS = { pl: { revenue: 0, cogs: 0, grossProfit: 0, payroll: 0, adSpend: 0, rAndD: 0, operatingProfit: 0, interestExpense: 0, netIncome: 0 }, bs: { cash: initialState.cash, inventory: 0, assets: initialState.cash, debt: initialState.debt, equity: initialState.valuation }, cf: { operatingCashFlow: 0, investingCashFlow: 0, financingCashFlow: 0, netCashFlow: 0 } }

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
  const [state, setState] = useState(initialState as CompanyState)
  const [decisions, setDecisions] = useState(initialDecisions as Decisions)
  const [statements, setStatements] = useState(blankStatements as FS)
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

  const multiAxisScore = useMemo(() => calculateMultiAxisScore({
    revenueGrowthRate: state.revenue <= 0 ? 0 : (statements.pl.revenue - state.revenue) / Math.max(state.revenue, 1),
    debtToAssetRatio: statements.bs.assets <= 0 ? 1 : statements.bs.debt / statements.bs.assets,
    operatingMargin: statements.pl.revenue <= 0 ? 0 : statements.pl.operatingProfit / statements.pl.revenue,
    decisionQuality: Math.min(1, logs.length / 12)
  }), [logs.length, state.revenue, statements])

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
