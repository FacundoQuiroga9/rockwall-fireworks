const ProductShowcase = () => (
  <div className="product-showcase" data-motion="product">
    <img
      className="product-showcase-image"
      src="/images/hero/products-studio-800.webp"
      srcSet="/images/hero/products-studio-480.webp 480w, /images/hero/products-studio-800.webp 800w, /images/hero/products-studio-1200.webp 1200w"
      sizes="(max-width: 600px) min(90vw, 350px), (max-width: 1100px) 45vw, 530px"
      width="1200"
      height="1200"
      alt="Festival Balls, Diablo, Neon Beef, The Reaper and Night Rider together on a circular navy studio platform"
      decoding="async"
      loading="lazy"
    />
  </div>
);

export default ProductShowcase;
