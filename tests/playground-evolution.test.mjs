import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createTimeline, validateProfiles } from '../src/shared/playgroundTimeline.js';
import { filterPlaygroundProfiles, profileGroup, sceneProfiles, togglePlaygroundSelection } from '../src/shared/playgroundSelection.js';
import { buildPlaygroundDocument } from '../src/shared/playgroundDocument.js';
import { createPlaygroundRenderer } from '../src/shared/playgroundRenderer.js';
const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url)));
const data = read('../src/data/playgroundProfiles.json'); const all = data.profiles;
const products = read('../src/data/products.json');
test('approved profiles remain identical and new excerpts retain evidence and honest scope', () => {
  assert.deepEqual(all.slice(0,4), read('../docs/catalog/playground-evolution-2026-09/approved-profiles-before.json').profiles);
  assert.deepEqual(validateProfiles(data, products), []);
  for (const p of all.slice(4,6)) { assert.match(p.sampleLabel, /excerpt/i); assert.ok(p.source.notes.length); assert.match(p.source.evidenceDirectory, /evolution/); }
  assert.equal(all.find((p) => p.productId === 'fairies-in-a-jar').observedShots, null);
});
test('zero through four selections; fifth rejected, toggle and clear do not touch filters or My List', () => {
  let ids=[];
  for (const p of all.slice(0,4)) { ids=togglePlaygroundSelection(ids,p.productId).ids; assert.equal(new Set(ids).size,ids.length); }
  const before=[...ids];const denied=togglePlaygroundSelection(ids,all[4].productId);assert.equal(denied.limited,true);assert.deepEqual(denied.ids,before);
  ids=togglePlaygroundSelection(ids,ids[1]).ids;assert.equal(ids.length,3);
  for(const id of [...ids]) ids=togglePlaygroundSelection(ids,id).ids;assert.deepEqual(ids,[]);
});
test('type/search filters only available profiles, with selection retained across hidden types', () => {
  const ids=[all[0].productId,all[2].productId,all[6].productId];
  assert.deepEqual([...new Set(all.map(profileGroup))],['Cakes','Artillery Shells','Fountains']);
  assert.equal(filterPlaygroundProfiles(all,'Artillery Shells','ghost').length,1);
  assert.equal(filterPlaygroundProfiles(all,'Cakes','fairies').length,0);
  assert.equal(filterPlaygroundProfiles(all,'All').length,all.length);
  assert.deepEqual(ids,[all[0].productId,all[2].productId,all[6].productId]);
  assert.equal(sceneProfiles(all,ids,'ground').length,1);assert.equal(sceneProfiles(all,ids,'aerial').length,2);
});
test('four clocks finish at the longest duration without duplicated cues, empty clock is idle', () => {
  const clock=createTimeline(all.slice(0,4));clock.play(100);const seen=[];
  for(let t=100;t<35000;t+=151)seen.push(...clock.tick(t).cues.map((c)=>`${c.event.id}:${c.type}`));
  assert.equal(seen.length,60);assert.equal(new Set(seen).size,60);assert.equal(clock.snapshot().state,'ended');assert.equal(clock.snapshot().duration,33.8);
  assert.deepEqual(clock.tick(100000).cues,[]);clock.select([]);clock.play(100100);assert.equal(clock.snapshot().state,'idle');assert.equal(clock.snapshot().duration,0);
  clock.select([2]);assert.equal(clock.snapshot().position,0);assert.equal(clock.snapshot().duration,3.6);
});
test('fountain stages cover the excerpt continuously; aerial and ground cannot mix in one document', () => {
  const fountain=all[6];assert.equal(fountain.stages[0].start,0);assert.equal(fountain.stages.at(-1).end,fountain.duration);
  assert.throws(()=>buildPlaygroundDocument({profiles:[all[0],fountain],skyline:''}));
  const html=buildPlaygroundDocument({profiles:[fountain],scene:'ground',skyline:''});assert.match(html,/class="terrain"/);assert.doesNotMatch(html,/<img class="city"/);
  assert.doesNotThrow(()=>buildPlaygroundDocument({profiles:[],skyline:''}));
  const c=createTimeline([fountain]);c.play(0);const cues=c.tick(2000).cues;assert.equal(cues.length,0); // fountains use continuous audio envelopes, never repeated one-second cues
  c.pause(2000);c.play(50000);assert.deepEqual(c.tick(50000).cues,[]);
});
test('catalog enrichment and native counterpart carry contextual observations, not physics parameters', () => {
  const nativeText=readFileSync(new URL('../../rockwall-fireworks-mobile/src/data/products.ts',import.meta.url),'utf8');
  const native=JSON.parse(nativeText.match(/export const products: readonly Product\[\] = (\[[\s\S]*?\n\]);/)[1]);
  for(const p of all){const product=products.find((v)=>v.id===p.productId);assert.deepEqual(product.demonstration,native.find((v)=>v.id===p.productId).demonstration);assert.equal(product.demonstration.sourceUrl,p.source.url);assert.ok(product.demonstration.note);assert.equal(product.demonstration.durationSeconds,p.duration);assert.doesNotMatch(JSON.stringify(product.demonstration),/"radius"|"height"|"seed"/);}
});
test('four dense products share a global budget and leave no final particles', () => {
  const previous=globalThis.ResizeObserver;globalThis.ResizeObserver=class{observe(){}disconnect(){}};let points=[];
  const ctx={setTransform(){},clearRect(){points=[];},save(){},restore(){},beginPath(){},ellipse(){},createRadialGradient(){return {addColorStop(){}};},rect(){},clip(){},fill(){},fillRect(){},stroke(){},moveTo(){},lineTo(){},arc(x,y){points.push([x,y]);}};
  const canvas={getContext:()=>ctx,getBoundingClientRect:()=>({width:1296,height:640})};
  try {
    const dense=Array.from({length:4},(_,i)=>({...all[1],productId:`stress-${i}`,events:all[1].events.map((e)=>({...e,burst:1,launch:0}))}));
    for(const compact of [true,false]) {const renderer=createPlaygroundRenderer(canvas,dense,compact);const count=renderer.draw(1.7,[0,1,2,3]);assert.ok(count<= (compact?420:1000));for(const fraction of [.17,.39,.61,.83])assert.ok(points.some(([x])=>Math.abs(x-1296*fraction)<100));assert.equal(renderer.draw(100,[0,1,2,3]),0);renderer.destroy();}
    const ground=createPlaygroundRenderer(canvas,[all[6]],true);assert.ok(ground.draw(22,[0])>0);assert.ok(ground.draw(45,[0])>0);assert.equal(ground.draw(all[6].playbackDuration,[0]),0);ground.destroy();
  } finally {globalThis.ResizeObserver=previous;}
});
