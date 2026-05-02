import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf-8'))

test('event cards are at least 10', () => {
  const cards = readJson('data/eventCards.json')
  assert.ok(Array.isArray(cards))
  assert.ok(cards.length >= 10)
})

test('glossary has at least 20 terms', () => {
  const glossary = readJson('data/glossary.json')
  assert.ok(Array.isArray(glossary))
  assert.ok(glossary.length >= 20)
})

test('scenario has 12 quarters', () => {
  const scenario = readJson('data/scenarios.json')
  assert.equal(scenario.durationQuarters, 12)
})
