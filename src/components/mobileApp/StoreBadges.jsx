import { siteConfig } from '../../config/siteConfig';
import './StoreBadges.css';
const StoreBadges = () => <div className="store-badges">
    <div className="store-platform">
      <a className="store-badge" href={siteConfig.mobileApp.appStoreUrl} target="_blank" rel="noopener noreferrer" aria-label="Download on the App Store">
        <img src={siteConfig.mobileApp.appStoreBadge} alt="Download on the App Store" width="218" height="64" />
      </a>
      <span>Available now for iOS</span>
    </div>
    <div className="store-platform store-platform--soon">
      <div className="store-badge" aria-disabled="true" aria-label="Google Play for Android — Coming soon">
        <img src={siteConfig.mobileApp.googlePlayBadge} alt="Google Play" width="218" height="64" />
      </div>
      <span>Android · Coming soon</span>
    </div>
  </div>;
export default StoreBadges;
