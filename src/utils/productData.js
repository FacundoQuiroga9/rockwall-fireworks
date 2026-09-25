import { getBogoState } from '../shared/myList.js';

export const getFeaturedProducts = (products) => {
  if (!Array.isArray(products)) return [];

  return products
    .filter(
      (product) =>
        product &&
        typeof product.id === 'string' &&
        product.id.trim() &&
        typeof product.name === 'string' &&
        product.name.trim() &&
        product.featured === true,
    )
    .sort(
      (firstProduct, secondProduct) =>
        (Number.isFinite(firstProduct.sortOrder)
          ? firstProduct.sortOrder
          : Number.MAX_SAFE_INTEGER) -
        (Number.isFinite(secondProduct.sortOrder)
          ? secondProduct.sortOrder
          : Number.MAX_SAFE_INTEGER),
    );
};

export const getProductCategories = (products) => [
  ...new Set(
    (Array.isArray(products) ? products : [])
      .map((product) => product?.category?.trim())
      .filter(Boolean),
  ),
];

// Unknown brands are a fallback, always after the named collection.
export const getCatalogBrands = (products) => {
  const names = [...new Set(products.map((p) => p.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'en-US'));
  return products.some((p) => !p.brand) ? [...names, 'Unspecified'] : names;
};

const normalizeSearch = (value) => value.normalize('NFKD').replace(/\p{M}/gu, '')
  .toLocaleLowerCase('en-US').replace(/\b(?:[a-z]\.)+[a-z]\.?/g, (initials) => initials.replace(/\./g, ''))
  .replace(/['’]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

export const filterCatalog = (products, { query = '', category = '', brand = '', favorites = null, bogoOnly = false, offers = [], today } = {}) => {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
  return products.filter((product) => {
    if (bogoOnly && !getBogoState(product, offers, today).active) return false;
    if (category && product.category !== category) return false;
    if (brand && (product.brand || 'Unspecified') !== brand) return false;
    if (favorites && !favorites.includes(product.id)) return false;
    const searchable = normalizeSearch([product.name, product.category, product.brand, product.presentation]
      .filter(Boolean).join(' '));
    return terms.every((term) => searchable.includes(term));
  }).sort((a, b) => a.name.localeCompare(b.name, 'en-US') || a.id.localeCompare(b.id));
};
