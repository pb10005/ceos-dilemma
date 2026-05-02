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
}

export type GameLogEntry = {
  quarter: number
  eventId: string
  eventTitle: string
  summary: string
  learningPoint: string
}
