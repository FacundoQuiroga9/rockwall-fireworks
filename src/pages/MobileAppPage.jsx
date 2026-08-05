import { siteConfig } from '../config/siteConfig';
import { usePageMetadata } from '../hooks/usePageMetadata';
import './MobileAppPage.css';

const appBenefits = [
  {
    title: 'Browse the product catalog',
    description:
      'Explore the current Rockwall Fireworks catalog and product categories from your phone.',
  },
  {
    title: 'Save your favorite fireworks',
    description:
      'Keep a personal favorites list stored locally on your device, with no account required.',
  },
  {
    title: 'Seasonal countdown',
    description:
      'See the next configured seasonal opening and follow the countdown as the date approaches.',
  },
  {
    title: 'Store information',
    description:
      'Find the Rockwall Fireworks address, phone number, email, hours, directions, and social links.',
  },
  {
    title: 'Safety guidance',
    description:
      'Review clear reminders and links to official resources for responsible fireworks use.',
  },
  {
    title: 'Opening dates',
    description:
      'Keep seasonal dates and store availability information close at hand when planning a visit.',
  },
];

const preventUnavailableDownload = (event) => {
  event.preventDefault();
};

const MobileAppPage = () => {
  usePageMetadata(siteConfig.seo.mobileApp);

  return (
    <main className="mobile-app-page" id="main-content" tabIndex="-1">
      <section className="mobile-app-hero" aria-labelledby="mobile-app-title">
        <picture className="mobile-app-hero__background" aria-hidden="true">
          <source
            srcSet="/images/hero/fireworks-bg-768.webp 768w, /images/hero/fireworks-bg-1440.webp 1440w, /images/hero/fireworks-bg-1920.webp 1920w"
            sizes="100vw"
            type="image/webp"
          />
          <img
            alt=""
            decoding="async"
            height="1440"
            src="/images/hero/fireworks-bg-1440.webp"
            width="1440"
          />
        </picture>

        <div className="mobile-app-hero__content">
          <div className="mobile-app-hero__copy">
            <p className="mobile-app-eyebrow">The Rockwall Fireworks App</p>
            <h1 id="mobile-app-title">Rockwall Fireworks Mobile App</h1>
            <p className="mobile-app-hero__subtitle">
              Everything you need for the season, right in your pocket.
            </p>
          </div>

          <figure className="mobile-app-hero__mockup">
            <img
              alt="Rockwall Fireworks mobile app shown on a phone"
              decoding="async"
              height="1536"
              src={siteConfig.mobileApp.mockupImage}
              width="1024"
            />
          </figure>
        </div>
      </section>

      <section
        className="mobile-app-benefits"
        aria-labelledby="mobile-app-benefits-title"
      >
        <div className="mobile-app-section">
          <p className="mobile-app-eyebrow">Made for the season</p>
          <h2 id="mobile-app-benefits-title">Rockwall Fireworks in your pocket</h2>
          <p className="mobile-app-section__intro">
            Browse, plan, and find reliable store information in a focused
            mobile experience that matches the Rockwall Fireworks website.
          </p>

          <div className="mobile-app-benefits__grid">
            {appBenefits.map((benefit) => (
              <article className="mobile-app-benefit" key={benefit.title}>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="mobile-app-download"
        aria-labelledby="mobile-app-download-title"
      >
        <div className="mobile-app-section">
          <p className="mobile-app-eyebrow">Available on the App Store</p>
          <h2 id="mobile-app-download-title">Download the App</h2>
          <p className="mobile-app-section__intro">
            The Rockwall Fireworks app is available now on the App Store.
          </p>

          <div className="mobile-app-download__links">
            <a
              aria-label="Download on the App Store"
              className="mobile-app-download__link"
              href={siteConfig.mobileApp.appStoreUrl}
            >
              <span
                aria-hidden="true"
                className="mobile-app-download__badge mobile-app-download__badge--app-store"
              />
            </a>
            {/* TODO: Replace with official Google Play URL */}
            <a
              aria-label="Get it on Google Play (coming soon)"
              aria-disabled="true"
              className="mobile-app-download__link"
              href={siteConfig.mobileApp.googlePlayUrl}
              onClick={preventUnavailableDownload}
            >
              <span
                aria-hidden="true"
                className="mobile-app-download__badge mobile-app-download__badge--google-play"
              />
            </a>
          </div>
        </div>
      </section>

      <section
        className="mobile-app-rewards"
        aria-labelledby="mobile-app-rewards-title"
      >
        <div className="mobile-app-rewards__content">
          <p className="mobile-app-eyebrow">Future updates</p>
          <h2 id="mobile-app-rewards-title">More value in future versions</h2>
          <p>
            Future versions are planned to bring new features and benefits for
            frequent Rockwall Fireworks customers. Details will be shared when
            those updates are ready.
          </p>
        </div>
      </section>
    </main>
  );
};

export default MobileAppPage;
