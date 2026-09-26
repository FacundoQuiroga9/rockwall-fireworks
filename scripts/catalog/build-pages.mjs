// Static route metadata for Apache/Hostinger. React still renders the same pages.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { webRoot } from './sync.mjs';
const escape = (s) => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
export const catalogPages = (products) => [{ slug: 'index', title: 'Fireworks Catalog | Rockwall Fireworks', path: '/products', description: 'Explore fireworks by brand and category, watch product demos and save your favorites. Visit Rockwall Fireworks in Lavon, Texas.' }, ...products.map((p) => ({ slug: p.slug, path: `/products/${p.slug}`, title: `${p.name}${p.presentation ? ` — ${p.presentation}` : ''} | Rockwall Fireworks`, description: p.description || `Explore ${p.name}${p.brand ? ` by ${p.brand}` : ''}, ${p.category.toLowerCase()} at Rockwall Fireworks in Lavon, Texas.`, image: p.image }))];
export function renderPageMetadata(base, p) {
  const url = `https://www.rockwallfireworks.com${p.path}`;
  let html = base.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(p.title)}</title>`);
  for (const [attribute,key,value] of [['name','description',p.description], ['property','og:title',p.title], ['property','og:description',p.description], ['property','og:url',url], ['name','twitter:title',p.title], ['name','twitter:description',p.description]]) {
    html = html.replace(new RegExp(`<meta\\s+${attribute}="${key}"[^>]*>`, 'g'), `<meta ${attribute}="${key}" content="${escape(value)}" />`);
  }
  if (p.image) for (const [attribute,key] of [['property','og:image'],['name','twitter:image']]) html=html.replace(new RegExp(`<meta\\s+${attribute}="${key}"[^>]*>`,'g'), `<meta ${attribute}="${key}" content="https://www.rockwallfireworks.com${escape(p.image)}" />`);
  if (p.image) {
    html = html.replace(/<meta\s+property="og:image:(width|height)"[^>]*>/g, '');
    for (const [attribute, key] of [['property', 'og:image:alt'], ['name', 'twitter:image:alt']]) {
      html = html.replace(new RegExp(`<meta\\s+${attribute}="${key}"[^>]*>`, 'g'), `<meta ${attribute}="${key}" content="${escape(p.title)}" />`);
    }
  }
  html = html.replace(/<link\s+rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`);
  return html;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const products = JSON.parse(readFileSync(resolve(webRoot, 'src/data/products.json'), 'utf8'));
  const base = readFileSync(resolve(webRoot, 'dist/index.html'), 'utf8');
  const output = resolve(webRoot, 'dist/catalog-pages');
  mkdirSync(output, { recursive: true });
  const pages = catalogPages(products);
  for (const p of pages) writeFileSync(resolve(output, `${p.slug}.html`), renderPageMetadata(base, p));
  writeFileSync(resolve(webRoot, 'dist/playground.html'), renderPageMetadata(base, { path: '/playground', title: 'Fireworks Playground | Rockwall Fireworks', description: 'Choose reviewed fireworks demonstrations for an illustrative Dallas sky or fountain field.' }));
  console.log(`Generated metadata for ${pages.length} catalog routes.`);
}
