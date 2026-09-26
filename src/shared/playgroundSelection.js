// Ephemeral playground selection is independent of My List and its storage.
export const MAX_PLAYGROUND_SELECTION = 4;
export const profileScene = (profile) => ['aerial', 'ground'].includes(profile.scene) ? profile.scene : null;
export const profileGroup = (profile) => profileScene(profile) === 'ground' ? 'Fountains' : profile.kind === 'shell-sample' ? 'Artillery Shells' : 'Cakes';
export function togglePlaygroundSelection(ids, id) {
  if (ids.includes(id)) return { ids: ids.filter((value) => value !== id), limited: false };
  return ids.length >= MAX_PLAYGROUND_SELECTION ? { ids, limited: true } : { ids: [...ids, id], limited: false };
}
export function filterPlaygroundProfiles(profiles, group = 'All', search = '') {
  const query = search.trim().toLowerCase();
  return profiles.filter((p) => (group === 'All' || profileGroup(p) === group) && (!query || `${p.name} ${p.brand}`.toLowerCase().includes(query)));
}
export function sceneProfiles(profiles, ids, scene) {
  return [...new Set(ids)].map((id) => profiles.find((p) => p.productId === id)).filter((p) => p && profileScene(p) === scene).slice(0, MAX_PLAYGROUND_SELECTION);
}

// In-memory session only. No My List/favorites storage or persisted commercial data.
let session;
let preferences = { volume: .35, quality: 'auto' };
export function restorePlaygroundSelection(profiles, value) {
  const scene = value?.scene === 'ground' ? 'ground' : 'aerial';
  const picks = Object.fromEntries(['aerial', 'ground'].map((family) => [family,
    sceneProfiles(profiles, Array.isArray(value?.picks?.[family]) ? value.picks[family] : [], family).map((p) => p.productId),
  ]));
  return { scene, picks };
}
export const sceneChangeMessage = (scene) => scene === 'ground'
  ? 'Switched to the ground scene. Your aerial picks are saved.'
  : 'Switched to the Dallas sky. Your ground picks are saved.';
export function updatePlaygroundSelection(profiles, value, action) {
  const state = restorePlaygroundSelection(profiles, value);
  const previous = state.scene;
  let limited = false;
  if (action.type === 'clear') state.picks[state.scene] = [];
  else if (action.type === 'scene' && ['aerial', 'ground'].includes(action.scene)) {
    if (action.scene === previous) return { state, limited: false, message: 'This scene is already active. Your picks are unchanged.' };
    state.scene = action.scene;
  }
  else if (action.type === 'toggle' || action.type === 'select') {
    const profile = profiles.find((p) => p.productId === action.id);
    const target = profile && profileScene(profile);
    if (!target) return { state, limited: false, message: 'This preview is unavailable.' };
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
      ? 'Active selection cleared. Your other scene is saved.' : 'Playback reset. Press Play when ready.',
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
  if (['auto', 'balanced', 'low'].includes(value?.quality)) preferences.quality = value.quality;
}
export const getPlaygroundPreferences = () => ({ ...preferences });
