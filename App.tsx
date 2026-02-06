import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCategories from './components/ProductCategories';
import ShopSection from './components/ShopSection';
import InfoSection from './components/InfoSection';
import Footer from './components/Footer';
import TechAssistant from './components/TechAssistant';
import ParticleBackground from './components/ParticleBackground';

function App() {
  return (
    <div className="bg-brand-dark min-h-screen text-slate-50 selection:bg-brand-accent selection:text-brand-dark relative">
      <ParticleBackground />
      <div className="relative z-10">
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
    </div>
  );
}

export default App;