import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const menuButtonRef = useRef(null);
  const navigationRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const desktopMedia = window.matchMedia('(min-width: 53.76rem)');
    const closeAtDesktop = ({ matches }) => {
      if (matches) setMenuOpen(false);
    };

    desktopMedia.addEventListener('change', closeAtDesktop);

    return () => {
      desktopMedia.removeEventListener('change', closeAtDesktop);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    const backgroundElements = [
      document.querySelector('main'),
      document.querySelector('footer'),
    ].filter(Boolean);
    backgroundElements.forEach((element) => {
      element.inert = menuOpen;
    });

    if (!menuOpen) {
      return () => {
        document.body.classList.remove('menu-open');
        backgroundElements.forEach((element) => {
          element.inert = false;
        });
      };
    }

    const navigation = navigationRef.current;
    const firstNavigationLink = navigation?.querySelector('a');
    const focusFrame = window.requestAnimationFrame(() => {
      firstNavigationLink?.focus();
    });

    const handleMenuKeyboard = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = [
        ...document.querySelectorAll(
          '.sticky-nav a[href], .sticky-nav button:not(:disabled)',
        ),
      ].filter((element) => element.offsetParent !== null);
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

    document.addEventListener('keydown', handleMenuKeyboard);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleMenuKeyboard);
      document.body.classList.remove('menu-open');
      backgroundElements.forEach((element) => {
        element.inert = false;
      });
    };
  }, [menuOpen]);

  return (
    <header className="sticky-nav">
      <div className="top-bar">
        <p>
          <span aria-hidden="true">⊘</span>
          {siteConfig.announcement}
          <span aria-hidden="true">⊘</span>
        </p>
      </div>
      <nav className="main-nav" aria-label="Primary navigation">
        <Link className="navbar-brand" to="/#top" onClick={() => setMenuOpen(false)}>
          <img
            src="/images/hero/rockwall-fireworks-logo.webp"
            srcSet="/images/hero/rockwall-fireworks-logo-360.webp 360w, /images/hero/rockwall-fireworks-logo.webp 720w"
            sizes="(max-width: 53.75rem) 48vw, 17.5rem"
            alt="Rockwall Fireworks"
            className="navbar-logo"
            width="720"
            height="214"
          />
        </Link>
        <div
          className={`header-nav ${menuOpen ? 'active' : ''}`}
          id="primary-navigation"
          ref={navigationRef}
        >
          <ul className="navbar-nav">
            {siteConfig.navigation.map((item) => (
              <li className="nav-item" key={item.sectionId}>
                <Link
                  className="nav-link"
                  to={`/#${item.sectionId}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/mobile-app"
                onClick={() => setMenuOpen(false)}
              >
                Mobile App
              </NavLink>
            </li>
          </ul>
        </div>
        <button
          ref={menuButtonRef}
          className="navbar-button"
          type="button"
          aria-label={`${menuOpen ? 'Close' : 'Open'} navigation menu`}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((currentValue) => !currentValue)}
        >
          <span className={`top-line-${menuOpen ? 'clicked' : 'unclicked'}`} />
          <span className={`middle-line-${menuOpen ? 'clicked' : 'unclicked'}`} />
          <span className={`bottom-line-${menuOpen ? 'clicked' : 'unclicked'}`} />
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
