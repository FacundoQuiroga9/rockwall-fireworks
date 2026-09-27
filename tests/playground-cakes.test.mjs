import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { aerialFlight } from '../src/shared/playgroundFlight.js';
import { createPlaygroundRenderer } from '../src/shared/playgroundRenderer.js';
import { createTimeline, validateProfiles } from '../src/shared/playgroundTimeline.js';
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url)));
const data=read('../src/data/playgroundProfiles.json'), get=id=>data.profiles.find(p=>p.productId===id);
const geometry={center:640,width:1280,height:640,scale:640/850};

test('every primary aerial lift starts behind Dallas and lands exactly on its own break at every viewport',()=>{
 for(const p of data.profiles.filter(p=>p.scene==='aerial'))for(const e of p.shellEffects?.flatMap(s=>s.events)||p.events){
  if(e.launchCue===false){assert.equal(aerialFlight(e,e.launch+.01,geometry),null);continue;}
  assert.ok(e.burst>e.launch,`${p.productId}/${e.id}`);
  for(const [width,height] of [[1280,640],[1920,620],[390,350]]){
   const g={center:width*.5,width,height,scale:Math.min(width/1800,height/850)};
   const first=aerialFlight(e,e.launch,g),last=aerialFlight(e,e.burst,g),before=aerialFlight(e,e.burst-.000001,g);
   assert.equal(first.y,height*.96);assert.ok(Math.hypot(last.x-last.target[0],last.y-last.target[1])<1e-9);
   assert.ok(Math.hypot(last.x-before.x,last.y-before.y)<.01);
   assert.ok(Math.abs(last.y-(Math.max(45,height*.25)+(e.y??0)*height))<1e-9);
   assert.equal(aerialFlight(e,e.burst+.0001,g),null);
  }
 }
});

test('quiet locators do not become product tails; inclinations connect explicit origin and burst',()=>{
 const e={launch:1,burst:2,x:.12,launchX:-.12,launchVisible:false};
 const a=aerialFlight(e,1,geometry),b=aerialFlight(e,1.5,geometry),c=aerialFlight(e,2,geometry);
 assert.equal(a.documented,false);assert.equal(a.color,'#d3c4a8');assert.ok(a.x<b.x&&b.x<c.x);assert.ok(a.y>b.y&&b.y>c.y);
 assert.equal(aerialFlight({...e,launchCue:false},1.5,geometry),null);
});

test('essential lift heads precede dense effects and survive low, balanced and high budgets for all four lanes',()=>{
 const previous={observer:globalThis.ResizeObserver,performance:globalThis.performance};let now=0,arcs=[];
 globalThis.ResizeObserver=class{observe(){}disconnect(){}};globalThis.performance={now:()=>now};
 const context={setTransform(){},clearRect(){arcs=[];},save(){},restore(){},beginPath(){},arc(x,y,r){arcs.push({x,y,r,color:this.fillStyle});},fill(){},stroke(){},moveTo(){},lineTo(){}};
 const head={id:'head',shape:'peony',launch:1,burst:2,colors:['#ff0000'],launchVisible:false,life:2,x:0,seed:9};
 const dense=Array.from({length:30},(_,i)=>({...head,id:`dense-${i}`,launch:0,burst:.2,seed:i}));
 const profiles=Array.from({length:4},(_,i)=>({productId:`lane-${i}`,scene:'aerial',kind:'cake',duration:5,events:[...dense,head]}));
 try{
  const renderer=createPlaygroundRenderer({getContext:()=>context,getBoundingClientRect:()=>({width:1280,height:640})},profiles,false);
  for(const quality of ['low','balanced','high']){
   renderer.setQuality(quality);now+=1400;renderer.draw(1.5,[0,1,2,3]);
   const heads=arcs.filter(a=>a.color==='#d3c4a8'&&a.r<3);assert.equal(heads.length,4,quality);
   assert.ok(renderer.metrics().drawnPoints<=renderer.metrics().budget);assert.ok(heads.every(h=>h.r>=1.65));
  }
  renderer.destroy();assert.equal(arcs.length,0);
 }finally{globalThis.ResizeObserver=previous.observer;globalThis.performance=previous.performance;}
});

