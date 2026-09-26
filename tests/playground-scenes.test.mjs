import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { restorePlaygroundSelection, updatePlaygroundSelection, sceneProfiles, profileScene, filterPlaygroundProfiles, getPlaygroundSession, savePlaygroundSession, getPlaygroundPreferences, savePlaygroundPreferences } from '../src/shared/playgroundSelection.js';
import { createTimeline } from '../src/shared/playgroundTimeline.js';
import { buildPlaygroundDocument } from '../src/shared/playgroundDocument.js';
import { createFountainModel } from '../src/shared/playgroundFountain.js';
const profiles = JSON.parse(readFileSync(new URL('../src/data/playgroundProfiles.json', import.meta.url))).profiles;
const aerial = profiles.filter(p=>p.scene==='aerial'), ground=profiles.filter(p=>p.scene==='ground');
const toggle=(state,id)=>updatePlaygroundSelection(profiles,state,{type:'toggle',id});

test('selecting either family automatically switches, saves and restores each scene without toggling off a remembered pick', () => {
  let state=restorePlaygroundSelection(profiles);
  state=toggle(state,aerial[0].productId).state;
  const switched=toggle(state,ground[0].productId); state=switched.state;
  assert.equal(state.scene,'ground'); assert.match(switched.message,/aerial picks are saved/);
  assert.deepEqual(state.picks.aerial,[aerial[0].productId]);
  state=toggle(state,ground[1].productId).state;
  const returned=toggle(state,aerial[0].productId);state=returned.state;
  assert.equal(state.scene,'aerial');assert.match(returned.message,/Dallas sky/);
  assert.deepEqual(state.picks.aerial,[aerial[0].productId]);assert.equal(state.picks.ground.length,2);
  state=toggle(state,ground[2].productId).state;
  assert.deepEqual(state.picks.ground,ground.slice(0,3).map(p=>p.productId));
  savePlaygroundSession(profiles,state);
  assert.deepEqual(getPlaygroundSession(profiles).state,state);
  assert.equal(getPlaygroundSession(profiles,aerial[0].productId).state.scene,'aerial');
  assert.deepEqual(getPlaygroundSession(profiles,aerial[0].productId).state.picks.aerial,[aerial[0].productId]);
});

test('a full destination restores four, reports the limit and never replaces or adds a fifth', () => {
  let state=restorePlaygroundSelection(profiles);
  for(const p of aerial.slice(0,4))state=toggle(state,p.productId).state;
  state=toggle(state,ground[0].productId).state;
  const result=toggle(state,aerial[4].productId);
  assert.equal(result.state.scene,'aerial');assert.equal(result.limited,true);assert.match(result.message,/Four picks/);
  assert.deepEqual(result.state.picks.aerial,aerial.slice(0,4).map(p=>p.productId));
  const selectedAgain=updatePlaygroundSelection(profiles,result.state,{type:'select',id:aerial[0].productId});
  assert.deepEqual(selectedAgain.state.picks.aerial,result.state.picks.aerial);
  const fiveGround=[...profiles,{...ground[0],productId:'fifth-ground'}];
  const fullGround=restorePlaygroundSelection(fiveGround,{scene:'aerial',picks:{ground:ground.map(p=>p.productId)}});
  const g=updatePlaygroundSelection(fiveGround,fullGround,{type:'toggle',id:'fifth-ground'});
  assert.equal(g.limited,true);assert.equal(g.state.scene,'ground');assert.equal(g.state.picks.ground.length,4);
});

test('filters never alter selection; clear and last deselection affect only the active scene', () => {
  let state=toggle(toggle(undefined,aerial[0].productId).state,ground[0].productId).state;
  const before=structuredClone(state);
  for(const filter of ['All','Cakes','Fountains','Artillery Shells'])filterPlaygroundProfiles(profiles,filter,'no match');
  assert.deepEqual(state,before);
  state=toggle(state,ground[0].productId).state;assert.equal(state.scene,'ground');assert.deepEqual(state.picks.ground,[]);
  state=toggle(state,ground[1].productId).state;
  const cleared=updatePlaygroundSelection(profiles,state,{type:'clear'});
  assert.equal(cleared.state.scene,'ground');assert.deepEqual(cleared.state.picks.ground,[]);
  assert.deepEqual(cleared.state.picks.aerial,[aerial[0].productId]);assert.match(cleared.message,/Active selection cleared/);
  state=updatePlaygroundSelection(profiles,cleared.state,{type:'scene',scene:'aerial'}).state;
  assert.deepEqual(sceneProfiles(profiles,state.picks[state.scene],state.scene),[aerial[0]]);
});

