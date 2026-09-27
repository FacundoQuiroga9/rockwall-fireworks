import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { PLAYGROUND_SCENES, playgroundCatalog, updatePlaygroundSelection, restorePlaygroundSelection, sceneProfiles } from '../src/shared/playgroundSelection.js';
import { createTimeline, validateProfiles } from '../src/shared/playgroundTimeline.js';
import { launchSystemLabel } from '../src/shared/catalogCategory.js';
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url)));
const data=read('../src/data/playgroundProfiles.json'),profiles=data.profiles;
const get=id=>profiles.find(p=>p.productId===id);
const command=(s,type,rest={})=>updatePlaygroundSelection(profiles,s,{type,...rest}).state;

test('three catalogs partition all published profiles, with only useful filters and scene-local search',()=>{
 const catalogs=PLAYGROUND_SCENES.map(s=>playgroundCatalog(profiles,s));
 const cakes=profiles.filter(p=>p.kind.startsWith('cake')).length;
 assert.deepEqual(catalogs.map(c=>c.total),[cakes+11,3,6]);
 assert.deepEqual(catalogs[0].groups,[{name:'All',count:cakes+11},{name:'Cakes',count:cakes},{name:'Artillery Shells',count:11}]);
 assert.deepEqual(catalogs[2].groups,[]);
 const all=catalogs.flatMap(c=>c.visible.map(p=>p.productId));assert.equal(new Set(all).size,profiles.length);assert.deepEqual(all.sort(),profiles.map(p=>p.productId).sort());
 assert.equal(playgroundCatalog(profiles,'ground','Artillery Shells').visible.length,6);
 assert.equal(playgroundCatalog(profiles,'aerial','All','fountain').visible.length,0);
 assert.equal(playgroundCatalog(profiles,'aerial','Reloadables','G-Force').visible[0].productId,'g-force-24-pack');
 assert.deepEqual(playgroundCatalog(profiles,'close').groups.map(g=>g.name),['All','Spinners','Roman Candles','Rockets']);
});

test('normal picks cannot cross scenes; explicit detail entry and scenario tabs retain all three selections',()=>{
 const ids=['vertical-limit','skybolt-rockets-5-pack','movie-time'];let s=restorePlaygroundSelection(profiles);
 s=command(s,'toggle',{id:ids[0]});assert.deepEqual(command(s,'toggle',{id:ids[1]}),s);
 for(const id of ids.slice(1))s=command(s,'select',{id});
 for(const scene of PLAYGROUND_SCENES){s=command(s,'scene',{scene});assert.equal(s.picks[scene].length,1);assert.ok(sceneProfiles(profiles,s.picks[scene],scene).every(p=>p.scene===scene));const before=structuredClone(s);playgroundCatalog(profiles,scene,'All','no match');assert.deepEqual(s,before);}
 s=command(s,'clear');assert.deepEqual(s.picks.ground,[]);assert.deepEqual(s.picks.aerial,[ids[0]]);assert.deepEqual(s.picks.close,[ids[1]]);
 const dirty=restorePlaygroundSelection(profiles,{scene:'close',picks:{aerial:ids,ground:ids,close:[...ids,ids[1],'missing']}});
 assert.deepEqual(dirty.picks,{aerial:[ids[0]],close:[ids[1]],ground:[ids[2]]});
 const full=profiles.filter(p=>p.scene==='aerial').slice(0,4).map(p=>p.productId);
 const result=updatePlaygroundSelection(profiles,{scene:'ground',picks:{aerial:full}},{type:'select',id:'g-force-24-pack'});
 assert.equal(result.limited,true);assert.deepEqual(result.state.picks.aerial,full);
});

test('approved profiles retain every visual parameter; only Skybolt scene metadata changes',()=>{
 const hashes=read('../docs/catalog/playground-navigation-2026-09/approved-profile-hashes.json');
 const digest=p=>createHash('sha256').update(JSON.stringify(p)).digest('hex');
 assert.equal(Object.keys(hashes).length,31);
 for(const [id,hash]of Object.entries(hashes)){
  if(id!=='skybolt-rockets-5-pack')assert.equal(digest(get(id)),hash,id);
  else {const old=read('../docs/catalog/playground-navigation-2026-09/skybolt-before.json'),current=structuredClone(get(id));assert.equal(current.scene,'close');current.scene=old.scene;current.revision=old.revision;current.source.notes=old.source.notes;assert.deepEqual(current,old);}
 }
});

