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
                key={paymentMethod.id}
              />
            ))}
          </div>
        </div>
        <div className="footer-section">
          <h2>Terms & Conditions</h2>
          <Link to="/terms-and-conditions" className='footer-link'>Read here</Link>
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
