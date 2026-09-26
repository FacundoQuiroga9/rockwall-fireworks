import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Script } from 'node:vm';
import { createTimeline, validateProfiles } from '../src/shared/playgroundTimeline.js';
import { playgroundDevice } from '../src/shared/playgroundDevice.js';
import { buildPlaygroundDocument } from '../src/shared/playgroundDocument.js';
import { listProductName } from '../src/shared/listPresentation.js';
import { addProduct, emptyList, parseList } from '../src/shared/myList.js';
const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const data = read('../src/data/playgroundProfiles.json');
const products = read('../src/data/products.json');
const profiles = data.profiles;

test('reviewed profiles resolve exact catalog identities and valid source segments', () => {
  assert.deepEqual(validateProfiles(data, products), []);
  assert.equal(profiles.length, 13);
  assert.deepEqual(profiles.filter((p) => p.kind === 'cake').map((p) => p.category), ['200g Cakes', '500g Cakes', '200g Cakes']);
  assert.equal(profiles.filter((p) => p.kind === 'shell-sample').length, 4);
  assert.deepEqual(profiles.slice(0, 4).map((p) => p.events.length), [16, 12, 1, 1]);
  const broken = structuredClone(data); broken.profiles[0].events[0].burst = -1;
  assert.ok(validateProfiles(broken, products).length);
  const changed = products.map((p) => p.id === 'bump-bear' ? { ...p, category: '500g Cakes' } : p);
  assert.ok(validateProfiles(data, changed).length);
});

test('pause and resume use active time, do not duplicate cues or catch up background time', () => {
  const clock = createTimeline([profiles[0]]);
  assert.equal(clock.snapshot().state, 'idle');
  clock.play(1000);
  const first = clock.tick(2500);
  assert.equal(first.position, 1.5);
  assert.equal(first.cues.filter((c) => c.type === 'burst').length, 1);
  clock.pause(2500);
  assert.equal(clock.tick(902500).position, 1.5);
  clock.play(902500);
  assert.deepEqual(clock.tick(902500).cues, []);
  assert.equal(clock.tick(903000).position, 2);
  assert.equal(clock.tick(903000).cues.length, 0);
  clock.restart(); assert.equal(clock.snapshot().position, 0); assert.equal(clock.snapshot().state, 'idle');
  clock.play(950000); assert.equal(clock.tick(951500).cues.filter((c) => c.type === 'burst').length, 1);
});

test('synchronized comparison runs independent events through the longer duration', () => {
  const clock = createTimeline(profiles.slice(0, 2)); clock.play(0);
  const seen = [];
  for (let t = 0; t <= 34000; t += 17) seen.push(...clock.tick(t).cues.filter((c) => c.type === 'burst'));
  assert.equal(seen.length, 28);
  assert.equal(new Set(seen.map((c) => c.event.id)).size, 28);
  assert.equal(clock.snapshot().state, 'ended');
  assert.equal(clock.snapshot().position, 33.8);
  assert.deepEqual(clock.tick(60000).cues, []);
  clock.select([0]); assert.equal(clock.snapshot().duration, 24.3); assert.equal(clock.snapshot().position, 0);
  clock.select([1]); assert.equal(clock.snapshot().duration, 33.8);
  assert.throws(() => clock.select([0, 0])); assert.throws(() => clock.select([2]));
});

test('shell samples end after one effect; still moments never emit past cues', () => {
  const clock = createTimeline(profiles.slice(2, 4));
  clock.seek(2); assert.deepEqual(clock.tick(5000).cues, []);
  clock.play(5000); assert.deepEqual(clock.tick(5100).cues, []);
  clock.restart(); clock.play(6000);
  const result = clock.tick(11000);
  assert.equal(result.state, 'ended'); assert.equal(result.cues.filter((c) => c.type === 'burst').length, 2);
  const fresh = createTimeline(profiles.slice(2, 4)); assert.equal(fresh.snapshot().position, 0); assert.equal(fresh.snapshot().state, 'idle');
});

test('slow drawing does not stretch profile duration or change event order', () => {
  for (const step of [16, 33, 150, 900]) {
    const clock = createTimeline([profiles[1]]); clock.play(0); const seen = [];
    for (let t = 0; t < 34000 + step; t += step) seen.push(...clock.tick(t).cues.filter((c) => c.type === 'burst').map((c) => c.event.id));
    assert.deepEqual(seen, profiles[1].events.map((e) => e.id)); assert.equal(clock.snapshot().position, 33.8);
  }
});

test('device detection allows touch laptops but excludes phones and desktop-mode iPads', () => {
  const desktop = { fine: true, hover: true };
  assert.equal(playgroundDevice({ ...desktop, platform: 'Win32', userAgent: 'Windows NT', touchPoints: 10 }), 'desktop');
  assert.equal(playgroundDevice({ ...desktop, platform: 'MacIntel', touchPoints: 0 }), 'desktop');
  assert.equal(playgroundDevice({ ...desktop, platform: 'MacIntel', touchPoints: 5 }), 'app-preview');
  assert.equal(playgroundDevice({ ...desktop, platform: 'Linux armv8l', userAgent: 'Android' }), 'app-preview');
  assert.equal(playgroundDevice({ ...desktop, userAgent: 'iPhone', mobile: true }), 'app-preview');
  assert.equal(playgroundDevice({ userAgent: 'Unknown', fine: false, hover: false }), 'app-preview');
});