test('new excerpts and twelve-effect bank match catalog identity and both platforms',()=>{
 const products=read('../src/data/products.json');assert.deepEqual(validateProfiles(data,products),[]);
 assert.deepEqual(data,read('../../rockwall-fireworks-mobile/src/data/playgroundProfiles.json'));
 for(const path of ['playgroundSelection.js','playgroundSelection.d.ts','catalogCategory.js','catalogCategory.d.ts'])assert.equal(readFileSync(new URL('../src/shared/'+path,import.meta.url),'utf8'),readFileSync(new URL('../../rockwall-fireworks-mobile/src/shared/'+path,import.meta.url),'utf8'));
 const ids=read('../docs/catalog/playground-navigation-2026-09/new-profile-ids.json');assert.equal(ids.length,4);
 for(const id of ids){const p=get(id);assert.equal(p.scene,'aerial');assert.equal(p.source.url,products.find(x=>x.id===id).previewVideo);for(const e of p.events)assert.ok(e.burst+e.life<=p.duration+.00001);}
 assert.equal(get('vertical-limit').kind,'cake-sample');assert.equal(get('vertical-limit').events.length,16);
 assert.equal(get('one-bad-mother-in-law').kind,'cake-sample');assert.equal(get('strobing-willow').events.length,20);
 const g=get('g-force-24-pack');assert.equal(g.shellCount,24);assert.equal(g.shellEffects.length,12);assert.ok(g.shellEffects.every(e=>e.breakCount===1));
 const timeline=createTimeline([get('vertical-limit'),get('one-bad-mother-in-law'),get('strobing-willow'),g]);timeline.play(0);timeline.play(0);
 let now=0;const seen=[];
 for(let i=0;i<24;i++){
  assert.equal(timeline.snapshot().shells[0].effectId,g.shellEffects[i%12].id);assert.equal(timeline.launch(3,now),false);
  timeline.pause(now);now+=1000;timeline.play(now);assert.equal(timeline.snapshot().shells[0].launched,i+1);
  for(let step=0;step<120;step++){now+=50;seen.push(...timeline.tick(now).cues);}
  if(i<23)assert.equal(timeline.launch(3,now),true);
 }
 assert.equal(seen.filter(e=>e.profile<3&&e.type==='burst').length,52);assert.equal(seen.filter(e=>e.profile===3&&e.type==='burst').length,24);
 assert.equal(timeline.launch(3,now),false);timeline.restart();timeline.play(now);assert.equal(timeline.snapshot().shells[0].effectIndex,0);
});

test('confirmed launch systems persist with identity guards, omit unknowns, and leave commercial eligibility unchanged',async()=>{
 const {applyCommercialCorrections}=await import('../scripts/catalog/sync.mjs');
 const products=read('../src/data/products.json'),corrections=read('../docs/catalog/playground-navigation-2026-09/launch-system-corrections.json');
 assert.equal(corrections.length,16);const missing=products.map(({launchSystem,...p})=>p);const restored=applyCommercialCorrections(missing,corrections);assert.deepEqual(restored,products);
 for(const p of products){assert.deepEqual(p.bogo,missing.find(x=>x.id===p.id).bogo);assert.equal(p.promotionCategory,missing.find(x=>x.id===p.id).promotionCategory);assert.equal(launchSystemLabel(p),p.launchSystem?'Reloadable shell kit':'');}
 assert.equal(products.filter(p=>p.category==='Artillery Shells'&&!p.launchSystem).length,22);
 assert.throws(()=>applyCommercialCorrections(products,[{...corrections[0],brand:'Wrong variant'}]));
 assert.equal(launchSystemLabel({launchSystem:'unverified'}),'');
});
