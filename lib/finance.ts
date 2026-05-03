export const calculateUnitsSold = (demand: number, beginningInventory: number, productionUnits: number): number =>
  Math.max(0, Math.min(demand, beginningInventory + productionUnits))

export const calculateRevenue = (unitsSold: number, price: number): number => unitsSold * price

export const calculateCogs = (unitsSold: number, unitCost: number, cogsMultiplier = 1): number =>
  unitsSold * unitCost * cogsMultiplier

export const calculateEndingInventoryUnits = (
  beginningInventory: number,
  productionUnits: number,
  unitsSold: number
): number => Math.max(0, beginningInventory + productionUnits - unitsSold)

export const calculateInventoryValue = (endingInventoryUnits: number, unitCost: number): number =>
  endingInventoryUnits * unitCost

export const calculateOperatingProfit = (
  grossProfit: number,
  payroll: number,
  adSpend: number,
  rAndDSpend: number,
  adminCost = 0
): number => grossProfit - payroll - adSpend - rAndDSpend - adminCost

export const calculateNetIncome = (operatingProfit: number, interestExpense: number, tax = 0): number =>
  operatingProfit - interestExpense - tax

export const calculateOperatingCashFlow = (netIncome: number, nonCashAdjustments = 0, workingCapitalDelta = 0): number =>
  netIncome + nonCashAdjustments - workingCapitalDelta

export const calculateFinancingCashFlow = (borrowDebt: number, equityCashIn: number, repayDebt: number): number =>
  borrowDebt + equityCashIn - repayDebt

export const calculateEndingCash = (
  beginningCash: number,
  operatingCashFlow: number,
  investingCashFlow: number,
  financingCashFlow: number
): number => beginningCash + operatingCashFlow + investingCashFlow + financingCashFlow

export type MultiAxisScore = {
  growth: number
  stability: number
  profitability: number
  learning: number
}

const clampScore = (value: number): number => Math.max(0, Math.min(100, Math.round(value)))

export const calculateMultiAxisScore = (metrics: {
  revenueGrowthRate: number
  debtToAssetRatio: number
  operatingMargin: number
  decisionQuality: number
}): MultiAxisScore => ({
  growth: clampScore(metrics.revenueGrowthRate * 100),
  stability: clampScore((1 - metrics.debtToAssetRatio) * 100),
  profitability: clampScore(metrics.operatingMargin * 100),
  learning: clampScore(metrics.decisionQuality * 100)
})
