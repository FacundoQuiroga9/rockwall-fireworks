import assert from 'node:assert/strict';
import test from 'node:test';
import { seasonalConfig } from '../src/config/seasonalConfig.js';
import { siteConfig } from '../src/config/siteConfig.js';
import { getSeasonalCountdown } from '../src/utils/seasonalCountdown.js';
import { getSeasonAttendance, getSeasonPresentation } from '../src/utils/seasonPresentation.js';
const at = date => getSeasonalCountdown(seasonalConfig, Date.parse(date));

// Explicit UTC fixtures assert Chicago conversion independently of the implementation.
const ranges = [
  ['texas-independence-day', 'appointment', '2026-02-25T15:00:00Z', '2026-03-03T05:59:59Z'],
  ['san-jacinto-day', 'appointment', '2026-04-16T14:00:00Z', '2026-04-22T04:59:59Z'],
  ['memorial-day', 'appointment', '2026-05-21T14:00:00Z', '2026-05-27T04:59:59Z'],
  ['independence-day', 'public', '2026-06-24T14:00:00Z', '2026-07-05T04:59:59Z'],
  ['diwali', 'appointment', '2026-10-26T15:00:00Z', '2026-11-03T03:59:59Z'],
  ['new-years-eve', 'public', '2026-12-20T15:00:00Z', '2027-01-02T05:59:59Z'],
];

test('only July Independence Day and New Year are explicitly public', () => {
  assert.deepEqual(seasonalConfig.seasons.filter(s => s.serviceType === 'public').map(s => s.id), ['independence-day', 'new-years-eve']);
  assert.equal(seasonalConfig.seasons.filter(s => s.serviceType === 'appointment').length, 4);
  assert.equal(seasonalConfig.seasons.find(s => s.id === 'texas-independence-day').serviceType, 'appointment');
  assert.equal(seasonalConfig.timeZone, 'America/Chicago');
});

for (const [index, [id, serviceType, startISO, endISO]] of ranges.entries()) {
  test(`${id}: chronological selection, service type and inclusive Chicago boundaries`, () => {
    const start = Date.parse(startISO);
    const end = Date.parse(endISO);
    const before = getSeasonalCountdown(seasonalConfig, start - 1);
    assert.equal(before.status, 'upcoming');
    assert.equal(before.isSeasonActive, false);
    assert.equal(before.seasonId, id);
    assert.equal(before.serviceType, serviceType);
    assert.equal(before.target, start);
    for (const now of [start, start + 86400000, end]) {
      const state = getSeasonalCountdown(seasonalConfig, now);
      assert.equal(state.status, 'active');
      assert.equal(state.isSeasonActive, true);
      assert.equal(state.seasonId, id);
      assert.equal(state.serviceType, serviceType);
      assert.equal(state.target, end);
      assert.equal(Object.hasOwn(state, 'isOpen'), false);
      assert.ok(Object.values(state.remaining).every(value => value >= 0));
    }
    const after = getSeasonalCountdown(seasonalConfig, end + 1);
    assert.equal(after.status, 'upcoming');
    assert.equal(after.isSeasonActive, false);
    assert.equal(after.seasonId, ranges[(index + 1) % ranges.length][0]);
    assert.equal(after.target, Date.parse(index === ranges.length - 1 ? '2027-02-25T15:00:00Z' : ranges[index + 1][2]));
  });
}

test('New Year remains active across both UTC and Chicago calendar-year changes', () => {
  for (const date of ['2027-01-01T00:00:00Z', '2027-01-01T05:59:59Z', '2027-01-01T06:00:00Z', '2027-01-02T05:59:59Z']) {
    const state = at(date);
    assert.equal(state.seasonId, 'new-years-eve');
    assert.equal(state.status, 'active');
    assert.equal(state.target, Date.parse('2027-01-02T05:59:59Z'));
  }
});

test('Diwali spans the autumn daylight-saving change without shifting the configured local end', () => {
  for (const date of ['2026-11-01T06:59:59Z', '2026-11-01T07:00:00Z', '2026-11-02T18:00:00Z']) {
    const state = at(date);
    assert.equal(state.seasonId, 'diwali');
    assert.equal(state.status, 'active');
    assert.equal(state.target, Date.parse('2026-11-03T03:59:59Z'));
  }
});

test('selection uses dates regardless of input order, titles or attendance', () => {
  const renamed = { ...seasonalConfig, seasons: [...seasonalConfig.seasons].reverse().map(s => ({ ...s, title: 'Renamed celebration' })) };
  assert.equal(getSeasonalCountdown(renamed, Date.parse('2026-03-01T18:00:00Z')).seasonId, 'texas-independence-day');
  const appointmentOnly = { ...seasonalConfig, seasons: seasonalConfig.seasons.filter(s => s.serviceType === 'appointment') };
  assert.equal(getSeasonalCountdown(appointmentOnly, Date.parse('2026-06-25T18:00:00Z')).seasonId, 'diwali');
  const empty = getSeasonalCountdown({ ...seasonalConfig, seasons: [] });
  assert.equal(empty.status, 'unavailable');
  assert.equal(empty.target, null);
  assert.equal(empty.remaining, null);
  assert.equal(getSeasonPresentation(empty, siteConfig.phone.href), null);
});

test('main message and single CTA reflect attendance separately from active/upcoming status', () => {
  for (const [, serviceType, startISO] of ranges) {
    const start = Date.parse(startISO);
    for (const [now, active] of [[start - 1, false], [start, true]]) {
      const state = getSeasonalCountdown(seasonalConfig, now);
      const view = getSeasonPresentation(state, siteConfig.phone.href);
      assert.equal(view.statusLabel, active ? 'Season in progress' : 'Next season');
      assert.equal(view.timerLabel, active ? 'Season ends in' : 'Season starts in');
      assert.equal(view.calendarLabel, active ? 'In progress' : 'Up next');
      assert.doesNotMatch(JSON.stringify(view), /open now|now open|opening in/i);
      if (serviceType === 'appointment') {
        assert.equal(view.ctaHref, 'tel:+12144713434');
        assert.equal(view.ctaLabel, 'Call to schedule your visit');
        assert.match(view.message, /by appointment/);
        assert.equal(view.ctaIcon, 'phone');
      } else {
        assert.equal(view.ctaHref, '#contact');
        assert.equal(view.ctaLabel, 'Find our store');
        assert.match(view.message, /regular public opening/);
        assert.doesNotMatch(view.message, /appointment|schedule/i);
        assert.equal(view.ctaIcon, 'location');
      }
    }
  }
});

test('calendar attendance stays consistent with the main CTA for all six seasons and both states', () => {
  for (const [id, serviceType, startISO] of ranges) {
    const season = seasonalConfig.seasons.find(item => item.id === id);
    const attendance = getSeasonAttendance(season.serviceType, siteConfig.phone.href);
    const expected = serviceType === 'public' ? 'Open to the public' : 'By appointment';
    assert.equal(attendance.calendarServiceLabel, expected);
    for (const offset of [-1, 0]) {
      const state = getSeasonalCountdown(seasonalConfig, Date.parse(startISO) + offset);
      const view = getSeasonPresentation(state, siteConfig.phone.href);
      assert.equal(view.calendarServiceLabel, expected);
      assert.equal(view.ctaHref, attendance.ctaHref);
      assert.equal(view.serviceLabel, attendance.serviceLabel);
    }
  }
});
