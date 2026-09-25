import assert from 'node:assert/strict';
import test from 'node:test';
import { createNightSky } from '../src/components/hero/createNightSky.js';

function setup(t, { reduced = false, width = 1440, height = 720 } = {}) {
  t.mock.method(Math, 'random', () => 0.5);
  const eventSource = () => ({
    listeners: new Map(),
    addEventListener(name, callback) { this.listeners.set(name, callback); },
    removeEventListener(name) { this.listeners.delete(name); },
    dispatch(name) { this.listeners.get(name)?.(); },
  });
  const media = Object.assign(eventSource(), { matches: reduced });
  const documentMock = Object.assign(eventSource(), { visibilityState: 'visible' });
  const frames = new Map();
  const observers = [];
  let nextFrame = 0;
  let time = 0;
  const drawing = { starsAndParticles: 0, trails: 0, maxPoints: 0, colors: new Set() };
  const context = {
    setTransform() {},
    clearRect() { drawing.starsAndParticles = 0; },
    beginPath() {},
    arc() {
      drawing.starsAndParticles += 1;
      drawing.maxPoints = Math.max(drawing.maxPoints, drawing.starsAndParticles);
    },
    fill() { drawing.colors.add(this.fillStyle.split(',').slice(0, 3).join(',')); },
    moveTo() {},
    lineTo() {},
    stroke() { drawing.trails += 1; },
  };
  const canvas = {
    getContext: () => context,
    getBoundingClientRect: () => ({ width, height }),
  };
  const windowMock = Object.assign(eventSource(), {
    devicePixelRatio: 3,
    matchMedia: () => media,
    requestAnimationFrame(callback) {
      frames.set(++nextFrame, callback);
      return nextFrame;
    },
    cancelAnimationFrame(id) { frames.delete(id); },
  });
  class Observer {
    constructor(callback) { this.callback = callback; observers.push(this); }
    observe() {}
    disconnect() { this.disconnected = true; }
  }
  const replacements = {
    window: windowMock, document: documentMock,
    IntersectionObserver: Observer, ResizeObserver: Observer,
  };
  const descriptors = new Map();
  for (const [name, value] of Object.entries(replacements)) {
    descriptors.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { configurable: true, value });
  }
  const sky = createNightSky(canvas);
  t.after(() => {
    sky.destroy();
    for (const [name, descriptor] of descriptors) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  });

  return {
    sky, frames, canvas, drawing, media, documentMock, windowMock, observers,
    visible(value) { observers[0].callback([{ isIntersecting: value }]); },
    advance(milliseconds) {
      for (let elapsed = 0; elapsed < milliseconds; elapsed += 50) {
        time += 50;
        const callbacks = [...frames.values()];
        frames.clear();
        callbacks.forEach(callback => callback(time));
      }
    },
  };
}

test('sky pauses offscreen, in background, and on request without stacking frames', t => {
  const env = setup(t);
  assert.equal(env.frames.size, 0);
  env.visible(true);
  env.advance(5000);
  assert.equal(env.frames.size, 1);
  assert.ok(env.drawing.trails > 0, 'a launch draws an ascent trail');
  assert.ok(env.drawing.maxPoints > 360, 'a burst adds particles to the star field');
  assert.ok(env.drawing.maxPoints <= 360 + 3 * 62 * 3, 'overlapping bursts remain within the desktop particle budget');

  env.sky.setPaused(true);
  assert.equal(env.frames.size, 0);
  env.visible(false);
  env.visible(true);
  assert.equal(env.frames.size, 0, 'scrolling does not override manual pause');
  env.sky.setPaused(false);
  assert.equal(env.frames.size, 1);
  env.documentMock.visibilityState = 'hidden';
  env.documentMock.dispatch('visibilitychange');
  assert.equal(env.frames.size, 0);
  env.sky.setPaused(false);
  assert.equal(env.frames.size, 0, 'a hidden tab cannot resume');
  env.documentMock.visibilityState = 'visible';
  env.documentMock.dispatch('visibilitychange');
  assert.equal(env.frames.size, 1);
  env.visible(false);
  assert.equal(env.frames.size, 0);
});

test('reduced motion draws a static sky and responds to live preference changes', t => {
  const env = setup(t, { reduced: true });
  env.visible(true);
  env.advance(5000);
  assert.equal(env.frames.size, 0);
  assert.equal(env.drawing.starsAndParticles, 360);
  assert.equal(env.drawing.trails, 0);
  env.media.matches = false;
  env.media.dispatch('change');
  assert.equal(env.frames.size, 1);
  env.advance(4000);
  env.media.matches = true;
  env.media.dispatch('change');
  assert.equal(env.frames.size, 0);
  assert.equal(env.drawing.starsAndParticles, 360, 'active bursts disappear in reduced motion');
});

test('mobile sky caps resolution and particle count', t => {
  const env = setup(t, { width: 390, height: 950 });
  assert.equal(env.canvas.width, Math.round(390 * 1.25));
  assert.equal(env.canvas.height, Math.round(950 * 1.25));
  env.visible(true);
  env.advance(5000);
  assert.ok(env.drawing.maxPoints > 130);
  assert.ok(env.drawing.maxPoints <= 130 + 2 * 30 * 2);
});

test('unmount removes all observers, listeners, and queued frames', t => {
  const env = setup(t);
  assert.equal(env.canvas.width, 1440 * 1.5);
  env.visible(true);
  env.sky.destroy();
  assert.equal(env.frames.size, 0);
  assert.ok(env.observers.every(observer => observer.disconnected));
  assert.equal(env.media.listeners.size, 0);
  assert.equal(env.documentMock.listeners.size, 0);
  assert.equal(env.windowMock.listeners.size, 0);
  env.visible(true);
  env.observers[1].callback();
  env.sky.setPaused(false);
  assert.equal(env.frames.size, 0, 'late callbacks cannot resurrect a disposed sky');
});

test('unavailable canvas context preserves a functional page', () => {
  const sky = createNightSky({ getContext: () => null });
  assert.doesNotThrow(() => { sky.setPaused(true); sky.destroy(); });
});


test('a longer sequence varies color and allows bounded overlaps', t => {
  const env = setup(t);
  env.visible(true);
  env.advance(30000);
  assert.ok(env.drawing.colors.size >= 9, 'stars and fireworks use a varied color palette');
  assert.ok(env.drawing.maxPoints > 360 + 62 * 3, 'some bursts overlap');
  assert.ok(env.drawing.maxPoints <= 360 + 3 * 62 * 3);
  assert.equal(env.frames.size, 1, 'one animation loop handles all fireworks');
});

test('tablet uses an intermediate particle and star budget', t => {
  const env = setup(t, { width: 768, height: 700 });
  assert.equal(env.drawing.starsAndParticles, 220);
  env.visible(true);
  env.advance(15000);
  assert.ok(env.drawing.maxPoints <= 220 + 2 * 46 * 3);
});

test('viewport events that leave the hero size unchanged preserve the current frame', t => {
  const env = setup(t);
  env.visible(true);
  env.advance(2500);
  env.sky.setPaused(true);
  const points = env.drawing.starsAndParticles;
  assert.ok(points > 360);
  env.windowMock.dispatch('resize');
  env.observers[1].callback();
  assert.equal(env.drawing.starsAndParticles, points);
  assert.equal(env.frames.size, 0);
});
