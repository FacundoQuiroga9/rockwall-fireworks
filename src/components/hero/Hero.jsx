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
          <button className="btn btn-rockwall">CONTACT US</button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
