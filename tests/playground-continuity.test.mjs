import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createFountainModel } from '../src/shared/playgroundFountain.js';
import { createTimeline } from '../src/shared/playgroundTimeline.js';
import { formatDuration, durationLabel } from '../src/shared/playgroundPresentation.js';
import { productVideoPath, youtubeVideoId } from '../src/utils/productVideo.js';
import { createPlaygroundRenderer } from '../src/shared/playgroundRenderer.js';
import { createPlaygroundAudio } from '../src/shared/playgroundAudio.js';
const read = (file) => readFileSync(new URL(file, import.meta.url), 'utf8');
const profiles = JSON.parse(read('../src/data/playgroundProfiles.json')).profiles;
const fountain = JSON.parse(read('../docs/catalog/playground-continuity-2026-09/fairies-excerpt-before.json')); // regression fixture for the original abrupt excerpt ending
fountain.scene = 'ground';
const currentFountains = profiles.filter((p) => p.kind.startsWith('fountain'));

test('live particles retain birth properties across every stage and exhaust independently', () => {
  const model = createFountainModel(fountain);
  for (const boundary of fountain.stages.slice(1).map((s) => s.start).concat(fountain.ending.fadeStart, fountain.ending.emissionEnd)) {
    const before = model.particles(boundary - .001);
    const after = new Map(model.particles(boundary + .001).map((p) => [p.id, p]));
    let retained = 0;
    for (const p of before) {
      const next = after.get(p.id); if (!next) { assert.ok(p.life - (boundary - .001 - p.born) < .002); continue; }
      retained++;
      for (const key of ['born','life','color','lift','spread','intensity','cluster']) assert.equal(next[key], p[key], `${boundary}: ${key}`);
      assert.ok(Math.abs(next.x - p.x) < .003); assert.ok(Math.abs(next.y - p.y) < .006);
    }
    assert.ok(retained > 2);
    const a = model.emission(boundary - .001), b = model.emission(boundary + .001);
    for (const key of ['height','spread','intensity']) assert.ok(Math.abs(a[key] - b[key]) < .002);
  }
});

test('transition mixes new births without grey colors, extra emitters or unbounded particles', () => {
  const model = createFountainModel(fountain);
  const palette = new Set(fountain.stages.flatMap((s) => s.colors));
  for (let t = 0; t < model.playbackEnd + 1; t += .09) {
    const particles = model.particles(t);
    assert.ok(particles.length <= 330);
    assert.equal(new Set(particles.map((p) => p.id)).size, particles.length);
    assert.ok(particles.every((p) => palette.has(p.color) && p.alpha >= 0 && p.alpha <= 1));
  }
  const fast = structuredClone(fountain); fast.stages[1].transitionSeconds = .04;
  assert.equal(createFountainModel(fast).emission(fast.stages[1].start + .05).mix, 1);
});

test('emission end precedes last spark and clock end, including pause/restart/selection changes', () => {
  const model = createFountainModel(fountain), clock = createTimeline([fountain]);
  clock.play(0); clock.tick(model.emissionEnd * 1000);
  assert.equal(clock.snapshot().state, 'playing'); assert.equal(model.emission(model.emissionEnd).power, 0);
  assert.ok(model.particles(model.emissionEnd).length > 0);
  clock.pause(model.emissionEnd * 1000); const remaining = model.particles(clock.snapshot().position);
  clock.play(100000); clock.tick(100000); assert.deepEqual(model.particles(clock.snapshot().position), remaining);
  clock.tick(100000 + model.maxLife * 1000 + 1); assert.equal(clock.snapshot().state, 'ended'); assert.deepEqual(model.particles(clock.snapshot().position), []);
  clock.seek(model.emissionEnd); clock.restart(); assert.deepEqual(model.particles(clock.snapshot().position), []);
  clock.seek(14); const beforePause = model.particles(clock.snapshot().position); clock.play(200000); clock.pause(200000);
  assert.deepEqual(model.particles(clock.snapshot().position), beforePause);
  clock.select([]); assert.equal(clock.snapshot().duration, 0); assert.equal(clock.snapshot().position, 0);
});

test('rounded display carries minute boundaries and never changes precise events or duration', () => {
  const before = JSON.stringify(profiles);
  assert.equal(formatDuration(24.3), '24 sec'); assert.equal(formatDuration(33.8), '34 sec');
  assert.equal(formatDuration(59.6), '1 min'); assert.equal(formatDuration(94.7), '1 min 35 sec');
  assert.equal(durationLabel(fountain), 'Preview · Approx. 45 sec');
  assert.equal(durationLabel(profiles[2]), 'Shell sample · Approx. 4 sec');
  assert.equal(JSON.stringify(profiles), before);
  assert.equal(createTimeline([profiles[0]]).snapshot().duration, 24.3);
});

