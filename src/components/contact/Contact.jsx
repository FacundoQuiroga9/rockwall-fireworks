import './Contact.css';
import { siteConfig } from '../../config/siteConfig';
import Icon from '../common/Icon';

const Contact = () => {
  return (
    <section id="contact" className="contact-container">
      <picture className="contact-background" aria-hidden="true">
        <source
          type="image/webp"
          srcSet="/images/sections/contact-768.webp 768w, /images/sections/contact-1366.webp 1366w"
          sizes="100vw"
        />
        <img
          src="/images/sections/contact-1366.webp"
          alt=""
          width="1366"
          height="768"
          loading="lazy"
          decoding="async"
        />
      </picture>

      <div className="contact-safe-area">
        <div className="contact-content">
          <h2 className="contact-title">CONTACT US!</h2>

          <div className="contact-details">
            <div className="contact-item contact-item--address">
              <h3 className="contact-subtitle">
                <Icon name="location" />
                ADDRESS
              </h3>
              <p className="contact-value">
                <a
                  className="contact-link"
                  href={siteConfig.address.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {siteConfig.address.display}
                </a>
              </p>
            </div>

            <div className="contact-item">
              <h3 className="contact-subtitle">
                <Icon name="phone" />
                PHONE
              </h3>
              <p className="contact-value">
                <a className="contact-link" href={siteConfig.phone.href}>
                  {siteConfig.phone.display}
                </a>
              </p>
            </div>

            <div className="contact-item contact-item--email">
              <h3 className="contact-subtitle">
                <Icon name="mail" />
                EMAIL
              </h3>
              <p className="contact-value">
                <a
                  className="contact-link"
                  href={`mailto:${siteConfig.email}`}
                >
                  {siteConfig.email}
                </a>
              </p>
            </div>

            <div className="contact-item contact-item--social">
              <h3 className="contact-subtitle">
                <Icon name="social" />
                SOCIAL MEDIA
              </h3>
              <div className="social-media-links">
                {siteConfig.socialLinks.map((socialLink) => (
                  <a
                    href={socialLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Rockwall Fireworks on ${socialLink.label}`}
                    key={socialLink.id}
                  >
                    <Icon name={socialLink.id} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
