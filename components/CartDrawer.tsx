import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import CheckoutModal from './CheckoutModal';

const CartDrawer: React.FC = () => {
  const { items, isCartOpen, closeCart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={closeCart}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] animate-fade-in"
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col animate-slide-in-right transition-transform duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#1d1d1f]" />
            <h2 className="text-xl font-semibold text-[#1d1d1f]">Your Bag</h2>
            <span className="text-sm text-gray-400 font-medium">({items.length} items)</span>
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <ShoppingBag size={32} className="text-gray-300" />
              </div>
              <div>
                <p className="text-lg font-medium text-[#1d1d1f]">Your bag is empty</p>
                <p className="text-gray-500 text-sm">Start shopping to add items to your bag.</p>
              </div>
              <button onClick={closeCart} className="text-[#0071e3] font-medium hover:underline">
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.cartId} className="flex gap-4 group">
                <div className="w-20 h-20 bg-[#f5f5f7] rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-medium text-[#1d1d1f] leading-tight mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.brand}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 bg-[#f5f5f7] rounded-full px-2 py-1">
                      <button 
                        onClick={() => updateQuantity(item.cartId, -1)}
                        className="p-1 hover:text-[#0071e3] transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.cartId, 1)}
                        className="p-1 hover:text-[#0071e3] transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="text-right">
                       <p className="font-semibold text-[#1d1d1f]">{(item.activePrice * item.quantity).toFixed(2)} TND</p>
                       <button onClick={() => removeFromCart(item.cartId)} className="text-[10px] text-red-500 hover:underline">Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white/80 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-xl font-bold text-[#1d1d1f]">{cartTotal.toFixed(2)} TND</span>
            </div>
            <p className="text-xs text-gray-400 mb-6 text-center">
              Shipping and taxes calculated at confirmation.
            </p>
            <button 
              onClick={() => {
                closeCart();
                setIsCheckoutOpen(true);
              }}
              className="w-full bg-[#0071e3] text-white py-4 rounded-xl font-medium text-lg hover:bg-[#0077ED] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/20"
            >
              Confirm Order <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal 
          isOpen={isCheckoutOpen} 
          onClose={() => setIsCheckoutOpen(false)} 
          cartItems={items} 
          total={cartTotal}
          onSuccess={clearCart}
        />
      )}
    </>
  );
};

export default CartDrawer;