import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';
import ScrollToTop from './components/scrollToTop/ScrollToTop';
import HomePage from './pages/HomePage';
import MobileAppPage from './pages/MobileAppPage';
import MyListProvider from './components/myList/MyListProvider';

const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const MyListPage = lazy(() => import('./pages/MyListPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const AppPrivacyPage = lazy(() => import('./pages/AppPrivacyPage'));
const AppSupportPage = lazy(() => import('./pages/AppSupportPage'));

function App() {
  return (
    <MyListProvider><Router
      future={{
        v7_relativeSplatPath: true,
        v7_startTransition: true,
      }}
    >
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <ScrollToTop />
      <Navbar />
      <Suspense
        fallback={
          <main
            className="route-loading"
            id="main-content"
            tabIndex="-1"
          >
            Loading…
          </main>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/my-list" element={<MyListPage />} />
          <Route path="/terms-and-conditions" element={<TermsPage />} />
          <Route path="/app-privacy" element={<AppPrivacyPage />} />
          <Route path="/app-support" element={<AppSupportPage />} />
          <Route path="/mobile-app" element={<MobileAppPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router></MyListProvider>
  );
}

export default App;
