import MotionTitle from '../common/MotionTitle';
import './Contact.css';
import { siteConfig } from '../../config/siteConfig';
import { publicSeasonNames } from '../../config/seasonalConfig';
import Icon from '../common/Icon';
const Contact = () => <section id="contact" className="contact-container">
    <div className="shell contact-grid" data-reveal>
      <div className="contact-lead">
        <p className="eyebrow">Good times start here</p>
        <MotionTitle lines={['COME FOR', <>THE <em>BOOM.</em></>]} />
        <p>Your local stop for a sky full of memories. Proudly serving Rockwall, Texas from our store on State Highway 205.</p>
        <a className="button" href={siteConfig.address.mapsUrl} target="_blank" rel="noopener noreferrer"><Icon name="location" />Get directions</a>
        <div className="contact-signoff"><Icon name="location" /><p>Serving Rockwall, Texas<span>Family-owned since 1975</span></p></div>
      </div>
      <div className="contact-details" data-reveal-item>
        <div className="contact-item contact-address">
          <h3><Icon name="location" /> Make your way here</h3>
          <a href={siteConfig.address.mapsUrl} target="_blank" rel="noopener noreferrer">{siteConfig.address.streetAddress}<br />{siteConfig.address.addressLocality}, {siteConfig.address.addressRegion} {siteConfig.address.postalCode}</a>
        </div>
        <div className="contact-item contact-hours">
          <h3><span aria-hidden="true">◷</span> Public season hours</h3>
          <p>
            {siteConfig.openHoursText}
          </p>
          <p className="contact-service">{publicSeasonNames} only.</p>
          <a href="#seasons" className="contact-note">See the seasonal calendar</a>
        </div>
        <div className="contact-item contact-phone">
          <h3><Icon name="phone" /> Visits by appointment</h3>
          <a href={siteConfig.phone.href}>
            {siteConfig.phone.display}
          </a>
          <p className="contact-service">All other listed seasons: please call ahead to arrange your visit.</p>
        </div>
        <div className="contact-item contact-mail">
          <h3><Icon name="mail" /> Drop us a line</h3>
          <a className="contact-email" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
        </div>
        <div className="contact-item contact-social">
          <h3>Follow the excitement</h3>
          <div>
            {siteConfig.socialLinks.map(social => <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer">
              <Icon name={social.id} />
              {social.label}
            </a>)}
          </div>
        </div>
      </div>
    </div>
  </section>;
export default Contact;
