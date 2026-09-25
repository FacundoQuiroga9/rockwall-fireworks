import MotionTitle from '../common/MotionTitle';
import { useState } from 'react';
import { siteConfig } from '../../config/siteConfig';
import Popup from '../popup/Popup';
import Burst from '../common/Burst';
import './Promotion.css';
const Promotion = () => {
  const [open, setOpen] = useState(false);
  return <section id="offers" className="promotion-section">
    <div className="shell promotion-grid" data-reveal>
      <div className="promotion-graphic" data-motion="graphic" aria-hidden="true">
        <Burst />
        <span>MORE<br />REASONS TO<br /><em>CELEBRATE.</em></span>
      </div>
      <div className="promotion-copy">
        <p className="eyebrow">A little extra excitement</p>
        <MotionTitle lines={['LET THE GOOD', 'TIMES GLOW.']} />
        <p>Plan your next visit with My List. Our 50th anniversary flyer is available as an archive; its priced offers expired July 4, 2025.</p>
        <div className="promotion-actions">
          <button type="button" className="button" onClick={() => setOpen(true)}>View archived flyer</button>
          <a className="text-link" href={siteConfig.promotion.offersUrl} target="_blank" rel="noopener noreferrer">Open archived PDF (2025)</a>
        </div>
        <p className="promotion-note">Ask the store about current promotions. Archived coupons are not applied to My List.</p>
      </div>
    </div>
    {open && <Popup onClose={() => setOpen(false)} />}
  </section>;
};
export default Promotion;
