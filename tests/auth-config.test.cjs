const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { createRequire } = require('node:module');
const ts = require('typescript');
const apiRequire = createRequire(path.join(__dirname, '../artifacts/api-server/package.json'));
const jwt = apiRequire('jsonwebtoken');

function evaluate(file, env, mocks = {}) {
  const content = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const output = ts.transpileModule(content, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, esModuleInterop: true,
  } }).outputText;
  const exports = {};
  vm.runInNewContext(output, {
    exports, process: { env }, require(name) {
      if (name === 'jsonwebtoken') return jwt;
      if (name in mocks) return mocks[name];
      throw new Error(`Unexpected import ${name}`);
    },
  });
  return exports;
}

for (const secret of [undefined, '', 'short', 'replace_with_a_random_secret_at_least_32_characters', ' '.repeat(40)]) {
  test(`rejects missing, weak or placeholder configuration: ${String(secret).slice(0,10)}`, () => {
    assert.throws(() => evaluate('artifacts/api-server/src/middlewares/auth.ts', { SESSION_SECRET: secret }), /SESSION_SECRET/);
  });
}

test('valid configuration signs and validates tokens, rejecting forged tokens', () => {
  const auth = evaluate('artifacts/api-server/src/middlewares/auth.ts', { SESSION_SECRET: 'unit-test-only-strong-secret-0123456789' });
  const token = auth.signToken({ id: 1, email: 'demo@example.com', name: 'Demo', role: 'admin' });
  assert.equal(auth.verifyToken(token).id, 1);
  assert.equal(auth.verifyToken(token + 'tampered'), null);
});

test('non-admin token cannot enter an admin handler', () => {
  const auth = evaluate('artifacts/api-server/src/middlewares/auth.ts', { SESSION_SECRET: 'unit-test-only-strong-secret-0123456789' });
  const token = auth.signToken({ id: 2, email: 'user@example.com', name: 'Demo', role: 'user' });
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = { status(code) { this.code = code; return this; }, json(body) { this.body = body; } };
  let called = false;
  auth.requireAdmin(req, res, () => { called = true; });
  assert.equal(res.code, 403);
  assert.equal(called, false);
});
