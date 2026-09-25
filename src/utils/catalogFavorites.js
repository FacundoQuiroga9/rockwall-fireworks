export const FAVORITES_KEY = 'rockwall:favorites:v1';
export const readFavoriteIds = (storage, validIds) => {
  try {
    const value = JSON.parse(storage.getItem(FAVORITES_KEY) || '[]');
    return Array.isArray(value) ? [...new Set(value.filter((id) => validIds.includes(id)))] : [];
  } catch { return []; }
};
export const toggleFavoriteId = (ids, id) => ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
export const saveFavoriteIds = (storage, ids) => {
  try { storage.setItem(FAVORITES_KEY, JSON.stringify(ids)); return true; } catch { return false; }
};
