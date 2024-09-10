import Slider from "react-slick";
import './ProductCarousel.css';

const ProductCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  // Array de productos
  const products = [
    {
      name: 'The Reaper',
      category: 'Cakes',
      image: '/the-reaper.png',
      videoLink: 'https://www.youtube.com/watch?v=FP8t9UP0Im8',
    },
    {
      name: 'Alien Attack',
      category: 'Cakes',
      image: '/alien-attack.png',
      videoLink: 'https://www.youtube.com/watch?v=wTSWjZvHc_M',
    },
    {
      name: 'Festival Balls',
      category: 'Reloadables',
      image: '/festival-balls.png',
      videoLink: 'https://www.youtube.com/watch?v=38JSR3cUynU',
    },
    {
      name: 'Neon Beef',
      category: 'Artillery Shells',
      image: '/neon-beef.png',
      videoLink: 'https://www.youtube.com/watch?v=Qnw1EaEoHs4',
    },
    {
      name: 'Diablo',
      category: 'Artillery Shells',
      image: '/diablo.png',
      videoLink: 'https://www.youtube.com/watch?v=oWgGZIkl8cA&t=6s',
    },
    {
      name: 'Night Rider',
      category: 'Cakes',
      image: '/night-rider.png',
      videoLink: 'https://www.youtube.com/watch?v=e9y7KeeEg6Q',
    },

    {
      name: 'Futurama Artillery',
      category: 'Artillery Shells',
      image: '/futurama.png',
      videoLink: 'https://www.youtube.com/watch?v=dZRsu66-XiQ',
    },
    {
      name: 'Festival Balls',
      category: 'Artillery Shells',
      image: '/festival-balls3.png',
      videoLink: 'https://www.youtube.com/watch?v=IUaMk3dJlcA',
    },
    {
      name: 'Star Light',
      category: 'Assortments',
      image: '/star-light.png',
      videoLink: '',
    },
    {
      name: 'Action Zone',
      category: 'Assortments',
      image: '/action-zone.png',
      videoLink: '',
    },
  ];

  return (
    <div id="featured-products" className="carousel-container">
      <h2 className="carousel-title">Featured Products</h2>
      <Slider {...settings}>
        {products.map((product, index) => (
          <div key={index} className="product-card">
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-category">{product.category}</p>
            <div className="product-features">
              {/* Mostrar botón solo si hay un videoLink */}
              {product.videoLink && (
                <a href={product.videoLink} target="_blank" rel="noopener noreferrer">
                  <button className="product-button">PREVIEW</button>
                </a>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductCarousel;