test('restoration and playback reject incompatible families, unknown IDs, duplicate and excessive profiles', () => {
  const dirty=[ground[0].productId,...aerial.map(p=>p.productId),aerial[0].productId,'unknown'];
  const state=restorePlaygroundSelection(profiles,{scene:'invalid',picks:{aerial:dirty,ground:dirty}});
  assert.deepEqual(state.picks.aerial,aerial.slice(0,4).map(p=>p.productId));
  assert.deepEqual(state.picks.ground,[ground[0].productId]);
  assert.equal(profileScene({...ground[0],name:'Aerial Cake'}),'ground');
  assert.equal(profileScene({...aerial[0],name:'Fountain Ground'}),'aerial');
  assert.equal(profileScene({...aerial[0],scene:undefined}),null);
  for(const selected of [[aerial[0],ground[0]],[aerial[0],aerial[0]],aerial.slice(0,5),[{...aerial[0],scene:undefined}]]){
    assert.throws(()=>createTimeline(selected));
    assert.throws(()=>buildPlaygroundDocument({profiles:selected,scene:'aerial'}));
  }
  assert.throws(()=>buildPlaygroundDocument({profiles:[ground[0]],scene:'aerial'}));
  const timeline=createTimeline(sceneProfiles(profiles,dirty,'aerial'));timeline.play(0);timeline.tick(4000);timeline.restart();
  assert.equal(timeline.snapshot().position,0);assert.equal(timeline.snapshot().state,'idle');
  assert.equal(timeline.snapshot().selected.length,4);
});

test('volume and quality survive scene changes without persisting sound or autoplay', () => {
  savePlaygroundPreferences({volume:.64,quality:'low',sound:true});
  toggle(undefined,ground[0].productId);
  assert.deepEqual(getPlaygroundPreferences(),{volume:.64,quality:'low'});
  savePlaygroundPreferences({volume:10,quality:'invalid'});assert.deepEqual(getPlaygroundPreferences(),{volume:1,quality:'low'});
  savePlaygroundPreferences({volume:.35,quality:'auto'});
});

test('Movie Time preserves the real intermission, restarts emission, and treats its final fade as a simulation', () => {
  const p=profiles.find(p=>p.productId==='movie-time'), model=createFountainModel(p);
  assert.equal(model.emission(44.8).density,0);assert.equal(model.emission(44.8).intensity,0);
  assert.deepEqual(model.particles(44.8),[]);
  assert.ok(model.particles(46).length>0);assert.equal(p.ending.kind,'simulation');
  assert.equal(p.duration,81);assert.equal(p.playbackDuration,84.6);
  assert.deepEqual(model.particles(p.playbackDuration),[]);
});

