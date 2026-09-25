import { Navigate, useLocation } from 'react-router-dom';
import About from '../components/about/About';
import DiscoverProducts from '../components/discover/DiscoverProducts';
import Contact from '../components/contact/Contact';
import Countdown from '../components/countdown/Countdown';
import Hero from '../components/hero/Hero';
import Promotion from '../components/promotion/Promotion';
import AppTeaser from '../components/mobileApp/AppTeaser';
import { useReveal } from '../hooks/useReveal';
import { siteConfig } from '../config/siteConfig';
import { usePageMetadata } from '../hooks/usePageMetadata';

const HomePage = () => {
  usePageMetadata(siteConfig.seo.home);
  useReveal();
  const location = useLocation();
  if (location.hash === '#catalog') return <Navigate to='/products' replace />;

  return (
    <>
      <main id="main-content" tabIndex="-1">
        <Hero />
        <DiscoverProducts />
        <About />
        <Countdown />
        <Promotion />
        <AppTeaser />
        <Contact />
      </main>
    </>
  );
};

export default HomePage;
