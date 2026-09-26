// The web JSON is the commercial source. No runtime dependency crosses repositories.
import { readFileSync, writeFileSync, renameSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { mountPlayground } from '../../src/shared/playgroundRuntime.js';
import { createPlaygroundRenderer } from '../../src/shared/playgroundRenderer.js';
import { createFountainModel } from '../../src/shared/playgroundFountain.js';
import { createPlaygroundAudio } from '../../src/shared/playgroundAudio.js';
import { createTimeline, validateProfiles } from '../../src/shared/playgroundTimeline.js';
export const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const mobileRoot = resolve(webRoot, '../rockwall-fireworks-mobile');
const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const hash = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');
// Preserve the last complete file if the disk fills during generation.
const writeAtomic = (path, content) => {
  writeFileSync(`${path}.tmp`, content);
  renameSync(`${path}.tmp`, path);
};
const fields = ['id', 'name', 'category', 'brand', 'presentation', 'description', 'features', 'manufacturerCode', 'featured', 'sortOrder', 'storeCodes', 'cakeClass', 'saleUnit', 'bogo', 'demonstration'];
export function applyCommercialCorrections(products, corrections) {
  const corrected = structuredClone(products);
  const seen = new Set();
  for (const correction of corrections) {
    const product = corrected.find((p) => p.id === correction.id);
    if (!product || product.name !== correction.name || product.image !== correction.image || seen.has(correction.id)) throw new Error(`Commercial identity changed: ${correction.id}`);
    seen.add(correction.id);
    for (const [key, value] of Object.entries(correction.fields)) {
      if (!['category', 'presentation', 'storeCodes', 'cakeClass', 'saleUnit', 'bogo'].includes(key)) throw new Error(`Invalid commercial field: ${key}`);
      product[key] = value;
    }
  }
  return corrected;
}
export function applyManualCorrections(products, corrections) {
  const corrected = structuredClone(products);
  const seen = new Set();
  for (const correction of corrections) {
    if (seen.has(correction.id)) throw new Error(`Duplicate manual correction: ${correction.id}`);
    seen.add(correction.id);
    const product = corrected.find((p) => p.id === correction.id);
    if (!product || product.name !== correction.name || product.image !== correction.image) {
      throw new Error(`Manual correction identity changed: ${correction.id}; review its name and approved image`);
    }
    product.brand = correction.brand;
  }
  return corrected;
}
export function applyVideoCorrections(products, corrections) {
  const corrected = structuredClone(products);
  const seen = new Set();
  for (const correction of corrections) {
    const product = corrected.find((p) => p.id === correction.id);
    if (!product || product.name !== correction.name || product.image !== correction.image || product.brand !== correction.brand || seen.has(correction.id) || correction.status !== 'approved' || !/^https:\/\/www\.youtube\.com\/watch\?v=[\w-]{11}$/.test(correction.previewVideo)) throw new Error(`Video identity or approval changed: ${correction.id}`);
    seen.add(correction.id);
    product.previewVideo = correction.previewVideo;
  }
  return corrected;
}
export function mobileProduct(product) {
  return { ...Object.fromEntries(fields.filter((field) => product[field] !== undefined).map((field) => [field, product[field]])), imageKey: product.id, ...(product.previewVideo ? { previewVideoUrl: product.previewVideo } : {}) };
}
export function applyCopyCorrections(products, corrections) {
  const corrected = structuredClone(products);
  const seen = new Set();
  for (const correction of corrections) {
    const product = corrected.find((p) => p.id === correction.id);
    if (!product || product.name !== correction.name || seen.has(correction.id)) throw new Error(`Copy correction identity changed: ${correction.id}`);
    seen.add(correction.id);
    for (const [key, value] of Object.entries(correction.fields)) {
      if (!['description', 'features', 'presentation'].includes(key)) throw new Error(`Invalid editorial field: ${key}`);
      if (value === null) delete product[key]; else product[key] = value;
    }
  }
  return corrected;
}
export function compareCatalogs(web, mobile) {
  const errors = [];
  for (const [name, items] of [['web', web], ['mobile', mobile]]) {
    if (new Set(items.map((p) => p.id)).size !== items.length) errors.push(`${name}: duplicate ID`);
  }
  if (new Set(web.map((p) => p.slug)).size !== web.length || web.some((p) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug))) errors.push('web: invalid or duplicate slug');
  for (const p of web) {
    const peer = mobile.find((m) => m.id === p.id);
    if (!peer) errors.push(`${p.id}: missing mobile product`);
    else if (!isDeepStrictEqual(mobileProduct(p), peer)) errors.push(`${p.id}: commercial fields or video differ`);
  }
  for (const p of mobile) if (!web.some((w) => w.id === p.id)) errors.push(`${p.id}: missing web product`);
  return errors;
}
const renderProducts = (products) => `import { Product } from '@/src/types/product';\n\n// Generated by web: npm run catalog:sync. IDs are permanent.\nexport const products: readonly Product[] = ${JSON.stringify(products.map(mobileProduct), null, 2)};\n\nexport const featuredProducts = products.filter((product) => product.featured).sort((a, b) => a.sortOrder - b.sortOrder);\nexport const productCategories = [...new Set(products.map((product) => product.category))];\nexport const productBrands = [...new Set(products.map((product) => product.brand).filter((brand): brand is string => Boolean(brand)))].sort();\nexport const getProductById = (id: string | undefined) => products.find((product) => product.id === id);\n`;
const renderTypes = (products) => `// Generated by web: npm run catalog:sync.\nexport const productIds = ${JSON.stringify(products.map((p) => p.id), null, 2)} as const;\nexport type ProductId = (typeof productIds)[number];\nexport type Product = Readonly<{\n  id: ProductId; name: string; category: string; brand?: string; presentation?: string;\n  description?: string; features?: readonly string[]; manufacturerCode?: string;\n  demonstration?: { summary: string; effects: readonly string[]; durationSeconds: number; scope: string; observedShots: number | null; confirmedShots?: number | null; sourceUrl: string; segmentStart: number; segmentEnd: number; note: string };\n  featured: boolean; imageKey: ProductId; previewVideoUrl?: string; sortOrder: number;\n}>;\nexport const isProductId = (value: unknown): value is ProductId => typeof value === 'string' && (productIds as readonly string[]).includes(value);\n`;
export function run({ check = false } = {}) {
  const masterPath = resolve(webRoot, 'src/data/products.json');
  const master = read(masterPath);
  const corrections = read(resolve(webRoot, 'docs/catalog/manual-corrections.json'));
  const brands = read(resolve(webRoot, 'src/data/brands.json'));
  for (const correction of corrections) {
    if (correction.brandId === null && correction.brand === '' && correction.publicBrandSuppressed === true) continue;
    const brand = brands.find((b) => b.id === correction.brandId);
    if (!brand || brand.name.replace(/ Fireworks$/, '') !== correction.brand) throw new Error(`Noncanonical brand correction: ${correction.id}`);
  }
  const copyCorrections = read(resolve(webRoot, 'docs/catalog/presentation-2026-09/commercial-copy-review.json'));
  const commerce = read(resolve(webRoot, 'docs/catalog/my-list-2026-09/commercial-review.json'));
  // Later research is an identity-guarded overlay; rerunning the original Square
  // reconciliation must never erase a subsequently verified classification.
  const cakeResearch = read(resolve(webRoot, 'docs/catalog/refinement-2026-09-25/cake-research.json'));
  const latestCakes = read(resolve(webRoot, 'docs/catalog/iteration-2026-09-25/cake-corrections.json'));
  const videos = read(resolve(webRoot, 'docs/catalog/iteration-2026-09-25/video-research.json'));
  const continuityVideos = read(resolve(webRoot, 'docs/catalog/playground-continuity-2026-09/video-updates.json'));
  const products = applyVideoCorrections(applyVideoCorrections(applyCommercialCorrections(applyCommercialCorrections(applyCommercialCorrections(applyCopyCorrections(applyManualCorrections(master, corrections), copyCorrections), commerce), cakeResearch), latestCakes), videos), continuityVideos);
  for (const entry of read(resolve(webRoot, 'docs/catalog/playground-evolution-2026-09/catalog-enrichment.json'))) {
    const product = products.find((p) => p.id === entry.id);
    if (!product || product.previewVideo !== entry.demonstration.sourceUrl) throw new Error('Demonstration identity changed: ' + entry.id);
    product.demonstration = entry.demonstration;
  }
  const assets = read(resolve(webRoot, 'docs/catalog/asset-identities.json'));
  const pdfThumbnails = read(resolve(webRoot, 'src/data/pdfThumbnails.json'));
  const generated = {
    'src/data/products.ts': renderProducts(products),
    'src/types/product.ts': renderTypes(products),
    'src/data/productImages.ts': `import { ProductId } from '@/src/types/product';\n\nexport const productImages: Record<ProductId, number> = {\n${products.map((p) => `  '${p.id}': require('../../${assets.find((a) => a.id === p.id)?.mobilePath}'),`).join('\n')}\n};\n`,
  };
  generated['src/types/product.ts'] = generated['src/types/product.ts'].replace('  featured: boolean;', '  storeCodes?: readonly { token: string; sku: string; gtin: string; sourceRow: number }[];\n  cakeClass?: { status: string; grams: number | null }; saleUnit?: string;\n  bogo?: { eligibilityStatus?: string; evidenceStatus: string; promotionId: string; group: string; sourceTokens: readonly string[] };\n  featured: boolean;');
  for (const path of ['src/data/promotions.json', 'src/data/pdfThumbnails.json', 'src/data/brands.json', 'src/shared/myList.js', 'src/shared/myList.d.ts', 'src/shared/listPdf.js', 'src/shared/listPdf.d.ts', 'src/shared/listPresentation.js', 'src/shared/listPresentation.d.ts', 'src/data/playgroundProfiles.json', 'src/data/playgroundIndex.json', 'src/shared/playgroundSelection.js', 'src/shared/playgroundSelection.d.ts', 'src/shared/playgroundTimeline.js', 'src/shared/playgroundFountain.js', 'src/shared/playgroundPresentation.js', 'src/shared/playgroundPresentation.d.ts', 'src/data/playgroundBases.json', 'src/shared/playgroundRenderer.js', 'src/shared/playgroundAudio.js', 'src/shared/playgroundRuntime.js', 'src/shared/playgroundDocument.js', 'src/shared/playgroundDocument.d.ts']) {
    generated[path] = readFileSync(resolve(webRoot, path), 'utf8');
  }
  generated['src/data/brandLogos.ts'] = `// Generated by catalog:sync.\nexport const brandLogos: Record<string, number> = {\n${brands.map((b) => `  ${JSON.stringify(b.name.replace(/ Fireworks$/, ''))}: require('../../assets/brands/${b.id}.webp'),`).join('\n')}\n};\n`;
  // Pre-serialize in Node: Hermes cannot reliably recover function source at runtime.
  const runtimeSource = `// Generated by catalog:sync. Do not edit; source lives in playgroundRuntime/Timeline/Renderer/Audio.\nexport const playgroundRuntimeSource = ${JSON.stringify(`(config) => (${mountPlayground.toString()})(config,${createTimeline.toString()},${createPlaygroundRenderer.toString()},${createPlaygroundAudio.toString()},${createFountainModel.toString()})`)};\n`;
  generated['src/shared/playgroundRuntimeSource.js'] = runtimeSource;
  if (check && readFileSync(resolve(webRoot, 'src/shared/playgroundRuntimeSource.js'), 'utf8') !== runtimeSource) throw new Error('Web playground runtime stale; run catalog:sync');
  if (!check) writeAtomic(resolve(webRoot, 'src/shared/playgroundRuntimeSource.js'), runtimeSource);
  generated['src/data/playgroundSkyline.ts'] = `// Generated from the approved Dallas skyline; local/offline.\nexport const playgroundSkyline = 'data:image/webp;base64,${readFileSync(resolve(webRoot, 'public/images/hero/dallas-skyline-1440.webp')).toString('base64')}';\n`;
  const baseAssets = read(resolve(webRoot, 'src/data/playgroundBases.json'));
  const offlineBases = Object.fromEntries(Object.entries(baseAssets).map(([id, base]) => [id, { ...base, src: 'data:image/webp;base64,' + readFileSync(resolve(webRoot, `public${base.src}`)).toString('base64') }]));
  generated['src/data/playgroundBaseImages.ts'] = `// Generated from approved product photos; offline.\nexport const playgroundBases = ${JSON.stringify(offlineBases)};\n`;
  const profiles = read(resolve(webRoot, 'src/data/playgroundProfiles.json'));
  const errors = validateProfiles(profiles, products);
  if (!isDeepStrictEqual(read(resolve(webRoot, 'src/data/playgroundIndex.json')), profiles.profiles.map(({ productId, kind }) => ({ productId, kind })))) errors.push('Playground index differs');
  for (const brand of brands) {
    const target = resolve(mobileRoot, `assets/brands/${brand.id}.webp`);
    const source = resolve(webRoot, `public${brand.image}`);
    if (check) {
      if (!existsSync(target) || hash(source) !== hash(target)) errors.push(`${brand.id}: brand logo differs`);
    } else { mkdirSync(dirname(target), { recursive: true }); copyFileSync(source, target); }
  }
  if (check && !isDeepStrictEqual(master, products)) errors.push('Manual corrections not applied to master; run catalog:sync');
  // Check mode reads the actual compiled TS data, never an audit snapshot.
  const current = readFileSync(resolve(mobileRoot, 'src/data/products.ts'), 'utf8').match(/export const products: readonly Product\[\] = (\[[\s\S]*?\n\]);/);
  if (check) errors.push(...compareCatalogs(products, current ? JSON.parse(current[1]) : []));
  else errors.push(...compareCatalogs(products, products.map(mobileProduct)));
  for (const p of products) {
    if (pdfThumbnails[p.id]?.sourceSha256 !== hash(resolve(webRoot, `public${p.image}`))) errors.push(`${p.id}: PDF thumbnail missing or stale; run python3 scripts/catalog/prepare_pdf_thumbnails.py`);
    const asset = assets.find((a) => a.id === p.id);
    if (!asset?.identity || !asset.sourceSha256) { errors.push(`${p.id}: missing image identity`); continue; }
    if (asset.webPath !== `public${p.image}` || !['png', 'webp'].some((extension) => asset.mobilePath === `assets/products/${p.id}.${extension}`)) errors.push(`${p.id}: wrong image mapping`);
    if (asset.framingSource && (!existsSync(resolve(webRoot, asset.framingSource)) || hash(resolve(webRoot, asset.framingSource)) !== asset.framingSourceSha256)) errors.push(`${p.id}: archived framing original missing or changed`);
    for (const [root, path, expected] of [[webRoot, asset.webPath, asset.webSha256], [mobileRoot, asset.mobilePath, asset.mobileSha256], ...asset.responsive.map((a) => [webRoot, a.path, a.sha256])]) {
      if (!existsSync(resolve(root, path)) || hash(resolve(root, path)) !== expected) errors.push(`${p.id}: image missing or changed: ${path}`);
    }
  }
  for (const [path, content] of Object.entries(generated)) {
    if (check) { if (!existsSync(resolve(mobileRoot, path)) || readFileSync(resolve(mobileRoot, path), 'utf8') !== content) errors.push(`${path}: generated file out of date`); }
    else if (!errors.length) { mkdirSync(dirname(resolve(mobileRoot, path)), { recursive: true }); writeAtomic(resolve(mobileRoot, path), content); }
  }
  const routes = ['/', '/products', '/playground', ...products.map((p) => `/products/${p.slug}`), '/mobile-app', '/terms-and-conditions', '/app-privacy', '/app-support'];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `  <url><loc>https://www.rockwallfireworks.com${route}</loc></url>`).join('\n')}\n</urlset>\n`;
  if (check) { if (readFileSync(resolve(webRoot, 'public/sitemap.xml'), 'utf8') !== sitemap) errors.push('sitemap out of date'); }
  else if (!errors.length) {
    writeAtomic(masterPath, JSON.stringify(products, null, 2) + '\n');
    writeAtomic(resolve(webRoot, 'public/sitemap.xml'), sitemap);
    const snapshotPath = resolve(mobileRoot, 'docs/catalog/web-catalog-snapshot.json');
    const snapshot = read(snapshotPath); snapshot.products = products;
    writeAtomic(snapshotPath, JSON.stringify(snapshot, null, 2) + '\n');
  }
  if (errors.length) throw new Error(errors.join('\n'));
  return { products: products.length, imageIdentities: assets.length, fields, result: 'PASS' };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { console.log(JSON.stringify(run({ check: process.argv.includes('--check') }), null, 2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
