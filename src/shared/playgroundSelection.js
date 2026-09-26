// Ephemeral playground selection is independent of My List and its storage.
export const MAX_PLAYGROUND_SELECTION = 4;
export const profileScene = (profile) => profile.kind.startsWith('fountain') ? 'ground' : 'aerial';
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
  return ids.map((id) => profiles.find((p) => p.productId === id)).filter((p) => p && profileScene(p) === scene);
}
