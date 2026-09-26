// Screen labels only. Never changes persisted snapshots, catalog data or the PDF.
export function listProductName(product, catalog = []) {
  const sameName = catalog.filter((p) => p.name === product.name);
  if (sameName.length < 2) return product.name;
  const details = [];
  if (new Set(sameName.map((p) => p.brand || '')).size > 1 && product.brand) details.push(product.brand);
  const display = product.presentation?.match(/Display\s*[·/]?\s*(\d+) packs/i);
  const unit = display ? `Display of ${display[1]} packs` : product.presentation?.match(/(?:\d+[- ](?:pack|count)|\d+ (?:shells|candles|cones|fountains|pieces|tanks|firecrackers|party poppers))/i)?.[0];
  if (unit && !product.name.toLowerCase().includes(unit.toLowerCase())) details.push(unit);
  return details.length ? `${product.name} (${details.join(' · ')})` : product.name;
}
