import './Hero.css';
import { siteConfig } from '../../config/siteConfig';

const Hero = () => {
  return (
    <section id="top" className="hero-container">
      <picture className="hero-background" aria-hidden="true">
        <source
          type="image/webp"
          srcSet="/images/hero/fireworks-bg-768.webp 768w, /images/hero/fireworks-bg-1440.webp 1440w, /images/hero/fireworks-bg-1920.webp 1920w"
          sizes="100vw"
        />
        <img
          src="/images/hero/fireworks-bg-1440.webp"
          alt=""
          width="1440"
          height="1440"
          decoding="async"
          fetchPriority="high"
        />
      </picture>
      <div className="hero-content">
        <div className="hero-left">
          <img
            src="/images/hero/product-showcase-800.webp"
            srcSet="/images/hero/product-showcase-480.webp 480w, /images/hero/product-showcase-640.webp 640w, /images/hero/product-showcase-800.webp 800w"
            sizes="(max-width: 36rem) calc(100vw - 3rem), (max-width: 62rem) 300px, 400px"
            alt="A selection of Rockwall Fireworks products"
            className="product-img"
            width="800"
            height="735"
            decoding="async"
            fetchPriority="low"
          />
        </div>
        <div className="hero-right">
          <h1 className="hero-title">
            <span className="sr-only">Celebrating 50 years of Rockwall Fireworks</span>
            <img
              src="/images/hero/50-years-phrase.png"
              alt=""
              className="phrase-img"
              width="581"
              height="264"
              decoding="async"
            />
          </h1>
          <p className="hero-description">Proudly serving North Texas since 1975 with family-friendly service, low prices, and 100% tariff free fireworks guaranteed!</p>
          <a
            className="btn btn-rockwall"
            href={siteConfig.promotion.offersUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            SEE SPECIAL OFFERS
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
