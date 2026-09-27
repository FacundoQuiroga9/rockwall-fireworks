// Navigation aliases never establish promotion eligibility.
export const normalizeCategory = (value = '') => /^reloadables$/i.test(value.trim()) ? 'Artillery Shells' : value;
export const categorySearchText = (product) => [product.category, ...(product.categoryAliases || [])].join(' ');
export function shellPackageLabel(product) {
  const p = product.shellPackage;
  if (!p) return '';
  return [p.style, p.shellCount ? `${p.shellCount} shells per pack` : '', p.totalBreaks ? `${p.totalBreaks} total breaks` : '', p.includedTubes ? `${p.includedTubes} tube${p.includedTubes === 1 ? '' : 's'} included` : '', p.contents].filter(Boolean).join(' · ');
}

// Launch-system facts appear only on product details; unknown stays absent.
export const launchSystemLabel = product => ({ 'reloadable-kit': 'Reloadable shell kit', 'single-use-preloaded': 'Single-use, preloaded tube' })[product.launchSystem] || '';
