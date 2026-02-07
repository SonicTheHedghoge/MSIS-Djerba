import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { BUSINESS_INFO } from '../constants';
import { useStore } from '../contexts/StoreContext';

const InfoSection: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const { siteSettings } = useStore();
  const isDark = siteSettings.is_dark_mode;

  // Houmt Souk Coordinates
  const COORDINATES = { lat: 33.876, lng: 10.858 };

  useEffect(() => {
    // Wait for Leaflet to load
    const L = window.L;
    if (!L || !mapRef.current) return;

    if (!mapInstance.current) {
      // Initialize Map
      mapInstance.current = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: false // Keep it static like a premium location card
      }).setView([COORDINATES.lat, COORDINATES.lng], 15);

      // Use a clean, muted tile layer (CartoDB Positron) for that premium Apple feel
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(mapInstance.current);

      // Add custom marker
      const customIcon = L.divIcon({
        className: 'custom-pin',
        html: `<div style="background-color: #0071e3; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      L.marker([COORDINATES.lat, COORDINATES.lng], { icon: customIcon }).addTo(mapInstance.current);
    }
    
    // Cleanup
    return () => {
      // We don't necessarily destroy to avoid flashes if component re-renders quickly, 
      // but strictly speaking we should if unmounting.
    };
  }, []);

  return (
    <section id="location" className={`py-32 transition-colors duration-500 ${isDark ? 'bg-[#000]' : 'bg-[#f5f5f7]'}`}>
      <div className="max-w-[1200px] mx-auto px-6">
        
        <div className={`rounded-[40px] p-8 md:p-16 shadow-sm overflow-hidden relative transition-colors duration-500 ${isDark ? 'bg-[#1d1d1f]' : 'bg-white'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                <div>
                     <h2 className={`text-4xl font-semibold mb-8 tracking-tight ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>
                        Visit us in Houmt Souk.
                    </h2>
                    
                    <div className="space-y-8">
                        <div>
                            <h3 className={`text-sm font-bold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-[#1d1d1f]'}`}>Address</h3>
                            <p className={`text-lg leading-relaxed max-w-xs ${isDark ? 'text-gray-300' : 'text-[#86868b]'}`}>
                                {BUSINESS_INFO.address}<br/>
                                {BUSINESS_INFO.location}
                            </p>
                        </div>
                        
                        <div>
                            <h3 className={`text-sm font-bold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-[#1d1d1f]'}`}>Contact</h3>
                            <a href={`tel:${BUSINESS_INFO.phone}`} className={`text-lg font-medium hover:text-[#0071e3] transition-colors ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>
                                {BUSINESS_INFO.phone}
                            </a>
                        </div>

                         <div>
                            <h3 className={`text-sm font-bold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-400' : 'text-[#1d1d1f]'}`}>Hours</h3>
                            <p className={isDark ? 'text-gray-300' : 'text-[#86868b]'}>{BUSINESS_INFO.hours.weekdays}</p>
                            <p className={isDark ? 'text-gray-300' : 'text-[#86868b]'}>{BUSINESS_INFO.hours.weekend}</p>
                        </div>
                        
                        <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${COORDINATES.lat},${COORDINATES.lng}`}
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-[#0071e3] font-medium text-lg hover:underline mt-4"
                        >
                            Get Directions <ArrowUpRight size={18} />
                        </a>
                    </div>
                </div>

                {/* Actual Map Implementation */}
                <div className="h-[400px] md:h-auto rounded-3xl overflow-hidden relative border border-gray-100/10 shadow-inner bg-[#e5e5e5]">
                    <div ref={mapRef} className="w-full h-full z-0"></div>
                    
                    {/* Floating Label on Map */}
                    <div className="absolute bottom-6 left-6 z-[400] bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-[#0071e3] flex items-center justify-center text-white">
                            <MapPin size={20} />
                         </div>
                         <div>
                            <p className="text-[10px] uppercase font-bold text-gray-400">Our Store</p>
                            <p className="text-sm font-bold text-[#1d1d1f]">MSIS Djerba</p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;