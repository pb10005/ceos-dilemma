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
