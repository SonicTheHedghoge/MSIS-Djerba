import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';

interface CartItem extends Product {
  cartId: string; // Unique ID for cart instance
  quantity: number;
  activePrice: number;
}

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  cartTotal: number;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, price: number) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load Cart
  useEffect(() => {
    const savedCart = localStorage.getItem('msis_cart');
    if (savedCart) setItems(JSON.parse(savedCart));
  }, []);

  // Save Cart
  useEffect(() => {
    localStorage.setItem('msis_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, price: number) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, cartId: `${product.id}_${Date.now()}`, quantity: 1, activePrice: price }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartId: string) => {
    setItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const clearCart = () => setItems([]);

  const cartTotal = items.reduce((sum, item) => sum + (item.activePrice * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items, isCartOpen, cartTotal,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      addToCart, removeFromCart, updateQuantity, clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};