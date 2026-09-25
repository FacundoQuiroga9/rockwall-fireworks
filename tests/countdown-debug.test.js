import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import process from 'node:process';
import { readFile } from 'node:fs/promises';
import { transformWithEsbuild } from 'vite';
import { seasonalConfig } from '../src/config/seasonalConfig.js';
import { getSeasonalCountdown, getSeasonRanges } from '../src/utils/seasonalCountdown.js';
import { getSeasonPresentation } from '../src/utils/seasonPresentation.js';
import { createCountdownClock, observeCountdown, readCountdownSnapshot } from '../src/utils/countdownClock.js';
import { formatDateInput, parseDateInput, getDebugPresets } from '../src/components/countdown/debug/debugDates.js';

const zone = seasonalConfig.timeZone;

test('the compiled development option gates simulation, defaults off and cannot enable production', async () => {
  const source = await readFile(new URL('../src/config/developmentConfig.js', import.meta.url), 'utf8');
  for (const [dev, option, enabled] of [
    [true, undefined, false], [true, 'false', false], [true, 'true', true],
    [false, undefined, false], [false, 'true', false],
  ]) {
    const { code } = await transformWithEsbuild(source, 'developmentConfig.js', {
      define: { 'import.meta.env.DEV': String(dev), 'import.meta.env.VITE_COUNTDOWN_DEBUG': JSON.stringify(option) ?? 'undefined' },
    });
    const { countdownDebugEnabled } = await import(`data:text/javascript,${encodeURIComponent(code)}`);
    const real = Date.parse('2026-09-24T18:00:00Z');
    const clock = createCountdownClock({ allowSimulation: countdownDebugEnabled, now: () => real });
    assert.equal(clock.simulate(Date.parse('2026-06-25T18:00:00Z')), enabled);
    const snapshot = readCountdownSnapshot(seasonalConfig, clock);
    assert.equal(snapshot.simulated, enabled);
    assert.equal(snapshot.state.seasonId, enabled ? 'independence-day' : 'diwali');
    if (!enabled) assert.equal(snapshot.now, real);
  }
});

test('Chicago input is independent of the host process timezone', () => {
  const moduleUrl = new URL('../src/components/countdown/debug/debugDates.js', import.meta.url).href;
  const script = `import { parseDateInput } from ${JSON.stringify(moduleUrl)}; console.log(parseDateInput('2026-06-24T09:00', 'America/Chicago').timestamp);`;
  for (const hostZone of ['Asia/Tokyo', 'America/Los_Angeles']) {
    const result = execFileSync(process.execPath, ['--input-type=module', '-e', script], {
      env: { ...process.env, TZ: hostZone }, encoding: 'utf8',
    });
    assert.equal(Number(result.trim()), Date.parse('2026-06-24T14:00:00Z'));
  }
});

test('custom wall time resolves Chicago standard/daylight offsets, including leap dates', () => {
  for (const [input, expected] of [
    ['2026-02-25T09:00:00', '2026-02-25T15:00:00Z'],
    ['2026-06-24T09:00', '2026-06-24T14:00:00Z'],
    ['2027-01-01T00:00:00', '2027-01-01T06:00:00Z'],
    ['2028-02-29T12:00:00', '2028-02-29T18:00:00Z'],
  ]) {
    const result = parseDateInput(input, zone);
    assert.equal(result.timestamp, Date.parse(expected));
    assert.equal(result.error, null);
    assert.equal(formatDateInput(result.timestamp, zone), input.length === 16 ? `${input}:00` : input);
  }
  for (const invalid of ['', '2026-02-29T12:00:00', '2026-13-01T12:00:00', '2026-01-01T24:00:00']) {
    assert.ok(parseDateInput(invalid, zone).error);
  }
});

test('DST gap is rejected and repeated hour offers both explicit instants', () => {
  const gap = parseDateInput('2026-03-08T02:30:00', zone);
  assert.equal(gap.timestamp, undefined);
  assert.match(gap.error, /does not exist/);
  const first = parseDateInput('2026-11-01T01:30:00', zone);
  const second = parseDateInput('2026-11-01T01:30:00', zone, 'later');
  assert.deepEqual(first.candidates, [Date.parse('2026-11-01T06:30:00Z'), Date.parse('2026-11-01T07:30:00Z')]);
  assert.equal(first.timestamp, first.candidates[0]);
  assert.equal(second.timestamp, first.candidates[1]);
  assert.equal(formatDateInput(first.timestamp, zone), formatDateInput(second.timestamp, zone));
});

test('all configured seasons produce before/during/after and between-season quick checks', () => {
  const groups = getDebugPresets(seasonalConfig, 2026);
  const ranges = getSeasonRanges(seasonalConfig, 2026);
  assert.equal(groups.length, ranges.length + 2);
  for (const [index, range] of ranges.entries()) {
    const [before, during, after] = groups[index].options;
    assert.equal(before.timestamp, range.start - 1000);
    assert.equal(after.timestamp, range.end + 1000);
    const prior = getSeasonalCountdown(seasonalConfig, before.timestamp);
    const active = getSeasonalCountdown(seasonalConfig, during.timestamp);
    const next = getSeasonalCountdown(seasonalConfig, after.timestamp);
    assert.equal(prior.seasonId, range.id);
    assert.equal(prior.status, 'upcoming');
    assert.equal(active.seasonId, range.id);
    assert.equal(active.status, 'active');
    assert.equal(active.serviceType, range.serviceType);
    assert.notEqual(next.seasonId, range.id);
    assert.equal(next.status, 'upcoming');
  }
  for (const gap of groups.at(-2).options) {
    assert.equal(getSeasonalCountdown(seasonalConfig, gap.timestamp).status, 'upcoming');
  }
  for (const rollover of groups.at(-1).options) {
    const state = getSeasonalCountdown(seasonalConfig, rollover.timestamp);
    assert.equal(state.seasonId, 'new-years-eve');
    assert.equal(state.status, 'active');
    assert.equal(state.serviceType, 'public');
  }
});

