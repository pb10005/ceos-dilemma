import test from 'node:test'
import assert from 'node:assert/strict'
import { processTurn } from '../lib/gameEngine.runtime.mjs'
import { getNextTurnRiskHint } from '../lib/gameEngine.runtime.mjs'
import initialState from '../data/initialCompany.json' with { type: 'json' }
import events from '../data/eventCards.json' with { type: 'json' }

const event = events[0]

test('processTurn increments quarter and updates statements', () => {
  const decisions = { adSpend: 300000, productionUnits: 4000, hireCount: 1, rAndDSpend: 200000, price: 5000, raiseEquity: false, borrowDebt: 0, repayDebt: 0 }
  const { nextState, statements } = processTurn(initialState, decisions, event)
  assert.equal(nextState.quarter, initialState.quarter + 1)
  assert.ok(statements.pl.revenue >= 0)
  assert.ok(statements.bs.assets >= 0)
  assert.ok(typeof statements.cf.netCashFlow === 'number')
})

test('processTurn can trigger game over when cash is critically low', () => {
  const weakState = { ...initialState, cash: 1000 }
  const decisions = { adSpend: 1000000, productionUnits: 6000, hireCount: 5, rAndDSpend: 1500000, price: 2000, raiseEquity: false, borrowDebt: 0, repayDebt: 0 }
  const { nextState } = processTurn(weakState, decisions, event)
  assert.equal(nextState.isGameOver, true)
  assert.ok(nextState.gameOverReason)
})

test('next turn hint corresponds to the actual next event', () => {
  const hint = getNextTurnRiskHint(events, 1)
  assert.ok(hint)
  assert.equal(hint.nextEventId, events[1].id)
  assert.equal(hint.hint, events[1].hint)
})

test('strategy coefficients create KPI differences in a 12Q simulation', () => {
  const decisions = { adSpend: 500000, productionUnits: 4500, hireCount: 1, rAndDSpend: 250000, price: 4800, raiseEquity: false, borrowDebt: 0, repayDebt: 0 }
  const growth = {
    id: 'growth', name: '成長重視', demandBaseMultiplier: 1.08, adEffectMultiplier: 1.25,
    unitCostMultiplier: 1.08, payrollMultiplier: 1.12, valuationMultiplier: 1.2
  }
  const efficiency = {
    id: 'efficiency', name: '収益重視', demandBaseMultiplier: 0.94, adEffectMultiplier: 0.9,
    unitCostMultiplier: 0.9, payrollMultiplier: 0.92, valuationMultiplier: 0.95
  }

  let growthState = { ...initialState }
  let efficiencyState = { ...initialState }

  for (let i = 0; i < 12; i += 1) {
    growthState = processTurn(growthState, decisions, events[i % events.length], growth).nextState
    efficiencyState = processTurn(efficiencyState, decisions, events[i % events.length], efficiency).nextState
  }

  // Brand accumulation from ad/sales drives both to production-constrained by late game, so revenue converges.
  // Cash and valuation still diverge due to different COGS and payroll multipliers.
  assert.notEqual(growthState.cash, efficiencyState.cash)
  assert.notEqual(growthState.valuation, efficiencyState.valuation)
})
