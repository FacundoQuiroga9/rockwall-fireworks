import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createTimeline, validateProfiles } from '../src/shared/playgroundTimeline.js';
import { createPlaygroundRenderer } from '../src/shared/playgroundRenderer.js';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url)));
const data=read('src/data/playgroundProfiles.json'), products=read('src/data/products.json');
const get=id=>data.profiles.find(p=>p.productId===id);
test('Aggression restores independently timed phases, not a stretched five-shot excerpt',()=>{
 const before=read('docs/catalog/playground-fidelity-2026-09/baseline-profiles.json').profiles.find(p=>p.productId==='aggression'),p=get('aggression');
 assert.equal(before.events.length,5);assert.equal(p.events.length,25);assert.equal(p.kind,'cake');
 for(let i=0;i<5;i++)assert.ok(Math.abs(before.events[i].burst+before.source.segmentStart-p.events[i].burst-p.source.segmentStart)<1e-8);
 assert.deepEqual(p.events.filter(e=>e.accent).filter((_,i)=>i%5===0).map(e=>e.accent.colors[0]),['#e97489','#84d797','#e4b773','#81cad9']);
 assert.equal(p.events.filter(e=>e.shape==='bouquet').length,5);assert.equal(p.duration,15.14);
 assert.deepEqual(validateProfiles(data,products),[]);
});
test('timeline does not discard a live tail when stale declared duration is too short',()=>{
 const p=structuredClone(get('aggression'));p.duration=2;
 const clock=createTimeline([p]);clock.play(100);const at=clock.tick(3100);
 assert.equal(at.state,'playing');assert.equal(at.position,3);assert.ok(at.duration>2);
 assert.equal(clock.tick(100+p.events.at(-1).burst*1000+1000).state,'playing');
 assert.equal(clock.tick(100+15140).state,'ended');
 assert.ok(validateProfiles({profiles:[p]},products).some(e=>e.includes('tail exceeds')));
});
test('all source onsets survive pause and quality-independent frame cadences exactly once',()=>{
 const p=get('aggression');
 for(const step of [1000/60,1000/30,83,170]){
  const clock=createTimeline([p]);clock.play(0);let cues=[];
  for(let t=0;t<=4500;t+=step)cues.push(...clock.tick(t).cues);
  const pause=clock.snapshot().position;clock.pause(pause*1000);clock.play(pause*1000+2000);
  for(let t=pause*1000+2000;t<19000;t+=step)cues.push(...clock.tick(t).cues);
  assert.deepEqual(cues.filter(c=>c.type==='burst').map(c=>c.event.id),p.events.map(e=>e.id));
  assert.equal(new Set(cues.filter(c=>c.type==='launch').map(c=>c.event.id)).size,25);
  assert.equal(clock.snapshot().position,p.duration);clock.restart();assert.equal(clock.snapshot().position,0);
 }
});
test('secondary lifetimes cannot silently extend beyond parent events',()=>{
 const p=structuredClone(get('jawbreaker'));p.events[0].accent.delay=3;
 assert.ok(validateProfiles({profiles:[p]},products).some(e=>e.includes('secondary tail')));
});
test('delayed bouquet clusters fade within their window and retain a documented longer tail',()=>{
 const original=globalThis.ResizeObserver;globalThis.ResizeObserver=class{observe(){}disconnect(){}};let alphas=[];
 const ctx={setTransform(){},clearRect(){alphas=[];},save(){},restore(){},beginPath(){},arc(){},fill(){alphas.push(this.globalAlpha);},stroke(){},moveTo(){},lineTo(){}};
 const event={id:'tail',launch:0,burst:.5,life:1.8,shape:'bouquet',colors:['#ddbb88'],seed:7,clusters:12,clusterDelay:.7};
 const p={productId:'test',scene:'aerial',kind:'cake',duration:2.3,events:[event]};
 try{
  const r=createPlaygroundRenderer({getContext:()=>ctx,getBoundingClientRect:()=>({width:1280,height:640})},[p],false);
  r.draw(2.2999,[0]);assert.ok(alphas.length>0);assert.ok(Math.max(...alphas)<.004);
  r.draw(2.3,[0]);assert.equal(r.metrics().activeParticles,0);r.destroy();
  const baseline=read('docs/catalog/playground-fidelity-2026-09/baseline-profiles.json').profiles;
  for(const id of ['vertical-limit','wild-horses'])for(const event of baseline.find(p=>p.productId===id).events){
   const duration=event.burst+event.life,p={productId:id,scene:'aerial',kind:'cake-sample',duration,events:[event]};
   const tail=createPlaygroundRenderer({getContext:()=>ctx,getBoundingClientRect:()=>({width:1280,height:640})},[p],false);
   tail.draw(duration-.0001,[0]);assert.ok(Math.max(0,...alphas)<.004,id+': no bright terminal cut');
   tail.draw(duration,[0]);assert.equal(tail.metrics().activeParticles,0);tail.destroy();
  }
  const extended=structuredClone(get('aggression'));const rr=createPlaygroundRenderer({getContext:()=>ctx,getBoundingClientRect:()=>({width:1280,height:640})},[extended],false);
  rr.draw(extended.duration-.3,[0]);assert.ok(rr.metrics().activeParticles>0);
  rr.draw(extended.duration,[0]);assert.equal(rr.metrics().activeParticles,0);rr.destroy();
 }finally{globalThis.ResizeObserver=original;}
});

