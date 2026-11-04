import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import test from 'node:test';

const baseUrl = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3000';
const request = (path, options) => fetch(new URL(path, baseUrl), {
  redirect: 'manual',
  signal: AbortSignal.timeout(15_000),
  ...options,
});

for (const path of ['/', '/sign-in', '/sign-up']) {
  test(`public route ${path} renders or starts the Clerk development handshake`, async () => {
    const response = await request(path, { headers: { Accept: 'text/html' } });
    if (response.status === 307) {
      const location = new URL(response.headers.get('location'), baseUrl);
      assert.equal(location.protocol, 'https:');
      assert.equal(location.pathname, '/v1/client/handshake');
    } else {
      assert.equal(response.status, 200);
    }
    await response.arrayBuffer();
  });
}

test('compiled JavaScript and CSS are served', async () => {
  const files = await readdir('.next/static', { recursive: true });
  for (const extension of ['.js', '.css']) {
    const file = files.find((file) => file.endsWith(extension));
    assert.ok(file, `missing ${extension} asset`);
    const response = await request('/_next/static/' + file.replaceAll('\\', '/'));
    assert.equal(response.status, 200);
    assert.ok((await response.arrayBuffer()).byteLength > 0);
  }
});

for (const [method, path, body] of [
  ['POST', '/api/journal', undefined],
  ['PATCH', '/api/journal/00000000-0000-4000-8000-000000000001', { content: 'Test content' }],
  ['DELETE', '/api/journal/00000000-0000-4000-8000-000000000001', undefined],
  ['POST', '/api/journal/question', { question: 'Test question' }],
]) {
  test(`anonymous ${method} ${path} is rejected`, async () => {
    const response = await request(path, {
      method,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    assert.ok([401, 404, 307].includes(response.status), `unexpected HTTP ${response.status}`);
    if (response.status === 307) {
      assert.equal(new URL(response.headers.get('location'), baseUrl).pathname, '/sign-in');
    }
    await response.arrayBuffer();
  });
}
