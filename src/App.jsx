import './App.css';
import Hero from './components/hero/Hero';
import Navbar from './components/navbar/Navbar';
import Brands from "./components/brands/Brands";
import About from "./components/about/About";
import Countdown from "./components/countdown/Countdown";
import Contact from "./components/contact/Contact"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductCarousel from './components/productCarousel/ProductCarousel';


function App() {

  return (
    <div>
      <Navbar />
      <Hero />
      <Brands />
      <ProductCarousel />
      <About />
      <Countdown/>
      <Contact />
    </div>
  )
}

export default App
