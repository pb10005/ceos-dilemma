'use client'

import { useMemo, useState } from 'react'
import DecisionPanel from './DecisionPanel'
import FinancialStatements from './FinancialStatements'
import EventCard from './EventCard'
import KPIBoard from './KPIBoard'
import GameLog from './GameLog'
import StartScreen from './StartScreen'
import TutorialPanel from './TutorialPanel'
import TrendChart from './TrendChart'
import TurnResult from './TurnResult'
import { BarChart3, Lightbulb, History, Cloud, ShoppingCart, Wrench, AlertTriangle, XCircle } from '@/components/icons'
import type { LucideIcon } from '@/components/icons'
import initialState from '@/data/initialCompany.json'
import events from '@/data/eventCards.json'
import scenarios from '@/data/scenarios.json'
import { processTurn } from '@/lib/gameEngine'
import { getNextTurnRiskHint } from '@/lib/gameEngine'
import { calculateMultiAxisScore } from '@/lib/finance'
import type { CompanyState, EventCard as GameEventCard, GameLogEntry, StrategyCoefficients, OperationalMetrics } from '@/types/game'
import type { Decisions } from '@/types/decision'
import type { FinancialStatements as FS } from '@/types/finance'

type QuarterlyStatement = { quarter: number; statements: FS }
type Phase = 'setup' | 'playing'
type TabId = 'status' | 'decision' | 'history'
type IndustryProfile = {
  id: string
  label: string
  icon: LucideIcon
  description: string
  companyName: string
  productName: string
  productTag: string
  productDescription: string
  challenge: string
  stateOverrides: Partial<CompanyState>
  decisionOverrides: Partial<Decisions>
}

const baseDecisions: Decisions = { adSpend: 300000, productionUnits: 3000, hireCount: 0, rAndDSpend: 200000, price: 5000, raiseEquity: false, borrowDebt: 0, repayDebt: 0 }

const industryProfiles: IndustryProfile[] = [
  {
    id: 'saas',
    label: 'SaaS',
    icon: Cloud,
    description: '高粗利・成長重視。研究開発とブランド投資の影響が大きい。',
    companyName: 'NebulaSync株式会社',
    productName: 'NebulaSync',
    productTag: 'クラウド型プロジェクト管理SaaS',
    productDescription: 'リモートワーク需要を追い風に成長するB2B SaaS。月額課金で安定収益を築く一方、プロダクト品質と広告投資が解約率と新規獲得を左右する。',
    challenge: '急増する競合に対し、R&D投資でプロダクトを差別化しながら、既存顧客のリテンションと新規獲得の両立が急務。',
    stateOverrides: { cash: 40000000, valuation: 240000000, customerBase: 1600, productQuality: 70, inventory: 500, supplyStability: 80 },
    decisionOverrides: { adSpend: 500000, productionUnits: 500, rAndDSpend: 500000, price: 5000 },
  },
  {
    id: 'retail',
    label: '小売',
    icon: ShoppingCart,
    description: '在庫と供給安定性が収益に直結。需要変動の影響を受けやすい。',
    companyName: 'UrbanBasket株式会社',
    productName: 'URBANBASKET',
    productTag: '生活雑貨・インテリアECチェーン',
    productDescription: '実店舗とECを展開する生活雑貨・インテリアブランド。季節変動の激しい需要に合わせた在庫管理と、ブランド力によるリピート獲得が収益の鍵を握る。',
    challenge: '仕入れコストの高騰と競合ECの台頭に対抗しながら、在庫回転率を高めてキャッシュフローを安定させたい。',
    stateOverrides: { cash: 60000000, valuation: 180000000, customerBase: 2500, inventory: 11000, supplyStability: 65, brandPower: 24 },
    decisionOverrides: { adSpend: 300000, productionUnits: 5000, rAndDSpend: 100000, price: 3000 },
  },
  {
    id: 'manufacturing',
    label: '製造',
    icon: Wrench,
    description: '設備・在庫・負債管理が重要。供給網ショックに備える。',
    companyName: 'ShiftGear株式会社',
    productName: 'ShiftGear Pro',
    productTag: '産業用IoTセンサー',
    productDescription: '製造ライン向け設備監視IoTデバイスメーカー。原価低減と高い製品品質が受注競争力を生む。設備投資を借入金で賄っており、キャッシュフロー管理が経営を安定させる。',
    challenge: '₂億円の有利子負債を返済しながら、量産効率の改善とR&D投資で競合の低価格攻勢に対抗する。',
    stateOverrides: { cash: 55000000, valuation: 210000000, customerBase: 1200, inventory: 14000, supplyStability: 72, debt: 20000000 },
    decisionOverrides: { adSpend: 200000, productionUnits: 4000, rAndDSpend: 300000, price: 8000, repayDebt: 500000 },
  },
]