test('presets follow changed configuration instead of hardcoded commercial dates', () => {
  const config = { ...seasonalConfig, seasons: [{ ...seasonalConfig.seasons[0], start: { month: 2, day: 23, time: '11:15:00' } }] };
  assert.equal(getDebugPresets(config, 2028)[0].options[0].timestamp, Date.parse('2028-02-23T17:14:59Z'));
});

test('one frozen snapshot feeds countdown, status, attendance and CTA; resume reads fresh real time', () => {
  let real = Date.parse('2026-09-23T18:00:00Z');
  const clock = createCountdownClock({ allowSimulation: true, now: () => real });
  const reads = [];
  const unsubscribe = clock.subscribe(() => reads.push(readCountdownSnapshot(seasonalConfig, clock)));
  const frozen = Date.parse('2026-06-25T18:00:00Z');
  assert.equal(clock.simulate(frozen), true);
  const first = readCountdownSnapshot(seasonalConfig, clock);
  real += 86400000;
  assert.deepEqual(readCountdownSnapshot(seasonalConfig, clock), first);
  assert.equal(first.state.seasonId, 'independence-day');
  assert.equal(first.state.status, 'active');
  assert.equal(first.simulated, true);
  assert.equal(getSeasonPresentation(first.state, 'tel:+12144713434').ctaHref, '#contact');
  clock.simulate(Date.parse('2027-03-01T18:00:00Z'));
  const appointment = readCountdownSnapshot(seasonalConfig, clock);
  assert.equal(appointment.state.seasonId, 'texas-independence-day');
  assert.equal(appointment.state.serviceType, 'appointment');
  assert.equal(getSeasonPresentation(appointment.state, 'tel:+12144713434').ctaHref, 'tel:+12144713434');
  clock.resume();
  assert.equal(clock.now(), real);
  assert.equal(clock.isSimulated(), false);
  assert.equal(reads.at(-1).state.seasonId, 'diwali');
  unsubscribe();
  const length = reads.length;
  clock.simulate(frozen);
  assert.equal(reads.length, length);
});

test('production-disabled clock rejects simulation and invalid timestamps', () => {
  let real = Date.parse('2026-09-23T18:00:00Z');
  const clock = createCountdownClock({ allowSimulation: false, now: () => real });
  for (const attempt of [0, Date.parse('2026-06-25T18:00:00Z'), NaN, Infinity]) {
    assert.equal(clock.simulate(attempt), false);
    assert.equal(clock.now(), real);
    assert.equal(clock.isSimulated(), false);
  }
  real += 1000;
  assert.equal(clock.now(), real);
  const dev = createCountdownClock({ allowSimulation: true });
  assert.equal(dev.simulate(NaN), false);
  assert.equal(dev.simulate(8.64e15 + 1), false);
});

test('scheduler freezes without ticking, crosses inclusive boundaries on real time and cleans up', () => {
  const start = Date.parse('2026-06-24T14:00:00Z');
  const end = Date.parse('2026-07-05T04:59:59Z');
  let real = start - 1;
  const clock = createCountdownClock({ allowSimulation: true, now: () => real });
  const tasks = new Map();
  const events = new Map();
  let id = 0;
  let latest;
  let updates = 0;
  const stop = observeCountdown(seasonalConfig, clock, snapshot => { latest = snapshot; updates++; }, {
    setTimer: (callback, delay) => { tasks.set(++id, { callback, delay }); return id; },
    clearTimer: timer => tasks.delete(timer),
    visibility: { addEventListener: (name, cb) => events.set(name, cb), removeEventListener: name => events.delete(name) },
  });
  assert.equal(tasks.size, 1);
  assert.equal([...tasks.values()][0].delay, 1);
  real = start;
  [...tasks.values()][0].callback();
  assert.equal(latest.state.status, 'active');
  clock.simulate(end);
  assert.equal(tasks.size, 0);
  assert.equal(latest.state.status, 'active');
  assert.deepEqual(latest.state.remaining, { days: 0, hours: 0, minutes: 0 });
  clock.simulate(end + 1);
  assert.equal(latest.state.seasonId, 'diwali');
  real = end;
  clock.resume();
  assert.equal(tasks.size, 1);
  assert.equal([...tasks.values()][0].delay, 1);
  real = end + 1;
  [...tasks.values()][0].callback();
  assert.equal(latest.state.status, 'upcoming');
  assert.equal(latest.state.seasonId, 'diwali');
  stop();
  assert.equal(tasks.size, 0);
  assert.equal(events.size, 0);
  const count = updates;
  clock.simulate(start);
  assert.equal(updates, count);
});