test('saved selections retain internal codes while compact names distinguish duplicate variants', () => {
  const product = products.find((p) => p.id === 'bump-bear');
  const before = addProduct(emptyList(), product);
  const restored = parseList(JSON.stringify(before));
  assert.deepEqual(restored, before);
  assert.equal(listProductName(product, products), 'Bump Bear');
  const duplicates = products.filter((p) => p.name === 'Ground Bloom Flower');
  if (duplicates.length > 1) assert.equal(new Set(duplicates.map((p) => listProductName(p, products))).size, duplicates.length);
  const withSecond = addProduct(restored, products.find((p) => p.id === 'band-of-brothers'));
  assert.deepEqual(withSecond.groups[0], before.groups[0]);
});

test('runtime document is standalone, source is escaped, audio starts disabled', () => {
  const html = buildPlaygroundDocument({ profiles: profiles.slice(0, 2), skyline: 'data:image/webp;base64,AA' });
  assert.match(html, /id="sound" aria-pressed="false">Sound off/);
  assert.doesNotMatch(html, /<script src=|youtube.com\/embed|autoplay/i);
  new Script(html.match(/<script>([\s\S]*)<\/script>/)[1]);
  assert.throws(() => buildPlaygroundDocument({ profiles, skyline: '' }));
});

test('product, promotion, storage engine, PDF, hero and Hostinger baselines remain intact', () => {
  const baseline = read('../docs/catalog/playground-2026-09/baseline.json');
  for (const [path, digest] of Object.entries(baseline)) {
    let content = readFileSync(new URL(`../${path}`, import.meta.url));
    if (path === 'src/data/products.json') { const oldFields = JSON.parse(content); oldFields.forEach((p) => delete p.demonstration); for (const update of read('../docs/catalog/playground-continuity-2026-09/video-updates.json')) { const product = oldFields.find((p) => p.id === update.id); assert.equal(product.previewVideo, update.previewVideo); product.previewVideo = update.previousPreviewVideo; } content = JSON.stringify(oldFields, null, 2) + '\n'; }
    assert.equal(createHash('sha256').update(content).digest('hex'), digest, path);
  }
});

