import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createTimeline, validateProfiles } from '../src/shared/playgroundTimeline.js';
import { createPlaygroundRenderer } from '../src/shared/playgroundRenderer.js';
const read = path => JSON.parse(readFileSync(new URL(path, import.meta.url)));
const data = read('../src/data/playgroundProfiles.json'), get = id => data.profiles.find(p => p.productId === id);
const rules = get('break-the-rules-6-pack'), chameleon = get('chameleon-shells-24-pack');
const hash = x => createHash('sha256').update(JSON.stringify(x)).digest('hex');

test('historical profile baselines and commercial fields stay unchanged outside reviewed scene and launch-system metadata', () => {
 const hashes = read('../docs/catalog/playground-aerial-batch-2026-09/approved-profile-hashes.json');
 assert.equal(Object.keys(hashes).length,27);
 for(const [id,digest] of Object.entries(hashes)) assert.equal(hash(id==='skybolt-rockets-5-pack'?read('../docs/catalog/playground-navigation-2026-09/skybolt-before.json'):get(id)),digest,id);
 const commercial = read('../src/data/products.json').map(({demonstration,launchSystem,...p})=>p);
 assert.equal(hash(commercial),read('../docs/catalog/playground-aerial-batch-2026-09/catalog-commercial-hash.json').sha256);
});

test('four new profiles sync with exact identities, honest windows and no truncated automatic tails', () => {
 const ids = read('../docs/catalog/playground-aerial-batch-2026-09/new-profile-ids.json');
 const mobile = read('../../rockwall-fireworks-mobile/src/data/playgroundProfiles.json');
 const catalog = read('../src/data/products.json');
 assert.deepEqual(validateProfiles(data,catalog),[]);assert.deepEqual(data,mobile);
 for(const id of ids){const p=get(id);assert.equal(p.scene,'aerial');assert.equal(p.source.url,catalog.find(x=>x.id===id).previewVideo);for(const e of p.events)assert.ok(e.burst+e.life<=p.duration);}
 assert.equal(get('hot-dog').events.length,16);assert.equal(get('hot-dog').kind,'cake');
 assert.equal(get('battle-cry').events.length,8);assert.equal(get('battle-cry').kind,'cake-sample');
 assert.equal(catalog.find(x=>x.id==='battle-cry').demonstration.confirmedShots,null);
});

test('new banks advance once per shell, keep independent indices and cycle only documented effects', () => {
 assert.equal(rules.shellCount,6);assert.equal(rules.shellEffects.length,6);
 assert.equal(chameleon.shellCount,24);assert.equal(chameleon.shellEffects.length,12);
 for(const p of [rules,chameleon]){
  const c=createTimeline([p]);c.play(0);c.play(0);let now=0;
  for(let i=0;i<p.shellCount;i++){
   const s=c.snapshot();assert.equal(s.shells[0].effectId,p.shellEffects[i%p.shellEffects.length].id);assert.equal(s.shells[0].launched,i+1);
   for(let tap=0;tap<20;tap++)assert.equal(c.launch(0,now),false);
   now+=100;c.pause(now);const paused=c.snapshot();now+=1500;c.play(now);
   assert.equal(c.snapshot().shells[0].effectIndex,paused.shells[0].effectIndex);assert.deepEqual(c.tick(now).cues,[]);
   now+=6000;c.tick(now);if(i+1<p.shellCount)assert.equal(c.launch(0,now),true);
  }
  assert.equal(c.launch(0,now),false);assert.equal(c.resetShell(0),true);assert.equal(c.launch(0,now),true);assert.equal(c.snapshot().shells[0].effectIndex,0);
 }
 const two=createTimeline([rules,chameleon]);two.play(0);two.tick(6000);two.launch(1,6000);assert.deepEqual(two.snapshot().shells.map(s=>s.launched),[1,2]);two.restart();two.play(7000);assert.deepEqual(two.snapshot().shells.map(s=>s.effectIndex),[0,0]);
});

test('split-screen samples cue one lift and one break; manual launches do not consume or restart three cakes', () => {
 for(const effect of chameleon.shellEffects){assert.equal(effect.breakCount,1);assert.equal(effect.events.length,1);assert.ok(['left','right'].includes(effect.source.screenSide));}
 const cakes=[get('hot-dog'),get('battle-cry'),get('raging-willow')], c=createTimeline([...cakes,rules]);c.play(0);const seen=[];
 for(let t=0;t<=42000;t+=50){seen.push(...c.tick(t).cues);if([6000,12000,18000,36000].includes(t))assert.equal(c.launch(3,t),true);}
 assert.equal(seen.filter(x=>x.profile<3&&x.type==='burst').length,43);
 assert.equal(seen.filter(x=>x.profile===3&&x.type==='burst').length,5);
 assert.equal(new Set(seen.map(x=>x.profile+':'+x.event.id+':'+x.type)).size,seen.length);
 assert.equal(c.snapshot().automaticPosition,35.6);assert.equal(c.launch(3,42000),true);
 c.select([0]);assert.deepEqual(c.tick(80000).cues,[]);assert.equal(c.snapshot().position,0);
});

test('tiger tails and colored flower pearls remain bounded, keep palettes across quality and clear completely', () => {
 const original=globalThis.ResizeObserver,perf=Object.getOwnPropertyDescriptor(globalThis,'performance');let now=0,colors=[];
 globalThis.ResizeObserver=class{observe(){}disconnect(){}};Object.defineProperty(globalThis,'performance',{configurable:true,value:{now:()=>now}});
 const ctx={setTransform(){},clearRect(){colors=[];},save(){},restore(){},beginPath(){},arc(){},fill(){colors.push(this.fillStyle);},stroke(){},moveTo(){},lineTo(){}};
 const canvas={getContext:()=>ctx,getBoundingClientRect:()=>({width:1600,height:800})};
 try{
  const r=createPlaygroundRenderer(canvas,[rules],false),e=rules.shellEffects[3].events[0],before=JSON.stringify(rules);
  for(const q of ['low','balanced','high']){r.setQuality(q);now+=1400;r.draw(e.burst+.5,[0],{0:[e]});assert.ok(colors.includes(e.accent.colors[0]));assert.ok(r.metrics().drawnPoints<=3200);r.draw(e.burst+.1,[0],{0:[e]});assert.ok(colors.includes(e.liftTrail.color));}
  assert.equal(r.draw(100,[0],{0:[e]}),0);r.destroy();assert.equal(JSON.stringify(rules),before);
 }finally{globalThis.ResizeObserver=original;Object.defineProperty(globalThis,'performance',perf);}
 const broken=structuredClone(data);broken.profiles.find(p=>p.productId===rules.productId).shellEffects[1].events[0].liftTrail.seconds=100;
 const catalog=data.profiles.map(p=>({id:p.productId,name:p.name,brand:p.brand,category:p.category,shellPackage:{shellCount:p.shellCount}}));
 assert.ok(validateProfiles(broken,catalog).includes('Invalid bounded lift trail'));
 broken.profiles.find(p=>p.productId===chameleon.productId).shellEffects[4].events[0].clusterRadialMin=2;
 assert.ok(validateProfiles(broken,catalog).includes('Invalid flower cluster distribution'));
});
