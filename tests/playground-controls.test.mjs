import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createTimeline, validateProfiles } from '../src/shared/playgroundTimeline.js';
import { createQualityController } from '../src/shared/playgroundQuality.js';
import { createPlaygroundRenderer } from '../src/shared/playgroundRenderer.js';
import { starPositions, starMarkup } from '../src/shared/playgroundStars.js';
import { normalizeCategory } from '../src/shared/catalogCategory.js';
import { filterPlaygroundProfiles, updatePlaygroundSelection } from '../src/shared/playgroundSelection.js';
import { isBogoCandidate, canPair, addProduct, emptyList, assessList } from '../src/shared/myList.js';
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url)));
const profiles=read('../src/data/playgroundProfiles.json').profiles;
const cakes=profiles.filter(p=>p.kind==='cake'), shells=profiles.filter(p=>p.playback==='manual-shell');
const products=read('../src/data/products.json');

test('three automatic cakes keep their exact cues while independent manual launches continue after them',()=>{
  const c=createTimeline([...cakes.slice(0,3),shells[0]]);c.play(0);c.play(0);
  assert.equal(c.snapshot().shells[0].launched,1);
  const cakeCues=[], shellCues=[];
  const tick=t=>{for(const cue of c.tick(t).cues)(cue.profile===3?shellCues:cakeCues).push(`${cue.event.id}:${cue.type}`);};
  for(let ms=0;ms<=50000;ms+=100){tick(ms);if(ms===6000){assert.equal(c.launch(3,ms),true);assert.equal(c.launch(3,ms),false);}}
  assert.equal(c.snapshot().state,'waiting');assert.equal(c.snapshot().automaticPosition,c.snapshot().automaticDuration);
  assert.equal(cakeCues.length,cakes.slice(0,3).reduce((n,p)=>n+p.events.length*2,0));assert.equal(new Set(cakeCues).size,cakeCues.length);
  assert.equal(shellCues.length,4);assert.equal(new Set(shellCues).size,4);
  const finishedCakeCues=[...cakeCues];assert.equal(c.launch(3,60000),true);tick(60100);tick(66000);
  assert.deepEqual(cakeCues,finishedCakeCues);assert.equal(c.snapshot().shells[0].launched,3);assert.equal(c.snapshot().state,'waiting');
});

test('per-product retail limits, unknown quantity, rapid taps, pause/resume and product-only reset',()=>{
  const a={...shells[0],shellCount:2},b={...shells[1],shellCount:undefined};const c=createTimeline([a,b]);
  assert.equal(c.launch(0,0),false);c.play(0);c.tick(0);
  assert.deepEqual(c.snapshot().shells.map(s=>s.launched),[1,1]);assert.equal(c.snapshot().shells[1].limit,null);
  for(let i=0;i<20;i++)assert.equal(c.launch(0,1),false);
  c.pause(200);const pos=c.snapshot().position;c.play(90000);c.tick(90000);
  assert.equal(c.snapshot().position,pos);assert.deepEqual(c.snapshot().shells.map(s=>s.launched),[1,1]);
  c.tick(96000);assert.equal(c.launch(0,96000),true);assert.deepEqual(c.snapshot().shells.map(s=>s.launched),[2,1]);
  assert.equal(c.resetShell(0),false);c.tick(102000);assert.equal(c.launch(0,102000),false);
  assert.equal(c.snapshot().shells[0].complete,true);assert.equal(c.resetShell(0),true);
  assert.deepEqual(c.snapshot().shells.map(s=>s.launched),[0,1]);assert.equal(c.launch(0,102000),true);
  c.pause(102100);assert.equal(c.launch(1,102100),false);c.play(120000);
  assert.deepEqual(c.snapshot().shells.map(s=>s.launched),[1,1]);c.restart();
  assert.deepEqual(c.snapshot().shells.map(s=>s.launched),[0,0]);assert.ok(Object.values(c.snapshot().renderEvents).every(e=>!e.length));
});

