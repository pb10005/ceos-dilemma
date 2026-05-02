export type ProfitAndLoss = {
  revenue: number
  cogs: number
  grossProfit: number
  payroll: number
  adSpend: number
  rAndD: number
  operatingProfit: number
  interestExpense: number
  netIncome: number
}

export type BalanceSheet = {
  cash: number
  inventory: number
  assets: number
  debt: number
  equity: number
}

export type CashFlowStatement = {
  operatingCashFlow: number
  investingCashFlow: number
  financingCashFlow: number
  netCashFlow: number
}

export type FinancialStatements = {
  pl: ProfitAndLoss
  bs: BalanceSheet
  cf: CashFlowStatement
}
