import test from 'node:test'
import assert from 'node:assert/strict'
import {
  calculateUnitsSold, calculateRevenue, calculateCogs, calculateEndingInventoryUnits,
  calculateInventoryValue, calculateOperatingProfit, calculateNetIncome,
  calculateOperatingCashFlow, calculateFinancingCashFlow, calculateEndingCash, calculateMultiAxisScore
} from '../lib/finance.runtime.mjs'

test('sales and revenue calculations', () => {
  const units = calculateUnitsSold(1200, 500, 600)
  assert.equal(units, 1100)
  assert.equal(calculateRevenue(units, 5000), 5500000)
})

test('cogs and inventory calculations', () => {
  assert.equal(calculateCogs(1000, 1200, 1.25), 1500000)
  const endingUnits = calculateEndingInventoryUnits(500, 600, 900)
  assert.equal(endingUnits, 200)
  assert.equal(calculateInventoryValue(endingUnits, 1200), 240000)
})

test('profit and cash flow calculations', () => {
  const operatingProfit = calculateOperatingProfit(3000000, 800000, 400000, 300000, 200000)
  assert.equal(operatingProfit, 1300000)
  const netIncome = calculateNetIncome(operatingProfit, 50000)
  assert.equal(netIncome, 1250000)
  const opCf = calculateOperatingCashFlow(netIncome)
  const finCf = calculateFinancingCashFlow(1000000, 500000, 200000)
  assert.equal(calculateEndingCash(2000000, opCf, -300000, finCf), 4250000)
})

test('multi-axis score clamps boundary values', () => {
  const score = calculateMultiAxisScore({
    revenueGrowthRate: 1.7,
    debtToAssetRatio: 1.8,
    operatingMargin: -0.4,
    decisionQuality: 0.51
  })
  assert.equal(score.growth, 100)
  assert.equal(score.stability, 0)
  assert.equal(score.profitability, 0)
  assert.equal(score.learning, 51)
})
