import React from 'react';
import { ChevronRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop" 
          alt="Technology Background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-brand-dark/80 to-brand-dark"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="glass-panel inline-block px-4 py-1 rounded-full mb-6 animate-fade-in-up border-brand-accent/20">
            <span className="text-brand-accent text-xs md:text-sm font-bold tracking-widest uppercase">
                Welcome to the Future of Djerba
            </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-6 leading-tight drop-shadow-2xl">
          TECH THAT <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-secondary filter drop-shadow-lg">
            EMPOWERS
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Your premier destination for high-performance computing, electronics, and expert support in the heart of Houmt Souk.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="#products" 
            className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-bold text-white transition-all duration-300 bg-brand-accent rounded-full hover:bg-white hover:text-brand-dark focus:outline-none focus:ring shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)]"
          >
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
            <span className="relative flex items-center gap-2">
                Explore Collection <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </a>
          
          <a 
            href="#location" 
            className="px-8 py-3 rounded-full border border-brand-accent/30 text-gray-300 hover:border-brand-accent hover:text-white transition-all font-medium backdrop-blur-sm bg-brand-dark/30"
          >
            Visit Store
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;