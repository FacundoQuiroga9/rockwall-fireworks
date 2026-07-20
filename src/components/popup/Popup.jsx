import { useCallback, useEffect, useRef, useState } from 'react';
import { siteConfig } from '../../config/siteConfig';
import './Popup.css';

const SESSION_KEY = 'rockwall-promotion-dismissed';

const wasDismissedThisSession = () => {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === 'true';
  } catch {
    return false;
  }
};

const rememberDismissal = () => {
  try {
    window.sessionStorage.setItem(SESSION_KEY, 'true');
  } catch {
    // The dialog still closes when storage is unavailable.
  }
};

const Popup = () => {
  const [visible, setVisible] = useState(false);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previouslyFocusedElement = useRef(null);
  const promotionImageBase = siteConfig.promotion.image.replace(/\.webp$/, '');
  const promotionImageSrcSet = siteConfig.promotion.image.endsWith('.webp')
    ? `${promotionImageBase}-480.webp 480w, ${promotionImageBase}-640.webp 640w, ${siteConfig.promotion.image} 800w`
    : undefined;

  const closePopup = useCallback(() => {
    setVisible(false);
    rememberDismissal();
  }, []);

  useEffect(() => {
    if (wasDismissedThisSession()) {
      return undefined;
    }

    const showTimer = window.setTimeout(
      () => setVisible(true),
      siteConfig.promotion.delayToShow,
    );
    const closeTimer = window.setTimeout(
      closePopup,
      siteConfig.promotion.delayToShow +
        siteConfig.promotion.autoCloseAfter,
    );

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(closeTimer);
    };
  }, [closePopup]);

  useEffect(() => {
    if (!visible) return undefined;

    previouslyFocusedElement.current = document.activeElement;
    const backgroundElements = [
      document.querySelector('header'),
      document.querySelector('main'),
      document.querySelector('footer'),
    ]
      .filter(Boolean)
      .map((element) => ({ element, wasInert: element.inert }));

    document.body.classList.add('dialog-open');
    backgroundElements.forEach(({ element }) => {
      element.inert = true;
    });

    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    const handleDialogKeyboard = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closePopup();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = [
        ...dialogRef.current.querySelectorAll(
          'a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])',
        ),
      ];
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener('keydown', handleDialogKeyboard);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleDialogKeyboard);
      document.body.classList.remove('dialog-open');
      backgroundElements.forEach(({ element, wasInert }) => {
        element.inert = wasInert;
      });
      if (previouslyFocusedElement.current?.isConnected) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [closePopup, visible]);

  if (!visible) return null;

  return (
    <div
      className="popup-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closePopup();
      }}
    >
      <div
        ref={dialogRef}
        className="popup-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="promotion-title"
        aria-describedby="promotion-description"
      >
        <h2 id="promotion-title" className="sr-only">
          Rockwall Fireworks special offers
        </h2>
        <p id="promotion-description" className="sr-only">
          View the current 50th anniversary promotional offers.
        </p>
        <button
          ref={closeButtonRef}
          className="popup-close"
          type="button"
          aria-label="Close special offers"
          onClick={closePopup}
        >
          <span aria-hidden="true">×</span>
        </button>
        <img
          src={siteConfig.promotion.image}
          srcSet={promotionImageSrcSet}
          sizes="(max-width: 36rem) calc(100vw - 4rem), 24rem"
          alt={siteConfig.promotion.imageAlt}
          className="popup-img"
          width="800"
          height="1241"
          decoding="async"
        />
        <a
          href={siteConfig.promotion.offersUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-popup"
          onClick={closePopup}
        >
          See special offers
        </a>
      </div>
    </div>
  );
};

export default Popup;
