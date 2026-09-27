import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { buildPlaygroundDocument } from '../src/shared/playgroundDocument.js';
import { createPlaygroundRenderer } from '../src/shared/playgroundRenderer.js';
import { updatePlaygroundSelection, playgroundCatalog } from '../src/shared/playgroundSelection.js';
import { validateProfiles } from '../src/shared/playgroundTimeline.js';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url)));
const data=read('src/data/playgroundProfiles.json'), products=read('src/data/products.json'), environments=read('src/data/playgroundEnvironments.json');
const doc='docs/catalog/playground-environments-2026-09/', hash=b=>createHash('sha256').update(b).digest('hex');
test('scenic documents select one landscape, preserve the Dallas markup and reserve the same canvas layout',()=>{
 for(const scene of ['ground','close']){
  const html=buildPlaygroundDocument({profiles:[],scene,environment:environments[scene].wide});
  assert.equal((html.match(/<img class="environment"/g)||[]).length,1);
  assert.ok(html.includes(environments[scene].wide));
  assert.ok(!html.includes(environments[scene==='ground'?'close':'ground'].wide));
  assert.ok(!html.includes('<div class="terrain">'));assert.ok(!html.includes('class="city"'));
  assert.ok(html.includes('object-position:center bottom'));assert.ok(html.includes('position:absolute;z-index:0;inset:0;width:100%;height:100%'));
 }
 const baseline=read(doc+'dallas-baseline.json');
 const aerial=buildPlaygroundDocument({profiles:[],scene:'aerial',skyline:'http://localhost:5173/images/hero/dallas-skyline-2160.webp',environment:environments.ground.wide});
 assert.ok(!aerial.includes('class="environment"'));
 assert.equal(hash(aerial.split('<script>')[0].replace(/\s+</g,'<')),baseline.markupSha256);
 for(const [p,sha] of Object.entries(baseline.assets))assert.equal(hash(readFileSync(new URL('../'+p,import.meta.url))),sha,p);
});
test('base photos are requested only for selected products and onload handlers are released',()=>{
 const before={image:globalThis.Image,observer:globalThis.ResizeObserver};const images=[];
 globalThis.Image=class{constructor(){images.push(this);}};globalThis.ResizeObserver=class{observe(){}disconnect(){}};
 const context={setTransform(){},clearRect(){},save(){},restore(){}};
 const canvas={getContext:()=>context,getBoundingClientRect:()=>({width:1280,height:640})};
 try{
  const bases={one:{src:'one.webp'},two:{src:'two.webp'}};
  const empty=createPlaygroundRenderer(canvas,[],false,undefined,bases);assert.equal(images.length,0);empty.destroy();
  const renderer=createPlaygroundRenderer(canvas,[{productId:'one',scene:'aerial',events:[]}],false,undefined,bases);
  assert.deepEqual(images.map(i=>i.src),['one.webp']);renderer.destroy();assert.equal(images[0].onload,null);
 }finally{globalThis.Image=before.image;globalThis.ResizeObserver=before.observer;}
});
test('quiet scenario changes preserve independent picks and still reject a fifth product',()=>{
 let value;const apply=action=>{const result=updatePlaygroundSelection(data.profiles,value,action);value=result.state;return result;};
 const aerial=data.profiles.filter(p=>p.scene==='aerial').slice(0,5).map(p=>p.productId);
 for(const id of aerial.slice(0,4))apply({type:'select',id});
 assert.equal(apply({type:'scene',scene:'ground'}).message,'');
 const ground=data.profiles.find(p=>p.scene==='ground').productId;apply({type:'toggle',id:ground});
 apply({type:'scene',scene:'close'});assert.deepEqual(value.picks.aerial,aerial.slice(0,4));
 apply({type:'scene',scene:'aerial'});assert.deepEqual(value.picks.aerial,aerial.slice(0,4));
 const fifth=apply({type:'toggle',id:aerial[4]});assert.equal(fifth.limited,true);assert.match(fifth.message,/Remove one/);
 apply({type:'clear'});assert.deepEqual(value.picks.aerial,[]);assert.deepEqual(value.picks.ground,[ground]);
 assert.equal(playgroundCatalog(data.profiles,'ground').groups.length,0);
});
test('six individually reviewed cake excerpts extend exact-ID coverage without changing approved profiles',()=>{
 assert.deepEqual(validateProfiles(data,products),[]);
 const get=id=>data.profiles.find(p=>p.productId===id);
 for(const p of read(doc+'baseline-profiles.json').profiles)assert.deepEqual(get(p.productId),p);
 const ids=read(doc+'new-profile-ids.json');assert.equal(ids.length,6);
 for(const id of ids){const p=get(id);assert.equal(p.kind,'cake-sample');assert.equal(p.scene,'aerial');assert.equal(p.playback,'automatic');assert.equal(p.events.length,p.observedShots);assert.ok(Math.abs(p.duration-(p.source.segmentEnd-p.source.segmentStart))<1e-8);for(const e of p.events){assert.ok(e.burst>e.launch);assert.ok(e.burst+e.life<=p.duration+.001);}}
 const coverage=read(doc+'cake-coverage.json');assert.deepEqual(coverage.map(r=>r.productId).sort(),products.filter(p=>p.category.toLowerCase().includes('cake')).map(p=>p.id).sort());
 for(const id of ids)assert.equal(coverage.find(r=>r.productId===id).status,'excerpt');
});
test('compact scenic bytes and all published profiles match the app; wide assets remain bounded',()=>{
 const app=new URL('../../rockwall-fireworks-mobile/',import.meta.url);
 const ts=readFileSync(new URL('src/data/playgroundEnvironments.ts',app),'utf8');
 for(const asset of Object.values(environments)){
  assert.ok(statSync(new URL('../public'+asset.wide,import.meta.url)).size<130000);
  const bytes=readFileSync(new URL('../public'+asset.compact,import.meta.url));assert.ok(bytes.length<60000);assert.ok(ts.includes('data:image/webp;base64,'+bytes.toString('base64')));
 }
 for(const file of ['src/data/playgroundProfiles.json','src/data/playgroundIndex.json','src/shared/playgroundDocument.js','src/shared/playgroundRenderer.js','src/shared/playgroundSelection.js'])assert.equal(readFileSync(new URL('../'+file,import.meta.url),'utf8'),readFileSync(new URL(file,app),'utf8'),file);
});
