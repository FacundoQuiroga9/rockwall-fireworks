import { useMemo, useState } from 'react';
import { formatDateInput, getDebugPresets, parseDateInput } from './debugDates';
import './CountdownDebug.css';

const CountdownDebug = ({ config, clock, now, simulated, state, presentation }) => {
  const [draft, setDraft] = useState(() => formatDateInput(now, config.timeZone));
  const [occurrence, setOccurrence] = useState('earlier');
  const [error, setError] = useState('');
  const [year, setYear] = useState(() => formatDateInput(now, config.timeZone).slice(0, 4));
  const [presetId, setPresetId] = useState('');
  const validYear = /^\d{4}$/.test(year) && Number(year) >= 1000 && Number(year) < 9999;
  const presets = useMemo(() => validYear ? getDebugPresets(config, Number(year)) : [], [config, year, validYear]);
  const parsed = parseDateInput(draft, config.timeZone, occurrence);
  const displayTime = timestamp => new Intl.DateTimeFormat('en-US', {
    timeZone: config.timeZone, dateStyle: 'medium', timeStyle: 'long',
  }).format(new Date(timestamp));

  const applyDraft = () => {
    if (parsed.error) { setError(parsed.error); return; }
    setError('');
    clock.simulate(parsed.timestamp);
  };
  const resume = () => {
    clock.resume();
    setDraft(formatDateInput(clock.now(), config.timeZone));
    setOccurrence('earlier');
    setPresetId('');
    setError('');
  };
  const applyPreset = () => {
    const preset = presets.flatMap(group => group.options).find(option => option.id === presetId);
    if (!preset) return;
    const value = formatDateInput(preset.timestamp, config.timeZone);
    setDraft(value);
    setOccurrence(parseDateInput(value, config.timeZone).timestamp === preset.timestamp ? 'earlier' : 'later');
    setError('');
    clock.simulate(preset.timestamp);
  };

  return <details className="countdown-debug" id="countdown-debug">
    <summary><span>Countdown debug <small>Development only</small></span><strong className={simulated ? 'debug-is-frozen' : ''}>{simulated ? 'SIMULATION · FROZEN' : 'LIVE CLOCK'}</strong></summary>
    <div className="countdown-debug-body">
      <p className="debug-clock-status" role="status">{simulated ? 'Frozen at' : 'Real store time'}: <time dateTime={new Date(now).toISOString()}>{displayTime(now)}</time> · {config.timeZone}</p>
      <div className="debug-fields">
        <form onSubmit={event => { event.preventDefault(); applyDraft(); }}>
          <label htmlFor="debug-date">Custom date &amp; time · {config.timeZone}</label>
          <input id="debug-date" type="datetime-local" step="1" min="1000-01-01T00:00:00" max="9999-12-31T23:59:59" value={draft} onChange={event => { setDraft(event.target.value); setError(''); setPresetId(''); }} aria-describedby="debug-time-help debug-date-error" aria-invalid={Boolean(error)} required />
          <p id="debug-time-help">Store-local time, regardless of your computer’s timezone.</p>
          {parsed.candidates.length > 1 && <label className="debug-repeated-hour">This hour occurs twice. Choose its occurrence:
            <select aria-label="Repeated hour occurrence" value={occurrence} onChange={event => setOccurrence(event.target.value)}>
              {parsed.candidates.map((timestamp, index) => <option key={timestamp} value={index === 0 ? 'earlier' : 'later'}>{index === 0 ? 'First' : 'Second'} · {displayTime(timestamp)}</option>)}
            </select>
          </label>}
          <p id="debug-date-error" role={error ? 'alert' : undefined}>{error}</p>
          <div className="debug-actions"><button type="submit">Apply &amp; freeze</button><button type="button" onClick={resume}>Use real time</button><label className="debug-toggle"><input type="checkbox" checked={simulated} onChange={event => event.target.checked ? applyDraft() : resume()} /> Freeze simulated time</label></div>
        </form>
        <div>
          <div className="debug-preset-heading"><label htmlFor="debug-preset">Configured season checks</label><label htmlFor="debug-year">Year <input id="debug-year" type="number" min="1000" max="9998" step="1" value={year} onChange={event => { setYear(event.target.value); setPresetId(''); }} /></label></div>
          <select id="debug-preset" value={presetId} onChange={event => setPresetId(event.target.value)} disabled={!validYear}>
            <option value="">Choose a moment…</option>
            {presets.map(group => <optgroup label={group.label} key={group.label}>{group.options.map(option => <option value={option.id} key={option.id}>{group.label}: {option.label}</option>)}</optgroup>)}
          </select>
          <p>Before, during, after, between seasons and the December–January rollover. Dates come from the current configuration.</p>
          <div className="debug-actions"><button type="button" disabled={!presetId || !validYear} onClick={applyPreset}>Apply quick check</button></div>
        </div>
      </div>
      <dl className="debug-state">
        <div><dt>Selected season</dt><dd>{state.title || 'None'}</dd></div>
        <div><dt>State / attendance</dt><dd>{presentation?.statusLabel ?? 'Unavailable'} · {state.serviceType ?? '—'}</dd></div>
        <div><dt>{presentation?.timerLabel ?? 'Target'}</dt><dd>{state.target === null ? '—' : displayTime(state.target)}</dd></div>
        <div><dt>Main CTA</dt><dd>{presentation?.ctaLabel ?? 'None'}<span>{presentation?.ctaHref}</span></dd></div>
      </dl>
      <p className="debug-note">Simulation affects only this countdown, stays frozen when this panel is collapsed, and resets on reload. It is unavailable in production.</p>
    </div>
  </details>;
};
export default CountdownDebug;
