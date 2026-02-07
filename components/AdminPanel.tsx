import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import { Product, Offer, Order, SiteTheme } from '../types';
import { supabase } from '../services/supabaseClient';
import { Plus, Trash2, Edit2, LogOut, Package, Tag, Layers, X, ShieldAlert, KeyRound, QrCode, ShoppingBag, Upload, Loader, Palette, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';

const AdminPanel: React.FC = () => {
  const { user, login, logout, isLocked, lockoutTimeRemaining, requiresMfaSetup, mfaSecret, completeMfaSetup, logs, logAction } = useAuth();
  const { 
    products, categories, offers, siteSettings, updateSiteSettings,
    addProduct, updateProduct, deleteProduct,
    addCategory, deleteCategory,
    addOffer, deleteOffer, updateOffer
  } = useStore();

  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mfaToken, setMfaToken] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // Dashboard State
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'offers' | 'categories' | 'audit' | 'themes'>('orders');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingOffer, setEditingOffer] = useState<Partial<Offer> | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch Orders
  useEffect(() => {
    if (user?.isAuthenticated && activeTab === 'orders') {
      const fetchOrders = async () => {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) console.error("Error fetching orders:", error);
        if (data) setOrders(data as Order[]);
      };
      fetchOrders();
    }
  }, [user, activeTab]);

  // Generate QR Code when MFA Setup is required
  useEffect(() => {
    if (requiresMfaSetup && mfaSecret) {
      const uri = `otpauth://totp/MSIS_Admin:${user?.username}?secret=${mfaSecret}&issuer=MSIS_Admin`;
      QRCode.toDataURL(uri).then(setQrCodeUrl);
    }
  }, [requiresMfaSetup, mfaSecret, user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requiresMfaSetup) {
       completeMfaSetup();
       return;
    }

    setIsLoggingIn(true);
    setLoginError('');
    const result = await login(username, password, mfaToken);
    setIsLoggingIn(false);
    
    if (!result.success) {
      setLoginError(result.message || 'Authentication Failed');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      if (data) {
          const currentImages = editingProduct?.images || [];
          setEditingProduct(prev => prev ? ({...prev, images: [...currentImages, data.publicUrl]}) : null);
      }
    } catch (error) {
      alert('Upload failed: ' + (error as any).message);
    } finally {
        setIsUploading(false);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name || !editingProduct.price) return;
    const action = editingProduct.id ? 'UPDATE_PRODUCT' : 'CREATE_PRODUCT';
    if (editingProduct.id) updateProduct(editingProduct.id, editingProduct);
    else addProduct({ ...editingProduct, id: `prod_${Date.now()}`, createdAt: new Date().toISOString(), images: editingProduct.images?.length ? editingProduct.images : ['https://via.placeholder.com/400'], specs: editingProduct.specs || {}, stock: editingProduct.stock || 0 } as Product);
    logAction(action, `Product: ${editingProduct.name}`, 'INFO');
    setEditingProduct(null);
  };

  const handleSaveOffer = (e: React.FormEvent) => {
      e.preventDefault();
      if(!editingOffer) return;
      if(editingOffer.id) updateOffer(editingOffer.id, editingOffer);
      else addOffer({ ...editingOffer, id: `offer_${Date.now()}`, isActive: true, productIds: editingOffer.productIds || [] } as Offer);
      logAction(editingOffer.id ? 'UPDATE_OFFER' : 'CREATE_OFFER', `Offer: ${editingOffer.name}`, 'INFO');
      setEditingOffer(null);
  };

  // --- LOCKOUT VIEW ---
  if (isLocked) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-red-200 text-center">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-2">System Locked</h2>
          <div className="text-3xl font-mono font-bold text-red-500 mb-4">
            {Math.floor(lockoutTimeRemaining / 60)}:{(lockoutTimeRemaining % 60).toString().padStart(2, '0')}
          </div>
        </div>
      </div>
    );
  }

  // --- MFA SETUP VIEW ---
  if (requiresMfaSetup && user) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
             <div className="text-center mb-6">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                   {/* QrCode Used Here */}
                   <QrCode className="text-[#0071e3]" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-[#1d1d1f]">MFA Setup Required</h2>
             </div>
             <div className="bg-gray-50 p-4 rounded-xl mb-6 flex justify-center">
               {qrCodeUrl && <img src={qrCodeUrl} alt="MFA QR Code" className="w-48 h-48" />}
             </div>
             <button onClick={completeMfaSetup} className="w-full bg-[#0071e3] text-white py-3 rounded-xl font-medium">I Have Scanned The Code</button>
        </div>
      </div>
    );
  }

  // --- LOGIN VIEW ---
  if (!user?.isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
          <h2 className="text-3xl font-bold text-[#1d1d1f] tracking-tight text-center mb-8">System Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-[#f5f5f7] border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#0071e3] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#f5f5f7] border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#0071e3] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">MFA Code</label>
              <input type="text" inputMode="numeric" maxLength={6} value={mfaToken} onChange={(e) => setMfaToken(e.target.value)} className="w-full bg-[#f5f5f7] border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#0071e3] outline-none font-mono tracking-widest text-center text-lg" placeholder="000 000" />
            </div>
            {loginError && <div className="bg-red-50 text-red-500 text-xs p-3 rounded-lg">{loginError}</div>}
            <button type="submit" disabled={isLoggingIn} className="w-full bg-[#1d1d1f] text-white py-3 rounded-xl font-medium">{isLoggingIn ? 'Verifying...' : 'Authenticate'}</button>
            <div className="mt-6 text-center"><Link to="/" className="text-gray-400 text-xs hover:text-[#0071e3]">Return to Public Site</Link></div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col fixed h-full z-10">
        <div className="mb-10 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1d1d1f] flex items-center justify-center text-white"><ShieldAlert size={14} /></div>
            <span className="font-bold text-lg text-[#1d1d1f]">SysAdmin</span>
        </div>
        <nav className="flex-1 space-y-2">
            <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-[#0071e3] text-white' : 'text-gray-500 hover:bg-gray-100'}`}><ShoppingBag size={18} /> Orders</button>
            <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-[#0071e3] text-white' : 'text-gray-500 hover:bg-gray-100'}`}><Package size={18} /> Products</button>
            <button onClick={() => setActiveTab('offers')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'offers' ? 'bg-[#0071e3] text-white' : 'text-gray-500 hover:bg-gray-100'}`}><Tag size={18} /> Offers</button>
            <button onClick={() => setActiveTab('categories')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'categories' ? 'bg-[#0071e3] text-white' : 'text-gray-500 hover:bg-gray-100'}`}><Layers size={18} /> Categories</button>
            <button onClick={() => setActiveTab('themes')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'themes' ? 'bg-[#0071e3] text-white' : 'text-gray-500 hover:bg-gray-100'}`}><Palette size={18} /> Theme Center</button>
            <button onClick={() => setActiveTab('audit')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'audit' ? 'bg-[#0071e3] text-white' : 'text-gray-500 hover:bg-gray-100'}`}><KeyRound size={18} /> Security Logs</button>
        </nav>
        <div className="pt-6 border-t border-gray-100">
            <button onClick={logout} className="w-full flex items-center justify-center gap-2 text-red-500 bg-red-50 py-2 rounded-lg text-sm font-medium hover:bg-red-100"><LogOut size={16} /> Secure Logout</button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-10">
        
        {activeTab === 'orders' && (
             <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-[#1d1d1f] mb-8">Incoming Orders</h1>
                {orders.length === 0 ? (
                  <div className="text-center p-12 bg-white rounded-3xl border border-gray-200">
                    <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No orders received yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="font-bold text-lg text-[#1d1d1f]">{order.full_name}</h3>
                              <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">{new Date(order.created_at).toLocaleString()}</span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">{order.phone} • {order.email}</div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{order.status}</span>
                        </div>
                        <div className="bg-[#f5f5f7] rounded-xl p-4 mb-4">
                          <ul className="space-y-2">{order.products?.map((p, idx) => (<li key={idx} className="flex justify-between text-sm"><span>{p.quantity}x {p.name}</span><span className="font-medium">{p.price.toFixed(2)} TND</span></li>))}</ul>
                          <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-bold text-[#1d1d1f]"><span>Total</span><span>{order.total_amount.toFixed(2)} TND</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
        )}

        {activeTab === 'products' && (
             <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8"><h1 className="text-3xl font-bold text-[#1d1d1f]">Product Management</h1><button onClick={() => setEditingProduct({ name: '', price: 0, stock: 0, description: '', categoryId: categories[0]?.id || '', images: [] })} className="bg-[#1d1d1f] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-black"><Plus size={18} /> Add Product</button></div>
                {editingProduct ? (
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">{editingProduct.id ? 'Edit Product' : 'New Product'}</h3><button onClick={() => setEditingProduct(null)}><X size={24} className="text-gray-400"/></button></div>
                        <form onSubmit={handleSaveProduct} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Name</label><input required type="text" className="w-full bg-[#f5f5f7] rounded-lg p-3" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} /></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Price</label><input required type="number" className="w-full bg-[#f5f5f7] rounded-lg p-3" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} /></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Stock</label><input required type="number" className="w-full bg-[#f5f5f7] rounded-lg p-3" value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})} /></div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
                                    <select className="w-full bg-[#f5f5f7] rounded-lg p-3" value={editingProduct.categoryId} onChange={e => setEditingProduct({...editingProduct, categoryId: e.target.value})}>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="flex items-center gap-2 cursor-pointer bg-[#1d1d1f] text-white px-4 py-2 rounded-lg w-fit hover:bg-black">
                                    {isUploading ? <Loader className="animate-spin" size={18} /> : <Upload size={18} />}
                                    {isUploading ? 'Uploading...' : 'Upload Image'}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                                </label>
                            </div>
                            <button type="submit" className="w-full bg-[#0071e3] text-white py-3 rounded-lg font-bold">Save Product</button>
                        </form>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-[#f5f5f7] border-b border-gray-200">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Product</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Stock</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">{products.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="p-4">{p.name}</td>
                                    <td className="p-4">{p.stock}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => setEditingProduct(p)}><Edit2 size={18} className="text-gray-400"/></button>
                                        <button onClick={() => { if(confirm('Delete?')) deleteProduct(p.id); }}><Trash2 size={18} className="text-red-400"/></button>
                                    </td>
                                </tr>))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        )}

        {/* OFFERS TAB */}
        {activeTab === 'offers' && (
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-[#1d1d1f]">Offers & Discounts</h1>
                    <button 
                        onClick={() => setEditingOffer({ name: '', type: 'PERCENTAGE', value: 10, productIds: [] })}
                        className="bg-[#1d1d1f] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-black transition-colors"
                    >
                        <Plus size={18} /> Create Offer
                    </button>
                </div>

                {editingOffer ? (
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 animate-fade-in-up">
                        <h3 className="text-xl font-bold mb-6">Create New Offer</h3>
                        <form onSubmit={handleSaveOffer} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Offer Name</label>
                                    <input required type="text" className="w-full bg-[#f5f5f7] rounded-lg p-3" value={editingOffer.name} onChange={e => setEditingOffer({...editingOffer, name: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Discount Type</label>
                                    <select className="w-full bg-[#f5f5f7] rounded-lg p-3" value={editingOffer.type} onChange={e => setEditingOffer({...editingOffer, type: e.target.value as any})}>
                                        <option value="PERCENTAGE">Percentage (%)</option>
                                        <option value="FIXED_AMOUNT">Fixed Amount (TND)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Value</label>
                                    <input required type="number" className="w-full bg-[#f5f5f7] rounded-lg p-3" value={editingOffer.value} onChange={e => setEditingOffer({...editingOffer, value: parseFloat(e.target.value)})} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Apply to Products</label>
                                <div className="bg-[#f5f5f7] p-4 rounded-xl max-h-48 overflow-y-auto grid grid-cols-2 gap-2">
                                    {products.map(p => (
                                        <label key={p.id} className="flex items-center gap-2 text-sm">
                                            <input 
                                                type="checkbox" 
                                                checked={editingOffer.productIds?.includes(p.id)}
                                                onChange={e => {
                                                    const current = editingOffer.productIds || [];
                                                    const updated = e.target.checked ? [...current, p.id] : current.filter(id => id !== p.id);
                                                    setEditingOffer({...editingOffer, productIds: updated});
                                                }}
                                            />
                                            {p.name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                             
                            <div className="flex gap-4">
                                 <button type="button" onClick={() => setEditingOffer(null)} className="w-full bg-gray-100 text-gray-600 py-3 rounded-lg font-bold">Cancel</button>
                                 <button type="submit" className="w-full bg-[#0071e3] text-white py-3 rounded-lg font-bold hover:bg-[#0077ED]">Save Offer</button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {offers.map(offer => (
                            <div key={offer.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-bold text-lg text-[#1d1d1f]">{offer.name}</h3>
                                        <span className="bg-blue-100 text-[#0071e3] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                                            {offer.type === 'PERCENTAGE' ? `${offer.value}% OFF` : `-${offer.value} TND`}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">Applied to {offer.productIds.length} products</p>
                                </div>
                                <button onClick={() => { deleteOffer(offer.id); logAction('DELETE_OFFER', `Deleted offer ${offer.name}`, 'WARNING'); }} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {/* AUDIT LOG TAB */}
        {activeTab === 'audit' && (
             <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-[#1d1d1f] mb-8">Security Audit Logs</h1>
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-[#f5f5f7] border-b border-gray-200">
                            <tr>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Timestamp</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Level</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Action</th>
                                <th className="p-4 text-xs font-bold text-gray-500 uppercase">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {logs.map(log => (
                                <tr key={log.id} className="hover:bg-gray-50 font-mono text-sm">
                                    <td className="p-4 text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                                            log.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' : 
                                            log.severity === 'WARNING' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {log.severity}
                                        </span>
                                    </td>
                                    <td className="p-4 font-bold text-[#1d1d1f]">{log.action}</td>
                                    <td className="p-4 text-gray-600 truncate max-w-xs">{log.details}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
            <div className="max-w-xl mx-auto">
                <h1 className="text-3xl font-bold text-[#1d1d1f] mb-8">Categories</h1>
                
                <div className="flex gap-4 mb-8">
                    <input 
                        type="text" 
                        placeholder="New Category Name" 
                        className="flex-1 bg-white border border-gray-200 rounded-lg px-4"
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                    />
                    <button 
                        onClick={() => {
                            if(newCategory) {
                                addCategory({ id: `cat_${Date.now()}`, name: newCategory, slug: newCategory.toLowerCase().replace(/\s+/g, '-') });
                                logAction('CREATE_CATEGORY', `Created category ${newCategory}`, 'INFO');
                                setNewCategory('');
                            }
                        }}
                        className="bg-[#1d1d1f] text-white px-6 rounded-lg font-medium"
                    >
                        Add
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    {categories.map(cat => (
                        <div key={cat.id} className="flex justify-between items-center p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50">
                            <span className="font-medium">{cat.name}</span>
                            <button onClick={() => { deleteCategory(cat.id); logAction('DELETE_CATEGORY', `Deleted category ${cat.name}`, 'WARNING'); }} className="text-gray-400 hover:text-red-500">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* THEMES TAB */}
        {activeTab === 'themes' && (
             <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
                        <Palette size={24} />
                     </div>
                     <div>
                        <h1 className="text-3xl font-bold text-[#1d1d1f]">Theme Center</h1>
                        <p className="text-gray-500">Manage site-wide appearance and seasonal events.</p>
                     </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Dark Mode Toggle */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-[#1d1d1f] mb-4 flex items-center gap-2">
                            {siteSettings.is_dark_mode ? <Moon size={20} className="text-indigo-500"/> : <Sun size={20} className="text-orange-500"/>}
                            Color Scheme
                        </h3>
                        <div className="flex items-center justify-between p-4 bg-[#f5f5f7] rounded-xl">
                            <span className="font-medium text-gray-700">Dark Mode</span>
                            <button 
                                onClick={() => {
                                    updateSiteSettings({ is_dark_mode: !siteSettings.is_dark_mode });
                                    logAction('THEME_CHANGE', `Toggled Dark Mode to ${!siteSettings.is_dark_mode}`, 'INFO');
                                }}
                                className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${siteSettings.is_dark_mode ? 'bg-[#1d1d1f]' : 'bg-gray-300'}`}
                            >
                                <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${siteSettings.is_dark_mode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-4">
                            Toggles the base color palette of the public website between Light and Apple Dark Gray.
                        </p>
                    </div>

                    {/* Seasonal Theme Selector */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-[#1d1d1f] mb-4">Seasonal Decorations</h3>
                        <div className="space-y-3">
                            {[
                                { id: 'default', label: 'None (Standard)', icon: '⚪️' },
                                { id: 'ramadan', label: 'Ramadan Kareem', icon: '🌙' },
                                { id: 'eid', label: 'Aid El Fitr', icon: '🕌' },
                                { id: 'mawlid', label: 'Mawlid Nabawi', icon: '📿' },
                                { id: 'new_year', label: 'Happy New Year', icon: '🎉' }
                            ].map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => {
                                        updateSiteSettings({ theme: theme.id as SiteTheme });
                                        logAction('THEME_CHANGE', `Changed seasonal theme to ${theme.label}`, 'INFO');
                                    }}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                                        siteSettings.theme === theme.id 
                                        ? 'bg-[#0071e3] text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-500 ring-offset-2' 
                                        : 'bg-[#f5f5f7] text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    <span className="font-medium flex items-center gap-3">
                                        <span className="text-xl">{theme.icon}</span> {theme.label}
                                    </span>
                                    {siteSettings.theme === theme.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}

      </main>
    </div>
  );
};

export default AdminPanel;