import './About.css'


const About = ()=>{

  return(
    <section id='about' className="about-container">
      <picture className="about-background" aria-hidden="true">
        <source
          type="image/webp"
          srcSet="/images/sections/store-960.webp 960w, /images/sections/store-1600.webp 1600w"
          sizes="100vw"
        />
        <img
          src="/images/sections/store-1600.webp"
          alt=""
          width="1600"
          height="900"
          loading="lazy"
          decoding="async"
        />
      </picture>
      <div className="about-content">
        <h2>Who We Are</h2>
        <p>At Rockwall Fireworks, we specialize in bringing joy and excitement to your celebrations with our wide selection of premium fireworks. From sparklers to large displays, our products are designed to make every moment memorable, ensuring your events shine bright with safety, quality, and unforgettable experiences.</p>
      </div>
    </section>
  )
}

export default About
