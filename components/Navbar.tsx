import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Moon, Sun } from 'lucide-react';
import { BUSINESS_INFO } from '../constants';
import { useCart } from '../contexts/CartContext';
import { useStore } from '../contexts/StoreContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openCart, items } = useCart();
  const { isDarkMode, toggleDarkMode } = useStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Computers', href: '#shop' },
    { name: 'Components', href: '#shop' },
    { name: 'Services', href: '#expertise' },
    { name: 'Contact', href: '#location' },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${scrolled ? 'py-3' : 'py-6'}`}>
      <div className="max-w-screen-xl mx-auto px-6 flex justify-center">
        
        {/* Floating Pill Container - Apple Dynamic Island Style */}
        <div className={`
            flex items-center justify-between px-6 py-3.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
            ${scrolled || isOpen 
                ? `backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border w-full md:w-[720px] ${isDarkMode ? 'bg-[#1d1d1f]/80 border-white/10' : 'bg-white/80 border-white/60'}` 
                : 'bg-transparent w-full md:w-[720px]'}
        `}>
            
            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 group relative z-50">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform ${isDarkMode ? 'bg-white text-black' : 'bg-[#1d1d1f] text-white'}`}>
                    <span className="font-bold text-[10px] tracking-widest">MSIS</span>
                </div>
                <span className={`font-semibold text-sm tracking-tight group-hover:opacity-70 transition-opacity ${isDarkMode ? 'text-white' : 'text-[#1d1d1f]'}`}>
                    DJERBA
                </span>
            </a>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center justify-center space-x-8 absolute left-1/2 -translate-x-1/2">
                {navLinks.map((link) => (
                <a 
                    key={link.name} 
                    href={link.href} 
                    onClick={(e) => handleScroll(e, link.href)}
                    className={`text-[13px] font-medium transition-colors tracking-wide ${isDarkMode ? 'text-white/80 hover:text-[#2997ff]' : 'text-[#1d1d1f]/80 hover:text-[#0071e3]'}`}
                >
                    {link.name}
                </a>
                ))}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4 relative z-50">
                 {/* Dark Mode Toggle */}
                 <button 
                    onClick={toggleDarkMode}
                    className={`p-2 rounded-full transition-colors ${isDarkMode ? 'text-white hover:bg-white/10' : 'text-[#1d1d1f] hover:bg-gray-100'}`}
                    aria-label="Toggle Dark Mode"
                 >
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                 </button>

                 <button onClick={openCart} className={`hover:text-[#0071e3] transition-colors relative ${isDarkMode ? 'text-white' : 'text-[#1d1d1f]'}`}>
                    <ShoppingBag size={18} strokeWidth={2} />
                    {items.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#0071e3] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                        {items.length}
                      </span>
                    )}
                 </button>
                 <a 
                    href={`tel:${BUSINESS_INFO.phone.replace(/\s/g, '')}`}
                    className="bg-[#0071e3] text-white px-4 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#0077ED] transition-all hover:shadow-lg hover:shadow-blue-500/30"
                >
                    Call Us
                </a>
            </div>

            {/* Mobile Toggle */}
            <div className="flex items-center gap-4 md:hidden relative z-50">
                <button 
                    onClick={toggleDarkMode}
                    className={`p-1 ${isDarkMode ? 'text-white' : 'text-[#1d1d1f]'}`}
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button onClick={() => setIsOpen(!isOpen)} className={`p-1 ${isDarkMode ? 'text-white' : 'text-[#1d1d1f]'}`}>
                    {isOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className={`md:hidden fixed inset-0 z-40 backdrop-blur-3xl animate-fade-in pt-32 px-6 ${isDarkMode ? 'bg-black/95' : 'bg-white/95'}`}>
            <div className="flex flex-col space-y-6 items-center text-center">
                {navLinks.map((link) => (
                <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleScroll(e, link.href)}
                    className={`text-2xl font-semibold transition-colors ${isDarkMode ? 'text-white hover:text-[#2997ff]' : 'text-[#1d1d1f] hover:text-[#0071e3]'}`}
                >
                    {link.name}
                </a>
                ))}
                
                <button 
                  onClick={() => { setIsOpen(false); openCart(); }}
                  className={`text-xl font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white hover:text-[#2997ff]' : 'text-[#1d1d1f] hover:text-[#0071e3]'}`}
                >
                  Shopping Bag ({items.length})
                </button>

                 <a 
                    href={`tel:${BUSINESS_INFO.phone.replace(/\s/g, '')}`}
                    className="mt-8 bg-[#0071e3] text-white px-8 py-4 rounded-2xl text-lg font-medium shadow-xl shadow-blue-500/20 w-full max-w-xs"
                >
                    Call {BUSINESS_INFO.phone}
                </a>
            </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;