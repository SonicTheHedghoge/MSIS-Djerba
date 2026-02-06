import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SERVICES } from '../constants';

const ProductCategories: React.FC = () => {
  return (
    <section id="products" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Our Expertise</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-brand-accent to-brand-secondary mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                We provide top-tier hardware solutions tailored to your needs, whether you are a gamer, a professional, or a student.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((item) => (
            <div 
              key={item.id} 
              className="group relative p-8 glass-panel rounded-2xl hover:bg-white/5 transition-all duration-500 hover:-translate-y-2 border border-white/5 hover:border-brand-accent/30"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="text-brand-accent" />
              </div>
              
              <div className="mb-6 p-4 bg-brand-surface/50 rounded-xl inline-block group-hover:bg-brand-accent/10 transition-colors">
                {item.icon}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-accent transition-colors">
                {item.title}
              </h3>
              
              <p className="text-gray-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;