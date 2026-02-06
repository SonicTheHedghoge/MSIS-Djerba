import React from 'react';
import { MapPin, Phone, Clock, Facebook, Mail } from 'lucide-react';
import { BUSINESS_INFO } from '../constants';

const InfoSection: React.FC = () => {
  return (
    <section id="location" className="py-24 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-secondary/20 rounded-full blur-[100px] -translate-x-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-accent/10 rounded-full blur-[100px] translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Info */}
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Visit Our Store</h2>
            <p className="text-gray-400 mb-12 text-lg">
              Located in the beautiful Houmt Souk, we are your local hub for all things technology. Stop by for a chat, a repair, or to pick up your next gadget.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="p-4 rounded-xl bg-brand-surface border border-white/10 group-hover:border-brand-accent/50 transition-colors">
                  <MapPin className="text-brand-accent w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Address</h3>
                  <p className="text-gray-400">{BUSINESS_INFO.address}</p>
                  <p className="text-gray-400">{BUSINESS_INFO.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="p-4 rounded-xl bg-brand-surface border border-white/10 group-hover:border-brand-accent/50 transition-colors">
                  <Phone className="text-brand-accent w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Contact Us</h3>
                  <p className="text-gray-400 text-lg font-mono">{BUSINESS_INFO.phone}</p>
                  <a href={BUSINESS_INFO.social.facebook} target="_blank" rel="noreferrer" className="text-brand-accent text-sm hover:underline mt-1 inline-block">
                    Visit Facebook Page
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="p-4 rounded-xl bg-brand-surface border border-white/10 group-hover:border-brand-accent/50 transition-colors">
                  <Clock className="text-brand-accent w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Opening Hours</h3>
                  <p className="text-gray-400">{BUSINESS_INFO.hours.weekdays}</p>
                  <p className="text-red-400">{BUSINESS_INFO.hours.weekend}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Simulated Map / Visual */}
          <div className="relative h-[500px] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
             {/* Note: In a real app, embed Google Maps iframe here. For visual flair, using a static map image. */}
             <img 
                src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=1931&auto=format&fit=crop" 
                alt="Map aesthetic" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
             />
             <div className="absolute inset-0 bg-brand-dark/40 group-hover:bg-transparent transition-colors"></div>
             
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-brand-dark/90 backdrop-blur-md p-6 rounded-2xl border border-brand-accent/30 text-center shadow-xl transform transition-transform group-hover:-translate-y-2">
                    <MapPin className="w-10 h-10 text-brand-accent mx-auto mb-2 animate-bounce" />
                    <h4 className="text-white font-bold text-lg">Houmt Souk</h4>
                    <span className="text-xs text-gray-400">Gouvernorat de Médenine</span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default InfoSection;