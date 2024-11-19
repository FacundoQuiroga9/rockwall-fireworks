import './Footer.css';
import amex from '../../images/amex.png'
import visa from '../../images/visa.png'
import mastercard from '../../images/mastercard.png'
import { Link } from 'react-router-dom';


const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Open Hours</h4>
          <p>
            8am -12am
          </p>
        </div>
        <div className="footer-section">
          <h4>Payments methods</h4>
          <div className="payments-icons">
           <img src={amex} className='credit-card' alt="" />
           <img src={visa} className='credit-card' alt="" />
           <img src={mastercard} className='credit-card' alt="" />
          </div>
        </div>
        <div className="footer-section">
          <h4>Terms & Conditions</h4>
          <Link to="/terms-and-conditions" className='footer-link'>Read here</Link>
        </div>
        <div className="footer-section">
          <h4>Developed by</h4>
          <a href='https://bondicode.com/' target='_blanck' className='footer-link'>Bondi Code</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Rockwall Fireworks. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
