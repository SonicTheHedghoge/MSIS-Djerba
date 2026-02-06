import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCategories from './components/ProductCategories';
import ShopSection from './components/ShopSection';
import InfoSection from './components/InfoSection';
import Footer from './components/Footer';
import TechAssistant from './components/TechAssistant';
import AdminPanel from './components/AdminPanel';

// Context Providers
import { StoreProvider } from './contexts/StoreContext';
import { AuthProvider } from './contexts/AuthContext';

const PublicLayout: React.FC = () => {
  return (
    <div className="bg-white min-h-screen text-brand-black relative overflow-x-hidden">
      <Navbar />
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
        <HashRouter>
          <Routes>
            <Route path="/" element={<PublicLayout />} />
            {/* Obscured Admin Route - Security through obscurity layer 1 */}
            <Route path="/secure-sys-admin" element={<AdminPanel />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </StoreProvider>
  );
}

export default App;