test('manual run retains its last particles, clears on selection, and new families have explicit compatible scenes',()=>{
  const c=createTimeline([shells[0]]);c.play(0);c.tick((shells[0].duration-.05)*1000);
  assert.equal(c.snapshot().shells[0].busy,true);assert.ok(c.snapshot().renderEvents[0].length);
  c.tick(shells[0].duration*1000+1);assert.equal(c.snapshot().state,'waiting');assert.equal(c.snapshot().shells[0].available,true);
  c.select([]);assert.deepEqual(c.snapshot().renderEvents,{});assert.deepEqual(c.tick(999999).cues,[]);
  const close=profiles.filter(p=>p.scene==='close');assert.equal(close.length,3);
  let state=updatePlaygroundSelection(profiles,undefined,{type:'select',id:shells[0].productId}).state;
  state=updatePlaygroundSelection(profiles,state,{type:'select',id:close[0].productId}).state;
  assert.equal(state.scene,'close');assert.deepEqual(state.picks.aerial,[shells[0].productId]);
  const before=structuredClone(state);filterPlaygroundProfiles(profiles,'Roman Candles');assert.deepEqual(state,before);
  assert.throws(()=>createTimeline([close[0],shells[0]]));assert.deepEqual(validateProfiles({profiles},products),[]);
  for(const p of profiles.slice(-4))for(const e of p.events)assert.ok(e.burst+e.life<=p.duration+.000001);
});

test('category aliases normalize while explicit promotion groups and saved quantities remain independent',()=>{
  assert.equal(normalizeCategory(' Reloadables '),'Artillery Shells');assert.equal(normalizeCategory('Rockets'),'Rockets');
  assert.deepEqual(filterPlaygroundProfiles(profiles,'Reloadables'),filterPlaygroundProfiles(profiles,'Artillery Shells'));
  const group=products.filter(p=>p.category==='Artillery Shells');assert.equal(group.length,38);assert.ok(group.every(p=>p.categoryAliases.includes('Reloadables')));
  const old={...group.find(p=>p.promotionCategory==='Reloadables'),category:'Reloadables'};
  const saved=addProduct(emptyList(),old,3), assessment=assessList(saved,products,[]);
  assert.equal(assessment.groups[0].items[0].quantity,3);assert.equal(assessment.groups[0].items[0].changed,true);
  assert.equal(saved.groups[0].items[0].snapshot.category,'Reloadables');
  const promotion={kind:'bogo',id:'example'}, marker={evidenceStatus:'source-marked',sourceTokens:['verified-token'],promotionId:'example'};
  const first={category:'Artillery Shells',promotionCategory:'Reloadables',bogo:{...marker,group:'Reloadables'}};
  const second={category:'Artillery Shells',bogo:{...marker,group:'Artillery Shells'}};
  assert.equal(isBogoCandidate(first,promotion),true);assert.equal(canPair(first,second,promotion),false);
  assert.equal(canPair(first,{...first},promotion),true);assert.equal(isBogoCandidate({...first,bogo:undefined},promotion),false);
});

test('quality drops only after sustained load and recovers gradually without exceeding the request',()=>{
  const q=createQualityController('high');q.sample(1,90,100);assert.equal(q.snapshot().effective,'high');
  for(let t=20;t<4300;t+=20)q.sample(t,18,33);
  assert.equal(q.snapshot().effective,'balanced');assert.equal(q.snapshot().adjusted,true);
  for(let t=4300;t<10000;t+=20)q.sample(t,1,16.7);assert.equal(q.snapshot().effective,'balanced');
  for(let t=10000;t<26000;t+=20)q.sample(t,1,16.7);assert.equal(q.snapshot().effective,'high');
  q.set('balanced');for(let t=26000;t<50000;t+=20)q.sample(t,1,16.7);assert.equal(q.snapshot().effective,'balanced');
  assert.equal(createQualityController('auto',true).snapshot().effective,'balanced');
});

