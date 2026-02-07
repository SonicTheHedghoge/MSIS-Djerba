import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, ShieldCheck, Loader, MapPin } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

// Declare Leaflet on window since we load it via CDN
declare global {
  interface Window {
    L: any;
  }
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[];
  total: number;
  onSuccess: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cartItems, total, onSuccess }) => {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [error, setError] = useState('');
  
  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [locationCoords, setLocationCoords] = useState<{lat: number, lng: number} | null>(null);

  // Map Refs
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  useEffect(() => {
    if (isOpen && step === 'form' && window.L && mapRef.current && !mapInstance.current) {
      // Default to Houmt Souk Center
      const defaultLat = 33.876;
      const defaultLng = 10.858;

      mapInstance.current = window.L.map(mapRef.current).setView([defaultLat, defaultLng], 14);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; MSIS DJERBA'
      }).addTo(mapInstance.current);

      mapInstance.current.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        setLocationCoords({ lat, lng });

        if (markerInstance.current) {
          markerInstance.current.setLatLng([lat, lng]);
        } else {
          markerInstance.current = window.L.marker([lat, lng]).addTo(mapInstance.current);
        }
      });
    }

    // Cleanup
    return () => {
      if (!isOpen && mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        markerInstance.current = null;
      }
    };
  }, [isOpen, step]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // --- Validation ---
    if (!firstName || !lastName || !email || !phone) {
      setError("Please fill in all required fields.");
      return;
    }
    
    if (!locationCoords) {
      setError("Please click on the map to pin your exact delivery location.");
      return;
    }

    setStep('processing');

    const fullName = `${firstName} ${lastName}`;
    const googleMapsUrl = `https://www.google.com/maps?q=${locationCoords.lat},${locationCoords.lng}`;
    const formattedTotal = `${total.toFixed(2)} TND`;
    
    // Data prep
    const productJson = cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.activePrice,
        quantity: item.quantity
    }));

    try {
      // ---------------------------------------------------------
      // 1. Store in Supabase (CRITICAL STEP)
      // ---------------------------------------------------------
      // We set a timeout for the DB call so it doesn't hang forever
      const dbPromise = supabase
        .from('orders')
        .insert([{
          full_name: fullName,
          email: email,
          phone: phone,
          message: `${message}\n\nLocation: ${googleMapsUrl}`,
          products: productJson,
          total_amount: total,
          status: 'PENDING'
        }]);
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out')), 10000)
      );

      const { error: sbError } = await Promise.race([dbPromise, timeoutPromise]) as any;

      if (sbError) {
        console.error("Supabase Error:", sbError);
        throw new Error("Connection failed. Please try again.");
      }

      // ---------------------------------------------------------
      // 2. Success - Update UI Immediately
      // ---------------------------------------------------------
      setStep('success');

      // ---------------------------------------------------------
      // 3. Send Notifications (BACKGROUND - Fire and Forget)
      // ---------------------------------------------------------
      // We do NOT await these. This prevents the UI from hanging if emails fail.
      const sendNotifications = async () => {
        const cartSummary = cartItems.map(item => 
          `- ${item.quantity}x ${item.name} (${item.activePrice} TND)`
        ).join('\n');

        const formspreeData = new FormData();
        formspreeData.append('firstName', firstName);
        formspreeData.append('lastName', lastName);
        formspreeData.append('email', email);
        formspreeData.append('phone', phone);
        formspreeData.append('message', message);
        formspreeData.append('exactLocation', googleMapsUrl);
        formspreeData.append('orderTotal', formattedTotal);
        formspreeData.append('cartDetails', cartSummary);

        // Send Formspree
        fetch("https://formspree.io/f/mlgwenjn", {
            method: "POST",
            body: formspreeData,
            headers: { 'Accept': 'application/json' }
        }).catch(err => console.warn("Formspree ignored:", err));

        // Send Resend Confirmation
        fetch('/api/send-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                firstName,
                lastName,
                orderTotal: formattedTotal,
                products: productJson,
                googleMapsUrl
            })
        }).catch(err => console.warn("Resend ignored:", err));
      };

      sendNotifications();

      // Close modal after delay
      setTimeout(() => onSuccess(), 1500);

    } catch (err: any) {
      console.error("Order Error:", err);
      setError(err.message || "Failed to submit order. Please try again.");
      setStep('form');
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up">
        
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                  <h2 className="text-2xl font-bold text-[#1d1d1f]">Checkout</h2>
                  <p className="text-xs text-gray-500">Fill in your details to confirm purchase.</p>
              </div>
              <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-500"/>
              </button>
            </div>

            <div className="space-y-5 mb-8">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">First Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" required
                    className="w-full bg-[#f5f5f7] border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#0071e3] outline-none transition-all"
                    value={firstName} onChange={e => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Last Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" required
                    className="w-full bg-[#f5f5f7] border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#0071e3] outline-none transition-all"
                    value={lastName} onChange={e => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email <span className="text-red-500">*</span></label>
                  <input 
                    type="email" required
                    className="w-full bg-[#f5f5f7] border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#0071e3] outline-none transition-all"
                    value={email} onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone <span className="text-red-500">*</span></label>
                  <input 
                    type="tel" required
                    className="w-full bg-[#f5f5f7] border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#0071e3] outline-none transition-all"
                    placeholder="20 123 456"
                    value={phone} onChange={e => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Map Section */}
              <div className="bg-white rounded-xl border border-gray-200 p-1">
                <div className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-t-lg mb-1">
                    <label className="text-xs font-bold text-gray-600 uppercase flex items-center gap-2">
                        <MapPin size={14} className="text-[#0071e3]" /> Pin Delivery Location <span className="text-red-500">*</span>
                    </label>
                    {locationCoords && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                            Selected
                        </span>
                    )}
                </div>
                <div className="w-full h-[250px] rounded-lg overflow-hidden relative z-0">
                  <div ref={mapRef} className="w-full h-full z-0"></div>
                  {!locationCoords && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/5 z-[1000]">
                      <span className="bg-white/90 px-4 py-2 rounded-full text-xs font-bold shadow-lg text-[#1d1d1f] animate-bounce">
                        Tap map to select location
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Notes (Optional)</label>
                <textarea 
                  className="w-full bg-[#f5f5f7] border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#0071e3] outline-none h-20 resize-none"
                  placeholder="Any special instructions?"
                  value={message} onChange={e => setMessage(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 text-red-600 text-sm p-3 rounded-xl flex items-center gap-2 font-medium">
                <ShieldCheck size={16} /> {error}
              </div>
            )}

            <div className="flex items-center justify-between border-t border-gray-100 pt-6">
              <div className="text-sm text-gray-500">
                Total Amount: <span className="text-[#1d1d1f] font-bold text-xl ml-2">{total.toFixed(2)} TND</span>
              </div>
              <button 
                type="submit"
                className="bg-[#1d1d1f] text-white px-8 py-3.5 rounded-full font-medium hover:bg-black transition-all shadow-xl shadow-black/5 hover:shadow-black/10 active:scale-95"
              >
                Confirm Order
              </button>
            </div>
          </form>
        )}

        {step === 'processing' && (
          <div className="p-16 flex flex-col items-center justify-center text-center h-[400px]">
            <Loader size={48} className="text-[#0071e3] animate-spin mb-6" />
            <h3 className="text-xl font-bold text-[#1d1d1f] mb-2">Processing Order</h3>
            <p className="text-gray-500">Securing your products...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-16 flex flex-col items-center justify-center text-center h-[400px]">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-fade-in-up">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-[#1d1d1f] mb-2">Order Confirmed!</h3>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto">
              Thank you, <b>{firstName}</b>. We have received your order and will contact you shortly.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default CheckoutModal;