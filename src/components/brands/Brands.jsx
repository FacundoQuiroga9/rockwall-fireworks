import './Brands.css';
import brands from '../../data/brands.json';
const Brands = () => <section className="logos" aria-label="Firework brands we carry">
    <div className="shell">
      <div className="brands-heading">
        <p className="eyebrow">Big names. Bigger nights.</p>
        <span>The brands you know. The fireworks you love.</span>
      </div>
      <div className="logos-group" data-reveal>
        {brands.map(brand => <img className={brand.surface === 'night' ? 'brand-on-night' : undefined} data-motion="brand" src={brand.image} srcSet={`${brand.image.replace(/\.webp$/, '-160.webp')} 160w, ${brand.image} ${brand.width}w`} sizes="(max-width: 700px) 70px, 100px" alt={`${brand.name} logo`} width={brand.width} height={brand.height} loading="lazy" decoding="async" key={brand.id} />)}
      </div>
    </div>
  </section>;
export default Brands;
