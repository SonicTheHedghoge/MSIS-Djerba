import React, { useState } from 'react';
import { Search, Tag, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { PRODUCTS } from '../constants';

const ShopSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeImageIndices, setActiveImageIndices] = useState<Record<string, number>>({});

  // Filter products based on search term
  const filteredProducts = PRODUCTS.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.details.some(detail => detail.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleNextImage = (productId: string, totalImages: number, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveImageIndices(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % totalImages
    }));
  };

  const handlePrevImage = (productId: string, totalImages: number, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveImageIndices(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + totalImages) % totalImages
    }));
  };

  return (
    <section id="shop" className="py-24 relative overflow-hidden">
      {/* Decorative Background - Adjusted to be more subtle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
            <span className="text-brand-accent font-bold tracking-widest uppercase text-sm mb-2 block">Latest Arrivals</span>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Featured Products</h2>
            <div className="max-w-xl mx-auto relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-accent to-brand-secondary rounded-full blur opacity-25 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative bg-brand-surface/60 backdrop-blur-md border border-white/10 rounded-full flex items-center p-2 shadow-2xl">
                    <Search className="text-gray-400 ml-4 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search for power banks, laptops..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent border-none focus:outline-none text-white px-4 py-2 w-full placeholder-gray-500"
                    />
                </div>
            </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                    const currentImageIndex = activeImageIndices[product.id] || 0;
                    
                    return (
                        <div key={product.id} className="group relative glass-panel rounded-3xl overflow-hidden hover:border-brand-accent/30 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-accent/10 hover:-translate-y-2">
                            
                            {/* Discount Badge */}
                            {product.discount && (
                                <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse-slow flex items-center gap-1">
                                    <Tag className="w-3 h-3" /> {product.discount}
                                </div>
                            )}

                            {/* Image Carousel */}
                            <div className="relative aspect-video w-full overflow-hidden bg-brand-dark/50">
                                {product.images.map((img, idx) => (
                                    <div 
                                        key={idx}
                                        className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${idx === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                                    >
                                        <img 
                                            src={img} 
                                            alt={`${product.name} ${idx + 1}`} 
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                ))}
                                
                                {/* Carousel Controls */}
                                {product.images.length > 1 && (
                                    <>
                                        <button 
                                            onClick={(e) => handlePrevImage(product.id, product.images.length, e)}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-brand-accent/80 p-2 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button 
                                            onClick={(e) => handleNextImage(product.id, product.images.length, e)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-brand-accent/80 p-2 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                            {product.images.map((_, idx) => (
                                                <div 
                                                    key={idx} 
                                                    className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/40'}`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-brand-accent transition-colors">{product.name}</h3>
                                        <p className="text-brand-accent/80 text-sm font-medium">{product.category}</p>
                                    </div>
                                    {product.price && (
                                         <span className="text-xl font-bold text-white bg-white/5 px-3 py-1 rounded-lg border border-white/10">{product.price}</span>
                                    )}
                                </div>
                                
                                <p className="text-gray-400 mb-6 leading-relaxed">
                                    {product.description}
                                </p>

                                {/* Features / Models List */}
                                <div className="space-y-2 mb-8 bg-black/20 p-4 rounded-xl border border-white/5">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Available Models:</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {product.details.map((detail, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                                                <Check className="w-3 h-3 text-brand-accent" />
                                                {detail}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button className="w-full py-4 bg-brand-accent text-brand-dark font-bold rounded-xl hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-accent/20">
                                    Contact for Availability
                                </button>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="col-span-1 md:col-span-2 text-center py-12">
                    <p className="text-gray-400 text-lg">No products found matching "{searchTerm}".</p>
                    <button 
                        onClick={() => setSearchTerm('')}
                        className="mt-4 text-brand-accent hover:underline"
                    >
                        Clear search
                    </button>
                </div>
            )}
        </div>
      </div>
    </section>
  );
};

export default ShopSection;