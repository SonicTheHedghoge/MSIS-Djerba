import React, { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

const Hero: React.FC = () => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => setOffset(window.scrollY));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-[90vh] flex flex-col items-center justify-start overflow-hidden bg-[#ffffff] pt-40 lg:pt-52">
      
      {/* Content Container */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 text-center animate-fade-in-up">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5f5f7] border border-gray-100 mb-8 mx-auto">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#86868b]">Now Serving Djerba</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-[#1d1d1f] mb-6 leading-[1.05]">
          Tech Excellence.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0071e3] to-[#2997ff]">
            Right here.
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl font-medium text-[#86868b] mb-10 max-w-2xl mx-auto leading-relaxed">
          Premium computers, expert repairs, and components. <br className="hidden md:block"/>
          The definitive technology destination in Houmt Souk.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20">
          <a 
            href="#shop" 
            onClick={(e) => handleScroll(e, '#shop')}
            className="px-8 py-3.5 bg-[#0071e3] text-white rounded-full text-[17px] font-medium hover:bg-[#0077ED] hover:scale-105 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            View Products
          </a>
          <a 
            href="#location" 
            onClick={(e) => handleScroll(e, '#location')}
            className="text-[#0071e3] text-[17px] font-medium hover:underline flex items-center gap-1 group px-4 py-2"
          >
            Visit Store <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Hero Image - Parallax Effect */}
      <div 
        className="relative w-full max-w-[1100px] px-6 transition-transform duration-100 ease-out will-change-transform pb-20"
        style={{ transform: `translateY(-${offset * 0.15}px)` }}
      >
        <div className="relative aspect-[21/9] md:aspect-[2/1] rounded-[30px] md:rounded-[50px] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] bg-[#f5f5f7] ring-1 ring-black/5">
            {/* Clean Desk Setup Image */}
            <img 
                src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2940&auto=format&fit=crop" 
                alt="Modern Tech Workspace" 
                className="w-full h-full object-cover"
            />
            
            {/* Overlay Gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent pointer-events-none"></div>
            
            {/* Floating Label - Aesthetic Touch */}
            <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-white/40 hidden md:block">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Featured</p>
                <p className="text-[#1d1d1f] font-bold">Custom Workstations</p>
            </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;