import { useState } from 'react';

const ProductCard = ({ product }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(product.image) && !imageFailed;
  const smallImage = product.image?.endsWith('.webp')
    ? product.image.replace(/\.webp$/, '-320.webp')
    : null;
  const mediumImage = product.image?.endsWith('.webp')
    ? product.image.replace(/\.webp$/, '-480.webp')
    : null;

  return (
    <article className="product-card">
      <div className="product-image-frame">
        {hasImage ? (
          <img
            src={product.image}
            srcSet={smallImage ? `${smallImage} 320w, ${mediumImage} 480w, ${product.image} 640w` : undefined}
            sizes="(max-width: 36rem) calc(82vw - 2rem), (max-width: 48rem) calc(45vw - 2rem), (max-width: 75rem) calc(31vw - 2rem), 15rem"
            alt={product.name}
            className="product-image"
            width="640"
            height="640"
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="product-image-fallback" role="img" aria-label={`${product.name} image unavailable`}>
            <span aria-hidden="true">✦</span>
            <span>Image unavailable</span>
          </div>
        )}
      </div>
      <h3 className="product-name">{product.name}</h3>
      {product.category ? (
        <p className="product-category">{product.category}</p>
      ) : null}
      <div className="product-features">
        {product.previewVideo ? (
          <a
            className="product-button"
            href={product.previewVideo}
            target="_blank"
            rel="noopener noreferrer"
          >
            Preview
            <span className="sr-only"> {product.name}</span>
          </a>
        ) : (
          <span className="product-preview-unavailable">Preview coming soon</span>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
