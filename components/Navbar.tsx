import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { BUSINESS_INFO } from '../constants';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Products', href: '#products' },
    { name: 'Shop', href: '#shop' },
    { name: 'Location', href: '#location' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-brand-dark/90 backdrop-blur-lg border-b border-white/10 py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src="https://i.ibb.co/7Nnn85zF/302783568-496662659136297-119593787000234011-n.png" 
              alt="MSIS DJERBA Logo" 
              className="h-12 w-12 object-cover rounded-full border-2 border-brand-accent/30 shadow-lg shadow-brand-accent/20"
            />
            <span className="text-xl md:text-2xl font-bold tracking-tight text-white">
              MSIS <span className="text-brand-accent">DJERBA</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-gray-300 hover:text-brand-accent transition-colors text-sm font-medium uppercase tracking-wider"
              >
                {link.name}
              </a>
            ))}
            <a 
                href={`tel:${BUSINESS_INFO.phone.replace(/\s/g, '')}`}
                className="bg-brand-accent hover:bg-cyan-400 text-brand-dark px-5 py-2 rounded-full font-bold transition-transform hover:scale-105"
            >
                Call Now
            </a>
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-brand-accent">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-dark/95 backdrop-blur-xl border-b border-white/10 absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
             <a 
                href={`tel:${BUSINESS_INFO.phone.replace(/\s/g, '')}`}
                className="block w-full text-center mt-4 bg-brand-accent text-brand-dark px-5 py-3 rounded-lg font-bold"
            >
                {BUSINESS_INFO.phone}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;