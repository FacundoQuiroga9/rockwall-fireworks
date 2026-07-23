import './Footer.css';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h2>Open Hours</h2>
          <p>
            {siteConfig.openHoursText}
          </p>
        </div>
        <div className="footer-section">
          <h2>Payment methods</h2>
          <div className="payments-icons">
            {siteConfig.paymentMethods.map((paymentMethod) => (
              <img
                src={paymentMethod.image}
                className="credit-card"
                alt={paymentMethod.name}
                width={paymentMethod.width}
                height={paymentMethod.height}
                loading="lazy"
                decoding="async"
                style={{
                  width: `${((1.5 * paymentMethod.width) / paymentMethod.height).toFixed(3)}rem`,
                }}
                key={paymentMethod.id}
              />
            ))}
          </div>
        </div>
        <div className="footer-section">
          <h2>Legal &amp; App</h2>
          <nav aria-label="Legal and app support" className="footer-legal-links">
            <Link to="/app-privacy" className="footer-link">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="footer-link">
              Terms &amp; Conditions
            </Link>
            <Link to="/app-support" className="footer-link">
              App Support
            </Link>
          </nav>
        </div>
        <div className="footer-section">
          <h2>Developed by</h2>
          <a
            href={siteConfig.developer.url}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            {siteConfig.developer.name}
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Rockwall Fireworks. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
