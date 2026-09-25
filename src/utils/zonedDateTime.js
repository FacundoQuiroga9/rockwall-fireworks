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

export const getZonedParts = (timestamp, timeZone) =>
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

export const getTimestampInTimeZone = (year, dateConfig, timeZone) => {
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
