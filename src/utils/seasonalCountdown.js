import { getZonedParts, getTimestampInTimeZone } from './zonedDateTime.js';

const buildSeasonRange = (season, year, timeZone) => ({
  id: season.id,
  title: season.title,
  serviceType: season.serviceType,
  start: getTimestampInTimeZone(year, season.start, timeZone),
  end: getTimestampInTimeZone(year, season.end, timeZone),
});

export const getSeasonRanges = (config, year) => config.seasons
  .map(season => buildSeasonRange(season, year, config.timeZone))
  .sort((first, second) => first.start - second.start);

const getRemainingTime = (distance) => {
  const safeDistance = Math.max(0, distance);

  return {
    days: Math.floor(safeDistance / (1000 * 60 * 60 * 24)),
    hours: Math.floor(
      (safeDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    ),
    minutes: Math.floor(
      (safeDistance % (1000 * 60 * 60)) / (1000 * 60),
    ),
  };
};

export const getSeasonalCountdown = (config, now = Date.now()) => {
  const currentYear = getZonedParts(now, config.timeZone).year;
  const ranges = [currentYear - 1, currentYear, currentYear + 1]
    .flatMap(year => getSeasonRanges(config, year))
    .sort((firstRange, secondRange) => firstRange.start - secondRange.start);
  const currentRange = ranges.find(
    (range) => now >= range.start && now <= range.end,
  );
  const nextRange = ranges.find((range) => range.start > now);
  const selectedRange = currentRange ?? nextRange;

  if (!selectedRange) {
    return {
      status: 'unavailable',
      isSeasonActive: false,
      seasonId: null,
      serviceType: null,
      title: '',
      remaining: null,
      target: null,
    };
  }

  const target = currentRange ? selectedRange.end : selectedRange.start;

  return {
    status: currentRange ? 'active' : 'upcoming',
    isSeasonActive: Boolean(currentRange),
    seasonId: selectedRange.id,
    serviceType: selectedRange.serviceType,
    title: selectedRange.title,
    remaining: getRemainingTime(target - now),
    target,
  };
};
