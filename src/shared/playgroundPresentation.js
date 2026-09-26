// Display only. Never feed these rounded values back into a profile or clock.
export function formatDuration(seconds) {
  const rounded = Math.max(0, Math.round(seconds));
  if (rounded < 60) return `${rounded} sec`;
  const remainder = rounded % 60;
  return `${Math.floor(rounded / 60)} min${remainder ? ` ${remainder} sec` : ''}`;
}
export function durationLabel(value) {
  const scope = value.scope || value.sampleLabel || '';
  const prefix = /shell/i.test(scope) ? 'Shell sample · ' : /excerpt|preview/i.test(scope) ? 'Preview · ' : '';
  return `${prefix}Approx. ${formatDuration(value.durationSeconds ?? value.duration)}`;
}
