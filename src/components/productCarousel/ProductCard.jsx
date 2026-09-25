import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCatalogFavorites } from '../../hooks/useCatalogFavorites';
import AddToList from '../myList/AddToList';
import BrandMark from './BrandMark';
import BogoBadge from './BogoBadge';
import './ProductCard.css';

const ProductCard = ({ product, detailed = false }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const { ids, toggle, error } = useCatalogFavorites();
  const favorite = ids.includes(product.id);
  const path = `/products/${product.slug || product.id}`;
  const widths = product.imageWidths || [320, 480, 640];
  const sources = product.image?.endsWith('.webp') ? [...new Map([[widths[0], product.image.replace(/\.webp$/, '-320.webp')], [widths[1], product.image.replace(/\.webp$/, '-480.webp')], [widths[2], product.image]]).entries()].map(([width, src]) => `${src} ${width}w`).join(', ') : undefined;
  return (
    <article className="product-card">
      <Link className="product-card-link" to={path} aria-label={`${product.name}${product.presentation ? `, ${product.presentation}` : ''}${product.brand ? ` by ${product.brand}` : ''}`}>
      <div className="product-image-frame">
        {product.image && !imageFailed ? <img src={product.image} srcSet={sources} sizes={detailed ? '(max-width: 700px) 44vw, (max-width: 1100px) 30vw, 280px' : '(max-width: 700px) 74vw, (max-width: 1100px) 30vw, 280px'} alt={product.name} className="product-image" width="640" height="640" loading="lazy" decoding="async" onError={() => setImageFailed(true)} /> : <span className="product-image-fallback">Image unavailable</span>}
      </div>
      <div className="product-details">
        <p className="product-category">{product.category}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-brand-line"><BrandMark brand={product.brand} />
        <BogoBadge product={product} /></div>
        <span className="sr-only">{product.presentation}</span>
      </div>
      </Link>
      <div className="product-card-actions"><AddToList product={product} />
      <button type="button" className="product-save" aria-label={`${favorite ? 'Remove' : 'Save'} ${product.name} ${favorite ? 'from' : 'to'} favorites`} aria-pressed={favorite} onClick={() => toggle(product.id)}><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M12 20S3 14.4 3 8.3C3 3.9 8.6 2.8 12 7c3.4-4.2 9-3.1 9 1.3C21 14.4 12 20 12 20Z" /></svg></button></div>
      {!detailed && product.previewVideo && <a className="product-demo-link" href={product.previewVideo} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${product.name} demo on YouTube`}>▷ Demo</a>}
        {error && <span role="alert" className="favorite-error">Favorites could not be saved.</span>}
    </article>
  );
};
export default ProductCard;
