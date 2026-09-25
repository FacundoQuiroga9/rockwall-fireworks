import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { filterCatalog, getFeaturedProducts } from '../src/utils/productData.js';

const read = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const products = await read('../src/data/products.json');
const audit = '../docs/catalog/2026-08-square/';
const reviewed = await read(`${audit}reviewed-matches.json`);
const preserved = await read(`${audit}preserved-catalog.json`);
const provenance = await read(`${audit}asset-provenance.json`);
const commerce = [...await read('../docs/catalog/my-list-2026-09/commercial-review.json'), ...await read('../docs/catalog/refinement-2026-09-25/cake-research.json')];

test('every added product has one reviewed Square identity and matching source resources', async () => {
  const originals = new Set(preserved.products.map((p) => p.id));
  const enrichment = await read('../docs/catalog/enrichment-2026-09/reviewed-products.json');
  const added = products.filter((p) => !originals.has(p.id) && !enrichment.some((e) => e.id === p.id));
  assert.equal(new Set(reviewed.map((p) => p.squareToken)).size, reviewed.length);
  assert.equal(new Set(reviewed.map((p) => p.id)).size, reviewed.length);
  assert.equal(added.length, provenance.length);
  for (const product of added) {
    const review = reviewed.find((p) => p.id === product.id);
    const asset = provenance.find((p) => p.id === product.id);
    assert.equal(review.status, 'confirmed');
    assert.ok(review.squareToken && review.evidence.length > 40);
    assert.equal(product.name, review.name);
    assert.equal(product.brand, review.sourceBrand);
    const copyReviews = await read('../docs/catalog/presentation-2026-09/commercial-copy-review.json');
    const edit = copyReviews.find((r) => r.id === product.id);
    assert.equal(product.presentation, edit?.fields.presentation === null ? undefined : review.presentation);
    assert.equal(product.category, commerce.findLast((c) => c.id === product.id)?.fields.category || review.category);
    assert.equal(product.previewVideo, asset.source_video);
    assert.equal(product.featured, false);
    assert.equal(asset.source_sha256, review.sourceImageSha256);
    for (const output of asset.web) {
      const framedOriginal = `../docs/catalog/presentation-2026-09/framing-originals/${output.path.split('/').pop()}`;
      const bytes = await readFile(new URL(framedOriginal, import.meta.url));
      assert.equal(createHash('sha256').update(bytes).digest('hex'), output.sha256);
      assert.ok(output.width <= asset.source_width, 'Do not upscale source photos');
    }
    if (product.previewVideo) {
      const url = new URL(product.previewVideo);
      assert.ok(['www.youtube.com', 'youtube.com', 'youtu.be'].includes(url.hostname));
      assert.equal(url.protocol, 'https:');
    }
    for (const field of ['price', 'stock', 'available', 'promotion', 'description']) {
      assert.equal(product[field], undefined, `Unverified ${field} imported`);
    }
  }
});

test('original featured identities, videos, sort order and approved images remain intact', async () => {
  assert.deepEqual(getFeaturedProducts(products).map((p) => p.id), preserved.products.map((p) => p.id));
  for (const original of preserved.products) {
    const current = products.find((p) => p.id === original.id);
    for (const [field, value] of Object.entries(original)) assert.deepEqual(current[field], field === 'category' ? commerce.findLast((c) => c.id === current.id)?.fields.category || value : value);
  }
  for (const [path, hash] of Object.entries(preserved.webAssetHashes)) {
    assert.equal(createHash('sha256').update(await readFile(new URL(`../${path}`, import.meta.url))).digest('hex'), hash, path);
  }
});

test('catalog search combines brand, package and category without merging variants', () => {
  assert.deepEqual(filterCatalog(products, { query: 'BLACK CAT 24' }).map((p) => p.id), ['diablo', 'neon-diablo-24-pack', 'the-patriot-24-pack']);
  assert.equal(filterCatalog(products, { query: 'festival balls' }).length, 2);
  assert.equal(filterCatalog(products, { query: 'festival yellow' })[0].id, 'festival-balls-reloadable');
  assert.equal(filterCatalog(products, { query: '134' })[0].id, 'good-thinkin-lincoln');
  assert.equal(filterCatalog(products, { query: "Let's Celebrate" })[0].id, 'lets-celebrate');
  assert.equal(filterCatalog(products, { query: 'Lets Celebrate' })[0].id, 'lets-celebrate');
  assert.equal(filterCatalog(products, { query: 'U.S. 66' })[0].id, 'us-66');
  assert.ok(filterCatalog(products, { query: 'winda', category: 'Artillery Shells' }).every((p) => p.brand === 'Winda'));
  const fountains = filterCatalog(products, { category: 'Fountains' });
  for (const id of ['3-min', 'bad-cactus', 'neon-fish', 'snow-cone', 'no-3-cone-fountain-2-pack']) assert.ok(fountains.some(p => p.id === id));
  assert.ok(fountains.every(p => p.category === 'Fountains'));
  assert.equal(filterCatalog(products, { query: 'not-a-product' }).length, 0);
  assert.equal(filterCatalog(products).length, products.length);
});
