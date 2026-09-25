// Canonical list rules. catalog:sync copies this module unchanged to the app.
export const LIST_VERSION = 1;
export const MAX_QUANTITY = 999; // UI/storage bound, never a promotion allowance.
export function storeDate(instant = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(instant).map((p) => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}
export const emptyList = () => ({ version: LIST_VERSION, groups: [] });
const uid = () => `list-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
const quantity = (value) => Number.isInteger(value) && value > 0 && value <= MAX_QUANTITY;
export const snapshotProduct = (p) => ({
  id: p.id, name: p.name, category: p.category, brand: p.brand || '',
  presentation: p.presentation || '', manufacturerCode: p.manufacturerCode || '',
  storeCodes: (p.storeCodes || []).map(({ token, sku, gtin }) => ({ token, sku, gtin })),
});
const itemFor = (p, count = 1) => ({ productId: p.id, quantity: count, snapshot: snapshotProduct(p) });
const sameIdentity = (saved, current) => JSON.stringify(saved) === JSON.stringify(snapshotProduct(current));
export function parseList(raw) {
  if (!raw) return emptyList();
  const list = JSON.parse(raw);
  if (list?.version !== LIST_VERSION || !Array.isArray(list.groups)) throw new Error('Unsupported saved list');
  const ids = new Set();
  for (const group of list.groups) {
    if (!group || typeof group.id !== 'string' || ids.has(group.id) || !['individual', 'bogo', 'promotion'].includes(group.kind) || !Array.isArray(group.items) || !group.items.length) throw new Error('Invalid saved group');
    ids.add(group.id);
    if ((group.kind === 'individual' && group.items.length !== 1) || (group.kind === 'bogo' && group.items.length > 2)) throw new Error('Invalid selected units');
    for (const item of group.items) {
      if (!quantity(item.quantity) || typeof item.productId !== 'string' || item.snapshot?.id !== item.productId || typeof item.snapshot.name !== 'string') throw new Error('Invalid saved product');
    }
    if (group.kind !== 'individual' && (typeof group.promotionId !== 'string' || typeof group.promotionRevision !== 'string')) throw new Error('Invalid saved promotion');
  }
  return list;
}
export function addProduct(list, product, count = 1) {
  if (!quantity(count)) return list;
  const existing = list.groups.find((g) => g.kind === 'individual' && g.items[0].productId === product.id && sameIdentity(g.items[0].snapshot, product));
  if (existing && existing.items[0].quantity + count <= MAX_QUANTITY) return setQuantity(list, existing.id, 0, existing.items[0].quantity + count);
  return { ...list, groups: [...list.groups, { id: uid(), kind: 'individual', items: [itemFor(product, count)] }] };
}
export function setQuantity(list, groupId, index, count) {
  if (!quantity(count)) return list;
  return { ...list, groups: list.groups.map((g) => g.id !== groupId ? g : { ...g, items: g.items.map((item, i) => i === index ? { ...item, quantity: count } : item) }) };
}
export const removeGroup = (list, groupId) => ({ ...list, groups: list.groups.filter((g) => g.id !== groupId) });
export function isBogoCandidate(product, promotion) {
  return Boolean(product && promotion?.kind === 'bogo' && product.bogo?.evidenceStatus === 'source-marked' && product.bogo.promotionId === promotion.id && product.bogo.group === product.category && !['Cake Packs', 'Cakes - Size Unconfirmed', 'Cakes'].includes(product.category));
}
// A source marker is historical evidence, not approval of a current benefit.
// All consumers (cards, filters and list assessment) use these same three states.
export function getBogoState(product, promotions, today = storeDate()) {
  const promotion = promotions.find((p) => p.id === product?.bogo?.promotionId);
  const marked = product?.bogo?.evidenceStatus === 'source-marked';
  const eligible = isBogoCandidate(product, promotion) && product.bogo.eligibilityStatus === 'verified';
  const rulesReady = ['customer-choice', 'equal-price', 'lower-price-free'].includes(promotion?.priceRule) && promotion?.limitsConfirmed && promotion?.stackingConfirmed;
  const priceReady = promotion?.priceRule === 'customer-choice' || (Number.isInteger(product?.priceCents) && product.priceCents >= 0);
  return { marked, eligible, active: Boolean(eligible && promotionIsCurrent(promotion, today) && rulesReady && priceReady) };
}
export function canPair(first, second, promotion) {
  return isBogoCandidate(first, promotion) && isBogoCandidate(second, promotion) && first.category === second.category;
}
export function startBogo(list, groupId, catalog, promotion) {
  const group = list.groups.find((g) => g.id === groupId);
  const first = group && catalog.find((p) => p.id === group.items[0]?.productId);
  if (group?.kind !== 'individual' || !isBogoCandidate(first, promotion) || !sameIdentity(group.items[0].snapshot, first)) return list;
  let next = group.items[0].quantity === 1 ? removeGroup(list, groupId) : setQuantity(list, groupId, 0, group.items[0].quantity - 1);
  next = { ...next, groups: [...next.groups, { id: uid(), kind: 'bogo', promotionId: promotion.id, promotionRevision: promotion.revision, items: [itemFor(first)] }] };
  return next;
}
export function setBogoPartner(list, groupId, partner, catalog, promotion) {
  const group = list.groups.find((g) => g.id === groupId);
  const first = group && catalog.find((p) => p.id === group.items[0]?.productId);
  if (group?.kind !== 'bogo' || !canPair(first, partner, promotion)) return list;
  return { ...list, groups: list.groups.map((g) => g.id === groupId ? { ...g, items: [g.items[0], itemFor(partner, g.items[0].quantity)] } : g) };
}
export function setPairCount(list, groupId, count) {
  if (!quantity(count)) return list;
  return { ...list, groups: list.groups.map((g) => g.id === groupId && g.kind === 'bogo' ? { ...g, items: g.items.map((item) => ({ ...item, quantity: count })) } : g) };
}
export function dissolveGroup(list, groupId) {
  const group = list.groups.find((g) => g.id === groupId);
  if (!group || group.kind === 'individual') return list;
  return { ...list, groups: list.groups.flatMap((g) => g.id !== groupId ? [g] : g.items.map((item) => ({ id: uid(), kind: 'individual', items: [item] }))) };
}
export function reviewGroup(list, groupId, catalog, promotions) {
  return { ...list, groups: list.groups.map((g) => {
    if (g.id !== groupId || g.items.some((i) => !catalog.some((p) => p.id === i.productId))) return g;
    const promotion = promotions.find((p) => p.id === g.promotionId);
    return { ...g, ...(promotion ? { promotionRevision: promotion.revision } : {}), items: g.items.map((i) => itemFor(catalog.find((p) => p.id === i.productId), i.quantity)) };
  }) };
}
export function promotionIsCurrent(promotion, today = storeDate()) {
  if (promotion?.status !== 'confirmed') return false;
  // Dates must be explicitly confirmed; an open-ended policy also requires evidence.
  if (!promotion.validityConfirmed) return false;
  return (!promotion.validFrom || today >= promotion.validFrom) && (!promotion.validThrough || today <= promotion.validThrough);
}
export function addPromotion(list, promotion, catalog, selections, today) {
  if (!promotionIsCurrent(promotion, today) || !['choice', 'fixed'].includes(promotion.kind)) return list;
  const entries = promotion.kind === 'fixed' ? promotion.components : selections;
  if (!Array.isArray(entries) || !entries.length || entries.some((i) => !quantity(i.quantity) || !catalog.some((p) => p.id === i.productId) || !promotion.eligibleIds?.includes(i.productId))) return list;
  return { ...list, groups: [...list.groups, { id: uid(), kind: 'promotion', promotionId: promotion.id, promotionRevision: promotion.revision, items: entries.map((i) => itemFor(catalog.find((p) => p.id === i.productId), i.quantity)) }] };
}
export function setPromotionItem(list, groupId, index, product, count, promotion, today) {
  const group = list.groups.find((g) => g.id === groupId);
  if (group?.kind !== 'promotion' || group.promotionId !== promotion?.id || promotion.kind !== 'choice' || !promotionIsCurrent(promotion, today) || !Number.isInteger(index) || index < 0 || index > group.items.length || (count !== 0 && (!quantity(count) || !promotion.eligibleIds?.includes(product?.id)))) return list;
  const items = [...group.items];
  if (count === 0) items.splice(index, 1);
  else items[index] = itemFor(product, count);
  return items.length ? { ...list, groups: list.groups.map((g) => g.id === groupId ? { ...g, items } : g) } : removeGroup(list, groupId);
}
export function assessList(list, catalog, promotions, today = storeDate()) {
  const seen = new Set();
  const groups = list.groups.map((group) => {
    const issues = [];
    if (seen.has(group.id)) issues.push('Duplicate group. Remove it and add the products again.');
    seen.add(group.id);
    const items = group.items.map((item) => {
      const product = catalog.find((p) => p.id === item.productId);
      const changed = product && !sameIdentity(item.snapshot, product);
      if (!product) issues.push(`${item.snapshot.name} is no longer in the catalog. No replacement has been selected.`);
      else if (changed) issues.push(`${item.snapshot.name}: catalog details changed. Review the current product before accepting the update.`);
      if (!quantity(item.quantity)) issues.push('Enter a whole-number quantity from 1 to 999.');
      return { ...item, product, changed: Boolean(changed), missing: !product, paid: null, free: null };
    });
    const promotion = promotions.find((p) => p.id === group.promotionId);
    let state = 'individual';
    if (group.kind !== 'individual') {
      state = 'incomplete';
      if (!promotion) issues.push('This promotion is no longer available. Keep these products as individual units or remove the group.');
      else {
        if ((group.kind === 'bogo' && promotion.kind !== 'bogo') || (group.kind === 'promotion' && !['choice', 'fixed'].includes(promotion.kind))) issues.push('The promotion format changed. Reconfigure this selection.');
        if (group.promotionRevision !== promotion.revision) issues.push('Promotion conditions changed. Review and accept the updated conditions.');
        if (!promotionIsCurrent(promotion, today)) issues.push(promotion.status === 'pending' ? 'Store confirmation required. This benefit has not been applied.' : 'This promotion is expired or unavailable. No benefit has been applied.');
        if (group.kind === 'bogo') {
          if (items.some((item) => !getBogoState(item.product, promotions, today).eligible)) issues.push('Current BOGO eligibility for each selected product needs store confirmation.');
          if (items.length !== 2) issues.push('Choose the second BOGO product to complete this pair.');
          else if (!canPair(items[0].product, items[1].product, promotion)) issues.push('Both products must be eligible BOGO items from the same category.');
          if (items.length === 2 && items[0].quantity !== items[1].quantity) issues.push('The two BOGO selections need matching quantities.');
          if (!promotion.priceRule || !promotion.limitsConfirmed || !promotion.stackingConfirmed) issues.push('Free-item assignment, limits and coupon compatibility require confirmation.');
          const count = list.groups.filter((g) => g.promotionId === promotion.id).reduce((sum, g) => sum + g.items[0].quantity, 0);
          if (promotion.maxGroupsPerList != null && count > promotion.maxGroupsPerList) issues.push('This selection exceeds the confirmed promotion limit.');
          if (promotion.priceRule === 'equal-price' && (items.some((i) => !Number.isInteger(i.product?.priceCents)) || items[0]?.product?.priceCents !== items[1]?.product?.priceCents)) issues.push('Verified equal prices are required for this pair.');
          if (promotion.priceRule === 'lower-price-free' && items.some((i) => !Number.isInteger(i.product?.priceCents))) issues.push('Verified prices are required to identify the free item.');
          if (promotion.priceRule && !['customer-choice', 'equal-price', 'lower-price-free'].includes(promotion.priceRule)) issues.push('The free-item rule needs review.');
          if (!issues.length) {
            const freeIndex = promotion.priceRule === 'lower-price-free' && items[0].product.priceCents < items[1].product.priceCents ? 0 : 1;
            items.forEach((i, index) => { i.free = index === freeIndex ? i.quantity : 0; i.paid = i.quantity - i.free; });
            state = 'complete';
          }
        } else {
          const copies = list.groups.filter((g) => g.promotionId === promotion.id).length;
          if (promotion.maxGroupsPerList != null && copies > promotion.maxGroupsPerList) issues.push('This selection exceeds the confirmed promotion limit.');
          if (items.some((i) => !promotion.eligibleIds?.includes(i.productId))) issues.push('This promotion contains an ineligible product.');
          if (items.reduce((sum, i) => sum + i.quantity, 0) !== promotion.requiredQuantity) issues.push(`Select exactly ${promotion.requiredQuantity} eligible units.`);
          if (promotion.kind === 'fixed' && JSON.stringify(items.map(({ productId, quantity: n }) => ({ productId, quantity: n }))) !== JSON.stringify(promotion.components)) issues.push('Keep the verified fixed package composition.');
          if (!promotion.limitsConfirmed || !promotion.stackingConfirmed) issues.push('Promotion limits and compatibility require confirmation.');
          if (!issues.length) { state = 'complete'; items.forEach((i) => { i.paid = i.quantity; i.free = 0; }); }
        }
      }
    } else if (!issues.length) items.forEach((i) => { i.paid = i.quantity; i.free = 0; });
    if (issues.length && state === 'individual') state = 'review';
    return { ...group, items, promotion, state, issues: [...new Set(issues)], total: items.reduce((sum, i) => sum + i.quantity, 0) };
  });
  return {
    groups, total: groups.reduce((sum, g) => sum + g.total, 0),
    paid: groups.reduce((sum, g) => sum + g.items.reduce((n, i) => n + (i.paid || 0), 0), 0),
    free: groups.reduce((sum, g) => sum + g.items.reduce((n, i) => n + (i.free || 0), 0), 0),
    pending: groups.filter((g) => g.issues.length).reduce((sum, g) => sum + g.total, 0),
    // Do not display a partial monetary total. No current Rockwall price list is verified.
    priceTotal: null,
  };
}
