import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BUSINESS_INFO } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-light border-t border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                <div className="flex items-center gap-3">
                    <img 
                        src="https://i.ibb.co/7Nnn85zF/302783568-496662659136297-119593787000234011-n.png" 
                        alt="MSIS DJERBA Logo" 
                        className="h-8 w-8 object-cover rounded-full"
                    />
                    <span className="text-lg font-bold tracking-tight text-brand-black">
                    MSIS <span className="text-brand-accent">DJERBA</span>
                    </span>
                </div>

                <div className="flex space-x-6">
                    <a href={BUSINESS_INFO.social.facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-brand-accent transition-colors">
                        <Facebook size={20} />
                    </a>
                    <span className="text-gray-300 hover:text-gray-400 transition-colors cursor-not-allowed">
                        <Instagram size={20} />
                    </span>
                     <span className="text-gray-300 hover:text-gray-400 transition-colors cursor-not-allowed">
                        <Twitter size={20} />
                    </span>
                </div>
            </div>
            
            <div className="h-px w-full bg-gray-200 mb-8"></div>

            <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 font-medium">
                <p>&copy; {new Date().getFullYear()} MSIS DJERBA. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <span className="hover:text-brand-black cursor-pointer transition-colors">Privacy Policy</span>
                    <span className="hover:text-brand-black cursor-pointer transition-colors">Terms of Use</span>
                </div>
            </div>
        </div>
    </footer>
  );
};

export default Footer;