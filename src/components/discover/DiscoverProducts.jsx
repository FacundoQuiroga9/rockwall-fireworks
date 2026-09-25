import { Link } from 'react-router-dom';
import logos from '../../data/brands.json';
import products from '../../data/products.json';
const catalogBrands = new Set(products.map((p) => p.brand));
import MotionTitle from '../common/MotionTitle';
import ProductShowcase from '../hero/ProductShowcase';
import './DiscoverProducts.css';

export default function DiscoverProducts() {
  return <section id="featured-products" className="discover-products" aria-labelledby="discover-title">
    <div className="shell discover-composition" data-reveal>
      <div className="discover-copy">
        <p className="eyebrow" data-motion="copy">The brands. The big moments.</p>
        <MotionTitle as="h2" id="discover-title" lines={['PICK YOUR', <em key="wow">WOW FACTOR.</em>]} />
        <p className="discover-intro" data-motion="copy">From your first spark to the grand finale. Find your favorites from the brands that light up Rockwall.</p>
        <Link className="button discover-cta" to="/products" data-motion="copy">Explore all products <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="discover-stage"><span className="discover-orbit" aria-hidden="true" /><ProductShowcase /></div>
      <div id="brands" className="discover-brands">
        <div className="discover-brands-heading"><h3>Find your kind of fireworks</h3><span>Discover the lineup by brand</span></div>
        <ul className="discover-brand-grid" aria-label="Explore fireworks brands">
          {logos.map((brand) => <li key={brand.id} data-motion="brand"><Link to={catalogBrands.has(brand.name.replace(/ Fireworks$/, '')) ? `/products?brand=${encodeURIComponent(brand.name.replace(/ Fireworks$/, ''))}` : '/products'} aria-label={catalogBrands.has(brand.name.replace(/ Fireworks$/, '')) ? `Explore ${brand.name}` : `${brand.name}: explore all products`}>
            <img src={brand.image.replace('.webp', '-160.webp')} width={brand.width} height={brand.height} alt={brand.name} loading="lazy" decoding="async" />
          </Link></li>)}
        </ul>
      </div>
    </div>
  </section>;
}
