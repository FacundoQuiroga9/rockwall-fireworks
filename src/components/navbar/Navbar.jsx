
import './Navbar.css';

const Navbar = () => {
  return (
    <div>
      <div className="top-bar">
        <p>Take your celebration to the next level</p>
      </div>
      <nav className="navbar navbar-expand-lg navbar-dark main-nav">
        <a className="navbar-brand" href="#">
          <img src="/logotipo.png" alt="Rockwall fireworks Logo" className="navbar-logo" />
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
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
