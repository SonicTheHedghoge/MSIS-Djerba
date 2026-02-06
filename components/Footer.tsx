import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { BUSINESS_INFO } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-dark border-t border-white/5 py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                <div className="flex items-center gap-3">
                    <img 
                        src="https://i.ibb.co/7Nnn85zF/302783568-496662659136297-119593787000234011-n.png" 
                        alt="MSIS DJERBA Logo" 
                        className="h-10 w-10 object-cover rounded-full border border-brand-accent/30"
                    />
                    <span className="text-xl font-bold tracking-tight text-white">
                    MSIS <span className="text-brand-accent">DJERBA</span>
                    </span>
                </div>

                <div className="flex space-x-6">
                    <a href={BUSINESS_INFO.social.facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-brand-accent transition-colors">
                        <Facebook size={20} />
                    </a>
                    <span className="text-gray-600 hover:text-gray-500 transition-colors cursor-not-allowed">
                        <Instagram size={20} />
                    </span>
                     <span className="text-gray-600 hover:text-gray-500 transition-colors cursor-not-allowed">
                        <Twitter size={20} />
                    </span>
                </div>
            </div>
            
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8"></div>

            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} MSIS DJERBA. All rights reserved.</p>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    <span className="hover:text-gray-300 cursor-pointer">Privacy Policy</span>
                    <span className="hover:text-gray-300 cursor-pointer">Terms of Service</span>
                </div>
            </div>
        </div>
    </footer>
  );
};

export default Footer;