test('reference routes resolve the correct catalog product and only one lazy embedded video', () => {
  const products = JSON.parse(read('../src/data/products.json'));
  for (const p of profiles) {
    const product = products.find((v) => v.id === p.productId);
    const route = productVideoPath(product); const slug = route.split('/')[2].split('#')[0];
    assert.equal(products.find((v) => v.slug === slug).id, p.productId);
    assert.equal(route.split('#')[1], 'product-video');
    assert.equal(youtubeVideoId(product.previewVideo), youtubeVideoId(p.source.url));
  }
  const page = read('../src/pages/ProductPage.jsx');
  assert.equal((page.match(/<ProductVideo /g) || []).length, 1);
  assert.match(page, /id=\{PRODUCT_VIDEO_ANCHOR\}/); assert.match(page, /loading="lazy"/);
  assert.doesNotMatch(page, /autoplay=1|From the demonstration|demonstration\.note|observedShots/);
  assert.match(read('../src/components/scrollToTop/ScrollToTop.jsx'), /prefers-reduced-motion/);
  assert.match(read('../src/pages/ProductsPage.css'), /\.product-video \{ scroll-margin-top: var\(--header-offset\)/);
});

test('four fountains stay within shared draw budget and photo geometry never shifts on load or transition', () => {
  const originalObserver = globalThis.ResizeObserver, originalImage = globalThis.Image;
  let photos = [], rects = [];
  globalThis.ResizeObserver = class { observe() {} disconnect() {} };
  globalThis.Image = class { constructor() { photos.push(this); } };
  const context = { setTransform(){},clearRect(){rects=[];},save(){},restore(){},beginPath(){},ellipse(){},arc(){},fill(){},fillRect(){},stroke(){},moveTo(){},lineTo(){},createRadialGradient(){return {addColorStop(){}};},drawImage(...args){rects.push(args.slice(5));} };
  const base = JSON.parse(read('../src/data/playgroundBases.json'))[fountain.productId];
  const four = Array.from({length:4},(_,i)=>({...fountain, productId:`f-${i}`}));
  const bases = Object.fromEntries(four.map((p)=>[p.productId,base]));
  try {
    for (const compact of [false,true]) {
      photos=[];
      const renderer=createPlaygroundRenderer({getContext:()=>context,getBoundingClientRect:()=>({width:1296,height:640})},four,compact,createFountainModel,bases);
      for(const photo of photos) {photo.complete=true;photo.naturalWidth=320;photo.onload();}
      renderer.draw(0,[0,1,2,3]); const initial=structuredClone(rects); assert.equal(initial.length,4);
      for(const t of [13.49,13.51,28,45,47,49.2]) {assert.ok(renderer.draw(t,[0,1,2,3]) <= (compact?420:1000));assert.deepEqual(rects,initial);}
      assert.equal(renderer.draw(49.2,[0,1,2,3]),0);renderer.destroy();assert.ok(photos.every((p)=>p.onload===null));
    }
  } finally {globalThis.ResizeObserver=originalObserver;globalThis.Image=originalImage;}
});

test('continuous fountain audio reuses one voice per product and releases after the envelope', async () => {
  const previous=globalThis.AudioContext; const sources=[],targets=[];
  const param=()=>({value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){},setTargetAtTime(value,time,tau){targets.push({value,time,tau});}});
  const node=()=>({connect(){},disconnect(){}});
  globalThis.AudioContext=class {
    state='running';currentTime=0;sampleRate=100;
    createGain(){return {...node(),gain:param()};} createDynamicsCompressor(){return {...node(),threshold:param(),knee:param(),ratio:param(),attack:param(),release:param()};}
    createBuffer(){return {getChannelData:()=>new Float32Array(200)};}createBiquadFilter(){return {...node(),frequency:param()};}
    createBufferSource(){const source={...node(),start(){},stop(time){this.stoppedAt=time;}};sources.push(source);return source;}
    async resume(){this.state='running';}async suspend(){this.state='suspended';}async close(){this.state='closed';}
  };
  try {
    const audio=createPlaygroundAudio();audio.fountains([{id:0,intensity:1}]);assert.equal(sources.length,0);
    await audio.enable(true);
    for(let frame=0;frame<200;frame++)audio.fountains(Array.from({length:4},(_,id)=>({id,intensity:.7+Math.sin(frame/20)*.2})));
    assert.equal(sources.length,4);assert.ok(sources.every((s)=>s.loop));
    audio.fountains(Array.from({length:4},(_,id)=>({id,intensity:0})));
    assert.ok(sources.every((s)=>s.stoppedAt===.45));assert.ok(targets.some((t)=>t.value===0&&t.tau===.065));
    sources.forEach((s)=>s.onended());audio.destroy();
  } finally {globalThis.AudioContext=previous;}
});

test('new fountain profiles distinguish observed exhaustion from preview closure and keep bounded tails', () => {
  for (const profile of currentFountains) {
    const model = createFountainModel(profile);
    assert.equal(model.playbackEnd, profile.playbackDuration);
    assert.ok(model.emissionEnd < model.playbackEnd);
    assert.equal(profile.ending.kind, profile.kind === 'fountain' ? 'observed' : 'simulation');
    for (let t = 0; t <= model.playbackEnd; t += .11) assert.ok(model.particles(t).length <= 330);
    assert.deepEqual(model.particles(model.playbackEnd), []);
  }
  assert.equal(durationLabel(currentFountains[0]), 'Approx. 1 min 14 sec');
});
