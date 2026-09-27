// One continuous path to the primary break. Unknown lifts use a quiet locator,
// not a claimed product tail. Profile launch/burst times remain untouched.
// Self-contained for the offline WebView.
export function aerialFlight(event, time, { center, width, height, scale }) {
  if (event.launchCue === false || time < event.launch || time > event.burst || event.burst <= event.launch) return null;
  const u = Math.min(1, Math.max(0, (time - event.launch) / (event.burst - event.launch)));
  const progress = 1 - (1 - u) ** 1.35;
  const x0 = center + (event.launchX ?? 0) * 700 * scale;
  const y0 = height * .96;
  const x1 = center + event.x * 700 * scale;
  const y1 = Math.max(45, height * .25) + (event.y ?? 0) * height;
  return { x: x0 + (x1 - x0) * progress + (event.risingReport ? Math.sin((time - event.launch) * 30) * (event.spiral ?? 7) * scale * Math.sin(progress * Math.PI) : 0), y: y0 + (y1 - y0) * progress,
    origin: [x0, y0], target: [x1, y1], progress,
    color: event.launchVisible ? event.launchColor || event.liftTrail?.color || '#efcf98' : '#d3c4a8',
    documented: event.launchVisible === true, width };
}
