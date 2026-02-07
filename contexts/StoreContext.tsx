import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, Offer, SiteSettings } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS_RAW } from '../constants';
import { supabase } from '../services/supabaseClient';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  offers: Offer[];
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addOffer: (offer: Offer) => void;
  updateOffer: (id: string, updates: Partial<Offer>) => void;
  deleteOffer: (id: string) => void;
  addCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  getProductPrice: (product: Product) => { currentPrice: number; originalPrice: number; discountLabel?: string };
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Seed Data Transformation
const SEED_CATEGORIES: Category[] = [
  { id: 'cat_laptops', name: 'Laptops', slug: 'laptops' },
  { id: 'cat_accessories', name: 'Accessories', slug: 'accessories' },
  { id: 'cat_computers', name: 'Computers', slug: 'computers' },
  { id: 'cat_components', name: 'Components', slug: 'components' }
];

// Transform existing constants to new robust structure
const SEED_PRODUCTS: Product[] = INITIAL_PRODUCTS_RAW.map(p => ({
  id: p.id,
  name: p.name,
  brand: p.name.split(' ')[0], // Simple heuristic for seed data
  categoryId: p.category === 'Professional Laptops' ? 'cat_laptops' : 
              p.category === 'Accessories' ? 'cat_accessories' : 'cat_computers',
  description: p.description,
  specs: {}, // Seed data doesn't have map, would be parsed in real app
  price: typeof p.price === 'number' ? p.price : (typeof p.price === 'string' && !isNaN(parseFloat(p.price)) ? parseFloat(p.price) : 999),
  stock: 10,
  images: p.images,
  createdAt: new Date().toISOString()
}));

const SEED_OFFERS: Offer[] = [
  {
    id: 'offer_1',
    name: 'Power Bank Sale',
    type: 'PERCENTAGE',
    value: 50,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000 * 30).toISOString(),
    productIds: ['romoss-pb-01'],
    isActive: true,
    description: 'Up to 50% OFF'
  }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(SEED_CATEGORIES);
  const [offers, setOffers] = useState<Offer[]>(SEED_OFFERS);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({ theme: 'default', is_dark_mode: false });

  // 1. Fetch Data on Mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('msis_products');
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    
    const savedOffers = localStorage.getItem('msis_offers');
    if (savedOffers) setOffers(JSON.parse(savedOffers));

    const savedCats = localStorage.getItem('msis_categories');
    if (savedCats) setCategories(JSON.parse(savedCats));

    fetchSettings();

    // Real-time subscription for settings
    const subscription = supabase
      .channel('site_settings_changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'site_settings' }, (payload) => {
        setSiteSettings({
            theme: payload.new.theme,
            is_dark_mode: payload.new.is_dark_mode
        });
      })
      .subscribe();

    return () => {
        subscription.unsubscribe();
    };
  }, []);

  const fetchSettings = async () => {
    // Removed unused 'error' variable
    const { data } = await supabase.from('site_settings').select('*').single();
    if (data) {
        setSiteSettings({ theme: data.theme, is_dark_mode: data.is_dark_mode });
    }
  };

  const updateSiteSettings = async (updates: Partial<SiteSettings>) => {
      // Optimistic update
      setSiteSettings(prev => ({ ...prev, ...updates }));
      
      const { error } = await supabase
        .from('site_settings')
        .update(updates)
        .eq('id', 1);
        
      if (error) console.error("Failed to update settings:", error);
  };

  // Local Persistence for Product Data (Simulated DB)
  useEffect(() => {
    localStorage.setItem('msis_products', JSON.stringify(products));
    localStorage.setItem('msis_offers', JSON.stringify(offers));
    localStorage.setItem('msis_categories', JSON.stringify(categories));
  }, [products, offers, categories]);

  // CRUD Operations
  const addProduct = (product: Product) => setProducts([...products, product]);
  
  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addOffer = (offer: Offer) => setOffers([...offers, offer]);
  
  const updateOffer = (id: string, updates: Partial<Offer>) => {
    setOffers(offers.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const deleteOffer = (id: string) => {
    setOffers(offers.filter(o => o.id !== id));
  };

  const addCategory = (category: Category) => setCategories([...categories, category]);
  
  const deleteCategory = (id: string) => {
    const inUse = products.some(p => p.categoryId === id);
    if (inUse) {
      alert("Cannot delete category currently in use by products.");
      return;
    }
    setCategories(categories.filter(c => c.id !== id));
  };

  const getProductPrice = (product: Product) => {
    const now = new Date();
    const activeOffer = offers.find(o => 
      o.isActive && 
      o.productIds.includes(product.id) && 
      new Date(o.startDate) <= now && 
      new Date(o.endDate) >= now
    );

    if (!activeOffer) {
      return { currentPrice: product.price, originalPrice: product.price };
    }

    let currentPrice = product.price;
    if (activeOffer.type === 'PERCENTAGE') {
      currentPrice = product.price * (1 - activeOffer.value / 100);
    } else {
      currentPrice = Math.max(0, product.price - activeOffer.value);
    }

    return { 
      currentPrice, 
      originalPrice: product.price, 
      discountLabel: activeOffer.name 
    };
  };

  return (
    <StoreContext.Provider value={{
      products, categories, offers, siteSettings,
      updateSiteSettings,
      addProduct, updateProduct, deleteProduct,
      addOffer, updateOffer, deleteOffer,
      addCategory, deleteCategory,
      getProductPrice
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};