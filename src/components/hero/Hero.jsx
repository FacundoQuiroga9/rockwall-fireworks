import MotionTitle from '../common/MotionTitle';
import { useState } from 'react';
import './Hero.css';
import { Link } from 'react-router-dom';
import NightSky from './NightSky';

// React 18 forwards newer native HTML attributes through their lowercase names.
const skylinePriority = { fetchpriority: 'high' };

const Hero = () => {
  const [skyPaused, setSkyPaused] = useState(false);
  const [skyAnimated, setSkyAnimated] = useState(false);

  return <section id="top" className="hero-container" aria-labelledby="hero-title">
    <NightSky paused={skyPaused} onModeChange={setSkyAnimated} />
    <div className="hero-city" aria-hidden="true">
      <img
        src="/images/hero/dallas-skyline-1440.webp"
        srcSet="/images/hero/dallas-skyline-800.webp 800w, /images/hero/dallas-skyline-1440.webp 1440w, /images/hero/dallas-skyline-2160.webp 2160w"
        sizes="(max-width: 700px) 760px, (max-width: 1000px) 125vw, 100vw"
        width="2160"
        height="723"
        alt=""
        decoding="async"
        {...skylinePriority}
      />
    </div>
    <div className="hero-content shell">
      <div className="hero-copy" data-reveal>
        <p className="eyebrow" data-motion="copy">Rockwall, Texas. Big celebrations.</p>
        <MotionTitle as="h1" id="hero-title" className="hero-title" lines={['LIGHT UP', <>THE <em>NIGHT.</em></>]} />
        <p className="hero-description" data-motion="copy">Your celebration starts at Rockwall Fireworks. Family-owned, proudly serving Rockwall, Texas since 1975.</p>
        <div className="hero-actions" data-motion="copy">
          <Link className="button" to="/products">Explore the fireworks</Link>
          <a className="text-link" href="#contact">Find our store</a>
        </div>
      </div>
      <div className="hero-seal">
        <span>FAMILY OWNED</span>
        <strong>EST. 1975</strong>
        <span className="hero-seal-location">SERVING<br />ROCKWALL</span>
      </div>
    </div>
    <div className="hero-bottom shell">
      <p><span className="orange-dot" /> Serving Rockwall since 1975</p>
      {skyAnimated && <button className="sky-control" type="button" aria-pressed={skyPaused} aria-label={skyPaused ? 'Resume sky animation' : 'Pause sky animation'} onClick={() => setSkyPaused(value => !value)}>
        <span aria-hidden="true">{skyPaused ? '▷' : 'Ⅱ'}</span>
        {skyPaused ? 'Resume sky' : 'Pause sky'}
      </button>}
    </div>
  </section>;
};

export default Hero;
