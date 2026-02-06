import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../contexts/StoreContext';
import { Product, Offer, Category } from '../types';
import { Plus, Trash2, Edit2, LogOut, Package, Tag, Layers, Image as ImageIcon, Save, X, ShieldAlert, KeyRound, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';

const AdminPanel: React.FC = () => {
  const { user, login, logout, isLocked, lockoutTimeRemaining, requiresMfaSetup, mfaSecret, completeMfaSetup, logs, logAction } = useAuth();
  const { 
    products, categories, offers, 
    addProduct, updateProduct, deleteProduct,
    addCategory, deleteCategory,
    addOffer, deleteOffer
  } = useStore();

  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mfaToken, setMfaToken] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  // Dashboard State
  const [activeTab, setActiveTab] = useState<'products' | 'offers' | 'categories' | 'audit'>('products');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingOffer, setEditingOffer] = useState<Partial<Offer> | null>(null);
  const [newCategory, setNewCategory] = useState('');

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
      // Logic for confirming setup
       // In this flow, we assume the user scans and enters a code to "complete" login, 
       // but our context simplifies this to just "Complete Setup" button for this demo, 
       // effectively trusting the user scanned it.
       // In a real app, we would verify a code here.
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

  // --- LOCKOUT VIEW ---
  if (isLocked) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-red-200 text-center">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-2">System Locked</h2>
          <p className="text-gray-600 mb-4">Too many failed attempts. Security protocol activated.</p>
          <div className="text-3xl font-mono font-bold text-red-500 mb-4">
            {Math.floor(lockoutTimeRemaining / 60)}:{(lockoutTimeRemaining % 60).toString().padStart(2, '0')}
          </div>
          <p className="text-xs text-gray-400">Please wait before trying again.</p>
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
                <QrCode className="text-[#0071e3]" size={24} />
             </div>
             <h2 className="text-2xl font-bold text-[#1d1d1f]">MFA Setup Required</h2>
             <p className="text-gray-500 text-sm mt-2">To secure your admin account, you must set up Two-Factor Authentication.</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl mb-6 flex justify-center">
            {qrCodeUrl ? <img src={qrCodeUrl} alt="MFA QR Code" className="w-48 h-48" /> : <div className="w-48 h-48 bg-gray-200 animate-pulse"></div>}
          </div>

          <div className="mb-6 text-center">
             <p className="text-xs font-bold text-gray-400 uppercase mb-2">Manual Entry Secret</p>
             <code className="bg-gray-100 px-3 py-1 rounded text-sm break-all font-mono select-all">{mfaSecret}</code>
          </div>
          
          <button onClick={completeMfaSetup} className="w-full bg-[#0071e3] text-white py-3 rounded-xl font-medium hover:bg-[#0077ED] transition-colors">
            I Have Scanned The Code
          </button>
        </div>
      </div>
    );
  }

  // --- LOGIN VIEW ---
  if (!user?.isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-[#1d1d1f] tracking-tight">System Access</h2>
            <p className="text-gray-400 text-sm mt-1">Restricted Area. Authorized Personnel Only.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#f5f5f7] border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#0071e3] outline-none"
                placeholder="Admin username"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#f5f5f7] border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#0071e3] outline-none"
                placeholder="Passphrase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">MFA Code</label>
              <input 
                type="text" 
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={mfaToken}
                onChange={(e) => setMfaToken(e.target.value)}
                className="w-full bg-[#f5f5f7] border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-[#0071e3] outline-none font-mono tracking-widest text-center text-lg"
                placeholder="000 000"
              />
              <p className="text-[10px] text-gray-400 mt-2 text-center">Enter the 6-digit code from your authenticator app.</p>
            </div>

            {loginError && (
              <div className="bg-red-50 text-red-500 text-xs p-3 rounded-lg flex items-center gap-2">
                <ShieldAlert size={14} />
                {loginError}
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full bg-[#1d1d1f] text-white py-3 rounded-xl font-medium hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? 'Verifying Credentials...' : 'Authenticate'}
            </button>
            
            <div className="mt-6 text-center">
              <Link to="/" className="text-gray-400 text-xs hover:text-[#0071e3]">Return to Public Site</Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editingProduct.name || !editingProduct.price) {
        alert("Name and Price are required.");
        return;
    }
    const action = editingProduct.id ? 'UPDATE_PRODUCT' : 'CREATE_PRODUCT';
    const details = `Product: ${editingProduct.name}, Price: ${editingProduct.price}`;
    
    if (editingProduct.id) {
        updateProduct(editingProduct.id, editingProduct);
    } else {
        addProduct({
            ...editingProduct,
            id: `prod_${Date.now()}`,
            createdAt: new Date().toISOString(),
            images: editingProduct.images?.length ? editingProduct.images : ['https://via.placeholder.com/400'],
            specs: editingProduct.specs || {},
            stock: editingProduct.stock || 0
        } as Product);
    }
    logAction(action, details, 'INFO');
    setEditingProduct(null);
  };

  const handleSaveOffer = (e: React.FormEvent) => {
      e.preventDefault();
      if(!editingOffer) return;
      const action = editingOffer.id ? 'UPDATE_OFFER' : 'CREATE_OFFER';
      const details = `Offer: ${editingOffer.name}, Value: ${editingOffer.value}`;

      if(editingOffer.id) {
          // update logic
      } else {
          addOffer({
              ...editingOffer,
              id: `offer_${Date.now()}`,
              isActive: true,
              productIds: editingOffer.productIds || []
          } as Offer);
      }
      logAction(action, details, 'INFO');
      setEditingOffer(null);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col fixed h-full z-10">
        <div className="mb-10 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1d1d1f] flex items-center justify-center text-white">
                <ShieldAlert size={14} />
            </div>
            <span className="font-bold text-lg text-[#1d1d1f]">SysAdmin</span>
        </div>
        
        <nav className="flex-1 space-y-2">
            <button 
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-[#0071e3] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            >
                <Package size={18} /> Products
            </button>
            <button 
                onClick={() => setActiveTab('offers')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'offers' ? 'bg-[#0071e3] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            >
                <Tag size={18} /> Offers
            </button>
            <button 
                onClick={() => setActiveTab('categories')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'categories' ? 'bg-[#0071e3] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            >
                <Layers size={18} /> Categories
            </button>
            <button 
                onClick={() => setActiveTab('audit')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'audit' ? 'bg-[#0071e3] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
            >
                <KeyRound size={18} /> Security Logs
            </button>
        </nav>

        <div className="pt-6 border-t border-gray-100">
            <div className="text-xs text-gray-400 mb-4 text-center">Session Active</div>
            <button onClick={logout} className="w-full flex items-center justify-center gap-2 text-red-500 bg-red-50 py-2 rounded-lg text-sm font-medium hover:bg-red-100">
                <LogOut size={16} /> Secure Logout
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10">
        
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

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-[#1d1d1f]">Product Management</h1>
                    <button 
                        onClick={() => setEditingProduct({ name: '', price: 0, stock: 0, description: '', categoryId: categories[0]?.id || '', images: [] })}
                        className="bg-[#1d1d1f] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-black transition-colors"
                    >
                        <Plus size={18} /> Add Product
                    </button>
                </div>

                {editingProduct ? (
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">{editingProduct.id ? 'Edit Product' : 'New Product'}</h3>
                            <button onClick={() => setEditingProduct(null)}><X size={24} className="text-gray-400 hover:text-gray-600"/></button>
                        </div>
                        <form onSubmit={handleSaveProduct} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Name</label>
                                    <input required type="text" className="w-full bg-[#f5f5f7] rounded-lg p-3" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Brand</label>
                                    <input required type="text" className="w-full bg-[#f5f5f7] rounded-lg p-3" value={editingProduct.brand || ''} onChange={e => setEditingProduct({...editingProduct, brand: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Price (TND)</label>
                                    <input required type="number" step="0.01" className="w-full bg-[#f5f5f7] rounded-lg p-3" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Stock</label>
                                    <input required type="number" className="w-full bg-[#f5f5f7] rounded-lg p-3" value={editingProduct.stock} onChange={e => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
                                    <select className="w-full bg-[#f5f5f7] rounded-lg p-3" value={editingProduct.categoryId} onChange={e => setEditingProduct({...editingProduct, categoryId: e.target.value})}>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
                                <textarea className="w-full bg-[#f5f5f7] rounded-lg p-3 h-24" value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}></textarea>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Image URLs (comma separated)</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-[#f5f5f7] rounded-lg p-3" 
                                    placeholder="https://..., https://..."
                                    value={editingProduct.images?.join(', ')} 
                                    onChange={e => setEditingProduct({...editingProduct, images: e.target.value.split(',').map(s => s.trim())})} 
                                />
                                <div className="flex gap-2 mt-4 overflow-x-auto">
                                    {editingProduct.images?.map((img, i) => (
                                        img && <img key={i} src={img} className="w-20 h-20 object-cover rounded-lg border border-gray-200" alt="Preview"/>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-[#0071e3] text-white py-3 rounded-lg font-bold hover:bg-[#0077ED]">Save Product</button>
                        </form>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-[#f5f5f7] border-b border-gray-200">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Product</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Category</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Price</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase">Stock</th>
                                    <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="p-4 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-[#f5f5f7] overflow-hidden">
                                                <img src={product.images[0]} alt="" className="w-full h-full object-cover"/>
                                            </div>
                                            <span className="font-medium text-[#1d1d1f]">{product.name}</span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">{categories.find(c => c.id === product.categoryId)?.name}</td>
                                        <td className="p-4 text-sm font-medium">{product.price.toFixed(2)}</td>
                                        <td className="p-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button onClick={() => setEditingProduct(product)} className="text-gray-400 hover:text-[#0071e3]"><Edit2 size={18}/></button>
                                            <button onClick={() => { if(confirm('Delete product?')) { deleteProduct(product.id); logAction('DELETE_PRODUCT', `Deleted product: ${product.name}`, 'WARNING'); } }} className="text-gray-400 hover:text-red-500"><Trash2 size={18}/></button>
                                        </td>
                                    </tr>
                                ))}
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

      </main>
    </div>
  );
};

export default AdminPanel;