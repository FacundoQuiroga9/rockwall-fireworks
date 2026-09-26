import BogoBadge from '../components/productCarousel/BogoBadge';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './PlaygroundPage.css';
import playgroundIndex from '../data/playgroundIndex.json';
import products from '../data/products.json';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { useCatalogFavorites } from '../hooks/useCatalogFavorites';
import { PRODUCT_VIDEO_ANCHOR, productVideoPath, youtubeVideoId } from '../utils/productVideo';
import './ProductsPage.css';
import { durationLabel } from '../shared/playgroundPresentation';
import AddToList from '../components/myList/AddToList';
import BrandMark from '../components/productCarousel/BrandMark';
import '../components/productCarousel/ProductCard.css';

function ProductVideo({ product }) {
  const [playing, setPlaying] = useState(false);
  const player = useRef(null);
  const id = youtubeVideoId(product.previewVideo);
  useEffect(() => {
    if (playing) player.current?.focus();
  }, [playing]);
  return (
    <section id={PRODUCT_VIDEO_ANCHOR} className="product-video" aria-labelledby="video-title">
      <p className="eyebrow">See it in action</p>
      <h2 id="video-title">{product.name} demo</h2>
      {id && (
        <div className="product-video-frame">
          {playing ? (
            <iframe
              ref={player}
              title={`${product.name} demonstration`}
              src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
              loading="lazy"
              allow="encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : (
            <button type="button" onClick={() => setPlaying(true)}>
              <span className="video-play" aria-hidden="true">▷</span>
              <strong>Load video</strong>
              <span>Connects to YouTube. Playback is under your control.</span>
            </button>
          )}
        </div>
      )}
      <p className="product-video-help">If this video is unavailable here or embedding is disabled, you can watch it on YouTube.</p>
      <a href={product.previewVideo} target="_blank" rel="noopener noreferrer">
        Watch on YouTube<span className="sr-only"> (opens a new tab)</span>
      </a>
    </section>
  );
}

export default function ProductPage() {
  const { slug } = useParams();
  const product = products.find((item) => item.slug === slug);
  const { ids, toggle, error } = useCatalogFavorites();
  usePageMetadata({
    title: product
      ? `${product.name}${product.presentation ? ` — ${product.presentation}` : ''} | Rockwall Fireworks`
      : 'Product not found | Rockwall Fireworks',
    description: product?.description || (product
      ? `Explore ${product.name}${product.brand ? ` by ${product.brand}` : ''}, ${product.category.toLowerCase()} at Rockwall Fireworks in Lavon, Texas.`
      : 'This product could not be found.'),
    path: `/products/${slug}`,
    image: product?.image,
    noindex: !product,
  });
  if (!product) {
    return (
      <main id="main-content" className="products-page" tabIndex="-1">
        <div className="shell">
          <h1>Product not found</h1>
          <Link className="detail-back" to="/products">Back to the catalog</Link>
        </div>
      </main>
    );
  }
  const favorite = ids.includes(product.id);
  return (
    <main id="main-content" className="products-page product-page" tabIndex="-1">
      <div className="shell">
        <Link className="detail-back" to="/products">All products</Link>
        <div className="product-detail-layout">
          <div className="product-detail-photo">
            <img
              src={product.image}
              width="640"
              height="640"
              alt={`${product.name}${product.presentation ? ` — ${product.presentation}` : ''}`}
              loading="eager"
              decoding="async"
            />
          </div>
          <div className="product-detail-copy">
            <p className="eyebrow">{product.brand || 'Rockwall selection'} · {product.category}</p>
            <h1>{product.name}</h1>
            <BrandMark brand={product.brand} />
            {product.bogo && <p className="detail-bogo"><BogoBadge product={product} /><br /><strong>Buy One, Get One</strong><br />Marked BOGO in our source catalog. Current dates and conditions need store confirmation. Prepare a pair with another BOGO product in the same category in My List.</p>}
            {product.presentation && <p className="detail-presentation">{product.presentation}</p>}
            {product.description && <p className="detail-description">{product.description}</p>}
            {product.features?.length > 0 && (
              <ul className="detail-facts">
                {product.features.map((fact) => <li key={fact}>{fact}</li>)}
              </ul>
            )}
            {product.demonstration && <section className="detail-demonstration" aria-label="Product effects"><h2>{product.demonstration.scope.includes('shell') ? 'Shell sample' : 'The effect'}</h2><p>{product.demonstration.summary}</p><p>{durationLabel(product.demonstration)}{product.demonstration.confirmedShots ? ` · ${product.demonstration.confirmedShots} shots` : ''}</p><Link to={productVideoPath(product)}>Watch the reference</Link></section>}
            <button className="detail-favorite" type="button" aria-pressed={favorite} onClick={() => toggle(product.id)}>
              {favorite ? 'Saved to favorites' : 'Save to favorites'}
            </button>
            {playgroundIndex.some((profile) => profile.productId === product.id) && <p><Link className="detail-back" to={`/playground?product=${product.id}`}>Explore this effect in the Playground →</Link></p>}
            <div className="detail-list-action"><AddToList product={product} /><Link to="/my-list">Review My List →</Link></div>
            <p className="catalog-local-note">Saved in this browser. No account required.</p>
            {error && <p role="alert">Favorites could not be saved. Check your browser storage settings.</p>}
            <p className="detail-availability">
              Selection may vary. <Link to="/#contact">Contact the store</Link> to confirm availability.
            </p>
          </div>
        </div>
        {product.previewVideo && <ProductVideo key={product.id} product={product} />}
      </div>
    </main>
  );
}
