import { useEffect, useState } from 'react';
import { countdownDebugEnabled } from '../config/developmentConfig';
import { createCountdownClock, observeCountdown, readCountdownSnapshot } from '../utils/countdownClock';

// Vite replaces DEV with false for every production build, including custom modes.
const clock = createCountdownClock({ allowSimulation: countdownDebugEnabled });

export const useSeasonalCountdown = config => {
  const [snapshot, setSnapshot] = useState(() => readCountdownSnapshot(config, clock));
  useEffect(() => observeCountdown(config, clock, setSnapshot), [config]);
  return { ...snapshot, clock };
};
