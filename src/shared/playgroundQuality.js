// Hysteresis uses sustained two-second windows, not a single slow frame.
export function createQualityController(requested = 'auto', compact = false) {
  const order = ['low', 'balanced', 'high'];
  const desired = () => requested === 'auto' ? compact ? 1 : 2 : Math.max(0, order.indexOf(requested));
  let level = desired(), windowStart = 0, lastChange = -Infinity, costs = [], intervals = [], bad = 0, good = 0;
  const snapshot = () => ({ requested, effective: order[level], adjusted: level < desired() });
  return {
    snapshot,
    set(value) { if (!['auto', ...order].includes(value)) return snapshot(); requested = value; level = desired(); bad = good = 0; costs = []; intervals = []; windowStart = 0; return snapshot(); },
    sample(now, cost, interval) {
      if (!windowStart) windowStart = now;
      costs.push(cost); if (interval > 0 && interval < 250) intervals.push(interval);
      if (now - windowStart < 2000) return snapshot();
      const mean = values => values.reduce((a, b) => a + b, 0) / Math.max(1, values.length);
      const frameTarget = compact || level === 0 ? 1000 / 30 : 1000 / 60;
      const overloaded = mean(costs) > (compact ? 17 : 10) || mean(intervals) > frameTarget * 1.45;
      const comfortable = mean(costs) < (compact ? 7 : 4) && mean(intervals) < frameTarget * 1.15;
      bad = overloaded ? bad + 1 : 0; good = comfortable ? good + 1 : 0;
      costs = []; intervals = []; windowStart = now;
      if (bad >= 2 && level > 0 && now - lastChange > 6000) { level--; bad = good = 0; lastChange = now; }
      else if (good >= 5 && level < desired() && now - lastChange > 10000) { level++; bad = good = 0; lastChange = now; }
      return snapshot();
    },
  };
}
