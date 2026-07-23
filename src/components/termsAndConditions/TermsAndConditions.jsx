import { siteConfig } from '../../config/siteConfig';
import ContentPage, {
  ContentSection,
} from '../contentPage/ContentPage';

const TermsAndConditions = () => {
  return (
    <ContentPage
      description="These Terms govern your use of the Rockwall Fireworks mobile application and its informational content."
      eyebrow="Rockwall Fireworks Mobile App"
      title="Terms & Conditions"
    >
      <ContentSection title="1. Acceptance of Terms">
        <p>
          By downloading, accessing, or using the Rockwall Fireworks mobile
          application (the “App”), you agree to these Terms &amp; Conditions.
          If you do not agree, please do not use the App.
        </p>
      </ContentSection>

      <ContentSection title="2. Informational Use">
        <p>
          The App is provided for general informational purposes. It may
          present the Rockwall Fireworks product catalog, seasonal opening
          information, store details, favorites, and safety guidance. You may
          use this information only for lawful, personal, and non-commercial
          purposes.
        </p>
      </ContentSection>

      <ContentSection title="3. Product Information Disclaimer">
        <p>
          Product names, images, descriptions, availability, and other catalog
          details may change by season and may contain inadvertent errors.
          Packaging and manufacturer instructions are the controlling source
          for product-specific information. Contact or visit Rockwall
          Fireworks to confirm current information.
        </p>
      </ContentSection>

      <ContentSection title="4. Safety">
        <p>
          Fireworks can cause serious injury, fire, or property damage when
          handled incorrectly. Always follow product labels, manufacturer
          instructions, age restrictions, burn bans, and all applicable laws.
          Use responsible adult supervision and keep water readily available.
          Safety information in the App is general guidance and does not
          replace official instructions, emergency services, or professional
          advice.
        </p>
      </ContentSection>

      <ContentSection title="5. Intellectual Property">
        <p>
          The App and its original text, branding, graphics, layout, and other
          content are owned by Rockwall Fireworks or used with permission.
          Product names, logos, and marks may belong to their respective
          owners. You may not copy, distribute, modify, or exploit App content
          without prior written permission, except as allowed by law.
        </p>
      </ContentSection>

      <ContentSection title="6. External Links">
        <p>
          The App may open third-party resources such as maps, social media,
          product videos, and official safety information. Rockwall Fireworks
          does not control those services and is not responsible for their
          content, availability, security, or privacy practices. Your use of a
          third-party service is subject to that provider’s terms.
        </p>
      </ContentSection>

      <ContentSection title="7. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, the App and its content are
          provided “as is” and “as available,” without warranties of any kind.
          Rockwall Fireworks is not liable for losses or damages arising from
          reliance on App content, inability to use the App, use of external
          services, or improper use of fireworks. Nothing in these Terms
          excludes liability that cannot legally be excluded.
        </p>
      </ContentSection>

      <ContentSection title="8. Changes to These Terms">
        <p>
          We may update these Terms as the App or applicable requirements
          change. The revised version will be posted at this URL with a new
          “Last updated” date. Continued use of the App after an update means
          you accept the revised Terms.
        </p>
      </ContentSection>

      <ContentSection title="9. Contact Information">
        <p>
          Questions about these Terms may be directed to Rockwall Fireworks:
        </p>
        <dl className="content-page__contact-list">
          <div>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>
              <a href={siteConfig.phone.href}>{siteConfig.phone.display}</a>
            </dd>
          </div>
          <div>
            <dt>Address</dt>
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
      </ContentSection>

      <p className="content-page__updated">Last updated: July 23, 2026</p>
    </ContentPage>
  );
};

export default TermsAndConditions;
