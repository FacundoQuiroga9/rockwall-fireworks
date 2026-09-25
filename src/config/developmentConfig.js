// Opt in explicitly when starting Vite. Production always keeps the real clock.
export const countdownDebugEnabled = import.meta.env.DEV && import.meta.env.VITE_COUNTDOWN_DEBUG === 'true';
