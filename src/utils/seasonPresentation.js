// Attendance is independent of whether a date range is active.
// A season in progress does not establish that the store is open right now.
export const getSeasonAttendance = (serviceType, phoneHref) => ({
  appointment: {
    calendarServiceLabel: 'By appointment',
    serviceLabel: 'Visits by appointment',
    message: 'Planning your celebration? Visits this season are available by appointment. Give us a call to arrange yours.',
    ctaLabel: 'Call to schedule your visit',
    ctaHref: phoneHref,
    ctaIcon: 'phone',
  },
  public: {
    calendarServiceLabel: 'Open to the public',
    serviceLabel: 'Regular public opening',
    message: 'Come find your celebration favorites. We welcome visitors during this season’s regular public opening. Check our store hours and location before you visit.',
    ctaLabel: 'Find our store',
    ctaHref: '#contact',
    ctaIcon: 'location',
  },
})[serviceType];

export const getSeasonPresentation = (state, phoneHref) => {
  if (state.status === 'unavailable') return null;

  const active = state.status === 'active';

  return {
    ...getSeasonAttendance(state.serviceType, phoneHref),
    statusLabel: active ? 'Season in progress' : 'Next season',
    timerLabel: active ? 'Season ends in' : 'Season starts in',
    calendarLabel: active ? 'In progress' : 'Up next',
  };
};
