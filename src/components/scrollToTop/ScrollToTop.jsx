import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash, key, search } = useLocation();
  const navigate = useNavigate();
  const previousLocation = useRef(null);

  // Give native in-page links the same repeat-click and focus behavior as navbar
  // Links. CSS scroll-margin is the ONLY header compensation.
  useEffect(() => {
    const onAnchorClick = event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest('a[href]');
      if (!link || link.target || link.hasAttribute('download')) return;
      const url = new URL(link.href, window.location.href);
      if (!url.hash || url.origin !== window.location.origin || url.pathname !== window.location.pathname || url.search !== window.location.search) return;
      event.preventDefault();
      navigate(`${url.pathname}${url.search}${url.hash}`);
    };
    document.addEventListener('click', onAnchorClick);
    return () => document.removeEventListener('click', onAnchorClick);
  }, [navigate]);

  useEffect(() => {
    const previous = previousLocation.current;
    previousLocation.current = { pathname, hash, search };
    // Search filters are URL state, not a route transition: retain scroll and input focus.
    if (previous?.pathname === pathname && previous.hash === hash && previous.search !== search) return;
    let frame;
    let observer;
    let disposed = false;
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
    const position = () => {
      if (disposed) return;
      const target = id ? document.getElementById(id) : document.querySelector('main:not(.route-loading)');
      if (!target) return false;
      observer?.disconnect();
      if (id) target.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start',
      });
      else window.scrollTo({ top: 0, behavior: 'instant' });
      const focusTarget = target.matches('main') ? target : target.querySelector('h1, h2');
      if (focusTarget) {
        if (!focusTarget.hasAttribute('tabindex')) focusTarget.setAttribute('tabindex', '-1');
        focusTarget.focus({ preventScroll: true });
      }
      return true;
    };
    // Wait for the menu's inert/body-scroll cleanup, and for lazily mounted routes.
    frame = window.requestAnimationFrame(() => {
      frame = window.requestAnimationFrame(() => {
        if (!position()) {
          observer = new MutationObserver(() => { if (!disposed) position(); });
          observer.observe(document.body, { childList: true, subtree: true });
        }
      });
    });
    return () => { disposed = true; window.cancelAnimationFrame(frame); observer?.disconnect(); };
  }, [pathname, hash, key, search]);
  return null;
};
export default ScrollToTop;
