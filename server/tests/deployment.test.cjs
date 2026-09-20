const assert = require('node:assert/strict');
const { test, after } = require('node:test');

// Isolated configuration: no real database or credentials are used.
Object.assign(process.env, {
  NODE_ENV: 'production',
  COOKIE_SECRET: 'test-only',
  DATABASE_URL: 'postgresql://test:test@localhost/test?sslmode=disable',
  SUPER_ADMIN_USERNAME: 'test',
  SUPER_ADMIN_PASSWORD: 'test-only',
});
const { Client } = require('pg');
const db = require('../dist/db/postgres');
const { createApp } = require('../dist/app');
after(() => db.pool.end());

test('Render health probes succeed without accessing a sleeping/unavailable database', async () => {
  const originalQuery = db.pool.query;
  let queries = 0;
  db.pool.query = async () => {
    queries++;
    throw new Error('Database is unavailable');
  };
  try {
    const app = createApp();
    const health = app.router.stack.find((layer) => layer.route?.path === '/api/health');
    assert.ok(health);
    let payload;
    const response = { json(value) { payload = value; return this; } };
    await health.route.stack[0].handle({}, response);
    assert.deepEqual(payload, { ok: true });
    assert.equal(queries, 0);
  } finally {
    db.pool.query = originalQuery;
  }
});

test('production database connection requires certificate verification', () => {
  const client = new Client(db.pool.options);
  assert.equal(new URL(db.pool.options.connectionString).searchParams.get('sslmode'), 'verify-full');
  assert.ok(client.connectionParameters.ssl);
  assert.notEqual(client.connectionParameters.ssl.rejectUnauthorized, false);
});
