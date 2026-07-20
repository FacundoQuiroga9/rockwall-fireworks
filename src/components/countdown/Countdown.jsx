import { useState, useEffect } from 'react';
import { seasonalConfig } from '../../config/seasonalConfig';
import { getSeasonalCountdown } from '../../utils/seasonalCountdown';
import './Countdown.css';

const Countdown = () => {
  const [countdownState, setCountdownState] = useState(() =>
    getSeasonalCountdown(seasonalConfig),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdownState(getSeasonalCountdown(seasonalConfig));
    }, seasonalConfig.updateIntervalMs);

    return () => clearInterval(interval);
  }, []);

  const { remaining, isOpen, title } = countdownState;

  return (
    <section className="countdown" aria-labelledby="countdown-title">
      <div className="next-opening">
        <p className="sr-only" aria-live="polite">
          {isOpen ? 'Rockwall Fireworks is open.' : `Next opening: ${title}.`}
        </p>
        {isOpen ? (
          <>
            <h2 id="countdown-title">We’re Open!</h2>
            <p className="time">
              Closes in {remaining.days} days {remaining.hours} hours {remaining.minutes} minutes
            </p>
          </>
        ) : (
          <>
            <h2 id="countdown-title">Next Opening: <span className='holiday'>{title.toUpperCase()}</span></h2>
            <div className="time">
              {remaining ? (
                <>
                  {remaining.days} days {remaining.hours} hours {remaining.minutes} minutes
                </>
              ) : (
                <p>No upcoming openings.</p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Countdown;
