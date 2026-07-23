import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';
import ScrollToTop from './components/scrollToTop/ScrollToTop';
import HomePage from './pages/HomePage';
import MobileAppPage from './pages/MobileAppPage';

const TermsPage = lazy(() => import('./pages/TermsPage'));
const AppPrivacyPage = lazy(() => import('./pages/AppPrivacyPage'));
const AppSupportPage = lazy(() => import('./pages/AppSupportPage'));

function App() {
  return (
    <Router>
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
          <Route path="/terms-and-conditions" element={<TermsPage />} />
          <Route path="/app-privacy" element={<AppPrivacyPage />} />
          <Route path="/app-support" element={<AppSupportPage />} />
          <Route path="/mobile-app" element={<MobileAppPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
}

export default App;
