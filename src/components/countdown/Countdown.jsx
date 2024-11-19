import { useState, useEffect } from 'react';
import './Countdown.css';

const Countdown = ({ testDate }) => {
  const [timeRemaining, setTimeRemaining] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [nextOpeningTitle, setNextOpeningTitle] = useState('');

  const getNow = () => (testDate ? new Date(testDate).getTime() : new Date().getTime());
  const getYear = () => (testDate ? new Date(testDate).getFullYear() : new Date().getFullYear());

  const getFireworksRanges = (year) => [
    { title: 'Independence Day', start: new Date(`${year}-06-24T09:00:00`).getTime(), end: new Date(`${year}-07-04T23:59:59`).getTime() },
    { title: 'Diwali', start: new Date(`${year}-10-26T10:00:00`).getTime(), end: new Date(`${year}-11-02T21:59:59`).getTime() },
    { title: "New Year's Eve", start: new Date(`${year}-12-20T09:00:00`).getTime(), end: new Date(`${year + 1}-01-01T23:59:59`).getTime() },
    { title: 'Texas Independence Day', start: new Date(`${year}-02-25T09:00:00`).getTime(), end: new Date(`${year}-03-02T23:59:59`).getTime() },
    { title: 'San Jacinto Day', start: new Date(`${year}-04-16T09:00:00`).getTime(), end: new Date(`${year}-04-21T23:59:59`).getTime() },
    { title: 'Memorial Day', start: new Date(`${year}-05-21T09:00:00`).getTime(), end: new Date(`${year}-05-26T23:59:59`).getTime() },
  ];

  const getNextFireworksRange = () => {
    const now = getNow();
    const year = getYear();
    const fireworksRanges = getFireworksRanges(year);

    const currentRange = fireworksRanges.find(range => now >= range.start && now <= range.end);

    if (currentRange) {
      return { ...currentRange, isWithinRange: true };
    }

    const futureRanges = fireworksRanges.filter(range => range.start > now);
    futureRanges.sort((a, b) => a.start - b.start);

    return futureRanges.length ? { ...futureRanges[0], isWithinRange: false } : null;
  };

  useEffect(() => {
    const nextFireworksRange = getNextFireworksRange();

    const interval = setInterval(() => {
      const now = getNow();

      if (nextFireworksRange) {
        setNextOpeningTitle(nextFireworksRange.title);

        let distance;
        if (nextFireworksRange.isWithinRange) {
          distance = nextFireworksRange.end - now;
          setIsOpen(true);
        } else {
          distance = nextFireworksRange.start - now;
          setIsOpen(false);
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60)) / (1000 * 60));

        setTimeRemaining({ days, hours, minutes });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [testDate]);

  return (
    <div className="countdown">
      <div className="next-opening">
        {isOpen ? (
          <>
            <h2>We're Open!</h2>
            <div className="time">
              Closes in {timeRemaining.days} days {timeRemaining.hours} hours {timeRemaining.minutes} minutes
            </div>
          </>
        ) : (
          <>
            <h2>Next Opening: <span className='holiday'>{nextOpeningTitle.toUpperCase()}</span></h2>
            <div className="time">
              {timeRemaining.days !== undefined ? (
                <>
                  {timeRemaining.days} days {timeRemaining.hours} hours {timeRemaining.minutes} minutes
                </>
              ) : (
                <p>No upcoming openings.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Countdown;
