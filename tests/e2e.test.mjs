import { existsSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const HOST = '127.0.0.1';
const PORT = 3100;
const BASE = `http://${HOST}:${PORT}`;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 120000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {}
    await wait(500);
  }
  throw new Error(`Server did not start within ${timeoutMs}ms: ${url}`);
}

test('E2E: top page and game page are reachable', { skip: !existsSync('node_modules/.bin/next') }, async () => {
  const server = spawn('bash', ['-lc', `npm run dev -- --hostname ${HOST} --port ${PORT}`], {
    stdio: 'pipe',
  });

  try {
    await waitForServer(BASE);

    const top = await fetch(`${BASE}/`);
    assert.equal(top.status, 200);
    const topHtml = await top.text();
    assert.match(topHtml, /CEO's Dilemma/i);

    const game = await fetch(`${BASE}/game`);
    assert.equal(game.status, 200);
    const gameHtml = await game.text();
    assert.match(gameHtml, /CEO's Dilemma/i);
  } finally {
    server.kill('SIGTERM');
  }
});
