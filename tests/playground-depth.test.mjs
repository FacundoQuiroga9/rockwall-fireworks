import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createTimeline, validateProfiles } from '../src/shared/playgroundTimeline.js';
import { createPlaygroundRenderer } from '../src/shared/playgroundRenderer.js';
import { buildPlaygroundDocument } from '../src/shared/playgroundDocument.js';
import { createFountainModel } from '../src/shared/playgroundFountain.js';
const data=JSON.parse(readFileSync(new URL('../src/data/playgroundProfiles.json',import.meta.url)));
const get=id=>data.profiles.find(p=>p.productId===id);
const nishiki=get('nishiki-blast-6-pack'),dragon=get('double-dragon-6-pack');

test('Nishiki advances six documented effects deterministically, counts the automatic first once and explicitly resets its own package',()=>{
 const c=createTimeline([nishiki]); let now=0;
 c.play(now);c.play(now);
 const seen=[];
 for(let i=0;i<6;i++){
  let s=c.snapshot().shells[0];assert.equal(s.launched,i+1);assert.equal(s.effectId,nishiki.shellEffects[i].id);
  assert.equal(s.documentedEffects,6);assert.equal(s.breakCount,1);seen.push(s.effectId);
  for(let j=0;j<30;j++)assert.equal(c.launch(0,now),false);
  const start=c.snapshot().position;now+=200;c.pause(now);const paused=c.snapshot();now+=5000;c.play(now);
  assert.equal(c.snapshot().shells[0].effectId,s.effectId);assert.equal(c.snapshot().shells[0].launched,i+1);
  assert.equal(c.snapshot().position,paused.position);assert.deepEqual(c.tick(now).cues,[]);
  now+=(nishiki.shellEffects[i].duration-(paused.position-start))*1000+1;
  c.tick(now);assert.equal(c.snapshot().shells[0].busy,false);
  if(i<5)assert.equal(c.launch(0,now),true);
 }
 assert.equal(new Set(seen).size,6);assert.equal(c.snapshot().shells[0].complete,true);assert.equal(c.launch(0,now),false);
 assert.equal(c.resetShell(0),true);assert.equal(c.launch(0,now),true);assert.equal(c.snapshot().shells[0].effectId,seen[0]);
 c.restart();c.play(now+1);assert.equal(c.snapshot().shells[0].effectId,seen[0]);assert.equal(c.snapshot().shells[0].launched,1);
});

test('double breaks use one lift and one counter increment; different run lengths retain the last tail',()=>{
 const c=createTimeline([dragon]);c.play(0);let all=[];
 for(let t=0;t<4600;t+=20)all.push(...c.tick(t).cues);
 assert.equal(all.filter(e=>e.type==='launch').length,1);assert.equal(all.filter(e=>e.type==='burst').length,2);
 assert.equal(new Set(all.map(e=>e.type+e.event.id)).size,3);assert.equal(c.snapshot().shells[0].launched,1);
 c.launch(0,5000);assert.equal(c.snapshot().shells[0].effectIndex,1);
 c.tick(10000);assert.equal(c.snapshot().shells[0].busy,true); // second effect lasts 5.5 s, not first's 4.5 s
 c.tick(10501);assert.equal(c.snapshot().shells[0].busy,false);assert.equal(c.snapshot().state,'waiting');
});

test('three cakes keep all original cues while Nishiki advances, including launches after the cakes end',()=>{
 const cakes=data.profiles.filter(p=>p.kind==='cake').slice(0,3),c=createTimeline([...cakes,nishiki]);c.play(0);
 let cakeCues=[],shellCues=[];
 for(let t=0;t<=50000;t+=40){const state=c.tick(t);for(const cue of state.cues)(cue.profile===3?shellCues:cakeCues).push(cue);if([6000,12000,18000].includes(t))assert.equal(c.launch(3,t),true);}
 assert.equal(cakeCues.length,cakes.reduce((sum,p)=>sum+p.events.length*2,0));
 assert.equal(new Set(cakeCues.map(e=>e.type+e.event.id)).size,cakeCues.length);
 assert.equal(shellCues.filter(e=>e.type==='burst').length,4);
 assert.equal(c.snapshot().shells[0].effectId,nishiki.shellEffects[3].id);
 assert.equal(c.launch(3,50000),true);c.tick(55500);
 assert.equal(c.snapshot().shells[0].effectId,nishiki.shellEffects[4].id);assert.equal(c.snapshot().automaticPosition,c.snapshot().automaticDuration);
});

