import FullCatalog from '../components/productCarousel/FullCatalog';
import { usePageMetadata } from '../hooks/usePageMetadata';
import '../components/productCarousel/ProductCarousel.css';
import './ProductsPage.css';
export default function ProductsPage() {
  usePageMetadata({ title: 'Fireworks Catalog | Rockwall Fireworks', description: 'Explore fireworks by brand and category, watch product demos and save your favorites. Visit Rockwall Fireworks in Lavon, Texas.', path: '/products' });
  return (
    <main id="main-content" className="products-page" tabIndex="-1">
      <div className="shell">
        <header className="catalog-page-heading">
          <p className="eyebrow">Rockwall Fireworks · The collection</p>
          <h1>FIND YOUR<br /><em>NEXT BIG NIGHT.</em></h1>
          <p>Explore the lineup, watch demos and save your favorites.</p>
          <span>Selection may vary. Contact the store to confirm availability.</span>
        </header>
        <FullCatalog />
      </div>
    </main>
  );
}
