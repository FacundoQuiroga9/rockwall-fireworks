import About from '../components/about/About';
import Brands from '../components/brands/Brands';
import Contact from '../components/contact/Contact';
import Countdown from '../components/countdown/Countdown';
import Hero from '../components/hero/Hero';
import Popup from '../components/popup/Popup';
import ProductCarousel from '../components/productCarousel/ProductCarousel';
import { siteConfig } from '../config/siteConfig';
import { usePageMetadata } from '../hooks/usePageMetadata';

const HomePage = () => {
  usePageMetadata(siteConfig.seo.home);

  return (
    <>
      <Popup />
      <main id="main-content" tabIndex="-1">
        <Hero />
        <Brands />
        <ProductCarousel />
        <About />
        <Countdown />
        <Contact />
      </main>
    </>
  );
};

export default HomePage;
