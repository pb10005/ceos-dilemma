import type { CompanyState, EventCard, GameLogEntry, StrategyCoefficients, OperationalMetrics } from '@/types/game'
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
const BANK_WARNING_DEBT_TO_EBITDA_THRESHOLD = 4
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
): { nextState: CompanyState; statements: FinancialStatements; log: GameLogEntry; operationalMetrics: OperationalMetrics } => {
  const demandMultiplier = event.effect.demandMultiplier ?? 1
  const cogsMultiplier = event.effect.cogsMultiplier ?? 1
  const interestRate = BASE_INTEREST_RATE + (event.effect.interestRateDelta ?? 0)

  const baseDemand = BASE_DEMAND * strategy.demandBaseMultiplier
  const adDemandEffect = (decisions.adSpend / 50000) * strategy.adEffectMultiplier
  const repeatDemand = Math.floor(state.customerBase * 0.015)
  const qualityDemandBoost = Math.max(0, Math.floor((state.productQuality - 50) * 10))
  const qualityCostMultiplier = Math.max(0.70, 1 - Math.max(0, state.productQuality - 50) / 200)
  const demand = Math.max(0, Math.floor((baseDemand + adDemandEffect + state.brandPower * 30 + repeatDemand + qualityDemandBoost) * demandMultiplier))
  const unitsSold = calculateUnitsSold(demand, state.inventory, decisions.productionUnits)

  const brandGainFromAd = decisions.adSpend / 300000
  const brandGainFromSales = unitsSold * 0.001
  const brandFromQuality = Math.max(0, (state.productQuality - 50) * 0.05)
  const brandGain = brandGainFromAd + brandGainFromSales + brandFromQuality
  const customerGain = Math.floor(unitsSold * 0.01 + state.brandPower * 1)
  const qualityGain = decisions.rAndDSpend / 2000000

  const revenue = calculateRevenue(unitsSold, decisions.price)
  const cogs = calculateCogs(unitsSold, UNIT_COST * strategy.unitCostMultiplier * qualityCostMultiplier, cogsMultiplier)
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
  const updatedSupplyStability = Math.max(0, state.supplyStability + (event.effect.supplyStabilityDelta ?? 0))

  const statements: FinancialStatements = {
    pl: { revenue, cogs, grossProfit, payroll, adSpend: decisions.adSpend, rAndD: decisions.rAndDSpend, operatingProfit, interestExpense, netIncome },
    bs: { cash: endingCash, inventory: inventoryValue, assets: endingCash + inventoryValue, debt: nextDebt, equity: state.valuation - nextDebt + netIncome },
    cf: { operatingCashFlow, investingCashFlow, financingCashFlow, netCashFlow: operatingCashFlow + investingCashFlow + financingCashFlow }
  }

  const ebitda = operatingProfit
  const debtToEbitda = ebitda > 0 ? nextDebt / ebitda : Number.POSITIVE_INFINITY
  const bankWarning = debtToEbitda >= BANK_WARNING_DEBT_TO_EBITDA_THRESHOLD
    ? `銀行警告: 借入金/EBITDA が ${BANK_WARNING_DEBT_TO_EBITDA_THRESHOLD.toFixed(1)} 倍以上です（現在: ${debtToEbitda === Number.POSITIVE_INFINITY ? '∞' : debtToEbitda.toFixed(2)}倍）`
    : undefined

  const consecutiveCashShortageQuarters = endingCash < 0
    ? (state.consecutiveCashShortageQuarters ?? 0) + 1
    : 0

  const isImmediateCashShortage = endingCash < 0
  const isConsecutiveShortageBankruptcy = consecutiveCashShortageQuarters >= 2
  const isGameOver = isImmediateCashShortage || isConsecutiveShortageBankruptcy
  const gameOverReason = isImmediateCashShortage
    ? '現金残高がマイナスになりました（資金ショート）'
    : isConsecutiveShortageBankruptcy
      ? '2四半期連続で現金不足が発生しました（継続的な資金繰り悪化）'
      : undefined

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
    brandPower: Math.max(0, state.brandPower + (event.effect.brandPowerDelta ?? 0) + brandGain),
    productQuality: state.productQuality + qualityGain,
    customerBase: state.customerBase + customerGain,
    supplyStability: updatedSupplyStability,
    cumulativeProfit: state.cumulativeProfit + netIncome,
    consecutiveCashShortageQuarters,
    bankWarning,
    isGameOver,
    gameOverReason
  }

  const log: GameLogEntry = {
    quarter: state.quarter,
    eventId: event.id,
    eventTitle: event.title,
    summary: `売上 ${Math.round(revenue).toLocaleString()}円 / 純利益 ${Math.round(netIncome).toLocaleString()}円 / 現金 ${Math.round(endingCash).toLocaleString()}円`,
    learningPoint: event.learningPoint
  }

  const operationalMetrics: OperationalMetrics = {
    demand,
    adDemandEffect,
    adSpend: decisions.adSpend,
    unitsSold,
    beginningInventory: state.inventory,
    productionUnits: decisions.productionUnits,
    endingInventoryUnits,
    employeesBefore: state.employees,
    hireCount: decisions.hireCount,
    employeesAfter: Math.max(1, state.employees + decisions.hireCount),
    grossMarginPct: revenue > 0 ? (grossProfit / revenue) * 100 : 0,
    repeatDemand,
    qualityDemandBoost,
    brandPowerBefore: state.brandPower,
    brandGain,
    productQualityBefore: state.productQuality,
    qualityGain,
    customerBaseBefore: state.customerBase,
    customerGain,
    qualityCostMultiplier,
  }

  return { nextState, statements, log, operationalMetrics }
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