const tabs: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'status', label: '状況', icon: BarChart3 },
  { id: 'decision', label: '意思決定', icon: Lightbulb },
  { id: 'history', label: '履歴・財務', icon: History },
]

const createInitialCompanyState = (profileId: string): CompanyState => {
  const profile = industryProfiles.find((item) => item.id === profileId)
  return { ...(initialState as CompanyState), ...(profile?.stateOverrides ?? {}) }
}

const createInitialDecisions = (profileId: string): Decisions => {
  const profile = industryProfiles.find((item) => item.id === profileId)
  return { ...baseDecisions, ...(profile?.decisionOverrides ?? {}) }
}

const createBlankStatements = (cash: number, debt: number, valuation: number): FS => ({
  pl: { revenue: 0, cogs: 0, grossProfit: 0, payroll: 0, adSpend: 0, rAndD: 0, operatingProfit: 0, interestExpense: 0, netIncome: 0 },
  bs: { cash, inventory: 0, assets: cash, debt, equity: valuation },
  cf: { operatingCashFlow: 0, investingCashFlow: 0, financingCashFlow: 0, netCashFlow: 0 }
})

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
  const [phase, setPhase] = useState('setup' as Phase)
  const [selectedIndustryId, setSelectedIndustryId] = useState(industryProfiles[0].id)
  const [state, setState] = useState(() => createInitialCompanyState(industryProfiles[0].id))
  const [decisions, setDecisions] = useState(() => createInitialDecisions(industryProfiles[0].id))
  const [statements, setStatements] = useState(() => createBlankStatements(state.cash, state.debt, state.valuation))
  const [logs, setLogs] = useState([] as GameLogEntry[])
  const [statementHistory, setStatementHistory] = useState([] as QuarterlyStatement[])
  const [selectedStrategyId, setSelectedStrategyId] = useState('balanced')
  const [activeTab, setActiveTab] = useState('status' as TabId)
  const [operationalMetrics, setOperationalMetrics] = useState(null as OperationalMetrics | null)
  const eventCards = events as GameEventCard[]
  const strategies = scenarios.strategies as StrategyCoefficients[]

  const currentEvent = useMemo(() => eventCards[(state.quarter - 1) % eventCards.length], [eventCards, state.quarter])
  const nextRiskHint = useMemo(() => getNextTurnRiskHint(eventCards, state.quarter), [eventCards, state.quarter])
  const selectedStrategy = useMemo(
    () => strategies.find((strategy) => strategy.id === selectedStrategyId) ?? strategies[0],
    [selectedStrategyId, strategies]
  )
  const selectedIndustry = useMemo(
    () => industryProfiles.find((profile) => profile.id === selectedIndustryId) ?? industryProfiles[0],
    [selectedIndustryId]
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

  const trendPoints = useMemo(() => ({
    revenue: statementHistory.map((entry: QuarterlyStatement) => ({ quarter: entry.quarter, value: entry.statements.pl.revenue })),
    netIncome: statementHistory.map((entry: QuarterlyStatement) => ({ quarter: entry.quarter, value: entry.statements.pl.netIncome })),
    cash: statementHistory.map((entry: QuarterlyStatement) => ({ quarter: entry.quarter, value: entry.statements.bs.cash }))
  }), [statementHistory])

  const multiAxisScore = useMemo(() => calculateMultiAxisScore({
    revenueGrowthRate: state.revenue <= 0 ? 0 : (statements.pl.revenue - state.revenue) / Math.max(state.revenue, 1),
    debtToAssetRatio: statements.bs.assets <= 0 ? 1 : statements.bs.debt / statements.bs.assets,
    operatingMargin: statements.pl.revenue <= 0 ? 0 : statements.pl.operatingProfit / statements.pl.revenue,
    decisionQuality: Math.min(1, logs.length / 12)
  }), [logs.length, state.revenue, statements])

  const resetGame = (industryId: string) => {
    const nextState = createInitialCompanyState(industryId)
    setSelectedIndustryId(industryId)
    setState(nextState)
    setDecisions(createInitialDecisions(industryId))
    setStatements(createBlankStatements(nextState.cash, nextState.debt, nextState.valuation))
    setLogs([])
    setStatementHistory([])
    setSelectedStrategyId('balanced')
    setOperationalMetrics(null)
  }

  const startGame = () => {
    resetGame(selectedIndustryId)
    setActiveTab('status' as TabId)
    setPhase('playing' as Phase)
  }

  const nextTurn = () => {
    if (state.isGameOver) return

    const result = processTurn(state, sanitizeDecisions(decisions), currentEvent, selectedStrategy)
    setState(result.nextState)
    setStatements(result.statements)
    setLogs((prev: GameLogEntry[]) => [...prev, result.log])
    setStatementHistory((prev: QuarterlyStatement[]) => [...prev, { quarter: result.log.quarter, statements: result.statements }])
    setOperationalMetrics(result.operationalMetrics)
  }

  const SelectedIndustryIcon = selectedIndustry.icon
  const gameHeader = (
    <div className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 md:col-span-2">
      <div className="flex items-center gap-2 overflow-hidden">
        <SelectedIndustryIcon className="h-4 w-4 shrink-0 text-slate-400" />
        <span className="truncate text-sm font-semibold">{selectedIndustry.companyName}</span>
        <span className="hidden shrink-0 text-xs text-slate-400 sm:inline">— {selectedIndustry.productTag}</span>
      </div>
      <button
        type="button"
        onClick={() => setPhase('setup' as Phase)}
        className="ml-3 shrink-0 rounded-md bg-slate-800 px-3 py-1 text-xs text-slate-300 hover:bg-slate-700"
      >
        タイトルへ戻る
      </button>
    </div>
  )

  const alertsSection = (
    <>
      {state.bankWarning && (
        <div className="rounded-xl border border-yellow-700 bg-yellow-950/40 p-4 text-sm text-yellow-100 md:col-span-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-200" />
            <span>{state.bankWarning}</span>
          </div>
        </div>
      )}
      {state.isGameOver && (
        <div className="rounded bg-red-900 p-3 text-sm text-red-100 md:col-span-2">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-400" />
            <span>Game Over: {state.gameOverReason}</span>
          </div>
        </div>
      )}
    </>
  )

  if (phase === 'setup') {
    const startScreenProfiles = industryProfiles.map((p) => ({
      ...p,
      startingCash: p.stateOverrides.cash ?? (initialState as CompanyState).cash,
      startingDebt: p.stateOverrides.debt ?? 0,
      startingEmployees: p.stateOverrides.employees ?? (initialState as CompanyState).employees,
    }))
    return (
      <StartScreen
        profiles={startScreenProfiles}
        selectedId={selectedIndustryId}
        onSelect={setSelectedIndustryId}
        onStart={startGame}
      />
    )
  }

  return (
    <>
      {/* モバイルタブナビゲーション */}
      <div className="md:hidden">
        <div className="mb-4">{gameHeader}</div>
        <div className="mb-4 space-y-2">{alertsSection}</div>

        {/* タブバー */}
        <div className="mb-4 flex rounded-xl border border-slate-700 bg-slate-900 p-1">
          {tabs.map((tab) => {
            const TabIcon = tab.icon
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <TabIcon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {activeTab === 'status' && (
          <div className="space-y-4">
            <KPIBoard quarter={state.quarter} cash={state.cash} revenue={state.revenue} debt={state.debt} valuation={state.valuation} employees={state.employees} inventory={state.inventory} brandPower={state.brandPower} productQuality={state.productQuality} customerBase={state.customerBase} />
            {operationalMetrics && <TurnResult metrics={operationalMetrics} />}
            <EventCard event={currentEvent} />
            {nextRiskHint && (
              <div className="rounded-xl border border-amber-700 bg-amber-950/40 p-4 text-sm">
                <div className="mb-1 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-300" />
                  <h2 className="text-lg font-semibold text-amber-300">次ターンリスク予兆</h2>
                </div>
                <p className="text-amber-100">{nextRiskHint.hint}</p>
                <p className="mt-1 text-xs text-amber-200">リスク帯: {nextRiskHint.riskBand} / 影響領域: {nextRiskHint.impactArea}</p>
              </div>
            )}
            <div className="rounded-xl border border-slate-700 bg-slate-900 p-4">
              <h2 className="mb-3 text-lg font-semibold">経営状況の可視化</h2>
              <div className="space-y-3">
                <TrendChart title="売上推移" points={trendPoints.revenue} tone="cyan" />
                <TrendChart title="純利益推移" points={trendPoints.netIncome} tone="emerald" />
                <TrendChart title="現金残高推移" points={trendPoints.cash} tone="violet" />
              </div>
            </div>
            <TutorialPanel quarter={state.quarter} />
          </div>
        )}

        {activeTab === 'decision' && (
          <div className="space-y-4">
            <DecisionPanel
              decisions={decisions}
              onChange={(next) => setDecisions(sanitizeDecisions(next))}
              onNextTurn={nextTurn}
              strategies={strategies}
              selectedStrategyId={selectedStrategyId}
              onStrategyChange={setSelectedStrategyId}
              productQuality={state.productQuality}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <GameLog logs={logs} eventCards={eventCards} />
            <FinancialStatements statements={statements} annualReports={annualReports} />
            {state.quarter > 12 && (
              <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm">
                <h2 className="mb-2 text-lg font-semibold">4軸スコア</h2>
                <p>成長: {multiAxisScore.growth} / 安定: {multiAxisScore.stability} / 収益: {multiAxisScore.profitability} / 学習: {multiAxisScore.learning}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* デスクトップレイアウト（md:以上） */}
      <section className="hidden gap-4 md:grid md:grid-cols-2">
        {gameHeader}
        <KPIBoard quarter={state.quarter} cash={state.cash} revenue={state.revenue} debt={state.debt} valuation={state.valuation} employees={state.employees} inventory={state.inventory} brandPower={state.brandPower} productQuality={state.productQuality} customerBase={state.customerBase} />
        <EventCard event={currentEvent} />
        {operationalMetrics && (
          <div className="md:col-span-2">
            <TurnResult metrics={operationalMetrics} />
          </div>
        )}
        {nextRiskHint && (
          <div className="rounded-xl border border-amber-700 bg-amber-950/40 p-4 text-sm">
            <div className="mb-1 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-300" />
              <h2 className="text-lg font-semibold text-amber-300">次ターンリスク予兆</h2>
            </div>
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
          productQuality={state.productQuality}
        />
        <FinancialStatements statements={statements} annualReports={annualReports} />

        <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 md:col-span-2">
          <h2 className="mb-3 text-lg font-semibold">経営状況の可視化</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <TrendChart title="売上推移" points={trendPoints.revenue} tone="cyan" />
            <TrendChart title="純利益推移" points={trendPoints.netIncome} tone="emerald" />
            <TrendChart title="現金残高推移" points={trendPoints.cash} tone="violet" />
          </div>
        </div>

        <TutorialPanel quarter={state.quarter} />
        <GameLog logs={logs} eventCards={eventCards} />
        {state.quarter > 12 && (
          <div className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-sm md:col-span-2">
            <h2 className="mb-2 text-lg font-semibold">4軸スコア</h2>
            <p>成長: {multiAxisScore.growth} / 安定: {multiAxisScore.stability} / 収益: {multiAxisScore.profitability} / 学習: {multiAxisScore.learning}</p>
          </div>
        )}
        {alertsSection}
      </section>
    </>
  )
}
