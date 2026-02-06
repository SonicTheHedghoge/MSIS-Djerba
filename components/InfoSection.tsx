import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { BUSINESS_INFO } from '../constants';

const InfoSection: React.FC = () => {
  return (
    <section id="location" className="py-32 bg-[#f5f5f7]">
      <div className="max-w-[1200px] mx-auto px-6">
        
        <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-sm overflow-hidden relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                <div>
                     <h2 className="text-4xl font-semibold text-[#1d1d1f] mb-8 tracking-tight">
                        Visit us in Houmt Souk.
                    </h2>
                    
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-sm font-bold text-[#1d1d1f] uppercase tracking-wide mb-2">Address</h3>
                            <p className="text-[#86868b] text-lg leading-relaxed max-w-xs">
                                {BUSINESS_INFO.address}<br/>
                                {BUSINESS_INFO.location}
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="text-sm font-bold text-[#1d1d1f] uppercase tracking-wide mb-2">Contact</h3>
                            <a href={`tel:${BUSINESS_INFO.phone}`} className="text-[#1d1d1f] text-lg font-medium hover:text-[#0071e3] transition-colors">
                                {BUSINESS_INFO.phone}
                            </a>
                        </div>

                         <div>
                            <h3 className="text-sm font-bold text-[#1d1d1f] uppercase tracking-wide mb-2">Hours</h3>
                            <p className="text-[#86868b]">{BUSINESS_INFO.hours.weekdays}</p>
                            <p className="text-[#86868b]">{BUSINESS_INFO.hours.weekend}</p>
                        </div>
                        
                        <a 
                            href="https://maps.google.com" 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-[#0071e3] font-medium text-lg hover:underline mt-4"
                        >
                            Get Directions <ArrowUpRight size={18} />
                        </a>
                    </div>
                </div>

                <div className="h-[400px] md:h-auto rounded-3xl overflow-hidden relative bg-[#f5f5f7]">
                    {/* Abstract Representation of Location or High Quality Store Photo */}
                    <img 
                        src="https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1740&auto=format&fit=crop" 
                        alt="Store Interior" 
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;