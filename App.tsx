import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCategories from './components/ProductCategories';
import ShopSection from './components/ShopSection';
import InfoSection from './components/InfoSection';
import Footer from './components/Footer';
import TechAssistant from './components/TechAssistant';
import AdminPanel from './components/AdminPanel';
import CartDrawer from './components/CartDrawer';
import ThemeOverlay from './components/ThemeOverlay';

// Context Providers
import { StoreProvider, useStore } from './contexts/StoreContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

const AppContent: React.FC = () => {
  const { isDarkMode } = useStore();

  return (
    <div className={`min-h-screen text-brand-black relative overflow-x-hidden transition-colors duration-500 ${isDarkMode ? 'dark bg-[#000] text-white' : 'bg-white'}`}>
      <ThemeOverlay />
      <Navbar />
      <CartDrawer />
      <main>
        <Hero />
        <ProductCategories />
        <ShopSection />
        <InfoSection />
      </main>
      <Footer />
      <TechAssistant />
    </div>
  );
};

function App() {
  return (
    <StoreProvider>
      <AuthProvider>
        <CartProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<AppContent />} />
              {/* Obscured Admin Route */}
              <Route path="/secure-sys-admin" element={<AdminPanel />} />
            </Routes>
          </HashRouter>
        </CartProvider>
      </AuthProvider>
    </StoreProvider>
  );
}

export default App;