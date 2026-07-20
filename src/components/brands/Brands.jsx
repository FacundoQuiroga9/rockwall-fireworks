import './Brands.css'
import brands from '../../data/brands.json'

const getSmallBrandImage = (image) =>
  image.endsWith('.webp') ? image.replace(/\.webp$/, '-160.webp') : image;

const Brands = () => {
  return(
    <section className="logos" aria-label="Firework brands we carry">
      <div className="logos-slider">
        {[false, true].map((duplicate) => (
          <div
            className="logos-group"
            aria-hidden={duplicate || undefined}
            key={duplicate ? 'duplicate' : 'primary'}
          >
            {brands.map((brand) => (
              <img
                src={brand.image}
                srcSet={`${getSmallBrandImage(brand.image)} 160w, ${brand.image} ${brand.width}w`}
                sizes="(max-width: 44rem) 4rem, (max-width: 90rem) 9vw, 8rem"
                alt={duplicate ? '' : `${brand.name} logo`}
                width={brand.width}
                height={brand.height}
                loading="lazy"
                decoding="async"
                key={`${duplicate ? 'duplicate-' : ''}${brand.id}`}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

export default Brands