test('pause during ascent and manual multibreak shots keep one launch, independent counters and cake rhythm',()=>{
 const shell=data.profiles.find(p=>p.shellEffects?.some(s=>s.breakCount>1));
 const cakes=['sky-ink','wild-west','wild-horses'].map(get),clock=createTimeline([...cakes,shell]);
 const first=clock.play(0),events=first.renderEvents[3];const before=JSON.stringify(events);
 const t=events[0].launch+(events[0].burst-events[0].launch)*.4;
 const cues=[...clock.tick(t*1000).cues];clock.pause(t*1000);
 assert.equal(JSON.stringify(clock.snapshot().renderEvents[3]),before);
 clock.play(t*1000+2000);assert.equal(clock.snapshot().shells[0].launched,1);
 for(let ms=t*1000+2020;ms<42000;ms+=20)cues.push(...clock.tick(ms).cues);
 assert.equal(cues.filter(c=>c.profile===3&&c.type==='launch').length,1);
 for(let i=0;i<3;i++)assert.deepEqual(cues.filter(c=>c.profile===i&&c.type==='burst').map(c=>c.time),cakes[i].events.map(e=>e.burst));
 const auto=clock.snapshot().automaticPosition;assert.equal(clock.launch(3,42000),true);assert.equal(clock.launch(3,42000),false);
 assert.equal(clock.snapshot().automaticPosition,auto);assert.equal(clock.snapshot().shells[0].launched,2);
 clock.restart();assert.equal(clock.snapshot().position,0);assert.deepEqual(clock.snapshot().renderEvents[3],[]);clock.play(50000);assert.equal(clock.snapshot().shells[0].effectIndex,0);
});

test('manual tails reach zero at their shifted terminal instant without residual particles',()=>{
 const previous=globalThis.ResizeObserver;globalThis.ResizeObserver=class{observe(){}disconnect(){}};
 const context={setTransform(){},clearRect(){},save(){},restore(){},beginPath(){},arc(){},fill(){},stroke(){},moveTo(){},lineTo(){}};
 try{for(const p of data.profiles.filter(p=>p.shellEffects))for(const effect of p.shellEffects){
  const shift=28.3,events=effect.events.map(e=>({...e,launch:e.launch+shift,burst:e.burst+shift}));
  const renderer=createPlaygroundRenderer({getContext:()=>context,getBoundingClientRect:()=>({width:1280,height:640})},[p],false);
  renderer.draw(shift+effect.duration,[0],{0:events});assert.equal(renderer.metrics().activeParticles,0,p.productId+'/'+effect.id);assert.equal(renderer.metrics().drawnPoints,0);renderer.destroy();
 }}finally{globalThis.ResizeObserver=previous;}
});

test('inventory reconciliation has one row per cake ID, preserves prior profiles and publishes only reviewed windows',()=>{
 const products=read('../src/data/products.json'),audit=read('../docs/catalog/playground-cakes-2026-09/cake-coverage.json');
 assert.deepEqual(audit.map(r=>r.productId).sort(),products.filter(p=>p.category.toLowerCase().includes('cake')).map(p=>p.id).sort());
 assert.equal(new Set(audit.map(r=>r.productId)).size,audit.length);
 assert.deepEqual(validateProfiles(data,products),[]);
 for(const p of read('../docs/catalog/playground-cakes-2026-09/baseline-profiles.json').profiles){
  if(p.productId==='strobing-willow'){assert.deepEqual(get(p.productId).events.slice(0,5),p.events);assert.equal(get(p.productId).kind,'cake-sample');}
  else assert.deepEqual(get(p.productId),p,p.productId);
 }
 const ids=read('../docs/catalog/playground-cakes-2026-09/new-profile-ids.json');assert.equal(ids.length,10);
 for(const id of ids){const p=get(id);assert.equal(p.scene,'aerial');assert.equal(p.playback,'automatic');assert.ok(p.source.notes.length);for(const e of p.events)assert.ok(e.burst+e.life<=p.duration+.001);}
 assert.equal(get('wild-west').events.filter(e=>e.risingReport).length,5);
 assert.equal(get('sky-ink').events.length,16);assert.equal(get('whacky-tobacky').observedShots,8);assert.equal(get('whacky-tobacky').kind,'cake-sample');
 for(const file of ['src/data/playgroundProfiles.json','src/data/playgroundIndex.json','src/shared/playgroundFlight.js','src/shared/playgroundRenderer.js','src/shared/playgroundTimeline.js','src/shared/playgroundRuntimeSource.js'])assert.equal(readFileSync(new URL('../'+file,import.meta.url),'utf8'),readFileSync(new URL('../../rockwall-fireworks-mobile/'+file,import.meta.url),'utf8'),file);
});
