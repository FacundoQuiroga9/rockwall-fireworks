import brands from '../../data/brands.json';
const key = (name) => name.toLowerCase().replace(/fireworks|[^a-z0-9]/g, '');
export default function BrandMark({ brand }) {
  const logo = brand && brands.find((b) => key(b.name) === key(brand));
  return <span className="product-brand-mark">{logo ? <img src={logo.image.replace('.webp', '-160.webp')} alt={brand} width="78" height="34" loading="lazy" /> : <span>{brand || 'Brand not specified'}</span>}</span>;
}