test('switch while playing destroys outgoing particles/audio/RAF and restores new preferences at zero with no autoplay', async () => {
  const { mountPlayground }=await import('../src/shared/playgroundRuntime.js');
  const { createPlaygroundRenderer }=await import('../src/shared/playgroundRenderer.js');
  const keys=['document','performance','matchMedia','requestAnimationFrame','cancelAnimationFrame','parent','addEventListener','removeEventListener','ResizeObserver','rockwallPlayback'];
  const originals=new Map(keys.map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
  let now=0, serial=0, pixels=0, audioLive=false, audioDestroyed=0, observerDestroyed=0;
  const frames=new Map(),listeners=new Map(),nodes=new Map(),messages=[];
  const context={setTransform(){},clearRect(){pixels=0;},save(){},restore(){},beginPath(){},ellipse(){},arc(){},fill(){pixels++;},fillRect(){pixels++;},stroke(){pixels++;},moveTo(){},lineTo(){},createRadialGradient(){return {addColorStop(){}};}};
  const element=id=>{if(!nodes.has(id))nodes.set(id,{textContent:'',value:0,setAttribute(){},clientWidth:1200,clientHeight:640,getContext:()=>context,getBoundingClientRect:()=>({width:1200,height:640})});return nodes.get(id);};
  const replacements={document:{getElementById:element,querySelectorAll:()=>[],hidden:false,addEventListener:(n,cb)=>listeners.set(n,cb),removeEventListener:n=>listeners.delete(n)},performance:{now:()=>now},matchMedia:()=>({matches:false,addEventListener(){},removeEventListener(){}}),requestAnimationFrame:cb=>{frames.set(++serial,cb);return serial;},cancelAnimationFrame:id=>frames.delete(id),parent:{postMessage:m=>messages.push(m)},addEventListener:(n,cb)=>listeners.set(n,cb),removeEventListener:n=>listeners.delete(n),ResizeObserver:class {observe(){}disconnect(){observerDestroyed++;}}};
  for(const [key,value] of Object.entries(replacements))Object.defineProperty(globalThis,key,{configurable:true,writable:true,value});
  const makeAudio=()=>({cue(){},fountains(){},stop(){audioLive=false;},suspend(){audioLive=false;},resume:async()=>{audioLive=true;},enable:async enabled=>{audioLive=enabled;return enabled;},destroy(){audioLive=false;audioDestroyed++;},setVolume(){}});
  const tick=time=>{now=time;const callbacks=[...frames.values()];frames.clear();callbacks.forEach(cb=>cb(time));};
  try{
    mountPlayground({profiles:[aerial[0]],preferences:{volume:.62,quality:'low'}},createTimeline,createPlaygroundRenderer,makeAudio,createFountainModel);
    await element('sound').onclick();await element('play').onclick();tick(1700);
    assert.ok(pixels>0);assert.equal(audioLive,true);assert.ok(frames.size>0);
    const message=listeners.get('message');message({source:{},data:{type:'rockwall-destroy'}});assert.equal(audioDestroyed,0);
    message({source:parent,data:{type:'rockwall-destroy'}});
    assert.equal(pixels,0);assert.equal(audioLive,false);assert.equal(audioDestroyed,1);assert.equal(observerDestroyed,1);assert.equal(frames.size,0);
    assert.equal(listeners.size,0);
    nodes.clear();
    mountPlayground({profiles:[ground[0]],scene:'ground',preferences:{volume:.62,quality:'low'}},createTimeline,createPlaygroundRenderer,makeAudio,createFountainModel);
    assert.equal(element('progress').value,0);assert.equal(element('volume').value,.62);assert.equal(element('quality').value,'low');
    assert.equal(frames.size,0);assert.equal(audioLive,false);assert.equal(messages.at(-1).state,'idle');
    await element('play').onclick();tick(2700);assert.ok(pixels>0);assert.equal(audioLive,false);
    globalThis.rockwallPlayback.destroy();assert.equal(pixels,0);assert.equal(frames.size,0);assert.equal(audioDestroyed,2);
  } finally {for(const [key,descriptor]of originals){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}}
});

test('new event tails fit their reviewed segments and full fountains retain the last-particle interval', () => {
  const ids=['arms-depot-16-pack','sniper-fire-12-pack','ghost-killer','us-power','golden-peacock'];
  for(const p of profiles.filter(p=>ids.includes(p.productId))){
    for(const e of p.events){assert.equal(typeof e.id,'string');assert.ok(e.burst+e.life<=p.duration+.00001,p.productId);}
    assert.equal(new Set(p.events.map(e=>e.id)).size,p.events.length);
  }
  const jumbo=profiles.find(p=>p.productId==='jumboshell-fountain');
  assert.equal(jumbo.kind,'fountain');assert.equal(jumbo.ending.kind,'observed');assert.equal(jumbo.duration,150.1);
  const model=createFountainModel(jumbo);assert.ok(model.particles(jumbo.ending.emissionEnd).length>0);assert.deepEqual(model.particles(jumbo.playbackDuration),[]);
});

test('selecting the active scene is a no-op and does not announce a false playback reset', () => {
  const state=toggle(undefined,aerial[0].productId).state;
  const result=updatePlaygroundSelection(profiles,state,{type:'scene',scene:'aerial'});
  assert.deepEqual(result.state,state);assert.doesNotMatch(result.message,/reset/i);
});
