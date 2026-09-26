export const MAX_PLAYGROUND_SELECTION: number;
type Profile = { productId: string; kind: string; name: string; brand: string };
export function profileScene(profile: Profile): 'ground' | 'aerial';
export function profileGroup(profile: Profile): string;
export function togglePlaygroundSelection(ids: string[], id: string): { ids: string[]; limited: boolean };
export function filterPlaygroundProfiles<T extends Profile>(profiles: T[], group?: string, search?: string): T[];
export function sceneProfiles<T extends Profile>(profiles: T[], ids: string[], scene: string): T[];
