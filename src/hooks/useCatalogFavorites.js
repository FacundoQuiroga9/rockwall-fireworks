import { useEffect, useState } from 'react';
import products from '../data/products.json';
import { FAVORITES_KEY, readFavoriteIds, saveFavoriteIds, toggleFavoriteId } from '../utils/catalogFavorites';
const validIds = products.map((product) => product.id);
const read = () => { try { return readFavoriteIds(window.localStorage, validIds); } catch { return []; } };
export function useCatalogFavorites() {
  const [ids, setIds] = useState(read);
  const [error, setError] = useState(false);
  useEffect(() => {
    const refresh = (event) => { if (!event.key || event.key === FAVORITES_KEY) setIds(read()); };
    window.addEventListener('storage', refresh);
    window.addEventListener('catalog-favorites', refresh);
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener('catalog-favorites', refresh); };
  }, []);
  const toggle = (id) => {
    const next = toggleFavoriteId(read(), id);
    let saved = false;
    try { saved = saveFavoriteIds(window.localStorage, next); } catch { /* storage may be disabled */ }
    setError(!saved);
    if (saved) { setIds(next); window.dispatchEvent(new Event('catalog-favorites')); }
  };
  return { ids, toggle, error };
}
