import { Link } from 'react-router-dom';
import { siteConfig } from '../config/siteConfig';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { useReveal } from '../hooks/useReveal';
import StoreBadges from '../components/mobileApp/StoreBadges';
import Burst from '../components/common/Burst';
import './MobileAppPage.css';
const benefits = [{
  number: '01',
  title: 'Find your wow factor.',
  label: 'The catalog',
  description: 'Explore the Rockwall Fireworks catalog and product categories. Get to know the fireworks before you head to the store.',
  symbol: '✦'
}, {
  number: '02',
  title: 'Keep the good ones close.',
  label: 'Your favorites',
  description: 'Save your favorite fireworks in a personal list, stored right on your device. No account required.',
  symbol: '♡'
}, {
  number: '03',
  title: 'Feel the anticipation.',
  label: 'Seasonal countdown',
  description: 'Keep track of seasonal dates as you plan your next celebration. Confirm public opening or a visit by appointment in our store calendar.',
  symbol: '◷'
}];
const MobileAppPage = () => {
  usePageMetadata(siteConfig.seo.mobileApp);
  useReveal();
  return <main className="mobile-app-page" id="main-content" tabIndex="-1">
    <section className="mobile-app-hero" aria-labelledby="mobile-app-title">
      <div className="mobile-app-hero__content shell">
        <div className="mobile-app-hero__copy">
          <Link to="/" className="app-back hero-enter">← Back to the fireworks</Link>
          <p className="eyebrow hero-enter" style={{
            '--delay': '80ms'
          }}>The official Rockwall Fireworks app</p>
          <h1 id="mobile-app-title" className="hero-enter" style={{
            '--delay': '160ms'
          }}>CARRY THE<br /><span>EXCITEMENT.</span></h1>
          <p className="mobile-app-hero__subtitle hero-enter" style={{
            '--delay': '240ms'
          }}>Your next big night starts here. Explore the fireworks, save your favorites, and get ready for the season—all from your phone.</p>
          <div className="hero-enter" style={{
            '--delay': '320ms'
          }}>
            <StoreBadges />
          </div>
          <a href="#app-features" className="app-explore hero-enter" style={{
            '--delay': '400ms'
          }}>A little closer to the celebration</a>
        </div>
        <div className="mobile-app-hero__visual hero-enter" style={{
          '--delay': '240ms'
        }}>
          <div className="phone-orbit" aria-hidden="true" />
          <Burst className="hero-spark" />
          <span className="phone-caption phone-caption--top"><span aria-hidden="true">♡</span> Your favorites. Your lineup.</span>
          <img className="mobile-app-hero__mockup" src={siteConfig.mobileApp.mockupImage} srcSet="/images/mobile/rockwall-fireworks-app-mockup-480.webp 480w, /images/mobile/rockwall-fireworks-app-mockup-800.webp 800w" sizes="(max-width: 700px) 330px, 440px" alt="Rockwall Fireworks app shown on a phone, displaying the seasonal countdown and featured products" width="1024" height="1536" decoding="async" />
          <span className="phone-caption phone-caption--bottom"><span aria-hidden="true">✦</span> A little spark. Everywhere.</span>
        </div>
      </div>
      <div className="app-ribbon">
        <span>EXPLORE THE CATALOG</span>
        <i aria-hidden="true">✦</i>
        <span>SAVE YOUR FAVORITES</span>
        <i aria-hidden="true">✦</i>
        <span>COUNT DOWN TO THE SEASON</span>
      </div>
    </section>
    <section id="app-features" className="mobile-app-benefits shell">
      <div className="app-section-heading" data-reveal>
        <div>
          <p className="eyebrow">From inspiration to celebration</p>
          <h2 className="display-title">MORE SPARK.<br />LESS GUESSWORK.</h2>
        </div>
        <p className="section-intro">A simple way to plan your visit and discover what makes your kind of celebration.</p>
      </div>
      <div className="app-benefit-list" data-reveal>
        {benefits.map(benefit => <article className="app-benefit" key={benefit.number} data-reveal-item>
          <div className="app-benefit-top">
            <span>{benefit.number} / {benefit.label}</span>
            <span aria-hidden="true">
              {benefit.symbol}
            </span>
          </div>
          <h3>
            {benefit.title}
          </h3>
          <p>
            {benefit.description}
          </p>
        </article>)}
      </div>
    </section>
    <section className="app-visit">
      <div className="shell app-visit-grid" data-reveal>
        <div className="app-visit-photo" data-reveal-item>
          <img src="/images/sections/store-960.webp" alt="Rockwall Fireworks store serving Rockwall, Texas" width="960" height="540" loading="lazy" decoding="async" />
          <span>SERVING ROCKWALL, TEXAS.</span>
        </div>
        <div className="app-visit-copy" data-reveal-item>
          <p className="eyebrow">A better prepared visit</p>
          <h2 className="display-title">READY WHEN<br />YOU ARE.</h2>
          <div className="app-visit-detail">
            <span>04</span>
            <div>
              <h3>Find your way here</h3>
              <p>Address, hours, phone, email, directions, and social links. Your store essentials, together.</p>
            </div>
          </div>
          <div className="app-visit-detail">
            <span>05</span>
            <div>
              <h3>Plan for the season</h3>
              <p>Keep seasonal dates close at hand. Check our store calendar for public seasons and call ahead for appointment visits.</p>
            </div>
          </div>
          <div className="app-visit-detail">
            <span>06</span>
            <div>
              <h3>Celebrate responsibly</h3>
              <p>Review safety reminders and links to official resources for responsible fireworks use.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section id="download" className="mobile-app-download">
      <div className="shell" data-reveal>
        <Burst />
        <p className="eyebrow">Take the celebration with you</p>
        <h2 className="display-title">YOUR NEXT BIG NIGHT<br />IS CALLING.</h2>
        <p>Download the Rockwall Fireworks app for iOS.<br />We’ll bring the spark. You bring the excitement.</p>
        <StoreBadges />
        <div className="app-help">Need a hand? <Link to="/app-support">App support</Link><Link to="/app-privacy">Privacy policy</Link></div>
      </div>
    </section>
  </main>;
};
export default MobileAppPage;
