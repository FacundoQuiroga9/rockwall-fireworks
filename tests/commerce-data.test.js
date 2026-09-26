import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { applyCommercialCorrections, run } from '../scripts/catalog/sync.mjs';
import { promotionIsCurrent } from '../src/shared/myList.js';
const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const products = read('../src/data/products.json');
test('exact BOGO markers are traceable to reconciled Excel/CSV rows, with current validity pending', () => {
  const ledger = read('../docs/catalog/my-list-2026-09/bogo-evidence.json');
  assert.equal(ledger.sourceMarkedRows.length, 68); assert.equal(ledger.publishedProducts.length, 8);
  assert.deepEqual(products.filter((p) => p.bogo).map((p) => p.id).sort(), ledger.publishedProducts.map((p) => p.id).sort());
  for (const p of products.filter((p) => p.bogo)) {
    const entry = ledger.publishedProducts.find((e) => e.id === p.id);
    assert.ok(entry.sources.some((s) => /(?:^|[^a-z])BOGO(?:$|[^a-z])/i.test(s.original_name + ' ' + s.original_variation)));
    assert.equal(p.bogo.group, p.category);
  }
  assert.ok(read('../src/data/promotions.json').every((p) => !promotionIsCurrent(p, '2026-09-24')));
});
test('cake classification and Silent Treatment correction survive sync; all approved product bytes persist', () => {
  const decisions = read('../docs/catalog/my-list-2026-09/commercial-review.json');
  const stale = structuredClone(products); stale.filter((p) => p.cakeClass).forEach((p) => { p.category = 'Cakes'; });
  assert.deepEqual(applyCommercialCorrections(applyCommercialCorrections(applyCommercialCorrections(stale, decisions), read('../docs/catalog/refinement-2026-09-25/cake-research.json')), read('../docs/catalog/iteration-2026-09-25/cake-corrections.json')), products);
  assert.equal(products.find((p) => p.id === 'silent-treatment').brand, 'Fox');
  assert.equal(products.find((p) => p.id === 'the-reaper').category, '500g Cakes');
  assert.equal(products.find((p) => p.id === 'bump-bear').category, '200g Cakes');
  assert.equal(products.find((p) => p.id === 'old-ironsides').category, 'Cakes - Size Unconfirmed');
  assert.equal(products.filter((p) => p.category === 'Cakes').length, 0);
  const baseline = read('../docs/catalog/my-list-2026-09/baseline.json');
  assert.deepEqual(products.map((p) => p.id), baseline.products.map((p) => p.id));
  const upgrades = read('../docs/catalog/iteration-2026-09-25/image-upgrades.json');
  for (const [path, hash] of Object.entries(baseline.productHashes)) {
    const approved = upgrades.find(r => `/images/products/${r.id}.webp` === path);
    const target = approved ? approved.previous : `public${path}`;
    assert.equal(createHash('sha256').update(readFileSync(new URL(`../${target}`, import.meta.url))).digest('hex'), hash);
  }
  assert.equal(run({check: true}).result, 'PASS');
});
