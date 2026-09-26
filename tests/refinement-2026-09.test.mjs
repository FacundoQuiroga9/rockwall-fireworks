import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { applyCommercialCorrections } from '../scripts/catalog/sync.mjs';
import { filterCatalog } from '../src/utils/productData.js';
import { addProduct, assessList, canPair, emptyList, getBogoState, parseList, reviewGroup, setBogoPartner, startBogo } from '../src/shared/myList.js';
const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const products = read('../src/data/products.json');
const promotions = read('../src/data/promotions.json');
const research = read('../docs/catalog/refinement-2026-09-25/cake-research.json');
const baseline = read('../docs/catalog/refinement-2026-09-25/baseline.json');
const latestCakes = read('../docs/catalog/iteration-2026-09-25/cake-corrections.json');
const today = '2026-09-25';
// Synthetic data is test-local and never exported to the live catalog.
const offer = { id: 'test-bogo', revision: '1', kind: 'bogo', name: 'TEST ONLY', status: 'confirmed', validityConfirmed: true, validFrom: '2026-09-01', validThrough: '2026-09-30', priceRule: 'customer-choice', limitsConfirmed: true, stackingConfirmed: true, conditions: [] };
const fixture = (id, category = '200g Cakes', brand = 'Fox') => ({ id, name: `${id} TEST CAKE`, category, brand, bogo: { evidenceStatus: 'source-marked', eligibilityStatus: 'verified', promotionId: offer.id, group: category, sourceTokens: ['test'] } });

