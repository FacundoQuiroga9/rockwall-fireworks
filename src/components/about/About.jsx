import MotionTitle from '../common/MotionTitle';
import './About.css';
const About = () => <section id="about" className="about-container">
    <div className="about-grid shell" data-reveal>
      <div className="about-photo" data-motion="photo">
        <img src="/images/sections/store-1600.webp" srcSet="/images/sections/store-960.webp 960w, /images/sections/store-1600.webp 1600w" sizes="(max-width: 700px) 90vw, 50vw" alt="Rockwall Fireworks storefront on State Highway 205, serving Rockwall, Texas" width="1600" height="900" loading="lazy" decoding="async" />
        <div className="about-photo-caption">
          <span>SERVING ROCKWALL, TEXAS</span>
          <strong>SINCE 1975</strong>
        </div>
      </div>
      <div className="about-content">
        <p className="eyebrow">Our story</p>
        <MotionTitle lines={['A FAMILY', 'TRADITION.', <em key="accent">YOURS, TOO.</em>]} />
        <p>Some traditions are meant to light up the sky. Family-owned since 1975, Rockwall Fireworks has been helping Rockwall, Texas celebrate the moments that bring us together.</p>
        <p>From sparklers to large displays, our wide selection of premium fireworks brings joy and excitement to every celebration. Come for the fireworks. Count on family-friendly service, low prices, quality, and a focus on safety.</p>
        <a href="#contact" className="text-link">Come say hello</a>
      </div>
    </div>
  </section>;
export default About;
