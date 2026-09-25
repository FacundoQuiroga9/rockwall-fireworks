// Touch-first tablets use the same zero-particle composition as phones. The narrow
// viewport fallback also covers small desktop windows; no UA sniffing is needed.
export const skyMediaQueries = {
  compact: '(max-width: 700px)',
  touch: '(pointer: coarse)',
  reduced: '(prefers-reduced-motion: reduce)',
};

export function createResponsiveSky(host, { matchMedia, createEngine, onModeChange = () => {} }) {
  const media = Object.fromEntries(Object.entries(skyMediaQueries).map(([key, query]) => [key, matchMedia(query)]));
  let engine;
  let canvas;
  let paused = false;
  let disposed = false;
  let mode;
  const stop = () => {
    engine?.destroy();
    engine = undefined;
    canvas?.remove();
    canvas = undefined;
  };
  const update = () => {
    if (disposed) return;
    const nextMode = Object.values(media).some(query => query.matches) ? 'static' : 'animated';
    if (nextMode === mode) return;
    stop();
    mode = nextMode;
    if (mode === 'animated') {
      canvas = host.ownerDocument.createElement('canvas');
      host.append(canvas);
      engine = createEngine(canvas);
      engine.setPaused(paused);
    }
    onModeChange(mode);
  };
  Object.values(media).forEach(query => query.addEventListener('change', update));
  update();
  return {
    setPaused(value) { paused = value; engine?.setPaused(value); },
    destroy() {
      disposed = true;
      stop();
      Object.values(media).forEach(query => query.removeEventListener('change', update));
    },
  };
}
