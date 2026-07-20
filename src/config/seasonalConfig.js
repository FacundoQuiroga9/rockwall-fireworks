export const seasonalConfig = {
  timeZone: 'America/Chicago',
  updateIntervalMs: 60000,
  seasons: [
    {
      id: 'texas-independence-day',
      title: 'Texas Independence Day',
      start: { month: 2, day: 25, time: '09:00:00' },
      end: { month: 3, day: 2, time: '23:59:59' },
    },
    {
      id: 'san-jacinto-day',
      title: 'San Jacinto Day',
      start: { month: 4, day: 16, time: '09:00:00' },
      end: { month: 4, day: 21, time: '23:59:59' },
    },
    {
      id: 'memorial-day',
      title: 'Memorial Day',
      start: { month: 5, day: 21, time: '09:00:00' },
      end: { month: 5, day: 26, time: '23:59:59' },
    },
    {
      id: 'independence-day',
      title: 'Independence Day',
      start: { month: 6, day: 24, time: '09:00:00' },
      end: { month: 7, day: 4, time: '23:59:59' },
    },
    {
      id: 'diwali',
      title: 'Diwali',
      start: { month: 10, day: 26, time: '10:00:00' },
      end: { month: 11, day: 2, time: '21:59:59' },
    },
    {
      id: 'new-years-eve',
      title: "New Year's Eve",
      start: { month: 12, day: 20, time: '09:00:00' },
      end: {
        month: 1,
        day: 1,
        time: '23:59:59',
        yearOffset: 1,
      },
    },
  ],
};