test('only documented revisions change approved profiles and all new cakes keep their actual scope',()=>{
 const baseline=read('docs/catalog/playground-fidelity-2026-09/baseline-profiles.json');
 const corrected=read('docs/catalog/playground-fidelity-2026-09/corrected-profile-ids.json');
 for(const p of baseline.profiles)if(!corrected.includes(p.productId))assert.deepEqual(get(p.productId),p);
 assert.equal(get('fuego-loco').events.length,20);assert.equal(get('fuego-loco').kind,'cake');
 assert.equal(get('walkin-dead').events.length,18);assert.equal(get('walkin-dead').kind,'cake-sample');
 assert.equal(get('whacky-tobacky').events.length,9);assert.equal(get('whacky-tobacky').kind,'cake');
 assert.equal(get('migraine').events.length,9);assert.equal(get('migraine').kind,'cake-sample');
 for(const id of ['whacky-tobacky','migraine']){const old=baseline.profiles.find(p=>p.productId===id),p=get(id);
  for(let i=0;i<6;i++)assert.ok(Math.abs(old.events[i].burst+old.source.segmentStart-p.events[i].burst-p.source.segmentStart)<1e-8);
 }
});

test('terminal and restart reports expose live resource counts after audio cleanup',async()=>{
 const {mountPlayground}=await import('../src/shared/playgroundRuntime.js');
 const keys=['document','performance','matchMedia','requestAnimationFrame','cancelAnimationFrame','parent','addEventListener','removeEventListener','rockwallPlayback'];
 const original=new Map(keys.map(k=>[k,Object.getOwnPropertyDescriptor(globalThis,k)]));
 let now=0,serial=0,voices=0,points=0;const nodes=new Map(),frames=new Map(),messages=[];
 const element=id=>{if(!nodes.has(id))nodes.set(id,{textContent:'',setAttribute(){},clientWidth:1200,clientHeight:600});return nodes.get(id);};
 const replacements={document:{hidden:false,getElementById:element,querySelectorAll:()=>[],addEventListener(){},removeEventListener(){}},performance:{now:()=>now},matchMedia:()=>({matches:false,addEventListener(){},removeEventListener(){}}),requestAnimationFrame:cb=>{frames.set(++serial,cb);return serial;},cancelAnimationFrame:id=>frames.delete(id),parent:{postMessage:m=>messages.push(m)},addEventListener(){},removeEventListener(){}};
 for(const [k,v] of Object.entries(replacements))Object.defineProperty(globalThis,k,{configurable:true,writable:true,value:v});
 const tick=t=>{now=t;const callbacks=[...frames.values()];frames.clear();callbacks.forEach(cb=>cb(t));};
 try{
  const p={productId:'resource-test',scene:'aerial',kind:'cake',duration:1,events:[{id:'one',launch:0,burst:.2,life:.8}]};
  mountPlayground({profiles:[p],preferences:{sound:true}},createTimeline,()=>({draw:t=>(points=t>0&&t<1?10:0),metrics:()=>({activeParticles:points,drawnPoints:points}),setQuality(){},destroy(){points=0;}}),()=>({enable:async()=>true,setVolume(){},snapshot:()=>({running:true,state:'running',voices}),cue(){voices++;},fountains(){},stop(){voices=0;},suspend(){voices=0;},destroy(){voices=0;}}));
  await element('play').onclick();tick(210);tick(420);assert.ok(messages.at(-1).metrics.audio.voices>0);
  tick(1000);assert.equal(messages.at(-1).state,'ended');assert.equal(messages.at(-1).metrics.audio.voices,0);assert.equal(messages.at(-1).metrics.activeParticles,0);
  element('restart').onclick();assert.equal(messages.at(-1).position,0);assert.equal(messages.at(-1).metrics.particles,0);assert.equal(frames.size,0);
  globalThis.rockwallPlayback.destroy();
 }finally{for(const [k,d] of original)d?Object.defineProperty(globalThis,k,d):delete globalThis[k];}
});
