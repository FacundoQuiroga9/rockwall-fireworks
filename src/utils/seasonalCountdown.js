const formatterCache = new Map();

const getFormatter = (timeZone) => {
  if (!formatterCache.has(timeZone)) {
    formatterCache.set(
      timeZone,
      new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
      }),
    );
  }

  return formatterCache.get(timeZone);
};

const getZonedParts = (timestamp, timeZone) =>
  Object.fromEntries(
    getFormatter(timeZone)
      .formatToParts(new Date(timestamp))
      .filter(({ type }) => type !== 'literal')
      .map(({ type, value }) => [type, Number(value)]),
  );

const getTimeZoneOffset = (timestamp, timeZone) => {
  const parts = getZonedParts(timestamp, timeZone);
  const timestampWithoutMilliseconds = Math.floor(timestamp / 1000) * 1000;
  const zonedTimeAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );

  return zonedTimeAsUtc - timestampWithoutMilliseconds;
};

const getTimestampInTimeZone = (year, dateConfig, timeZone) => {
  const [hour, minute, second] = dateConfig.time.split(':').map(Number);
  const utcGuess = Date.UTC(
    year + (dateConfig.yearOffset ?? 0),
    dateConfig.month - 1,
    dateConfig.day,
    hour,
    minute,
    second,
  );
  const firstPass = utcGuess - getTimeZoneOffset(utcGuess, timeZone);

  return utcGuess - getTimeZoneOffset(firstPass, timeZone);
};

const buildSeasonRange = (season, year, timeZone) => ({
  id: season.id,
  title: season.title,
  start: getTimestampInTimeZone(year, season.start, timeZone),
  end: getTimestampInTimeZone(year, season.end, timeZone),
});

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
    .flatMap((year) =>
      config.seasons.map((season) =>
        buildSeasonRange(season, year, config.timeZone),
      ),
    )
    .sort((firstRange, secondRange) => firstRange.start - secondRange.start);
  const currentRange = ranges.find(
    (range) => now >= range.start && now <= range.end,
  );
  const nextRange = ranges.find((range) => range.start > now);
  const selectedRange = currentRange ?? nextRange;

  if (!selectedRange) {
    return {
      isOpen: false,
      title: '',
      remaining: null,
      target: null,
    };
  }

  const target = currentRange ? selectedRange.end : selectedRange.start;

  return {
    isOpen: Boolean(currentRange),
    title: selectedRange.title,
    remaining: getRemainingTime(target - now),
    target,
  };
};
