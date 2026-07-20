import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (hash) {
        const target = document.querySelector(hash);
        target?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
          block: 'start',
        });
        const focusTarget = target?.matches('main')
          ? target
          : target?.querySelector('h1, h2');
        if (focusTarget) {
          if (!focusTarget.hasAttribute('tabindex')) {
            focusTarget.setAttribute('tabindex', '-1');
          }
          focusTarget.focus({ preventScroll: true });
        }
        return;
      }

      window.scrollTo({ top: 0, behavior: 'auto' });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
