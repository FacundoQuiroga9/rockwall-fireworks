import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { siteConfig } from '../../config/siteConfig';
import './Popup.css';

const Popup = ({ onClose }) => {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previouslyFocusedElement = useRef(null);
  const promotionImageBase = siteConfig.promotion.image.replace(/\.webp$/, '');
  const promotionImageSrcSet = `${promotionImageBase}-480.webp 480w, ${promotionImageBase}-640.webp 640w, ${siteConfig.promotion.image} 800w`;
  const closeCallback = useRef(onClose);
  closeCallback.current = onClose;
  const closePopup = useCallback(() => closeCallback.current(), []);

  useEffect(() => {

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
  }, [closePopup]);

  return createPortal(
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
        <h2 id="promotion-title">
          A little extra spark.
        </h2>
        <p id="promotion-description">
          Archived 50th anniversary flyer. Priced offers expired July 4, 2025. Contact the store for current offers.
        </p>
        <button
          ref={closeButtonRef}
          className="popup-close"
          type="button"
          aria-label="Close archived flyer"
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
          className="button btn-popup"
          onClick={closePopup}
        >
          Open archived PDF (2025)
        </a>
      </div>
    </div>,
    document.body,
  );
};

export default Popup;