test('two shell products keep independent variant indices, pause does not consume them, unknown counts cycle only reviewed effects',()=>{
 const c=createTimeline([nishiki,{...dragon,shellCount:undefined}]);c.play(0);c.tick(6000);
 assert.equal(c.launch(1,6000),true);assert.deepEqual(c.snapshot().shells.map(s=>s.effectIndex),[0,1]);
 c.pause(6200);assert.equal(c.launch(0,6300),false);c.play(10000);assert.deepEqual(c.snapshot().shells.map(s=>s.launched),[1,2]);
 c.tick(16000);assert.equal(c.launch(0,16000),true);assert.deepEqual(c.snapshot().shells.map(s=>s.effectIndex),[1,1]);
 c.select([1]);assert.equal(c.snapshot().shells[0].launched,0);assert.deepEqual(c.tick(20000).cues,[]);
 const unknown=createTimeline([{...dragon,shellCount:undefined}]);unknown.play(0);let now=0;
 for(let i=0;i<8;i++){const s=unknown.snapshot().shells[0];assert.equal(s.effectIndex,i%6);assert.equal(s.limit,null);now+=6000;unknown.tick(now);if(i<7)assert.equal(unknown.launch(0,now),true);}
});

test('quality preserves the documented green pearl component and never mutates event identity or palette',()=>{
 const original=globalThis.ResizeObserver,perf=Object.getOwnPropertyDescriptor(globalThis,'performance');let now=0,colors=[];
 globalThis.ResizeObserver=class{observe(){}disconnect(){}};Object.defineProperty(globalThis,'performance',{configurable:true,value:{now:()=>now}});
 const ctx={setTransform(){},clearRect(){colors=[];},save(){},restore(){},beginPath(){},arc(){},fill(){colors.push(this.fillStyle);},stroke(){},moveTo(){},lineTo(){}};
 const canvas={getContext:()=>ctx,getBoundingClientRect:()=>({width:1600,height:800})};const e=nishiki.shellEffects[1].events, before=JSON.stringify(nishiki);
 try{const r=createPlaygroundRenderer(canvas,[nishiki],false);for(const level of ['low','balanced','high']){r.setQuality(level);now+=1300;r.draw(e[0].burst+.35,[0],{0:e});assert.ok(colors.includes(e[0].accent.colors[0]),level);assert.ok(r.metrics().drawnPoints<=3200);}r.destroy();assert.equal(JSON.stringify(nishiki),before);}
 finally{globalThis.ResizeObserver=original;Object.defineProperty(globalThis,'performance',perf);}
});

test('new fountain endings preserve born particles and real photos, while Dallas foreground is confined to aerial documents',()=>{
 const bases=JSON.parse(readFileSync(new URL('../src/data/playgroundBases.json',import.meta.url)));
 for(const id of ['snow-cone','citrus-fountain']){const p=get(id),m=createFountainModel(p);assert.equal(p.ending.kind,'observed');assert.equal(p.kind,'fountain');assert.ok(bases[id].src.includes(id));assert.ok(m.particles(p.ending.emissionEnd+.1).length>0);assert.deepEqual(m.particles(p.playbackDuration),[]);}
 const aerial=buildPlaygroundDocument({profiles:[nishiki],skyline:'approved.webp'}),ground=buildPlaygroundDocument({profiles:[get('snow-cone')],scene:'ground',skyline:'approved.webp'});
 assert.ok(aerial.indexOf('<canvas')<aerial.indexOf('<img class="city"'));assert.ok(aerial.indexOf('<img class="city"')<aerial.indexOf('<div class="labels"'));
 assert.match(aerial,/feFuncA type="linear" slope="1.08" intercept="-.005"/);assert.match(aerial,/\.city\{[^}]*opacity:1[^}]*z-index:2/);
 assert.doesNotMatch(ground,/<img class="city"|<filter id="dallas-foreground"/);
});

test('invalid effect banks are rejected before sync, including duplicate identities and truncated tails',()=>{
 const catalog=data.profiles.map(p=>({id:p.productId,name:p.name,brand:p.brand,category:p.category,shellPackage:{shellCount:p.shellCount}}));
 assert.deepEqual(validateProfiles(data,catalog),[]);
 const broken=structuredClone(data);let p=broken.profiles.find(p=>p.productId===nishiki.productId);p.shellEffects[1].id=p.shellEffects[0].id;assert.ok(validateProfiles(broken,catalog).length);
 p.shellEffects[1].id='unique';p.shellEffects[1].events[0].life=10;assert.ok(validateProfiles(broken,catalog).length);
 const invalidColor=structuredClone(data);invalidColor.profiles.find(p=>p.productId===nishiki.productId).shellEffects[3].events[0].colorChange.seconds=0;assert.ok(validateProfiles(invalidColor,catalog).includes('Invalid shell color transition'));
});
