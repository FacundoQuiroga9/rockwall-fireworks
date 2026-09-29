import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createTimeline, validateProfiles } from '../src/shared/playgroundTimeline.js';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url)));
const dir='docs/catalog/cake-expansion-2026-09-29/';
const data=read('src/data/playgroundProfiles.json'),products=read('src/data/products.json'),ids=read(dir+'new-profile-ids.json');
const get=id=>data.profiles.find(p=>p.productId===id);
test('cake expansion accounts for every inventory ID and preserves approved profiles',()=>{
 const rows=read(dir+'cake-coverage.json');
 assert.deepEqual(rows.map(r=>r.productId).sort(),products.filter(p=>p.category.toLowerCase().includes('cake')).map(p=>p.id).sort());
 assert.equal(new Set(rows.map(r=>r.productId)).size,117);
 assert.equal(rows.filter(r=>r.status==='complete').length,16);
 assert.equal(rows.filter(r=>r.status==='excerpt').length,24);
 for(const [id,hash] of Object.entries(read(dir+'baseline-profile-hashes-js.json')))assert.equal(createHash('sha256').update(JSON.stringify(get(id))).digest('hex'),hash,id);
 assert.deepEqual(validateProfiles(data,products),[]);
});
test('new profile events retain source onsets, real scope and their own terminal tails',()=>{
 for(const observation of read(dir+'observations.json')){
  const p=get(observation.productId);assert.ok(ids.includes(p.productId));
  assert.equal(p.events.length,observation.events.length);
  assert.equal(p.kind, ['alien-attack','viva-mexico'].includes(p.productId)?'cake':'cake-sample');
  assert.ok(Math.abs(p.duration-(observation.visibleEnd-observation.firstLaunch))<1e-9);
  for(let i=0;i<p.events.length;i++){
   const e=p.events[i],source=observation.events[i];
   assert.ok(Math.abs(e.launch+p.source.segmentStart-source.launch)<1e-9);
   assert.ok(Math.abs(e.burst+p.source.segmentStart-source.burst)<1e-9);
   assert.ok(e.burst+e.life<=p.duration+1e-9);
  }
  assert.equal(p.timing.lastLaunch,Math.max(...p.events.map(e=>e.launch)));
  assert.equal(p.timing.lastBurst,Math.max(...p.events.map(e=>e.burst)));
  assert.ok(p.timing.visibleEnd>p.timing.lastBurst);
 }
});
test('all four new cakes finish once without truncating tails or losing bursts across pause',()=>{
 const ps=ids.map(get),clock=createTimeline(ps);const cues=[];clock.play(0);
 cues.push(...clock.tick(400).cues);clock.pause(400);clock.play(2400);
 for(let t=2410;t<38000;t+=10)cues.push(...clock.tick(t).cues);
 for(let i=0;i<ps.length;i++)assert.deepEqual(cues.filter(c=>c.profile===i&&c.type==='burst').map(c=>c.time),ps[i].events.map(e=>e.burst));
 assert.equal(clock.snapshot().state,'ended');assert.equal(clock.snapshot().position,31.25);
 clock.restart();assert.equal(clock.snapshot().position,0);assert.equal(clock.snapshot().state,'idle');
});
