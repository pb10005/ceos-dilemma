import { calculateUnitsSold, calculateRevenue, calculateCogs, calculateEndingInventoryUnits, calculateInventoryValue, calculateOperatingProfit, calculateNetIncome, calculateOperatingCashFlow, calculateFinancingCashFlow, calculateEndingCash } from './finance.runtime.mjs'
const UNIT_COST = 1200
const SALARY_PER_EMPLOYEE_PER_QUARTER = 900000
const BASE_DEMAND = 4000
const BASE_INTEREST_RATE = 0.01
const EQUITY_RAISE_AMOUNT = 5000000

export const processTurn = (state, decisions, event) => {
  const demandMultiplier = event.effect.demandMultiplier ?? 1
  const cogsMultiplier = event.effect.cogsMultiplier ?? 1
  const interestRate = BASE_INTEREST_RATE + (event.effect.interestRateDelta ?? 0)
  const demand = Math.max(0, Math.floor((BASE_DEMAND + decisions.adSpend / 50000 + state.brandPower * 30) * demandMultiplier))
  const unitsSold = calculateUnitsSold(demand, state.inventory, decisions.productionUnits)
  const revenue = calculateRevenue(unitsSold, decisions.price)
  const cogs = calculateCogs(unitsSold, UNIT_COST, cogsMultiplier)
  const grossProfit = revenue - cogs
  const payroll = (state.employees + decisions.hireCount) * SALARY_PER_EMPLOYEE_PER_QUARTER
  const operatingProfit = calculateOperatingProfit(grossProfit, payroll, decisions.adSpend, decisions.rAndDSpend)
  const interestExpense = state.debt * interestRate
  const netIncome = calculateNetIncome(operatingProfit, interestExpense)
  const endingInventoryUnits = calculateEndingInventoryUnits(state.inventory, decisions.productionUnits, unitsSold)
  const inventoryValue = calculateInventoryValue(endingInventoryUnits, UNIT_COST)
  const operatingCashFlow = calculateOperatingCashFlow(netIncome)
  const equityCashIn = decisions.raiseEquity ? EQUITY_RAISE_AMOUNT : 0
  const financingCashFlow = calculateFinancingCashFlow(decisions.borrowDebt, equityCashIn, decisions.repayDebt)
  const endingCash = calculateEndingCash(state.cash, operatingCashFlow, 0, financingCashFlow)
  const nextDebt = Math.max(0, state.debt + decisions.borrowDebt - decisions.repayDebt)
  const isGameOver = endingCash < 0
  return {
    nextState: {
      ...state, quarter: state.quarter + 1, cash: endingCash, revenue, inventory: endingInventoryUnits, debt: nextDebt,
      equityRaised: state.equityRaised + equityCashIn, sharesOutstanding: state.sharesOutstanding + (decisions.raiseEquity ? 2500 : 0),
      valuation: Math.max(0, state.valuation + netIncome * 8), employees: Math.max(1, state.employees + decisions.hireCount),
      brandPower: Math.max(0, state.brandPower + (event.effect.brandPowerDelta ?? 0)),
      supplyStability: Math.max(0, state.supplyStability + (event.effect.supplyStabilityDelta ?? 0)),
      cumulativeProfit: state.cumulativeProfit + netIncome, isGameOver,
      gameOverReason: isGameOver ? '現金残高がマイナスになりました（資金ショート）' : undefined
    },
    statements: { pl: { revenue, cogs, grossProfit, payroll, adSpend: decisions.adSpend, rAndD: decisions.rAndDSpend, operatingProfit, interestExpense, netIncome }, bs: { cash: endingCash, inventory: inventoryValue, assets: endingCash + inventoryValue, debt: nextDebt, equity: state.valuation - nextDebt + netIncome }, cf: { operatingCashFlow, investingCashFlow: 0, financingCashFlow, netCashFlow: operatingCashFlow + financingCashFlow } },
    log: { quarter: state.quarter, eventId: event.id, eventTitle: event.title, summary: `売上 ${Math.round(revenue).toLocaleString()}円 / 純利益 ${Math.round(netIncome).toLocaleString()}円 / 現金 ${Math.round(endingCash).toLocaleString()}円`, learningPoint: event.learningPoint }
  }
}

export const getNextTurnRiskHint = (events, currentQuarter) => {
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