test('higher quality adds stable particles, bounds active draw load and pixels, and preserves event data',()=>{
  const original=globalThis.ResizeObserver,perf=Object.getOwnPropertyDescriptor(globalThis,'performance');let now=0;
  globalThis.ResizeObserver=class{observe(){}disconnect(){}};Object.defineProperty(globalThis,'performance',{configurable:true,value:{now:()=>now}});
  const context={setTransform(){},clearRect(){},save(){},restore(){},beginPath(){},ellipse(){},arc(){},fill(){},fillRect(){},stroke(){},moveTo(){},lineTo(){},createRadialGradient(){return {addColorStop(){}};}};
  const canvas={getContext:()=>context,getBoundingClientRect:()=>({width:1800,height:1000})};
  const p=profiles.find(p=>p.productId==='nishiki-blast-6-pack'),before=JSON.stringify(p);
  try{
    const r=createPlaygroundRenderer(canvas,[p],false);r.setQuality('balanced');now=1300;r.draw(2.4,[0]);const balanced=r.metrics();
    r.setQuality('high');r.draw(2.4,[0]);assert.equal(r.metrics().activeParticles,balanced.activeParticles);
    now+=1300;r.draw(2.4,[0]);const high=r.metrics();assert.ok(high.activeParticles>balanced.activeParticles);
    assert.ok(high.drawnPoints<=3200);assert.ok(high.activeParticles<=high.drawnPoints);assert.ok(canvas.width*canvas.height<=4000001);
    assert.equal(JSON.stringify(p),before);r.destroy();
  }finally{globalThis.ResizeObserver=original;Object.defineProperty(globalThis,'performance',perf);}
});

test('one stable normalized starfield spans the entire sky with nonrepeating positions',()=>{
  const stars=starPositions();assert.deepEqual(starPositions(),stars);assert.equal(new Set(stars.map(s=>`${s.x}:${s.y}`)).size,stars.length);
  for(let band=0;band<5;band++)assert.ok(stars.filter(s=>s.y>=band*20&&s.y<(band+1)*20).length>15);
  assert.ok(Math.max(...stars.map(s=>s.x))>98);assert.ok(Math.min(...stars.map(s=>s.x))<2);
  assert.equal((starMarkup().match(/<i /g)||[]).length,190);assert.doesNotMatch(starMarkup(),/background-size|repeat/);
});

test('canonical normalization survives sync and preserves every previous eligibility decision',async()=>{
  const {run}=await import('../scripts/catalog/sync.mjs');assert.equal(run({check:true}).result,'PASS');
  const previous=read('../docs/catalog/playground-controls-2026-09/shells-before.json');const promotions=read('../src/data/promotions.json');
  for(const old of previous){const current=products.find(p=>p.id===old.id);for(const promo of promotions)assert.equal(isBogoCandidate(current,promo),isBogoCandidate(old,promo));
    for(const key of ['id','slug','image','brand','presentation','storeCodes','bogo'])assert.deepEqual(current[key],old[key]);}
  const {filterCatalog}=await import('../src/utils/productData.js');
  assert.deepEqual(filterCatalog(products,{category:'Reloadables'}),filterCatalog(products,{category:'Artillery Shells'}));
});

test('unavailable or suspended audio reports failure and can be retried without a false running state',async()=>{
  const {createPlaygroundAudio}=await import('../src/shared/playgroundAudio.js');
  const audio=createPlaygroundAudio({contextFactory:()=>{throw new Error('Device output unavailable');}});
  assert.equal(await audio.enable(true),false);assert.equal(audio.snapshot().running,false);assert.match(audio.snapshot().error,/unavailable/);
  await audio.enable(false);assert.equal(audio.snapshot().enabled,false);audio.destroy();assert.equal(await audio.enable(true),false);
});
