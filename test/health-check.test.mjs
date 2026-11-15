import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { checkHealth } from '../src/health-check.mjs';

async function withServer(status, callback) {
  const server = createServer((_req, res) => { res.statusCode = status; res.end('health'); });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    return await callback(`http://127.0.0.1:${server.address().port}/health`);
  } finally {
    await new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve()));
  }
}

test('successfully accepts 200', async () => {
  await withServer(200, async url => assert.equal(await checkHealth(url), true));
});

test('rejects HTTP 503 rather than falsely passing CI', async () => {
  await withServer(503, async url => assert.rejects(checkHealth(url), /HTTP 503/));
});

test('rejects HTTP 404', async () => {
  await withServer(404, async url => assert.rejects(checkHealth(url), /HTTP 404/));
});

test('network errors propagate', async () => {
  await assert.rejects(checkHealth('http://example.invalid', {
    fetchImpl: async () => { throw new Error('connection refused'); },
  }), /connection refused/);
});

test('rejects invalid timeout', async () => {
  await assert.rejects(checkHealth('http://example.invalid', { timeoutMs: 0 }), /positive integer/);
});