test('all 31 unresolved cakes have individual evidence; 28 resolve, 3 conflicts stay isolated', () => {
  assert.deepEqual(research.map(r => r.id).sort(), baseline.products.filter(p => p.category === 'Cakes - Size Unconfirmed').map(p => p.id).sort());
  assert.equal(research.filter(r => r.status === 'confirmed').length, 28);
  assert.deepEqual(research.filter(r => r.status === 'unresolved').map(r => r.id).sort(), ['2-minutes-extravaganza', 'light-brigade', 'old-ironsides']);
  for (const r of research) {
    assert.ok(r.evidence && r.sources.every(s => s.startsWith('https://')));
    assert.equal(products.find(p => p.id === r.id).category, r.fields.category);
  }
  assert.equal(products.find(p => p.id === 'alien-attack').category, '500g Cakes');
  assert.equal(products.find(p => p.id === 'night-rider').category, '200g Cakes');
  assert.equal(products.find(p => p.id === 'lucky-streak').category, '200g Cakes');
  assert.equal(products.filter(p => p.category === 'Cake Packs').length, 5);
  assert.deepEqual(applyCommercialCorrections(applyCommercialCorrections(applyCommercialCorrections(products, read('../docs/catalog/my-list-2026-09/commercial-review.json')), research), latestCakes), products);
  assert.throws(() => applyCommercialCorrections(products, [{...research[0], name: 'Another variant'}]), /identity changed/);
});
test('source marker, current eligibility and active campaign are independent gates', () => {
  const p = fixture('one');
  assert.deepEqual(getBogoState({...p, bogo:{...p.bogo, eligibilityStatus:'pending'}}, [offer], today), {marked:true,eligible:false,active:false});
  assert.deepEqual(getBogoState(p, [{...offer,status:'pending'}], today), {marked:true,eligible:true,active:false});
  assert.equal(getBogoState(p, [offer], today).active, true);
  for (const change of [{ validityConfirmed:false }, { priceRule:null }, { limitsConfirmed:false }, { stackingConfirmed:false }, { validThrough:'2025-07-04' }, { validFrom:'2027-01-01' }]) assert.equal(getBogoState(p, [{...offer,...change}], today).active, false);
  assert.equal(getBogoState(p, [{...offer,priceRule:'lower-price-free'}], today).active, false);
  assert.equal(products.filter(p => getBogoState(p, promotions, today).marked).length, 8);
  assert.equal(products.filter(p => getBogoState(p, promotions, today).active).length, 0);
  assert.equal(filterCatalog(products, {bogoOnly:true,offers:promotions,today}).length, 8);
});
test('BOGO only intersects brand, category, text and favorites; turning it off restores results', () => {
  const entries = [fixture('alpha'), fixture('bravo', '500g Cakes'), fixture('charlie','200g Cakes','Winda'), {...fixture('delta'),bogo:undefined}, {...fixture('echo'),bogo:{...fixture('echo').bogo,eligibilityStatus:'pending'}}];
  const opts = {query:'test cake', category:'200g Cakes',brand:'Fox', favorites:['alpha','delta','echo'],bogoOnly:true,offers:[offer],today};
  assert.deepEqual(filterCatalog(entries,opts).map(p=>p.id),['alpha','echo']);
  assert.deepEqual(filterCatalog(entries,{...opts,bogoOnly:false}).map(p=>p.id),['alpha','delta','echo']);
  assert.equal(filterCatalog(entries).length,5);
});
test('saved lists retain old categories and quantities until explicit review of each reclassification', () => {
  for (const r of research.filter(r=>r.status==='confirmed')) {
    const old = baseline.products.find(p=>p.id===r.id);
    const saved = parseList(JSON.stringify(addProduct(emptyList(),old,3)));
    const before = assessList(saved, products, promotions, today);
    assert.equal(before.groups[0].items[0].snapshot.category,'Cakes - Size Unconfirmed');
    assert.equal(before.groups[0].items[0].changed,true);
    assert.equal(before.total,3); assert.equal(before.pending,3);
    const reviewed = reviewGroup(saved,saved.groups[0].id,products,promotions);
    assert.equal(assessList(reviewed,products,promotions,today).pending,0);
    assert.equal(reviewed.groups[0].items[0].snapshot.category,r.fields.category);
    assert.equal(reviewed.groups[0].items[0].productId,r.id);
    assert.equal(reviewed.groups[0].items[0].quantity,3);
  }
});
test('reclassified promotional groups cannot mix 200/500g or silently retain a benefit', () => {
  const first=fixture('one'), second=fixture('two','200g Cakes','Winda');
  let list=addProduct(emptyList(),first); list=startBogo(list,list.groups[0].id,[first,second],offer); list=setBogoPartner(list,list.groups[0].id,second,[first,second],offer);
  assert.equal(assessList(list,[first,second],[offer],today).free,1);
  const changed=fixture('two','500g Cakes','Winda');
  assert.equal(canPair(first,changed,offer),false);
  assert.equal(assessList(list,[first,changed],[offer],today).free,0);
  assert.equal(assessList(reviewGroup(list,list.groups[0].id,[first,changed],[offer]),[first,changed],[offer],today).free,0);
  assert.equal(assessList(list,[first,{...second,bogo:{...second.bogo,eligibilityStatus:'pending'}}],[offer],today).free,0);
  assert.equal(assessList(list,[first,second],[{...offer,revision:'2'}],today).free,0);
});
test('home keeps approved platform, catalog entry points and historical anchors without the carousel instance', () => {
  const source = readFileSync(new URL('../src/pages/HomePage.jsx',import.meta.url),'utf8');
  assert.match(source, /<DiscoverProducts \/>/); assert.doesNotMatch(source, /<ProductCarousel|<Brands/);
  const hero=readFileSync(new URL('../src/components/hero/Hero.jsx',import.meta.url),'utf8');
  assert.doesNotMatch(hero,/offersUrl|2025|coupons\.pdf/); assert.match(hero,/to="\/products"/);
  const discover=readFileSync(new URL('../src/components/discover/DiscoverProducts.jsx',import.meta.url),'utf8');
  assert.match(discover,/id="featured-products"/); assert.match(discover,/to="\/products"/);
  assert.equal(createHash('sha256').update(readFileSync(new URL('../public/images/hero/products-studio-1200.webp',import.meta.url))).digest('hex'),baseline.platformSha256);
});
