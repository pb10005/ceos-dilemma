import type { CompanyState, EventCard, GameLogEntry, StrategyCoefficients } from '@/types/game'
import type { EventHint } from '@/types/game'
import type { Decisions } from '@/types/decision'
import type { FinancialStatements } from '@/types/finance'
import {
  calculateUnitsSold,
  calculateRevenue,
  calculateCogs,
  calculateEndingInventoryUnits,
  calculateInventoryValue,
  calculateOperatingProfit,
  calculateNetIncome,
  calculateOperatingCashFlow,
  calculateFinancingCashFlow,
  calculateEndingCash
} from '@/lib/finance'

const UNIT_COST = 1200
const SALARY_PER_EMPLOYEE_PER_QUARTER = 900000
const BASE_DEMAND = 4000
const BASE_INTEREST_RATE = 0.01
const EQUITY_RAISE_AMOUNT = 5000000
const DEFAULT_STRATEGY: StrategyCoefficients = {
  id: 'balanced',
  name: 'バランス型',
  demandBaseMultiplier: 1,
  adEffectMultiplier: 1,
  unitCostMultiplier: 1,
  payrollMultiplier: 1,
  valuationMultiplier: 1
}

export const processTurn = (
  state: CompanyState,
  decisions: Decisions,
  event: EventCard,
  strategy: StrategyCoefficients = DEFAULT_STRATEGY
): { nextState: CompanyState; statements: FinancialStatements; log: GameLogEntry } => {
  const demandMultiplier = event.effect.demandMultiplier ?? 1
  const cogsMultiplier = event.effect.cogsMultiplier ?? 1
  const interestRate = BASE_INTEREST_RATE + (event.effect.interestRateDelta ?? 0)

  const baseDemand = BASE_DEMAND * strategy.demandBaseMultiplier
  const adDemandEffect = (decisions.adSpend / 50000) * strategy.adEffectMultiplier
  const demand = Math.max(0, Math.floor((baseDemand + adDemandEffect + state.brandPower * 30) * demandMultiplier))
  const unitsSold = calculateUnitsSold(demand, state.inventory, decisions.productionUnits)

  const revenue = calculateRevenue(unitsSold, decisions.price)
  const cogs = calculateCogs(unitsSold, UNIT_COST * strategy.unitCostMultiplier, cogsMultiplier)
  const grossProfit = revenue - cogs
  const payroll = (state.employees + decisions.hireCount) * SALARY_PER_EMPLOYEE_PER_QUARTER * strategy.payrollMultiplier
  const operatingProfit = calculateOperatingProfit(grossProfit, payroll, decisions.adSpend, decisions.rAndDSpend)
  const interestExpense = state.debt * interestRate
  const netIncome = calculateNetIncome(operatingProfit, interestExpense)

  const endingInventoryUnits = calculateEndingInventoryUnits(state.inventory, decisions.productionUnits, unitsSold)
  const inventoryValue = calculateInventoryValue(endingInventoryUnits, UNIT_COST)

  const operatingCashFlow = calculateOperatingCashFlow(netIncome)
  const equityCashIn = decisions.raiseEquity ? EQUITY_RAISE_AMOUNT : 0
  const financingCashFlow = calculateFinancingCashFlow(decisions.borrowDebt, equityCashIn, decisions.repayDebt)
  const investingCashFlow = 0
  const endingCash = calculateEndingCash(state.cash, operatingCashFlow, investingCashFlow, financingCashFlow)

  const nextDebt = Math.max(0, state.debt + decisions.borrowDebt - decisions.repayDebt)
  const updatedBrand = Math.max(0, state.brandPower + (event.effect.brandPowerDelta ?? 0))
  const updatedSupplyStability = Math.max(0, state.supplyStability + (event.effect.supplyStabilityDelta ?? 0))

  const statements: FinancialStatements = {
    pl: { revenue, cogs, grossProfit, payroll, adSpend: decisions.adSpend, rAndD: decisions.rAndDSpend, operatingProfit, interestExpense, netIncome },
    bs: { cash: endingCash, inventory: inventoryValue, assets: endingCash + inventoryValue, debt: nextDebt, equity: state.valuation - nextDebt + netIncome },
    cf: { operatingCashFlow, investingCashFlow, financingCashFlow, netCashFlow: operatingCashFlow + investingCashFlow + financingCashFlow }
  }

  const isGameOver = endingCash < 0
  const nextState: CompanyState = {
    ...state,
    quarter: state.quarter + 1,
    cash: endingCash,
    revenue,
    inventory: endingInventoryUnits,
    debt: nextDebt,
    equityRaised: state.equityRaised + equityCashIn,
    sharesOutstanding: state.sharesOutstanding + (decisions.raiseEquity ? 2500 : 0),
    valuation: Math.max(0, state.valuation + netIncome * 8 * strategy.valuationMultiplier),
    employees: Math.max(1, state.employees + decisions.hireCount),
    brandPower: updatedBrand,
    supplyStability: updatedSupplyStability,
    cumulativeProfit: state.cumulativeProfit + netIncome,
    isGameOver,
    gameOverReason: isGameOver ? '現金残高がマイナスになりました（資金ショート）' : undefined
  }

  const log: GameLogEntry = {
    quarter: state.quarter,
    eventId: event.id,
    eventTitle: event.title,
    summary: `売上 ${Math.round(revenue).toLocaleString()}円 / 純利益 ${Math.round(netIncome).toLocaleString()}円 / 現金 ${Math.round(endingCash).toLocaleString()}円`,
    learningPoint: event.learningPoint
  }

  return { nextState, statements, log }
}

export const getNextTurnRiskHint = (events: EventCard[], currentQuarter: number): EventHint | null => {
  if (!events.length) return null
  const nextEvent = events[currentQuarter % events.length]
  if (!nextEvent?.hint || !nextEvent.riskBand || !nextEvent.impactArea) return null

  return {
    nextEventId: nextEvent.id,
    hint: nextEvent.hint,
    riskBand: nextEvent.riskBand,
    impactArea: nextEvent.impactArea
  }
}
