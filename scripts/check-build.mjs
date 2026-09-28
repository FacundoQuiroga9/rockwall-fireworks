// Verify the upload directory after Vite copies public files and metadata is built.
import { readFileSync, existsSync, rmSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
assert.equal(readFileSync(resolve(dist, '.htaccess'), 'utf8'), readFileSync(resolve(root, 'public/.htaccess'), 'utf8'), 'dist/.htaccess missing or stale');
assert.ok(existsSync(resolve(dist, 'index.html')), 'Missing SPA entry');
// Local review galleries must not be shipped with the public build.
rmSync(resolve(dist, 'artifacts'), { recursive: true, force: true });
const routes = [...readFileSync(resolve(root, 'src/App.jsx'), 'utf8').matchAll(/<Route path="([^"]+)"/g)].map(m => m[1]);
for (const route of routes.filter(p => p !== '/' && !p.includes(':'))) {
  assert.ok(!existsSync(resolve(dist, route.slice(1))), `Generated directory conflicts with SPA route: ${route}`);
}
const index = readFileSync(resolve(dist, 'index.html'), 'utf8');
for (const [, asset] of index.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)) {
  assert.ok(existsSync(resolve(dist, asset.slice(1))), `Missing entry asset: ${asset}`);
}
assert.ok(readdirSync(resolve(dist, 'catalog-pages')).length > 0, 'Missing catalog metadata');
console.log('Upload directory verified: index, assets, metadata and hidden .htaccess; no QA artifacts.');