test('native document uses prebuilt source rather than Hermes function serialization', () => {
  const generator = readFileSync(new URL('../src/shared/playgroundDocument.js', import.meta.url), 'utf8');
  assert.doesNotMatch(generator, /\.toString\(/);
  const html = buildPlaygroundDocument({ profiles: [profiles[0]], skyline: '', compact: true });
  assert.doesNotMatch(html, /\[native code\]|\[bytecode\]/);
  new Script(html.match(/<script>([\s\S]*)<\/script>/)[1]);
});

test('all current duplicate product names remain distinguishable without codes', () => {
  for (const name of new Set(products.map((p) => p.name))) {
    const variants = products.filter((p) => p.name === name);
    assert.equal(new Set(variants.map((p) => listProductName(p, products))).size, variants.length, name);
  }
});

test('renderer is deterministic at a time, bounds particles and disposes its observer', async () => {
  const { createPlaygroundRenderer } = await import('../src/shared/playgroundRenderer.js');
  const previous = globalThis.ResizeObserver;
  let disconnected = false, points = [];
  globalThis.ResizeObserver = class { observe() {} disconnect() { disconnected = true; } };
  const context = { setTransform() {}, clearRect() { points = []; }, save() {}, restore() {}, beginPath() {}, rect() {}, clip() {}, fill() {}, stroke() {}, moveTo() {}, lineTo() {}, arc(...args) { points.push(args); } };
  const canvas = { getContext: () => context, getBoundingClientRect: () => ({ width: 390, height: 350 }) };
  try {
    const renderer = createPlaygroundRenderer(canvas, profiles.slice(0, 2), true);
    const count = renderer.draw(1.7, [0, 1]); const first = JSON.stringify(points);
    renderer.draw(3, [0, 1]); renderer.draw(1.7, [0, 1]); assert.equal(JSON.stringify(points), first);
    assert.ok(count > 0 && count <= 420);
    renderer.setQuality('low'); assert.ok(renderer.draw(30.8, [0, 1]) <= 420);
    assert.equal(renderer.draw(34, [0, 1]), 0);
    renderer.destroy(); assert.equal(disconnected, true);
  } finally { globalThis.ResizeObserver = previous; }
});

test('audio requires an explicit enable, caps overlaps and releases voices/context', async () => {
  const { createPlaygroundAudio } = await import('../src/shared/playgroundAudio.js');
  const previous = globalThis.AudioContext; let contexts = 0, starts = 0, stops = 0, closed = false;
  const param = () => ({ value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {}, setTargetAtTime() {} });
  const node = () => ({ connect() {}, disconnect() {} });
  globalThis.AudioContext = class {
    constructor() { contexts++; this.sampleRate = 8000; this.currentTime = 0; this.state = 'suspended'; }
    createGain() { return { ...node(), gain: param() }; }
    createDynamicsCompressor() { return { ...node(), threshold: param(), knee: param(), ratio: param(), attack: param(), release: param() }; }
    createBuffer(channels, length) { return { getChannelData: () => new Float32Array(length) }; }
    createBufferSource() { return { ...node(), start() { starts++; }, stop() { stops++; } }; }
    createBiquadFilter() { return { ...node(), frequency: param() }; }
    async resume() { this.state = 'running'; }
    async suspend() { this.state = 'suspended'; }
    async close() { this.state = 'closed'; closed = true; }
  };
  try {
    const audio = createPlaygroundAudio(); audio.cue('burst', profiles[0].events[0]); assert.equal(contexts, 0);
    assert.equal(await audio.enable(true), true);
    for (let i = 0; i < 12; i++) audio.cue('burst', profiles[0].events[0]);
    assert.equal(starts, 4); audio.suspend(); assert.ok(stops >= starts);
    audio.cue('burst', profiles[0].events[0]); assert.equal(starts, 4);
    audio.destroy(); assert.equal(closed, true);
  } finally { globalThis.AudioContext = previous; }
});

test('runtime freezes the last frame when a background command arrives late and cleans up', async () => {
  const { mountPlayground } = await import('../src/shared/playgroundRuntime.js');
  const keys = ['document','performance','matchMedia','requestAnimationFrame','cancelAnimationFrame','parent','addEventListener','removeEventListener','rockwallPlayback'];
  const original = new Map(keys.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  let now = 0, nextFrame = 0, destroyed = false; const queued = new Map(), listeners = new Map(), nodes = new Map(), cues = [];
  const element = (id) => { if (!nodes.has(id)) nodes.set(id, { textContent: '', value: id === 'quality' ? 'auto' : 0, setAttribute() {}, clientWidth: 390, clientHeight: 350 }); return nodes.get(id); };
  const document = { getElementById: element, querySelectorAll: () => [], hidden: false, addEventListener: (name, cb) => listeners.set(name, cb), removeEventListener: (name) => listeners.delete(name) };
  const replacements = { document, performance: { now: () => now }, matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }), requestAnimationFrame: (cb) => { queued.set(++nextFrame, cb); return nextFrame; }, cancelAnimationFrame: (id) => queued.delete(id), parent: { postMessage() {} }, addEventListener: (name, cb) => listeners.set(name, cb), removeEventListener: (name) => listeners.delete(name) };
  for (const [key, value] of Object.entries(replacements)) Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
  const tick = (time) => { now = time; const callbacks = [...queued.values()]; queued.clear(); callbacks.forEach((cb) => cb(time)); };
  try {
    mountPlayground({ profiles: [profiles[0]], compact: true, reducedMotion: false }, createTimeline, () => ({ draw: () => 20, setQuality() {}, destroy() { destroyed = true; } }), () => ({ cue: (type, event) => cues.push(`${type}:${event.id}`), fountains() {}, stop() {}, suspend() {}, resume: async () => {}, destroy() {}, enable: async () => false, setVolume() {} }));
    assert.equal(queued.size, 0); await element('play').onclick(); tick(1000);
    assert.equal(element('progress').value, 1);
    now = 100000; globalThis.rockwallPlayback.pause();
    assert.equal(element('progress').value, 1); assert.equal(queued.size, 0);
    const previousCues = [...cues]; await element('play').onclick(); tick(100300);
    assert.equal(element('progress').value, 1.3); assert.deepEqual(cues, previousCues);
    document.hidden = true; listeners.get('visibilitychange')(); assert.equal(queued.size, 0);
    globalThis.rockwallPlayback.destroy(); assert.equal(destroyed, true);
    assert.equal(listeners.has('visibilitychange'), false); assert.equal(listeners.has('message'), false);
    document.hidden = false; now = 200000;
    mountPlayground({ profiles: [profiles[0]], compact: true, reducedMotion: true }, createTimeline, () => ({ draw: () => 20, setQuality() {}, destroy() {} }), () => ({ cue() {}, fountains() {}, stop() {}, suspend() {}, resume: async () => {}, destroy() {}, enable: async () => false, setVolume() {} }));
    assert.equal(queued.size, 0); assert.equal(element('play').textContent, 'Play animation');
    assert.equal(element('progress').value, 1.7);
    await element('play').onclick(); assert.equal(element('progress').value, 0);
    tick(201000); assert.equal(element('progress').value, 1);
    globalThis.rockwallPlayback.destroy(); assert.equal(queued.size, 0);
  } finally {
    for (const [key, descriptor] of original) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; }
  }
});
