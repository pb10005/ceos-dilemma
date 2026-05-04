export type CompanyState = {
  quarter: number
  cash: number
  revenue: number
  inventory: number
  debt: number
  equityRaised: number
  sharesOutstanding: number
  valuation: number
  employees: number
  brandPower: number
  productQuality: number
  supplyStability: number
  marketShare: number
  customerBase: number
  cumulativeProfit: number
  isGameOver: boolean
  gameOverReason?: string
  consecutiveCashShortageQuarters: number
  bankWarning?: string
}

export type EventCategory = 'market' | 'supply' | 'finance' | 'competition' | 'internal'

export type EventCard = {
  id: string
  title: string
  description: string
  category: EventCategory
  effect: {
    demandMultiplier?: number
    cogsMultiplier?: number
    supplyStabilityDelta?: number
    interestRateDelta?: number
    brandPowerDelta?: number
  }
  learningPoint: string
  hint?: string
  riskBand?: 'low' | 'medium' | 'high'
  impactArea?: 'demand' | 'cost' | 'finance' | 'brand' | 'operations'
}

export type EventHint = {
  nextEventId: string
  hint: string
  riskBand: 'low' | 'medium' | 'high'
  impactArea: 'demand' | 'cost' | 'finance' | 'brand' | 'operations'
}

export type GameLogEntry = {
  quarter: number
  eventId: string
  eventTitle: string
  summary: string
  learningPoint: string
}

export type StrategyCoefficients = {
  id: string
  name: string
  demandBaseMultiplier: number
  adEffectMultiplier: number
  unitCostMultiplier: number
  payrollMultiplier: number
  valuationMultiplier: number
}

export type OperationalMetrics = {
  demand: number
  adDemandEffect: number
  adSpend: number
  unitsSold: number
  beginningInventory: number
  productionUnits: number
  endingInventoryUnits: number
  employeesBefore: number
  hireCount: number
  employeesAfter: number
  grossMarginPct: number
  repeatDemand: number
  qualityDemandBoost: number
  brandPowerBefore: number
  brandGain: number
  productQualityBefore: number
  qualityGain: number
  customerBaseBefore: number
  customerGain: number
  qualityCostMultiplier: number
}
