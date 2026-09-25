import assert from 'node:assert/strict';
import test from 'node:test';
import { createResponsiveSky, skyMediaQueries } from '../src/components/hero/createResponsiveSky.js';

function setup(initial = {}) {
  const media = Object.fromEntries(Object.entries(skyMediaQueries).map(([key, query]) => [query, {
    matches: Boolean(initial[key]), listeners: new Set(),
    addEventListener(_, callback) { this.listeners.add(callback); },
    removeEventListener(_, callback) { this.listeners.delete(callback); },
  }]));
  const nodes = new Set();
  const engines = [];
  const modes = [];
  let allocations = 0;
  const host = {
    ownerDocument: { createElement() { allocations++; return { remove() { nodes.delete(this); } }; } },
    append(node) { nodes.add(node); },
  };
  const session = createResponsiveSky(host, {
    matchMedia: query => media[query],
    createEngine() {
      const engine = { destroyed: false, setPaused(value) { this.paused = value; }, destroy() { this.destroyed = true; } };
      engines.push(engine); return engine;
    },
    onModeChange: mode => modes.push(mode),
  });
  return { session, engines, nodes, media, modes, allocations: () => allocations,
    change(key, value) { const m = media[skyMediaQueries[key]]; m.matches = value; [...m.listeners].forEach(cb => cb()); },
  };
}

for (const [name, initial] of Object.entries({ phone: { compact: true, touch: true }, landscapePhone: { touch: true }, tablet: { touch: true }, narrowDesktop: { compact: true }, reducedMotion: { reduced: true } })) {
  test(`${name}: static composition allocates no canvas and never initializes the engine`, () => {
    const env = setup(initial);
    assert.equal(env.allocations(), 0);
    assert.equal(env.engines.length, 0);
    assert.deepEqual(env.modes, ['static']);
    env.session.setPaused(false);
    assert.equal(env.engines.length, 0);
    env.session.destroy();
    assert.ok(Object.values(env.media).every(m => m.listeners.size === 0));
  });
}

test('live resizing and reduced motion destroy the old engine before restarting, preserving manual pause', () => {
  const env = setup();
  assert.equal(env.engines.length, 1);
  assert.equal(env.nodes.size, 1);
  env.session.setPaused(true);
  env.change('compact', true);
  assert.equal(env.engines[0].destroyed, true);
  assert.equal(env.nodes.size, 0);
  env.change('reduced', true);
  env.change('compact', false);
  assert.equal(env.engines.length, 1);
  env.change('reduced', false);
  assert.equal(env.engines.length, 2);
  assert.equal(env.engines[1].paused, true);
  assert.equal(env.nodes.size, 1);
  env.change('touch', true);
  assert.equal(env.engines[1].destroyed, true);
  env.change('touch', false);
  assert.equal(env.engines.length, 3);
  env.session.destroy();
  env.session.destroy();
  assert.ok(env.engines.every(engine => engine.destroyed));
  assert.equal(env.nodes.size, 0);
  assert.ok(Object.values(env.media).every(m => m.listeners.size === 0));
  env.change('compact', true);
  env.change('compact', false);
  assert.equal(env.engines.length, 3);
});
