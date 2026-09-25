import test from 'node:test';
import assert from 'node:assert/strict';
import { addProduct, addPromotion, assessList, canPair, dissolveGroup, emptyList, parseList, promotionIsCurrent, removeGroup, reviewGroup, setBogoPartner, setPairCount, setPromotionItem, setQuantity, snapshotProduct, startBogo, storeDate } from '../src/shared/myList.js';
import { bytesToBase64, createListPdf } from '../src/shared/listPdf.js';

// Synthetic rules ONLY. Never published as Rockwall offers.
const promo = { id: 'test-bogo', revision: 'one', name: 'TEST ONLY BOGO', kind: 'bogo', status: 'confirmed', validityConfirmed: true, validFrom: '2026-09-01', validThrough: '2026-09-30', priceRule: 'customer-choice', limitsConfirmed: true, stackingConfirmed: true, maxGroupsPerList: 3, conditions: ['Synthetic test fixture.'], source: 'test' };
const p = (id, category = '200g Cakes', brand = 'A') => ({ id, name: id, category, brand, bogo: { eligibilityStatus: 'verified', evidenceStatus: 'source-marked', promotionId: promo.id, group: category, sourceTokens: [id] } });
const catalog = [p('one'), p('two', '200g Cakes', 'B'), p('large', '500g Cakes'), p('250g', '250g Cakes'), { id: 'not-bogo', name: 'Not BOGO', category: '200g Cakes' }];
const date = '2026-09-24';
const assess = (list, rules = promo) => assessList(list, catalog, [rules], date);
function pair(second = catalog[1]) {
  let list = addProduct(emptyList(), catalog[0]);
  list = startBogo(list, list.groups[0].id, catalog, promo);
  return setBogoPartner(list, list.groups[0].id, second, catalog, promo);
}
test('eligibility requires two exact source-marked products; brand is not a restriction', () => {
  assert.equal(canPair(catalog[0], catalog[1], promo), true);
  assert.equal(canPair(catalog[0], catalog[0], promo), true);
  assert.equal(canPair(catalog[0], catalog[4], promo), false);
  assert.equal(canPair(catalog[0], undefined, promo), false);
});
test('200g, 250g and 500g groups cannot mix; ambiguous cake category is blocked', () => {
  assert.equal(canPair(catalog[0], catalog[2], promo), false);
  assert.equal(canPair(catalog[0], catalog[3], promo), false);
  for (const category of ['Cakes', 'Cakes - Size Unconfirmed', 'Cake Packs']) assert.equal(canPair(p('x', category), p('y', category), promo), false);
});
test('quantities are explicit: odd individual units are transferred without auto-selecting a free product', () => {
  let list = addProduct(emptyList(), catalog[0], 3);
  const original = list.groups[0].id;
  list = startBogo(list, original, catalog, promo);
  assert.equal(assess(list).total, 3);
  assert.equal(list.groups[0].items[0].quantity, 2);
  assert.equal(assess(list).groups[1].state, 'incomplete');
  assert.equal(assess(list).free, 0);
  list = setBogoPartner(list, list.groups[1].id, catalog[1], catalog, promo);
  assert.equal(assess(list).total, 4);
  assert.equal(assess(list).free, 1);
  assert.equal(assess(list).paid, 3);
});
test('explicit complete pairs allocate paid/free units, repeated and mismatched quantities are checked', () => {
  let list = pair(); const id = list.groups[0].id;
  list = setPairCount(list, id, 3);
  assert.deepEqual([assess(list).total, assess(list).paid, assess(list).free], [6, 3, 3]);
  list = setQuantity(list, id, 1, 2);
  assert.equal(assess(list).groups[0].state, 'incomplete');
  assert.equal(assess(list).free, 0);
  for (const n of [0, -1, 1.5, NaN, 1000]) assert.deepEqual(setPairCount(list, id, n), list);
});
test('unconfirmed dates, free-item rules, coupon compatibility or limits never apply a benefit', () => {
  for (const override of [{ status: 'pending' }, { validityConfirmed: false }, { priceRule: null }, { limitsConfirmed: false }, { stackingConfirmed: false }]) assert.equal(assess(pair(), { ...promo, ...override }).free, 0);
});
test('price differences are evaluated only under an explicitly confirmed rule; no prices means no money total', () => {
  assert.equal(assess(pair()).priceTotal, null);
  assert.equal(assess(pair(), { ...promo, priceRule: 'lower-price-free' }).free, 0);
  const priced = catalog.map((item, index) => ({ ...item, priceCents: index ? 1200 : 900 }));
  const result = assessList(pair(), priced, [{ ...promo, priceRule: 'lower-price-free' }], date);
  assert.equal(result.groups[0].items[0].free, 1);
  assert.equal(result.groups[0].items[1].paid, 1);
  assert.equal(assessList(pair(), priced, [{ ...promo, priceRule: 'equal-price' }], date).free, 0);
});
test('one unit cannot fill two benefits: conversion transfers ownership; dissolving keeps selected units only', () => {
  let list = addProduct(emptyList(), catalog[0]); const id = list.groups[0].id;
  list = startBogo(list, id, catalog, promo);
  assert.deepEqual(startBogo(list, id, catalog, promo), list);
  assert.equal(list.groups.length, 1);
  list = dissolveGroup(list, list.groups[0].id);
  assert.equal(assess(list).total, 1);
  list = pair(); list = dissolveGroup(list, list.groups[0].id);
  assert.equal(assess(list).total, 2); assert.equal(assess(list).free, 0);
  assert.equal(new Set(list.groups.map((g) => g.id)).size, list.groups.length);
});
test('promotion limits apply across separate groups, without an unlimited stacking assumption', () => {
  const list = pair(); list.groups.push(...pair().groups);
  assert.equal(assess(list, { ...promo, maxGroupsPerList: 1 }).free, 0);
});
test('persistence and editing round-trip; obsolete IDs remain visible rather than becoming another variant', () => {
  let list = pair(); list = parseList(JSON.stringify(list));
  assert.equal(assess(list).total, 2);
  const removed = assessList(list, catalog.slice(1), [promo], date);
  assert.equal(removed.groups[0].items[0].snapshot.name, 'one');
  assert.equal(removed.groups[0].items[0].missing, true); assert.equal(removed.free, 0);
  list = setPairCount(list, list.groups[0].id, 2); assert.equal(assess(parseList(JSON.stringify(list))).total, 4);
  assert.equal(removeGroup(list, list.groups[0].id).groups.length, 0);
  assert.throws(() => parseList('{bad')); assert.throws(() => parseList('{"version":99,"groups":[]}'));
  const invalid = pair(); invalid.groups.push(invalid.groups[0]); assert.throws(() => parseList(JSON.stringify(invalid)));
});
test('changed variant or promotion requires review; expired offers never become applied', () => {
  const list = pair(); const changed = catalog.map((p, i) => i ? p : { ...p, presentation: 'Different pack' });
  assert.equal(assessList(list, changed, [promo], date).free, 0);
  const newPromo = { ...promo, revision: 'two' }; assert.equal(assess(list, newPromo).free, 0);
  const reviewed = reviewGroup(list, list.groups[0].id, catalog, [newPromo]); assert.equal(assess(reviewed, newPromo).free, 1);
  assert.equal(assessList(list, catalog, [promo], '2026-10-01').free, 0);
  assert.equal(promotionIsCurrent(promo, '2026-08-31'), false);
  assert.equal(promotionIsCurrent(promo, '2026-09-30'), true);
  assert.equal(storeDate(new Date('2026-09-25T02:00:00Z')), '2026-09-24');
});
test('choice promotions require exact eligible quantities; fixed packs cannot change components', () => {
  const choice = { ...promo, id: 'choice', kind: 'choice', requiredQuantity: 3, eligibleIds: ['one', 'two'] };
  let list = addPromotion(emptyList(), choice, catalog, [{ productId: 'one', quantity: 2 }], date);
  assert.equal(assessList(list, catalog, [choice], date).groups[0].state, 'incomplete');
  list = setQuantity(list, list.groups[0].id, 0, 3);
  assert.equal(assessList(list, catalog, [choice], date).groups[0].state, 'complete');
  assert.equal(addPromotion(emptyList(), choice, catalog, [{ productId: 'large', quantity: 3 }], date).groups.length, 0);
  const fixed = { ...choice, kind: 'fixed', components: [{ productId: 'one', quantity: 1 }, { productId: 'two', quantity: 2 }] };
  const pack = addPromotion(emptyList(), fixed, catalog, [], date);
  assert.equal(assessList(pack, catalog, [fixed], date).groups[0].state, 'complete');
  pack.groups[0].items[1] = { productId: 'one', quantity: 2, snapshot: snapshotProduct(catalog[0]) };
  assert.equal(assessList(pack, catalog, [fixed], date).groups[0].state, 'incomplete');
  assert.equal(addPromotion(emptyList(), { ...choice, status: 'expired' }, catalog, [{ productId: 'one', quantity: 3 }], date).groups.length, 0);
});
test('PDF is a real multipage document with store disclaimer, pending allocation and printable text', () => {
  let list = pair(); for (let i = 0; i < 35; i++) list = addProduct(list, { ...catalog[4], id: `long-${i}`, name: `TEST long name ${i} ` + 'A long product name '.repeat(6) });
  const bytes = createListPdf(assess(list, { ...promo, status: 'pending' }), { generatedAt: '2026-09-24T12:00:00Z', title: 'TEST FIXTURE' });
  const text = Buffer.from(bytes).toString('ascii');
  assert.ok(text.startsWith('%PDF-1.4')); assert.ok(text.includes('xref')); assert.ok(text.includes('%%EOF'));
  assert.ok((text.match(/\/Type \/Page /g) || []).length > 1);
  assert.ok(text.includes('No payment, order or stock reservation')); assert.ok(text.includes('PAID')); assert.ok(text.includes('FREE'));
  assert.equal(bytesToBase64(bytes), Buffer.from(bytes).toString('base64'));
});

test('configurable groups can be completed, edited and reduced without changing a fixed package', () => {
  const choice = { ...promo, id: 'choice-edit', kind: 'choice', requiredQuantity: 3, eligibleIds: ['one', 'two'] };
  let list = addPromotion(emptyList(), choice, catalog, [{ productId: 'one', quantity: 2 }], date);
  const id = list.groups[0].id;
  list = setPromotionItem(list, id, 1, catalog[1], 1, choice, date);
  assert.equal(assessList(list, catalog, [choice], date).groups[0].state, 'complete');
  assert.deepEqual(setPromotionItem(list, id, 1, catalog[2], 1, choice, date), list);
  list = setPromotionItem(list, id, 0, catalog[1], 2, choice, date);
  assert.equal(list.groups[0].items[0].productId, 'two');
  list = setPromotionItem(list, id, 1, undefined, 0, choice, date);
  assert.equal(assessList(list, catalog, [choice], date).groups[0].state, 'incomplete');
  assert.deepEqual(setPromotionItem(list, id, 0, catalog[0], 3, { ...choice, kind: 'fixed' }, date), list);
  assert.deepEqual(setPromotionItem(list, id, 0, catalog[0], 3, { ...choice, status: 'expired' }, date), list);
});
