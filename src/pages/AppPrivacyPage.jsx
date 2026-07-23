import ContentPage, {
  ContentSection,
} from '../components/contentPage/ContentPage';
import { siteConfig } from '../config/siteConfig';
import { usePageMetadata } from '../hooks/usePageMetadata';

const AppPrivacyPage = () => {
  usePageMetadata(siteConfig.seo.appPrivacy);

  return (
    <main id="main-content" tabIndex="-1">
      <ContentPage
        description="This policy explains how the Rockwall Fireworks mobile application handles information in its current version."
        eyebrow="Rockwall Fireworks Mobile App"
        title="App Privacy"
      >
        <ContentSection title="Overview">
          <p>
            The Rockwall Fireworks mobile application (the “App”) is an
            informational app. Rockwall Fireworks does not collect personal
            information or usage data through the current version of the App.
          </p>
        </ContentSection>

        <ContentSection title="Information the App Collects">
          <p>
            The current version of the App does not send personal information,
            device identifiers, search activity, favorite selections, or app
            usage information to Rockwall Fireworks or to an analytics service.
          </p>
        </ContentSection>

        <ContentSection title="Information the App Does Not Collect">
          <p>The App does not collect or require:</p>
          <ul>
            <li>Your name, email address, phone number, or postal address</li>
            <li>Account credentials or profile information</li>
            <li>Precise location, contacts, photos, camera, or microphone data</li>
            <li>Advertising identifiers or cross-app activity</li>
            <li>Financial, payment, health, or biometric information</li>
          </ul>
        </ContentSection>

        <ContentSection title="Favorites and Local Storage">
          <p>
            When you save a favorite product, the App stores that product’s
            identifier locally on your device using the device’s app storage.
            Favorites are not transmitted to Rockwall Fireworks, are not
            associated with an account, and are not synchronized between
            devices.
          </p>
          <p>
            You can remove favorites in the App. You can also remove locally
            stored App data through your device settings or by uninstalling the
            App, subject to your device platform’s backup and restore settings.
          </p>
        </ContentSection>

        <ContentSection title="Accounts">
          <p>
            The App does not offer or require user accounts, sign-in, or
            registration. There is no user profile or cloud account associated
            with your use of the App.
          </p>
        </ContentSection>

        <ContentSection title="Tracking, Analytics, and Advertising">
          <p>
            The App does not include third-party analytics or advertising
            software. Rockwall Fireworks does not track you across apps or
            websites, display third-party advertising, or build advertising
            profiles from App activity.
          </p>
        </ContentSection>

        <ContentSection title="Sale or Sharing of Data">
          <p>
            Rockwall Fireworks does not sell, rent, or share personal
            information from the App. Because the current version does not
            collect personal information, Rockwall Fireworks has no App user
            data to sell.
          </p>
        </ContentSection>

        <ContentSection title="External Links">
          <p>
            The App can open external services, including maps, email and phone
            apps, social media, product videos, the Rockwall Fireworks website,
            and official safety resources. Once you leave the App, the external
            provider may process information such as your IP address or device
            information under its own privacy policy. Rockwall Fireworks does
            not control those third-party practices.
          </p>
        </ContentSection>

        <ContentSection title="Changes to This Policy">
          <p>
            If the App’s data practices change, this policy will be updated
            before or when the relevant feature becomes available. The “Last
            updated” date below will identify the latest version.
          </p>
        </ContentSection>

        <ContentSection title="Contact">
          <p>
            Questions about App privacy may be sent to{' '}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>. You
            may also call{' '}
            <a href={siteConfig.phone.href}>{siteConfig.phone.display}</a> or
            write to {siteConfig.address.display}.
          </p>
        </ContentSection>

        <p className="content-page__updated">Last updated: July 23, 2026</p>
      </ContentPage>
    </main>
  );
};

export default AppPrivacyPage;
