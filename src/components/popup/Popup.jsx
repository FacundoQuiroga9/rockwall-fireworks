import { useEffect, useState } from "react";
import './Popup.css';

const Popup = ({ delayToShow = 3000, autoCloseAfter = 0 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), delayToShow);
    let closeTimer;
    if (autoCloseAfter > 0) {
      closeTimer = setTimeout(() => setVisible(false), delayToShow + autoCloseAfter);
    }
    return () => {
      clearTimeout(showTimer);
      if (closeTimer) clearTimeout(closeTimer);
    };
  }, [delayToShow, autoCloseAfter]);

  if (!visible) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <button className="popup-close" onClick={() => setVisible(false)}>×</button>
        <img src="/poster.png" alt="50 Years" className="popup-img" />
        <a href="/rf coupons.pdf" target="_blank" rel="noopener noreferrer" className="btn-popup">
          SEE SPECIAL OFFERS
        </a>
      </div>
    </div>
  );
};

export default Popup;
