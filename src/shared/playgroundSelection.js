// Ephemeral playground selection is independent of My List and its storage.
export const PLAYGROUND_SCENES = ['aerial', 'close', 'ground'];
export const sceneLabel = scene => ({ aerial: 'Dallas Sky', ground: 'Close-up', close: 'Open Field' })[scene] || 'Scene';
export const MAX_PLAYGROUND_SELECTION = 4;
export const profileScene = (profile) => PLAYGROUND_SCENES.includes(profile.scene) ? profile.scene : null;
export const profileGroup = profile => ({ 'shell-sample': 'Artillery Shells', 'candle-sample': 'Roman Candles', 'spinner-sample': 'Spinners', 'rocket-sample': 'Rockets', fountain: 'Fountains', 'fountain-sample': 'Fountains' })[profile.kind] || 'Cakes';
export function togglePlaygroundSelection(ids, id) {
  if (ids.includes(id)) return { ids: ids.filter((value) => value !== id), limited: false };
  return ids.length >= MAX_PLAYGROUND_SELECTION ? { ids, limited: true } : { ids: [...ids, id], limited: false };
}
export function filterPlaygroundProfiles(profiles, group = 'All', search = '') {
  const query = search.trim().toLowerCase();
  if (group === 'Reloadables') group = 'Artillery Shells';
  return profiles.filter((p) => (group === 'All' || profileGroup(p) === group) && (!query || `${p.name} ${p.brand}`.toLowerCase().includes(query)));
}
// Catalog membership follows reviewed profile data, never product names/categories.
export function playgroundCatalog(profiles, scene, group = 'All', search = '') {
  const compatible = profiles.filter(p => profileScene(p) === scene);
  const categories = [...new Set(compatible.map(profileGroup))];
  const groups = categories.length > 1 ? ['All', ...categories] : [];
  const normalized = group === 'Reloadables' ? 'Artillery Shells' : group;
  const activeGroup = groups.includes(normalized) ? normalized : 'All';
  return {
    groups: groups.map(name => ({ name, count: filterPlaygroundProfiles(compatible, name).length })),
    visible: filterPlaygroundProfiles(compatible, activeGroup, search),
    total: compatible.length,
    group: activeGroup,
  };
}
export function sceneProfiles(profiles, ids, scene) {
  return [...new Set(ids)].map((id) => profiles.find((p) => p.productId === id)).filter((p) => p && profileScene(p) === scene).slice(0, MAX_PLAYGROUND_SELECTION);
}

// In-memory session only. No My List/favorites storage or persisted commercial data.
let session;
let preferences = { volume: .35, quality: 'auto', sound: null };
let hydrated = false;
const preferenceKey = 'rockwall:playground-preferences:v1';
export function restorePlaygroundSelection(profiles, value) {
  const scene = PLAYGROUND_SCENES.includes(value?.scene) ? value.scene : 'aerial';
  const picks = Object.fromEntries(PLAYGROUND_SCENES.map((family) => [family,
    sceneProfiles(profiles, Array.isArray(value?.picks?.[family]) ? value.picks[family] : [], family).map((p) => p.productId),
  ]));
  return { scene, picks };
}
export const sceneChangeMessage = scene => `${sceneLabel(scene)} selected. Your other picks are saved.`;
export function updatePlaygroundSelection(profiles, value, action) {
  const state = restorePlaygroundSelection(profiles, value);
  const previous = state.scene;
  let limited = false;
  if (action.type === 'clear') state.picks[state.scene] = [];
  else if (action.type === 'scene' && PLAYGROUND_SCENES.includes(action.scene)) {
    if (action.scene === previous) return { state, limited: false, message: '' };
    state.scene = action.scene;
  }
  else if (action.type === 'toggle' || action.type === 'select') {
    const profile = profiles.find((p) => p.productId === action.id);
    const target = profile && profileScene(profile);
    if (!target) return { state, limited: false, message: 'This preview is unavailable.' };
    // Only a product-detail entry may cross scenes; normal toggles stay scoped.
    if (action.type === 'toggle' && target !== previous) return { state, limited: false, message: 'Choose this product in its scene.' };
    state.scene = target;
    const ids = state.picks[target];
    // A remembered pick activates its scene; only an active pick toggles off.
    if (ids.includes(action.id)) {
      if (target === previous && action.type === 'toggle') state.picks[target] = ids.filter((id) => id !== action.id);
    } else if (ids.length === MAX_PLAYGROUND_SELECTION) limited = true;
    else state.picks[target] = [...ids, action.id];
  }
  const message = [previous !== state.scene ? sceneChangeMessage(state.scene) : '',
    limited ? 'Four picks in this scene. Remove one before adding another.' : action.type === 'clear'
      ? 'Active selection cleared. Your other scenes are saved.' : '',
  ].filter(Boolean).join(' ');
  return { state, limited, message };
}
export function getPlaygroundSession(profiles, productId) {
  const state = restorePlaygroundSelection(profiles, session);
  return productId ? updatePlaygroundSelection(profiles, state, { type: 'select', id: productId }) : { state, limited: false, message: '' };
}
export function savePlaygroundSession(profiles, value) { session = restorePlaygroundSelection(profiles, value); }
export function savePlaygroundPreferences(value) {
  if (Number.isFinite(value?.volume)) preferences.volume = Math.max(0, Math.min(1, value.volume));
  if (['auto', 'high', 'balanced', 'low'].includes(value?.quality)) preferences.quality = value.quality;
  if (typeof value?.sound === 'boolean') preferences.sound = value.sound;
  try { globalThis.localStorage?.setItem(preferenceKey, JSON.stringify(preferences)); } catch { /* Private browsing can disable storage. */ }
}
export function getPlaygroundPreferences() {
  if (!hydrated) { hydrated = true; try { const saved = JSON.parse(globalThis.localStorage?.getItem(preferenceKey) || 'null'); if (saved) savePlaygroundPreferences(saved); } catch { /* Keep defaults on invalid/unavailable storage. */ } }
  return { ...preferences };
}
