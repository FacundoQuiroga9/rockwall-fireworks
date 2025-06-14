import './Hero.css';

const Hero = () => {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <div className="hero-left">
          <img src="/fireworks-sample.png" alt="Product" className="product-img" />
        </div>
        <div className="hero-right">
          <img src="/50-years-phrase.png" alt="Crazy Phrase" className="phrase-img" />
          <p className="hero-description">Proudly serving North Texas since 1975 with family-friendly service, low prices, and 100% tariff free fireworks guaranteed!</p>
          <a className='btn btn-rockwall'  href='/rf coupons.pdf' target='_blanck'>SEE SPECIAL OFFERS</a>
        </div>
      </div>
    </div>
  );
}

export default Hero;
