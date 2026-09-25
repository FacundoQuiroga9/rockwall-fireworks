import { useEffect, useRef, useState } from 'react';
import { createNightSky } from './createNightSky';
import { createResponsiveSky } from './createResponsiveSky';

const NightSky = ({ paused, onModeChange }) => {
  const hostRef = useRef(null);
  const skyRef = useRef(null);
  const [mode, setMode] = useState('static');
  useEffect(() => {
    const sky = createResponsiveSky(hostRef.current, {
      matchMedia: query => window.matchMedia(query),
      createEngine: createNightSky,
      onModeChange: nextMode => { setMode(nextMode); onModeChange(nextMode === 'animated'); },
    });
    skyRef.current = sky;
    return () => { sky.destroy(); skyRef.current = null; };
  }, [onModeChange]);
  useEffect(() => { skyRef.current?.setPaused(paused); }, [paused]);

  return <div className="hero-sky" data-sky-mode={mode} aria-hidden="true">
    {mode === 'static' && <picture className="hero-static-sky">
      <source media="(max-width: 700px)" srcSet="/images/hero/sky-static-mobile.svg" />
      <source media="(max-aspect-ratio: 1/1)" srcSet="/images/hero/sky-static-tablet.svg" />
      <img src="/images/hero/sky-static-wide.svg" width="1440" height="800" alt="" />
    </picture>}
    <div className="hero-canvas-host" ref={hostRef} />
  </div>;
};
export default NightSky;
