import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Link as ScrollLink, scroller } from 'react-scroll'; // Importar desde react-scroll
import './Navbar.css';

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const [classSpan, setClassSpan] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const openMenu = () => {
    setMenu(!menu);
    setClassSpan(!classSpan);
  };

  // Función para manejar el desplazamiento
  const handleScroll = (sectionId) => {
    if (location.pathname !== '/') {
      // Si no estamos en la página principal, navegamos a ella
      navigate('/');
      // Esperamos un momento para que la página principal cargue antes de hacer scroll
      setTimeout(() => {
        scroller.scrollTo(sectionId, {
          smooth: true,
          duration: 500,
          offset: -157, // Ajustar según el tamaño de la navbar
        });
      }, 300);
    } else {
      // Si estamos en la página principal, simplemente desplazamos a la sección
      scroller.scrollTo(sectionId, {
        smooth: true,
        duration: 500,
        offset: -157,
      });
    }
    // Cerrar menú móvil al hacer clic en los enlaces
    openMenu();
  };

  return (
    <div className="sticky-nav">
      <div className="top-bar">
        <p>
          <ion-icon name="ban"></ion-icon> No tariff tax guaranteed {''}
          <ion-icon name="ban"></ion-icon>
        </p>
      </div>
      <nav className="navbar navbar-expand-lg navbar-dark main-nav">
        <Link className="navbar-brand" to="/" onClick={() => handleScroll('top')}>
          <img src="/logotipo.png" alt="Rockwall fireworks Logo" className="navbar-logo" />
        </Link>
        <div className={`header-nav ${menu ? 'active' : ''}`} id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={() => handleScroll('featured-products')}>
                FEATURED PRODUCTS
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={() => handleScroll('about')}>
                ABOUT
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={() => handleScroll('contact')}>
                CONTACT
              </a>
            </li>
          </ul>
        </div>
        <button className="navbar-button" onClick={openMenu}>
          <span className={`top-line-${classSpan ? 'clicked' : 'unclicked'}`}></span>
          <span className={`middle-line-${classSpan ? 'clicked' : 'unclicked'}`}></span>
          <span className={`bottom-line-${classSpan ? 'clicked' : 'unclicked'}`}></span>
        </button>
        <div className={`mobile-nav ${menu ? 'active' : ''}`} id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={() => handleScroll('featured-products')}>
                FEATURED PRODUCTS
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={() => handleScroll('about')}>
                ABOUT
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={() => handleScroll('contact')}>
                CONTACT
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
