import { getSeasonalCountdown } from './seasonalCountdown.js';

// Memory only: no URL, storage, system clock or global Date mutations.
// Production explicitly constructs this source with simulation disabled.
export const createCountdownClock = ({ allowSimulation = false, now = () => Date.now() } = {}) => {
  let simulatedTime = null;
  const listeners = new Set();
  const notify = () => listeners.forEach(listener => listener());
  return {
    now: () => simulatedTime ?? now(),
    isSimulated: () => simulatedTime !== null,
    simulate(timestamp) {
      if (!allowSimulation || !Number.isFinite(timestamp) || Math.abs(timestamp) > 8.64e15) return false;
      simulatedTime = timestamp;
      notify();
      return true;
    },
    resume() {
      simulatedTime = null;
      notify();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
};

export const readCountdownSnapshot = (config, clock) => {
  const now = clock.now();
  return { now, simulated: clock.isSimulated(), state: getSeasonalCountdown(config, now) };
};

// Frozen snapshots schedule no ticks. Resume reads fresh time immediately.
export const observeCountdown = (config, clock, onChange, {
  setTimer = setTimeout,
  clearTimer = clearTimeout,
  visibility = document,
} = {}) => {
  let timer;
  const refresh = () => {
    clearTimer(timer);
    const snapshot = readCountdownSnapshot(config, clock);
    onChange(snapshot);
    if (snapshot.simulated) return;
    const { target, isSeasonActive } = snapshot.state;
    const boundaryDelay = target === null ? Infinity : target - snapshot.now + (isSeasonActive ? 1 : 0);
    timer = setTimer(refresh, Math.max(1, Math.min(config.updateIntervalMs, boundaryDelay)));
  };
  const unsubscribe = clock.subscribe(refresh);
  visibility.addEventListener('visibilitychange', refresh);
  refresh();
  return () => {
    clearTimer(timer);
    unsubscribe();
    visibility.removeEventListener('visibilitychange', refresh);
  };
};
