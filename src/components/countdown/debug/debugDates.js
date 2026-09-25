import { getSeasonRanges } from '../../../utils/seasonalCountdown.js';
import { getZonedParts, getTimestampInTimeZone } from '../../../utils/zonedDateTime.js';

const pad = value => String(value).padStart(2, '0');
export const formatDateInput = (timestamp, timeZone) => {
  const p = getZonedParts(timestamp, timeZone);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}:${pad(p.second)}`;
};

// Resolve wall-clock input without using the computer's local timezone.
// Return both valid instants in a repeated hour; reject nonexistent spring times.
export const parseDateInput = (value, timeZone, occurrence = 'earlier') => {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value);
  if (!match) return { error: 'Enter a complete date and time, including the year.', candidates: [] };
  const [year, month, day, hour, minute, second] = match.slice(1).map(part => Number(part ?? 0));
  const wall = Date.UTC(year, month - 1, day, hour, minute, second);
  const utc = new Date(wall);
  if (year < 1000 || utc.getUTCFullYear() !== year || utc.getUTCMonth() + 1 !== month || utc.getUTCDate() !== day || utc.getUTCHours() !== hour || utc.getUTCMinutes() !== minute || utc.getUTCSeconds() !== second) {
    return { error: 'Enter a valid calendar date and time.', candidates: [] };
  }
  const offsets = new Set([-36, 0, 36].map(hours => {
    const instant = wall + hours * 3600000;
    const p = getZonedParts(instant, timeZone);
    return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - instant;
  }));
  const expected = `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:${pad(second)}`;
  const candidates = [...offsets].map(offset => wall - offset)
    .filter(timestamp => formatDateInput(timestamp, timeZone) === expected).sort((a, b) => a - b);
  if (!candidates.length) return { error: `This local time does not exist in ${timeZone} because the clock moves forward. Choose another time.`, candidates };
  return { timestamp: occurrence === 'later' ? candidates.at(-1) : candidates[0], candidates, error: null };
};

export const getDebugPresets = (config, year) => {
  const ranges = getSeasonRanges(config, year);
  const following = [...ranges, ...getSeasonRanges(config, year + 1)];
  const groups = ranges.map(range => ({
    label: range.title,
    options: [
      { id: `${range.id}-before`, label: '1 second before the start', timestamp: range.start - 1000 },
      { id: `${range.id}-during`, label: 'During the season', timestamp: Math.floor((range.start + range.end) / 2000) * 1000 },
      { id: `${range.id}-after`, label: '1 second after the end', timestamp: range.end + 1000 },
    ],
  }));
  groups.push({ label: 'Between seasons', options: ranges.flatMap(range => {
    const next = following.find(candidate => candidate.start > range.end);
    return next ? [{ id: `${range.id}-gap`, label: `After ${range.title}, before ${next.title}`, timestamp: Math.floor((range.end + next.start) / 2000) * 1000 }] : [];
  }) });
  groups.push({ label: 'December → January', options: [
    { id: 'year-last-second', label: `December 31, ${year} · 23:59:59`, timestamp: getTimestampInTimeZone(year, { month: 12, day: 31, time: '23:59:59' }, config.timeZone) },
    { id: 'year-first-second', label: `January 1, ${year + 1} · 00:00:00`, timestamp: getTimestampInTimeZone(year + 1, { month: 1, day: 1, time: '00:00:00' }, config.timeZone) },
  ] });
  return groups;
};
