import React from 'react';
import { ChevronRight, Cpu, Wrench, Wifi, Monitor } from 'lucide-react';

const ProductCategories: React.FC = () => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="expertise" className="py-32 bg-[#f5f5f7]">
      <div className="max-w-[1200px] mx-auto px-6">
        
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="max-w-2xl">
                <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#1d1d1f] mb-6">
                    Professional Services.
                </h2>
                <p className="text-xl md:text-2xl font-medium text-[#86868b] leading-relaxed">
                    Beyond just sales. We build, repair, and optimize your digital life.
                </p>
            </div>
            <a href="#location" onClick={(e) => handleScroll(e, '#location')} className="hidden md:flex items-center gap-2 text-[#0071e3] font-medium group hover:opacity-80 transition-opacity">
                See all services <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
        </div>

        {/* Apple Style Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
            
            {/* Large Card - Gaming */}
            <div className="md:col-span-2 group relative overflow-hidden rounded-[40px] bg-white shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-[1.01]">
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=2000&auto=format&fit=crop" 
                        className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                        alt="Gaming Setup"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 p-10 w-full">
                    <div className="flex items-center gap-3 mb-3 text-white/80">
                        <Cpu size={20} />
                        <span className="text-xs font-bold uppercase tracking-wider">Custom Builds</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">Gaming & Workstations</h3>
                    <p className="text-white/80 max-w-lg text-lg">High-performance rigs built to your exact specifications. RTX 40-Series ready.</p>
                </div>
            </div>

            {/* Tall Card - Repairs */}
            <div className="group relative overflow-hidden rounded-[40px] bg-white p-10 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-[1.01]">
                <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] flex items-center justify-center text-[#1d1d1f] mb-6">
                        <Wrench size={24} />
                    </div>
                    <h3 className="text-3xl font-semibold text-[#1d1d1f] mb-4">Expert Repair.</h3>
                    <p className="text-[#86868b] font-medium text-lg leading-relaxed">
                        Hardware diagnostics, screen replacements, and software troubleshooting.
                    </p>
                </div>
                <div className="flex items-center text-[#0071e3] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span className="text-sm">Visit Tech Bar</span>
                    <ChevronRight size={16} className="ml-1" />
                </div>
            </div>

            {/* Medium Card - Networking */}
            <div className="group relative overflow-hidden rounded-[40px] bg-white p-10 flex flex-col justify-center shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-[1.01]">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform rotate-12 scale-150">
                    <Wifi size={120} />
                </div>
                <div className="relative z-10">
                    <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-3">Enterprise Networking</h3>
                    <p className="text-[#86868b] font-medium mb-6">Routers, switches, and full office cabling solutions.</p>
                    <button className="bg-[#1d1d1f] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#333] transition-colors">
                        Learn more
                    </button>
                </div>
            </div>

             {/* Medium Card - Laptops */}
             <div className="md:col-span-2 group relative overflow-hidden rounded-[40px] bg-[#000] p-10 flex items-center shadow-sm hover:shadow-xl transition-all duration-500 hover:scale-[1.01]">
                <div className="relative z-10 max-w-md">
                    <div className="flex items-center gap-3 mb-4 text-[#86868b]">
                        <Monitor size={20} />
                        <span className="text-xs font-bold uppercase tracking-wider">Portable Power</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Laptops for every need.</h3>
                    <p className="text-gray-400 text-lg mb-8">From ultra-light ThinkPads to heavy-duty gaming laptops. Find your perfect match today.</p>
                    <a href="#shop" onClick={(e) => handleScroll(e, '#shop')} className="inline-flex text-[#2997ff] hover:text-white transition-colors items-center gap-2 font-medium">
                        Shop Laptops <ChevronRight size={16} />
                    </a>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#1d1d1f] to-transparent">
                     <img 
                        src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1000&auto=format&fit=crop" 
                        className="w-full h-full object-cover opacity-60 mix-blend-screen mask-image-linear"
                        alt="Laptop"
                    />
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};

export default ProductCategories;