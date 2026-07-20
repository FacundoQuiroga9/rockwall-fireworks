import { useEffect, useRef, useState } from 'react';
import products from '../../data/products.json';
import { getFeaturedProducts } from '../../utils/productData';
import ProductCard from './ProductCard';
import './ProductCarousel.css';

const featuredProducts = getFeaturedProducts(products);

const ProductCarousel = () => {
  const carouselRef = useRef(null);
  const [scrollState, setScrollState] = useState({
    canScrollBackward: false,
    canScrollForward: featuredProducts.length > 1,
  });

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return undefined;

    const updateScrollState = () => {
      const maximumScroll = carousel.scrollWidth - carousel.clientWidth;
      setScrollState({
        canScrollBackward: carousel.scrollLeft > 2,
        canScrollForward: carousel.scrollLeft < maximumScroll - 2,
      });
    };

    updateScrollState();
    carousel.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      carousel.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, []);

  const scrollProducts = (direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    carousel.scrollBy({
      left: direction * carousel.clientWidth * 0.85,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    });
  };

  return (
    <section
      id="featured-products"
      className="carousel-container"
      aria-labelledby="featured-products-title"
    >
      <div className="carousel-heading">
        <h2 id="featured-products-title" className="carousel-title">
          Featured Products
        </h2>
        {featuredProducts.length > 1 ? (
          <div className="carousel-controls" aria-label="Product carousel controls">
            <button
              type="button"
              className="carousel-control"
              aria-label="Previous products"
              disabled={!scrollState.canScrollBackward}
              onClick={() => scrollProducts(-1)}
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              type="button"
              className="carousel-control"
              aria-label="Next products"
              disabled={!scrollState.canScrollForward}
              onClick={() => scrollProducts(1)}
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>
        ) : null}
      </div>

      {featuredProducts.length ? (
        <div
          ref={carouselRef}
          className="product-carousel"
          role="region"
          aria-label="Featured fireworks"
          tabIndex="0"
        >
          {featuredProducts.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      ) : (
        <p className="products-empty-state">
          Featured products will be available soon.
        </p>
      )}
    </section>
  );
};

export default ProductCarousel;
