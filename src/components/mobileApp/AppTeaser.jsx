import MotionTitle from '../common/MotionTitle';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig';
import StoreBadges from './StoreBadges';
import './AppTeaser.css';
const AppTeaser = () => <section className="app-teaser" aria-labelledby="app-teaser-title">
    <div className="shell app-teaser-grid" data-reveal>
      <div className="app-teaser-visual" data-reveal-item>
        <span className="app-teaser-word" aria-hidden="true">LET’S<br />GLOW.</span>
        <img src={siteConfig.mobileApp.mockupImage} srcSet="/images/mobile/rockwall-fireworks-app-mockup-480.webp 480w, /images/mobile/rockwall-fireworks-app-mockup-800.webp 800w" sizes="(max-width: 700px) 330px, 440px" alt="The Rockwall Fireworks app catalog and seasonal countdown on a phone" width="1024" height="1536" loading="lazy" decoding="async" />
        <span className="app-teaser-tag">YOUR NEXT BIG NIGHT, ON HAND.</span>
      </div>
      <div className="app-teaser-copy">
        <p className="eyebrow">Meet the Rockwall Fireworks app</p>
        <MotionTitle id="app-teaser-title" lines={['BIG NIGHTS.', 'POCKET SIZE.']} />
        <p>Find your favorites before you visit. Browse the catalog, explore seasonal dates, and keep the store details close at hand.</p>
        <Link className="text-link" to="/mobile-app">Discover the app</Link>
        <StoreBadges />
      </div>
    </div>
  </section>;
export default AppTeaser;
