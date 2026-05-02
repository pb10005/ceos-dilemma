export const calculateUnitsSold = (demand, beginningInventory, productionUnits) => Math.max(0, Math.min(demand, beginningInventory + productionUnits))
export const calculateRevenue = (unitsSold, price) => unitsSold * price
export const calculateCogs = (unitsSold, unitCost, cogsMultiplier = 1) => unitsSold * unitCost * cogsMultiplier
export const calculateEndingInventoryUnits = (beginningInventory, productionUnits, unitsSold) => Math.max(0, beginningInventory + productionUnits - unitsSold)
export const calculateInventoryValue = (endingInventoryUnits, unitCost) => endingInventoryUnits * unitCost
export const calculateOperatingProfit = (grossProfit, payroll, adSpend, rAndDSpend, adminCost = 0) => grossProfit - payroll - adSpend - rAndDSpend - adminCost
export const calculateNetIncome = (operatingProfit, interestExpense, tax = 0) => operatingProfit - interestExpense - tax
export const calculateOperatingCashFlow = (netIncome, nonCashAdjustments = 0, workingCapitalDelta = 0) => netIncome + nonCashAdjustments - workingCapitalDelta
export const calculateFinancingCashFlow = (borrowDebt, equityCashIn, repayDebt) => borrowDebt + equityCashIn - repayDebt
export const calculateEndingCash = (beginningCash, operatingCashFlow, investingCashFlow, financingCashFlow) => beginningCash + operatingCashFlow + investingCashFlow + financingCashFlow
