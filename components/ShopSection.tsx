import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Search, Filter, X } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { ProductFilter } from '../types';

const ShopSection: React.FC = () => {
  const { products, categories, getProductPrice } = useStore();
  const [activeImageIndices, setActiveImageIndices] = useState<Record<string, number>>({});
  
  // Filter State
  const [filters, setFilters] = useState<ProductFilter>({
    search: '',
    categoryId: '',
    brand: '',
    minPrice: 0,
    maxPrice: 10000,
    onlyInStock: false,
    onlyDiscounted: false
  });

  const [showFilters, setShowFilters] = useState(false);

  // Derived Brands for Filter
  const brands = useMemo(() => Array.from(new Set(products.map(p => p.brand))), [products]);

  // Robust Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const { currentPrice, originalPrice } = getProductPrice(product);
      const isDiscounted = currentPrice < originalPrice;

      // Text Search
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        product.name.toLowerCase().includes(searchLower) || 
        product.description.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
      if (filters.categoryId && product.categoryId !== filters.categoryId) return false;
      if (filters.brand && product.brand !== filters.brand) return false;
      if (currentPrice < filters.minPrice || currentPrice > filters.maxPrice) return false;
      if (filters.onlyInStock && product.stock <= 0) return false;
      if (filters.onlyDiscounted && !isDiscounted) return false;

      return true;
    });
  }, [products, filters, getProductPrice]);

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
    <section id="shop" className="py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-8 border-b border-gray-100 pb-8">
            <div>
                <h2 className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] tracking-tight mb-4">
                    Store. <span className="text-[#86868b]">The best way to buy.</span>
                </h2>
                <p className="text-lg text-[#86868b] max-w-xl">
                    Browse our curated selection of high-quality electronics available in-store.
                </p>
            </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 items-center bg-[#f5f5f7] p-4 rounded-2xl">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search by name, brand, or description..."
                        className="w-full bg-white border-none rounded-xl py-3 pl-12 pr-4 text-[#1d1d1f] focus:ring-2 focus:ring-[#0071e3] outline-none shadow-sm"
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                </div>
                <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${showFilters ? 'bg-[#1d1d1f] text-white' : 'bg-white text-[#1d1d1f] shadow-sm hover:bg-gray-100'}`}
                >
                    <Filter size={18} /> Filters
                </button>
            </div>

            {/* Expandable Filter Panel */}
            {showFilters && (
                <div className="mt-4 p-6 bg-white border border-gray-100 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
                        <select 
                            className="w-full bg-[#f5f5f7] rounded-lg p-2 text-sm"
                            value={filters.categoryId}
                            onChange={(e) => setFilters(prev => ({ ...prev, categoryId: e.target.value }))}
                        >
                            <option value="">All Categories</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Brand</label>
                        <select 
                             className="w-full bg-[#f5f5f7] rounded-lg p-2 text-sm"
                             value={filters.brand}
                             onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                        >
                            <option value="">All Brands</option>
                            {brands.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Price Range ({filters.maxPrice} TND)</label>
                        <input 
                            type="range" min="0" max="10000" step="100" 
                            className="w-full accent-[#0071e3]"
                            value={filters.maxPrice}
                            onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                        />
                    </div>
                    <div className="flex flex-col justify-center gap-2">
                        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={filters.onlyDiscounted}
                                onChange={(e) => setFilters(prev => ({ ...prev, onlyDiscounted: e.target.checked }))}
                                className="rounded text-[#0071e3] focus:ring-[#0071e3]" 
                            />
                            Discounted Only
                        </label>
                        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={filters.onlyInStock}
                                onChange={(e) => setFilters(prev => ({ ...prev, onlyInStock: e.target.checked }))}
                                className="rounded text-[#0071e3] focus:ring-[#0071e3]" 
                            />
                            In Stock Only
                        </label>
                    </div>
                    <button 
                        className="md:col-span-4 text-center text-sm text-[#0071e3] hover:underline"
                        onClick={() => setFilters({
                            search: '', categoryId: '', brand: '', minPrice: 0, maxPrice: 10000, onlyInStock: false, onlyDiscounted: false
                        })}
                    >
                        Reset All Filters
                    </button>
                </div>
            )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-xl font-medium">No products found matching your criteria.</p>
                <button 
                    onClick={() => setFilters({search: '', categoryId: '', brand: '', minPrice: 0, maxPrice: 10000, onlyInStock: false, onlyDiscounted: false})}
                    className="mt-4 text-[#0071e3] font-medium"
                >
                    Clear Filters
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {filteredProducts.map((product) => {
                    const currentImageIndex = activeImageIndices[product.id] || 0;
                    const { currentPrice, originalPrice, discountLabel } = getProductPrice(product);
                    const isDiscounted = currentPrice < originalPrice;
                    const categoryName = categories.find(c => c.id === product.categoryId)?.name || 'Product';
                    
                    return (
                        <div key={product.id} className="group flex flex-col">
                            
                            {/* Image Container */}
                            <div className="relative aspect-[4/3] rounded-[30px] bg-[#f5f5f7] overflow-hidden mb-8 transition-transform duration-500 hover:scale-[1.02] cursor-pointer">
                                
                                {/* Tags */}
                                <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
                                    {isDiscounted && (
                                        <span className="bg-[#bf4800] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                                            {discountLabel || 'SALE'}
                                        </span>
                                    )}
                                    <span className="bg-white/80 backdrop-blur-sm text-[#1d1d1f] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/40">
                                        {categoryName}
                                    </span>
                                    {product.stock <= 0 && (
                                         <span className="bg-gray-800 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                            Out of Stock
                                        </span>
                                    )}
                                </div>

                                {/* Images */}
                                {product.images.map((img, idx) => (
                                    <div 
                                        key={idx}
                                        className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${idx === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                                    >
                                        <img 
                                            src={img} 
                                            alt={product.name} 
                                            className="w-full h-full object-cover mix-blend-multiply p-8 group-hover:p-6 transition-all duration-700" 
                                        />
                                    </div>
                                ))}

                                {/* Controls */}
                                {product.images.length > 1 && (
                                    <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2 z-20">
                                        {product.images.map((_, idx) => (
                                            <button 
                                                key={idx}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setActiveImageIndices(prev => ({...prev, [product.id]: idx}));
                                                }}
                                                className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${idx === currentImageIndex ? 'bg-[#1d1d1f] w-6' : 'bg-black/20 w-1.5 hover:bg-black/40'}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex flex-col flex-1 px-2">
                                <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-2 group-hover:text-[#0071e3] transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-[#86868b] text-[15px] leading-relaxed mb-6 line-clamp-2 min-h-[48px]">
                                    {product.description}
                                </p>
                                
                                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-6">
                                    <div>
                                        <span className="block text-xs font-bold text-[#86868b] uppercase tracking-wide mb-0.5">Price</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-lg font-semibold text-[#1d1d1f]">
                                                {currentPrice.toFixed(2)} TND
                                            </span>
                                            {isDiscounted && (
                                                <span className="text-sm text-gray-400 line-through">
                                                    {originalPrice.toFixed(2)} TND
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button 
                                        disabled={product.stock <= 0}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${product.stock > 0 ? 'bg-[#f5f5f7] text-[#0071e3] hover:bg-[#0071e3] hover:text-white' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
                                    >
                                        <ShoppingCart size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </div>
    </section>
  );
};

export default ShopSection;
