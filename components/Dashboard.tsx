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
import { processTurn } from '@/lib/gameEngine'
import type { CompanyState, GameLogEntry } from '@/types/game'
import type { Decisions } from '@/types/decision'
import type { FinancialStatements as FS } from '@/types/finance'

const initialDecisions: Decisions = { adSpend: 300000, productionUnits: 3000, hireCount: 0, rAndDSpend: 200000, price: 5000, raiseEquity: false, borrowDebt: 0, repayDebt: 0 }
const blankStatements: FS = { pl: { revenue: 0, cogs: 0, grossProfit: 0, payroll: 0, adSpend: 0, rAndD: 0, operatingProfit: 0, interestExpense: 0, netIncome: 0 }, bs: { cash: initialState.cash, inventory: 0, assets: initialState.cash, debt: initialState.debt, equity: initialState.valuation }, cf: { operatingCashFlow: 0, investingCashFlow: 0, financingCashFlow: 0, netCashFlow: 0 } }

export default function Dashboard() {
  const [state, setState] = useState(initialState as CompanyState)
  const [decisions, setDecisions] = useState(initialDecisions as Decisions)
  const [statements, setStatements] = useState(blankStatements as FS)
  const [logs, setLogs] = useState([] as GameLogEntry[])

  const currentEvent = useMemo(() => events[(state.quarter - 1) % events.length], [state.quarter])

  const nextTurn = () => {
    const result = processTurn(state, decisions, currentEvent)
    setState(result.nextState)
    setStatements(result.statements)
    setLogs((prev: GameLogEntry[]) => [...prev, result.log])
  }

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <KPIBoard quarter={state.quarter} cash={state.cash} revenue={state.revenue} debt={state.debt} valuation={state.valuation} />
      <EventCard event={currentEvent} />
      <DecisionPanel decisions={decisions} onChange={setDecisions} onNextTurn={nextTurn} />
      <FinancialStatements statements={statements} />
      <TutorialPanel quarter={state.quarter} />
      <GameLog logs={logs} />
      {state.isGameOver && <div className="rounded bg-red-900 p-3 text-sm text-red-100 md:col-span-2">Game Over: {state.gameOverReason}</div>}
    </section>
  )
}
