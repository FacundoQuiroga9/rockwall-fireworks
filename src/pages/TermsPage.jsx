import TermsAndConditions from '../components/termsAndConditions/TermsAndConditions';
import { siteConfig } from '../config/siteConfig';
import { usePageMetadata } from '../hooks/usePageMetadata';

const TermsPage = () => {
  usePageMetadata(siteConfig.seo.terms);

  return (
    <main id="main-content" tabIndex="-1">
      <TermsAndConditions />
    </main>
  );
};

export default TermsPage;
