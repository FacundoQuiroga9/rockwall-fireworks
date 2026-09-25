export const seasonalConfig = {
  timeZone: 'America/Chicago',
  updateIntervalMs: 60000,
  seasons: [
    {
      id: 'texas-independence-day',
      serviceType: 'appointment',
      title: 'Texas Independence Day',
      start: { month: 2, day: 25, time: '09:00:00' },
      end: { month: 3, day: 2, time: '23:59:59' },
    },
    {
      id: 'san-jacinto-day',
      serviceType: 'appointment',
      title: 'San Jacinto Day',
      start: { month: 4, day: 16, time: '09:00:00' },
      end: { month: 4, day: 21, time: '23:59:59' },
    },
    {
      id: 'memorial-day',
      serviceType: 'appointment',
      title: 'Memorial Day',
      start: { month: 5, day: 21, time: '09:00:00' },
      end: { month: 5, day: 26, time: '23:59:59' },
    },
    {
      id: 'independence-day',
      serviceType: 'public',
      title: 'Independence Day',
      start: { month: 6, day: 24, time: '09:00:00' },
      end: { month: 7, day: 4, time: '23:59:59' },
    },
    {
      id: 'diwali',
      serviceType: 'appointment',
      title: 'Diwali',
      start: { month: 10, day: 26, time: '10:00:00' },
      end: { month: 11, day: 2, time: '21:59:59' },
    },
    {
      id: 'new-years-eve',
      serviceType: 'public',
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

export const publicSeasonNames = seasonalConfig.seasons
  .filter(season => season.serviceType === 'public')
  .map(season => season.title).join(' and ');
