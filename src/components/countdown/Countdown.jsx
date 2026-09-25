import { lazy, Suspense } from 'react';
import { seasonalConfig } from '../../config/seasonalConfig';
import { countdownDebugEnabled } from '../../config/developmentConfig';
import { siteConfig } from '../../config/siteConfig';
import { useSeasonalCountdown } from '../../hooks/useSeasonalCountdown';
import { getSeasonAttendance, getSeasonPresentation } from '../../utils/seasonPresentation';
import MotionTitle from '../common/MotionTitle';
import Burst from '../common/Burst';
import Icon from '../common/Icon';
import './Countdown.css';

// The import and its CSS are removed from production by Vite's DEV guard.
const CountdownDebug = import.meta.env.DEV && countdownDebugEnabled ? lazy(() => import('./debug/CountdownDebug')) : null;

const formatDate = ({ month, day }) => new Intl.DateTimeFormat('en-US', {
  month: 'short', day: 'numeric', timeZone: 'UTC',
}).format(new Date(Date.UTC(2000, month - 1, day)));

const Countdown = () => {
  const { state, now, simulated, clock } = useSeasonalCountdown(seasonalConfig);

  const { remaining, title, seasonId } = state;
  const presentation = getSeasonPresentation(state, siteConfig.phone.href);

  return <section id="seasons" className="countdown" aria-labelledby="countdown-title">
    <div className="shell">
      {CountdownDebug && <Suspense fallback={null}><CountdownDebug config={seasonalConfig} clock={clock} now={now} simulated={simulated} state={state} presentation={presentation} /></Suspense>}
      <p className="sr-only" aria-live="polite">{presentation ? `${presentation.statusLabel}: ${title}. ${presentation.serviceLabel}.` : 'Season dates will be announced soon.'}</p>
      <div className="countdown-top" data-reveal>
        <div className="countdown-heading">
          <p className="eyebrow">Make room for celebration</p>
          <p className="countdown-status">{presentation?.statusLabel ?? 'Our seasons'}</p>
          <MotionTitle id="countdown-title" lines={[title || 'More good nights ahead.']} />
        </div>
        <Burst />
        {remaining && <div className="countdown-clock" data-motion="clock">
          <p id="countdown-timer-label">{presentation.timerLabel}</p>
          <div className="countdown-digits" role="timer" aria-label={`${presentation.timerLabel}: ${remaining.days} days, ${remaining.hours} hours, ${remaining.minutes} minutes`}>
            {Object.entries(remaining).map(([unit, value]) => <div key={unit}>
              <strong><b key={value}>{String(value).padStart(2, '0')}</b></strong><span>{unit}</span>
            </div>)}
          </div>
          <p className="countdown-zone">Store time · America/Chicago</p>
        </div>}
      </div>
      {presentation && <div className="season-attendance">
        <div><p className="season-service-label">{presentation.serviceLabel}</p><p className="season-message">{presentation.message}</p></div>
        <a className="button season-cta" href={presentation.ctaHref}><Icon name={presentation.ctaIcon} />{presentation.ctaLabel}</a>
      </div>}
      <div className="season-calendar-heading"><h3>The celebration calendar</h3><span>Season dates</span></div>
      <ul className="season-list" data-reveal aria-label="Season calendar">
        {seasonalConfig.seasons.map((season, index) => <li className={`season-item ${season.id === seasonId ? 'season-item--selected' : ''}`} key={season.id} data-motion="calendar">
          <span className="season-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <h4>{season.title}</h4>
          <p className="season-mode">{getSeasonAttendance(season.serviceType).calendarServiceLabel}</p>
          <p className="season-dates">{formatDate(season.start)} — {formatDate(season.end)}</p>
          {season.id === seasonId && <span className="season-current">{presentation.calendarLabel}</span>}
        </li>)}
      </ul>
    </div>
  </section>;
};
export default Countdown;
