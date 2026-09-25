import { Link } from 'react-router-dom';
import ContentPage, {
  ContentSection,
} from '../components/contentPage/ContentPage';
import { siteConfig } from '../config/siteConfig';
import { usePageMetadata } from '../hooks/usePageMetadata';

const AppSupportPage = () => {
  usePageMetadata(siteConfig.seo.appSupport);

  return (
    <main id="main-content" tabIndex="-1">
      <ContentPage
        description="Find help with the Rockwall Fireworks informational mobile app, including Favorites, store details, and ways to report an issue."
        eyebrow="Official App Support"
        title="Rockwall Fireworks App Support"
      >
        <ContentSection title="About the App">
          <p>
            The Rockwall Fireworks mobile app puts the current product catalog,
            favorite products, seasonal date information, store details, and
            safety guidance in one convenient place. No account is required.
          </p>
        </ContentSection>

        <ContentSection title="Contact Rockwall Fireworks">
          <dl className="content-page__contact-list">
            <div>
              <dt>Email</dt>
              <dd>
                <a
                  href={`mailto:${siteConfig.email}?subject=Rockwall%20Fireworks%20App%20Support`}
                >
                  {siteConfig.email}
                </a>
              </dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>
                <a href={siteConfig.phone.href}>{siteConfig.phone.display}</a>
              </dd>
            </div>
            <div>
              <dt>Store address</dt>
              <dd>
                <a
                  href={siteConfig.address.mapsUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {siteConfig.address.display}
                </a>
              </dd>
            </div>
          </dl>
          <p className="content-page__callout">
            For technical issues, include your device type, operating system,
            app version, and a short description of what happened. Please do
            not include passwords or other sensitive information.
          </p>
        </ContentSection>

        <ContentSection title="Frequently Asked Questions">
          <dl className="content-page__faq-list">
            <div>
              <dt>How do Favorites work?</dt>
              <dd>
                Tap the heart on a product to save it. Favorite product
                identifiers stay locally on your device and are available
                without an account. Tap the heart again to remove a favorite.
              </dd>
            </div>
            <div>
              <dt>Do I need an account?</dt>
              <dd>
                No. The App does not use accounts, registration, or sign-in.
              </dd>
            </div>
            <div>
              <dt>Can I buy fireworks through the App?</dt>
              <dd>
                No. The App is informational. Visit the Rockwall Fireworks store
                at {siteConfig.address.display} for current product availability
                and assistance.
              </dd>
            </div>
            <div>
              <dt>How do I report an issue?</dt>
              <dd>
                Email{' '}
                <a
                  href={`mailto:${siteConfig.email}?subject=Rockwall%20Fireworks%20App%20Issue`}
                >
                  {siteConfig.email}
                </a>{' '}
                with the device, app version, steps that led to the issue, and
                any non-sensitive details that help reproduce it.
              </dd>
            </div>
            <div>
              <dt>How do I contact the store?</dt>
              <dd>
                Call{' '}
                <a href={siteConfig.phone.href}>{siteConfig.phone.display}</a>,
                email{' '}
                <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>,
                or visit {siteConfig.address.display}.
              </dd>
            </div>
            <div>
              <dt>Where can I download the latest version?</dt>
              <dd>
                Once the App is publicly available, install updates through its
                official App Store or Google Play listing. Official download
                links will be published after release.
              </dd>
            </div>
          </dl>
        </ContentSection>

        <ContentSection title="Policies">
          <nav
            aria-label="Rockwall Fireworks app policies"
            className="content-page__legal-links"
          >
            <Link to="/app-privacy">Privacy Policy</Link>
            <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
          </nav>
        </ContentSection>
      </ContentPage>
    </main>
  );
};

export default AppSupportPage;
