import './Hero.css';

const Hero = () => {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <div className="hero-left">
          <img src="/fireworks-sample.png" alt="Product" className="product-img" />
        </div>
        <div className="hero-right">
          <img src="/crazy-phrase.png" alt="Crazy Phrase" className="phrase-img" />
          <p className="hero-description">Your favorite fireworks are here</p>
          <a className='btn btn-rockwall' href="tel:+12144713434">CONTACT US</a>
        </div>
      </div>
    </div>
  );
}

export default Hero;
