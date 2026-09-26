import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { applyCopyCorrections } from '../scripts/catalog/sync.mjs';
import { getCatalogBrands } from '../src/utils/productData.js';
const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), 'utf8'));
const products = read('../src/data/products.json');
const edits = read('../docs/catalog/presentation-2026-09/commercial-copy-review.json');

test('editorial decisions survive sync while model identifiers and useful variant data remain', () => {
  const stale = structuredClone(products);
  for (const edit of edits) Object.assign(stale.find((p) => p.id === edit.id), edit.before);
  const fixed = applyCopyCorrections(stale, edits);
  assert.deepEqual(fixed, products);
  assert.deepEqual(applyCopyCorrections(fixed, edits), products);
  assert.equal(products.find((p) => p.id === 'snow-cone').manufacturerCode, 'P3088');
  assert.equal(products.find((p) => p.id === 'snow-cone').presentation, undefined);
  assert.ok(products.find((p) => p.id === 'freedoms-wings').description.includes('silver sprays'));
  assert.equal(products.find((p) => p.id === '2-minute-bomb').description, undefined);
  assert.ok(products.find((p) => p.id === '2-minute-bomb').presentation.includes('70 shots'));
  assert.throws(() => applyCopyCorrections(products, [{ id: products[0].id, name: 'Wrong', fields: {} }]), /identity/);
});

test('all actual brands precede Other brands and supplied logos resolve locally', () => {
  assert.deepEqual(getCatalogBrands([{brand:'Winda'}, {}, {brand:'Fox'}, {brand:'Winda'}]), ['Fox','Winda','Unspecified']);
  assert.deepEqual(getCatalogBrands([{brand:'Winda'}]), ['Winda']);
  const brands = read('../src/data/brands.json');
  for (const id of ['bright-star','fox','pyro-shine','tnt','sky-bacon','red-rhino']) {
    const logo = brands.find((b) => b.id === id);
    assert.ok(logo && logo.width > 0 && logo.height > 0);
    assert.ok(existsSync(new URL(`../public${logo.image}`, import.meta.url)));
  }
  assert.equal(getCatalogBrands(products).at(-1), 'Unspecified');
});

test('framing retains complete object and shadow bounds and immutable source bytes', () => {
  const audit = read('../docs/catalog/presentation-2026-09/image-framing-audit.json');
  assert.equal(audit.length, products.length);
  assert.equal(new Set(audit.map((a) => a.id)).size, products.length);
  for (const item of audit.filter((a) => a.source)) {
    const [x,y,w,h] = item.viewport;
    const [l,t,r,b] = item.shadowBounds;
    assert.ok(l >= x && t >= y && r <= x+w && b <= y+h, item.id);
    assert.ok(item.actualOccupancy <= .82 && item.actualOccupancy >= .4, item.id);
    const bytes = readFileSync(new URL(`../${item.source}`, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), item.sourceSha256);
    assert.ok(item.outputWidth <= w, 'No upscaling');
  }
});

test('four-pack and display tray retain distinct Square identities', () => {
  const reviews = read('../docs/catalog/enrichment-2026-09/reviewed-products.json');
  assert.equal(reviews.find((p) => p.id === 'party-sparklers-4-pack').identityCode, '705108901203');
  assert.equal(reviews.find((p) => p.id === 'party-sparklers-display').identityCode, '705108901210');
  assert.equal(products.find((p) => p.id === 'party-sparklers-4-pack').previewVideo, 'https://www.youtube.com/watch?v=I0ZusraZI2g');
  assert.notEqual(products.find((p) => p.id === 'party-sparklers-4-pack').presentation, products.find((p) => p.id === 'party-sparklers-display').presentation);
});
