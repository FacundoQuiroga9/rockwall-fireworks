// Run against Apache/LiteSpeed, NOT Vite (whose fallback ignores .htaccess).
// npm run hosting:check -- http://127.0.0.1:4180
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const origin = process.argv[2];
assert.ok(origin && /^https?:\/\//.test(origin), 'Supply the Apache/LiteSpeed origin, e.g. http://127.0.0.1:4180');
const root = new URL('../', import.meta.url);
const products = JSON.parse(readFileSync(new URL('src/data/products.json', root)));
const routes = [...readFileSync(new URL('src/App.jsx', root), 'utf8').matchAll(/<Route path="([^"]+)"/g)].map(m => m[1]);
const paths = routes.filter(p => !p.includes(':')).concat(products.map(p => `/products/${p.slug}`));
const base = await fetch(new URL('/index.html', origin), { redirect: 'manual' });
assert.equal(base.status, 200, '/index.html');
const index = await base.text();
assert.match(index, /id="root"/, 'Not the built SPA');
const results = [];
async function check(path, status, sameIndex = false, resource = false, method = 'GET') {
  const response = await fetch(new URL(path, origin), { redirect: 'manual', method });
  const body = await response.text();
  const row = { path, method, status: response.status, contentType: response.headers.get('content-type'), location: response.headers.get('location') };
  results.push(row);
  assert.equal(row.status, status, path);
  assert.equal(row.location, null, `${path}: unnecessary redirect`);
  if (sameIndex) assert.equal(body, index, `${path}: did not serve index.html`);
  if (resource) assert.ok(!/text\/html/i.test(row.contentType) && body !== index, `${path}: resource received HTML`);
  if (status === 404) assert.ok(!body.includes('id="root"'), `${path}: SPA disguised as missing asset`);
}
for (const path of paths) await check(path, 200, true);
for (const path of ['/playground/', '/products/', '/products/aggression/', '/my-list?check=reload', '/playground?scene=aerial']) await check(path, 200, true);
for (const path of ['/assets/missing.js', '/assets/missing', '/images/missing.webp', '/fonts/missing.woff2', '/catalog-pages/missing.html', '/missing.css', '/missing.png/', '/products/missing.js', '/missing.js/child']) await check(path, 404);
for (const path of ['/playground', '/products/aggression', '/my-list?reload=1']) await check(path, 200, false, false, 'HEAD');
for (const [, asset] of index.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)) await check(asset, 200, false, true);
await check('/images/products/aggression.webp', 200, false, true);
await check('/catalog-pages/aggression.html', 200);
await check('/playground.html', 200);
if (process.argv.includes('--fixtures')) await check('/untouched-real-dir/probe.txt', 200, false, true);
console.log(JSON.stringify({ origin, server: base.headers.get('server'), checkedAt: new Date().toISOString(), passed: results.length, results }, null, 2));
