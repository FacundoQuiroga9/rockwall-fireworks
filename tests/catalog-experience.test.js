import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { applyManualCorrections, compareCatalogs, mobileProduct, run } from '../scripts/catalog/sync.mjs';
import { filterCatalog } from '../src/utils/productData.js';
import { FAVORITES_KEY, readFavoriteIds, saveFavoriteIds, toggleFavoriteId } from '../src/utils/catalogFavorites.js';
import { youtubeVideoId } from '../src/utils/productVideo.js';
import { catalogPages, renderPageMetadata } from '../scripts/catalog/build-pages.mjs';
const products=JSON.parse(readFileSync(new URL('../src/data/products.json',import.meta.url),'utf8'));
test('user-confirmed brands persist by ID without merging Festival Balls presentations',()=>{
  const corrections=JSON.parse(readFileSync(new URL('../docs/catalog/manual-corrections.json',import.meta.url),'utf8'));
  assert.ok(corrections.length >= 12);
  for (const [id,brand] of [['big-city-display','Black Cat'],['junior-pyro-assortment','Black Cat'],['pyro-city-safe-sane','Black Cat'],['war-hero','Brothers'],['super-magnum-12-pack','World-Class']]) assert.equal(products.find(p=>p.id===id).brand,brand);
  const stale=structuredClone(products);
  for(const c of corrections) delete stale.find(p=>p.id===c.id).brand;
  const repaired=applyManualCorrections(stale,corrections);
  for(const c of corrections) assert.equal(repaired.find(p=>p.id===c.id).brand,c.brand);
  assert.deepEqual(applyManualCorrections(repaired,corrections),repaired);
  assert.equal(repaired.find(p=>p.id==='festival-balls-artillery').brand,'Black Cat');
  assert.equal(repaired.find(p=>p.id==='festival-balls-reloadable').brand,'Monkey Mania');
  const changed=structuredClone(stale);changed.find(p=>p.id===corrections[0].id).image='/wrong-package.webp';
  assert.throws(()=>applyManualCorrections(changed,corrections),/identity changed/);
});
test('brand identifiers and labels are unique and Firehawk uses the supplied local logo',()=>{
  const brands=JSON.parse(readFileSync(new URL('../src/data/brands.json',import.meta.url),'utf8'));
  assert.equal(new Set(brands.map(b=>b.id)).size,brands.length);
  assert.equal(new Set(brands.map(b=>b.name.toLowerCase().replace(/[^a-z0-9]/g,''))).size,brands.length);
  const firehawk=brands.find(b=>b.id==='firehawk');assert.equal(firehawk.name,'Firehawk Fireworks');
  assert.ok(existsSync(new URL(`../public${firehawk.image}`,import.meta.url)));
  assert.ok(existsSync(new URL(`../public${firehawk.image.replace('.webp','-160.webp')}`,import.meta.url)));
  assert.ok(products.some(p=>p.brand==='Firehawk'));
});
test('actual web/mobile files and image identities agree per ID',()=>assert.equal(run({check:true}).result,'PASS'));
test('parity detects differing identity, variant, description, image mapping and absent video',()=>{
  const original=products.map(mobileProduct);
  assert.deepEqual(compareCatalogs(products,original),[]);
  for(const field of ['name','brand','category','presentation','description','features','imageKey','previewVideoUrl']){
    const altered=structuredClone(original);altered[0][field]=field==='features'?['Wrong variant']:'wrong';
    assert.ok(compareCatalogs(products,altered).length,field);
  }
  assert.ok(compareCatalogs(products,original.slice(1)).length);
  assert.ok(compareCatalogs([...products,{...products[0],id:'duplicate-slug'}],original).some(e=>e.includes('slug')));
});
test('brand/category/search/favorites combine and reset without merging Festival Balls',()=>{
  const ids=filterCatalog(products,{brand:'Black Cat',category:'Artillery Shells',query:'24'}).map(p=>p.id);
  assert.deepEqual(ids,['diablo','neon-diablo-24-pack','the-patriot-24-pack']);
  assert.deepEqual(filterCatalog(products,{brand:'Black Cat',favorites:['diablo'],query:'24'}).map(p=>p.id),['diablo']);
  assert.equal(filterCatalog(products,{brand:'Black Cat',category:'Parachutes'}).length,0);
  assert.equal(filterCatalog(products,{query:'Festival Balls'}).length,2);
  assert.equal(filterCatalog(products).length,products.length);
});
test('web favorites persist by stable ID and safely handle corrupt or disabled storage',()=>{
  let value=null;const storage={getItem:k=>{assert.equal(k,FAVORITES_KEY);return value;},setItem:(k,v)=>{assert.equal(k,FAVORITES_KEY);value=v;}};
  const valid=products.map(p=>p.id);assert.deepEqual(readFavoriteIds(storage,valid),[]);
  assert.equal(saveFavoriteIds(storage,toggleFavoriteId([],valid[0])),true);
  assert.deepEqual(readFavoriteIds(storage,valid),[valid[0]]);
  saveFavoriteIds(storage,toggleFavoriteId(readFavoriteIds(storage,valid),valid[0]));assert.deepEqual(readFavoriteIds(storage,valid),[]);
  value=JSON.stringify([valid[0],valid[0],'removed']);assert.deepEqual(readFavoriteIds(storage,valid),[valid[0]]);
  value='{bad';assert.deepEqual(readFavoriteIds(storage,valid),[]);
  assert.equal(saveFavoriteIds({setItem:()=>{throw Error('disabled');}},[]),false);
});
test('YouTube URLs support exact videos and reject search/general/malicious links',()=>{
  assert.equal(youtubeVideoId('https://youtu.be/is8CCkWA4yI'),'is8CCkWA4yI');
  assert.equal(youtubeVideoId('https://www.youtube.com/watch?v=is8CCkWA4yI&t=6s'),'is8CCkWA4yI');
  for(const url of [null,'','https://youtube.com/results?search_query=fireworks','https://evil.test/watch?v=is8CCkWA4yI','https://youtube.com/watch?v=short']) assert.equal(youtubeVideoId(url),null);
  assert.ok(products.some(p=>!p.previewVideo));
  for(const p of products) if(p.previewVideo) assert.ok(youtubeVideoId(p.previewVideo),p.id);
});
test('reviewed enrichment retains Square lineage and required local resources',()=>{
  const reviews=JSON.parse(readFileSync(new URL('../docs/catalog/enrichment-2026-09/reviewed-products.json',import.meta.url),'utf8'));
  const rows=new Set();
  for(const r of reviews){
    const p=products.find(p=>p.id===r.id);assert.ok(p);assert.equal(p.featured,false);assert.equal(p.manufacturerCode,r.manufacturerCode);
    for(const row of r.squareRows){assert.ok(!rows.has(row));rows.add(row);}
    assert.ok(r.sources.length&&r.evidence.length>50);
    assert.ok(existsSync(new URL(`../public${p.image}`,import.meta.url)));
    assert.ok(existsSync(new URL(`../${r.referenceImage || `docs/catalog/enrichment-2026-09/references/${p.id}-original.png`}`,import.meta.url)));
    const latest = JSON.parse(readFileSync(new URL('../docs/catalog/iteration-2026-09-25/video-research.json',import.meta.url),'utf8')).find(v => v.id === p.id);
    const continuity = JSON.parse(readFileSync(new URL('../docs/catalog/playground-continuity-2026-09/video-updates.json',import.meta.url),'utf8')).find(v => v.id === p.id);
    const scenes = JSON.parse(readFileSync(new URL('../docs/catalog/playground-scenes-2026-09/video-updates.json',import.meta.url),'utf8')).find(v => v.id === p.id);
    assert.equal(p.previewVideo,scenes?.previewVideo ?? continuity?.previewVideo ?? latest?.previewVideo ?? r.previewVideo);
  }
});
test('every initial pending row has an outcome and approved photos retain their identity',()=>{
  const decisions=JSON.parse(readFileSync(new URL('../docs/catalog/continuation-2026-09-24/row-decisions.json',import.meta.url),'utf8'));
  const reviews=JSON.parse(readFileSync(new URL('../docs/catalog/enrichment-2026-09/reviewed-products.json',import.meta.url),'utf8'));
  const states=new Set(['incorporated','linked_existing','duplicate','excluded','no_verified_identity','candidate_requires_package_review','identity_confirmation_needed','data_conflict','identified_missing_image','package_review']);
  assert.equal(decisions.length,1013);
  assert.equal(new Set(decisions.map(d=>d.csv_row)).size,1013);
  assert.equal(new Set(decisions.map(d=>d.square_token)).size,1013);
  for(const d of decisions){
    assert.ok(states.has(d.status),d.csv_row);
    assert.ok(d.reason.length>40 && d.queries.length,d.csv_row);
    if(d.status==='incorporated'){
      assert.ok(products.some(p=>p.id===d.product_id));
      assert.ok(reviews.some(r=>r.id===d.product_id && r.squareRows.includes(Number(d.csv_row))));
    } else if(!['duplicate','excluded','linked_existing'].includes(d.status)) assert.ok(d.required_next_step.length>20,d.csv_row);
  }
  for(const r of reviews.filter(r=>r.batch)){
    const bytes=readFileSync(new URL(`../${r.referenceImage}`,import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'),r.sourceImageSha256,r.id);
    assert.ok(r.sourceImageUrl?.startsWith('https://') || r.sourceImage,r.id);
  }
});
test('catalog routes have unique canonical metadata, their own image and sitemap entries',()=>{
  const base=readFileSync(new URL('../index.html',import.meta.url),'utf8');
  const sitemap=readFileSync(new URL('../public/sitemap.xml',import.meta.url),'utf8');
  const pages=catalogPages(products);
  assert.equal(new Set(pages.map(p=>p.path)).size,products.length+1);
  for(const page of pages){
    const html=renderPageMetadata(base,page);
    assert.ok(html.includes(`<link rel="canonical" href="https://www.rockwallfireworks.com${page.path}"`));
    assert.ok(sitemap.includes(`<loc>https://www.rockwallfireworks.com${page.path}</loc>`));
    assert.equal((html.match(/rel="canonical"/g)||[]).length,1);
    if(page.image){
      assert.ok(html.includes(`content="https://www.rockwallfireworks.com${page.image}"`));
      assert.ok(!html.includes('property="og:image:width"'));
      assert.ok(!html.includes('property="og:image:height"'));
    }
  }
  const escaped=renderPageMetadata(base,{...pages[1],title:'A < B & "C"'});
  assert.ok(escaped.includes('<title>A &lt; B &amp; &quot;C&quot;</title>'));
});
