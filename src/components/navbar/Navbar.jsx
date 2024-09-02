import { useState } from 'react'
import './Navbar.css';

const Navbar = () => {
  const [menu, setMenu]= useState(false)
  const [classSpan, setClassSpan] = useState(false)
  const openMenu = ()=>{
    setMenu(!menu)
    setClassSpan(!classSpan)
  }
  return (
    <div>
      <div className="top-bar">
        <p>Take your celebration to the next level</p>
      </div>
      <nav className="navbar navbar-expand-lg navbar-dark main-nav">
        <a className="navbar-brand" href="#">
          <img src="/logotipo.png" alt="Rockwall fireworks Logo" className="navbar-logo" />
        </a>
        <div className={`header-nav ${menu ? "active": ""}`} id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="#">FEATURED PRODUCTS</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">ABOUT</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">CONTACT</a>
            </li>
          </ul>
        </div>
        <button className="navbar-button" onClick={openMenu}>
            <span className={`top-line-${classSpan ? "clicked": "unclicked"}`}></span>
            <span className={`middle-line-${classSpan ? "clicked": "unclicked"}`}></span>
            <span className={`bottom-line-${classSpan ? "clicked": "unclicked"}`}></span>
        </button>
        <div className={`mobile-nav ${menu ? "active": ""}`} id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a className="nav-link" href="#">FEATURED PRODUCTS</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">ABOUT</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">CONTACT</a>
            </li>
          </ul>
        </div>

      </nav>
    </div>
  );
}

export default Navbar;
