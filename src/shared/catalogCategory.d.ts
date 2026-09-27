export function normalizeCategory(value?: string): string;
export function categorySearchText(product: { category: string; categoryAliases?: readonly string[] }): string;
export function shellPackageLabel(product: { shellPackage?: { style?: string; shellCount?: number; totalBreaks?: number; includedTubes?: number; contents?: string } }): string;

export function launchSystemLabel(product: { launchSystem?: string }): string;
