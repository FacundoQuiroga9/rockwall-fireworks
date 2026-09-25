import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import products from '../../data/products.json';
import logos from '../../data/brands.json';
import promotions from '../../data/promotions.json';
import { getBogoState } from '../../shared/myList';
import { filterCatalog, getProductCategories, getCatalogBrands } from '../../utils/productData';
import { useBrandRail } from '../../hooks/useBrandRail';
import { useCatalogFavorites } from '../../hooks/useCatalogFavorites';
import ProductCard from './ProductCard';
import './FullCatalog.css';

const PAGE_SIZE = 12;
const categories = getProductCategories(products).sort();
const brands = getCatalogBrands(products);
const brandKey = (value) => value.toLowerCase().replace(/fireworks|[^a-z0-9]/g, '');
export default function FullCatalog() {
  const [params, setParams] = useSearchParams();
  const pendingParams = useRef(params);
  useEffect(() => { pendingParams.current = params; }, [params]);
  const query = params.get('q') || '';
  const category = params.get('category') || '';
  const brand = params.get('brand') || '';
  const favoritesOnly = params.get('saved') === '1';
  const bogoOnly = params.get('bogo') === '1';
  const hasActiveBogo = products.some((p) => getBogoState(p, promotions).active);
  const { ids } = useCatalogFavorites();
  const brandRow = useRef(null);
  const rail = useBrandRail(brandRow);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const filtered = useMemo(() => filterCatalog(products, { query, category, brand, favorites: favoritesOnly ? ids : null, bogoOnly, offers: promotions }), [query, category, brand, favoritesOnly, ids, bogoOnly]);
  useEffect(() => {
    const row = brandRow.current;
    const selected = row?.querySelector('[aria-pressed="true"]');
    if (selected) row.scrollTo({ left: Math.max(0, selected.offsetLeft - (row.clientWidth - selected.offsetWidth) / 2), behavior: 'instant' });
  }, [brand]);
  const update = (key, value) => {
    const next = new URLSearchParams(pendingParams.current);
    if (value) next.set(key, value); else next.delete(key);
    pendingParams.current = next;
    setParams(next, { replace: true, preventScrollReset: true });
    setLimit(PAGE_SIZE);
  };
  const clear = () => {
    pendingParams.current = new URLSearchParams();
    setParams(pendingParams.current, { replace: true, preventScrollReset: true });
    setLimit(PAGE_SIZE);
  };
  return (
    <div id="catalog" className="full-catalog" aria-label="Fireworks catalog">
      <div className="catalog-brand-heading"><h2>Choose your brand</h2><div className="catalog-brand-navigation"><span>Swipe or drag to explore</span><button type="button" aria-label="Previous brands" aria-controls="catalog-brands" disabled={rail.edges.start} onClick={() => rail.advance(-1)}>‹</button><button type="button" aria-label="More brands" aria-controls="catalog-brands" disabled={rail.edges.end} onClick={() => rail.advance(1)}>›</button></div></div>
      <div id="catalog-brands" className="catalog-brands" ref={brandRow} {...rail.handlers} role="group" aria-label="Filter by brand">
        <button type="button" aria-pressed={!brand} onClick={() => update('brand', '')}><span className="brand-all" aria-hidden="true">ALL</span><span>All brands</span></button>
        {brands.map((name) => {
          const logo = logos.find((item) => brandKey(item.name) === brandKey(name));
          return <button type="button" key={name} aria-pressed={brand === name} onClick={() => update('brand', brand === name ? '' : name)}>
            {logo ? <img src={logo.image} width={logo.width} height={logo.height} alt="" loading="lazy" /> : <span className="brand-wordmark" aria-hidden="true">{name === 'Unspecified' ? 'MORE' : name}</span>}
            <span>{name === 'Unspecified' ? 'Other brands' : name}</span>
          </button>;
        })}
      </div>
      <div className="catalog-search-tools">
        <label htmlFor="catalog-search">Find your fireworks
          <input id="catalog-search" type="search" value={query} placeholder="Name, brand or package…" onChange={(event) => update('q', event.target.value)} />
        </label>
        <label htmlFor="catalog-category">Category
          <select id="catalog-category" value={category} onChange={(event) => update('category', event.target.value)}>
            <option value="">All categories</option>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <button className="catalog-clear" type="button" onClick={clear} disabled={!query && !category && !brand && !favoritesOnly && !bogoOnly}>Clear filters</button>
      </div>
      <div className="catalog-results-toolbar">
        <p className="catalog-result-count" role="status">{filtered.length} {filtered.length === 1 ? 'product' : 'products'}{filtered.length ? ` · Showing ${Math.min(limit, filtered.length)}` : ''}{brand && ` · ${brand === 'Unspecified' ? 'Other brands' : brand}`}</p>
        <div className="catalog-toggle-group"><button className="catalog-bogo-toggle" type="button" aria-pressed={bogoOnly} aria-describedby="bogo-filter-note" onClick={() => update('bogo', bogoOnly ? '' : '1')}><span aria-hidden="true">{bogoOnly ? '✓' : '+'}</span> BOGO only</button>
        <button className="catalog-saved-toggle" type="button" aria-pressed={favoritesOnly} onClick={() => update('saved', favoritesOnly ? '' : '1')}>Saved favorites ({ids.length})</button></div>
      </div>
      <p id="bogo-filter-note" className="catalog-local-note">{hasActiveBogo ? 'BOGO only shows verified, active Buy One, Get One offers.' : 'No active BOGO offer is confirmed yet. “Check in store” labels identify source-marked products, not an applied offer.'}</p>
      {favoritesOnly && <p className="catalog-local-note">Saved in this browser. Favorites in the app stay on your device.</p>}
      <div className="catalog-grid">
        {filtered.slice(0, limit).map((product) => <ProductCard key={product.id} product={product} detailed />)}
      </div>
      {!filtered.length && (
        <div className="catalog-empty">
          <h2>{bogoOnly && !hasActiveBogo ? 'No confirmed BOGO offers right now.' : favoritesOnly && !ids.length ? 'Your favorites start here.' : 'No matches for these filters.'}</h2>
          <p>{bogoOnly && !hasActiveBogo ? 'BOGO means Buy One, Get One. Current terms and eligibility still need store confirmation.' : favoritesOnly && !ids.length ? 'Save a product with the heart button to find it here again.' : 'Try a different brand, category or name, or clear your filters.'}</p>
          {bogoOnly && <button type="button" onClick={() => update('bogo', '')}>Turn off BOGO only</button>}
          <button type="button" onClick={clear}>Explore all products</button>
        </div>
      )}
      {limit < filtered.length && <button className="catalog-load-more" type="button" onClick={() => setLimit((current) => current + PAGE_SIZE)}>Show more products <span>({filtered.length - limit} more)</span></button>}
    </div>
  );
}
