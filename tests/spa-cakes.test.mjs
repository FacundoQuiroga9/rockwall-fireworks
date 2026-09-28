import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createTimeline, validateProfiles } from '../src/shared/playgroundTimeline.js';
import { createPlaygroundRenderer } from '../src/shared/playgroundRenderer.js';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url)));
const data=read('src/data/playgroundProfiles.json'), catalog=read('src/data/products.json');
const ids=read('docs/catalog/spa-cakes-2026-09-28/new-profile-ids.json');
const added=ids.map(id=>data.profiles.find(p=>p.productId===id));
test('cake additions preserve all 53 preceding profiles and reconcile exact source identities',()=>{
 for(const old of read('docs/catalog/spa-cakes-2026-09-28/baseline-profile-hashes.json')){
  const p=data.profiles.find(p=>p.productId===old.productId);
  assert.equal(createHash('sha256').update(JSON.stringify(p)).digest('hex'),old.sha256,old.productId);
 }
 assert.deepEqual(validateProfiles(data,catalog),[]);
 for(const p of added){const product=catalog.find(c=>c.id===p.productId);assert.equal(p.source.url,product.previewVideo);assert.equal(p.source.manufacturerCode,product.manufacturerCode);}
 assert.deepEqual(added.map(p=>[p.kind,p.events.length]),[['cake',9],['cake',9],['cake-sample',16]]);
 assert.equal(added[2].source.segmentEnd,25.9); // stops before unresolved retail finale at 26.9
});
test('source onsets, long pauses and close pairs survive the shared clock without duplicates',()=>{
 for(const p of added)for(const step of [16.667,83,170]){
  const clock=createTimeline([p]);clock.play(0);let cues=[];
  for(let t=0;t<(p.duration+1)*1000;t+=step)cues.push(...clock.tick(t).cues);
  assert.deepEqual(cues.filter(c=>c.type==='burst').map(c=>c.event.id),p.events.map(e=>e.id));
  assert.equal(cues.filter(c=>c.type==='launch').length,p.observedShots);
  assert.equal(clock.snapshot().state,'ended');assert.equal(clock.snapshot().position,p.duration);
 }
 assert.ok(added[0].events[1].burst-added[0].events[0].burst>5.4);
 assert.ok(Math.abs(added[0].events.at(-1).burst-added[0].events.at(-2).burst-.38)<1e-8);
 assert.ok(Math.abs(added[1].events.at(-1).burst-added[1].events.at(-2).burst-.2)<1e-8);
});
test('new ring components reject invalid planes and tails outside the reviewed event',()=>{
 const p=structuredClone(added[0]);p.events[0].ringChase.sweepSeconds=5;
 assert.ok(validateProfiles({profiles:[p]},catalog).includes('Invalid ghost ring persistence'));
 const h=structuredClone(added[1]);h.events[0].accent.plane.squash=0;
 assert.ok(validateProfiles({profiles:[h]},catalog).includes('Invalid accent plane'));
});
test('all new effects preserve visible tails and fade to zero before automatic end',()=>{
 const previous=globalThis.ResizeObserver;globalThis.ResizeObserver=class{observe(){}disconnect(){}};
 let points=[];const ctx={setTransform(){},clearRect(){points=[];},save(){},restore(){},beginPath(){},arc(x,y){this.point=[x,y];},fill(){points.push([...this.point,this.fillStyle,this.globalAlpha]);},stroke(){},moveTo(){},lineTo(){}};
 try{for(const p of added){
  const r=createPlaygroundRenderer({getContext:()=>ctx,getBoundingClientRect:()=>({width:1440,height:750})},[p],false);
  r.draw(p.duration-.35,[0]);assert.ok(r.metrics().activeParticles>0,p.productId);
  r.draw(p.duration-.0001,[0]);assert.ok(Math.max(0,...points.map(p=>p[3]))<.006,p.productId+': smooth extinction');
  r.draw(p.duration,[0]);assert.equal(r.metrics().activeParticles,0);r.destroy();
 }
 const p=added[0],r=createPlaygroundRenderer({getContext:()=>ctx,getBoundingClientRect:()=>({width:1440,height:750})},[p],false);
 r.draw(p.events[0].burst+.4,[0]);const first=structuredClone(points);assert.ok(points.some(p=>p[2]==='#ed637c'));
 r.draw(p.events[0].burst+2.2,[0]);assert.ok(points.length>0);assert.ok(!points.some(p=>p[2]==='#ed637c'));
 r.draw(p.events[0].burst+.4,[0]);assert.deepEqual(points,first,'seek recreates same ring and trail');r.destroy();
 }finally{globalThis.ResizeObserver=previous;}
});
