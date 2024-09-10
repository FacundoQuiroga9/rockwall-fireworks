import './App.css';
import Hero from './components/hero/Hero';
import Navbar from './components/navbar/Navbar';
import Brands from "./components/brands/Brands";
import About from "./components/about/About";
import Countdown from "./components/countdown/Countdown";
import Contact from "./components/contact/Contact";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCarousel from './components/productCarousel/ProductCarousel';
import Footer from "./components/footer/Footer";
import TermsAndConditions from './components/termsAndConditions/TermsAndConditions'; // Importar el nuevo componente
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScrollToTop from './components/scrollToTop/ScrollToTop'; // Importar ScrollToTop


function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <Brands />
            <ProductCarousel />
            <About />
            <Countdown />
            <Contact />
          </>
        } />
        {/* Ruta para la página de términos y condiciones */}
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App;
