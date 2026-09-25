import './Footer.css';
import { Link } from 'react-router-dom';
import { publicSeasonNames } from '../../config/seasonalConfig';
import { siteConfig } from '../../config/siteConfig';
const Footer = () => <footer className="footer-container">
    <div className="shell">
      <div className="footer-statement">
        <span>MAKE IT A NIGHT</span>
        <span>TO <em>REMEMBER.</em><span aria-hidden="true">✦</span></span>
      </div>
      <div className="footer-content">
        <div className="footer-brand">
          <Link to="/#top">
            <img src="/images/hero/rockwall-fireworks-logo-360.webp" alt="Rockwall Fireworks home" width="360" height="107" loading="lazy" decoding="async" />
          </Link>
          <p>Family-owned. Serving Rockwall, Texas.<br />Lighting up celebrations since 1975.</p>
        </div>
        <div className="footer-section">
          <h2>Find your spark</h2>
          <nav aria-label="Footer navigation">
            <Link to="/products">Products</Link>
            <Link to="/#about">Our Story</Link>
            <Link to="/#contact">Visit the Store</Link>
            <Link to="/mobile-app">Mobile App</Link>
          </nav>
        </div>
        <div className="footer-section">
          <h2>Good to know</h2>
          <nav aria-label="Legal and app support">
            <Link to="/app-support">App Support</Link>
            <Link to="/app-privacy">Privacy Policy</Link>
            <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
            <a href={siteConfig.promotion.offersUrl} target="_blank" rel="noopener noreferrer">Archived Coupons (2025)</a>
          </nav>
        </div>
        <div className="footer-section">
          <h2>Come celebrate</h2>
          <p>{siteConfig.address.streetAddress}<br />{siteConfig.address.addressLocality}, {siteConfig.address.addressRegion} {siteConfig.address.postalCode}</p>
          <a href={siteConfig.phone.href}>
            {siteConfig.phone.display}
          </a>
          <p className="footer-hours">{siteConfig.openHoursText} · {publicSeasonNames} only.</p>
          <p className="footer-hours">Other listed seasons: by appointment. <a href={siteConfig.phone.href}>Call to schedule your visit.</a></p>
          <div className="payments-icons">
            {siteConfig.paymentMethods.map(payment => <img src={payment.image} alt={payment.name} width={payment.width} height={payment.height} loading="lazy" decoding="async" key={payment.id} />)}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Rockwall Fireworks. All rights reserved.</p>
        <a href={siteConfig.developer.url} target="_blank" rel="noopener noreferrer">Made by {siteConfig.developer.name}</a>
        <Link to="/#top">Back to top ↑</Link>
      </div>
    </div>
  </footer>;
export default Footer;
