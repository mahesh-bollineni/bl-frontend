import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Register from './Register';
import Login from './Login';
import Welcome from './Welcome';
import AdminDashboard from './AdminDashboard';
import Navbar from './components/Navbar';
import { userApi, productApi } from './services/api';
import './styles/App.css';
import './styles/Marketplace.css';
import './styles/Settings.css';

function App() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bl_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [view, setView] = useState('marketplace');
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMode, setSearchMode] = useState("product"); 
  const [pForm, setPForm] = useState({ title: '', price: '' });
  const [imageFile, setImageFile] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [tempProfileFile, setTempProfileFile] = useState(null);
  const [settingTab, setSettingTab] = useState('profile');

  const loadData = useCallback(async () => {
    try {
      const { data } = await productApi.getAll();
      setProducts(data);
    } catch (err) {
      console.error("Marketplace currently offline.");
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('bl_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bl_user');
    setView('welcome');
  };

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    formData.append("whatsapp", document.getElementById("set-wa").value);
    formData.append("address", document.getElementById("set-address").value);
    formData.append("about", document.getElementById("set-about").value);
    if (tempProfileFile) formData.append("image", tempProfileFile);
    
    try {
      const { data } = await userApi.updateProfile(user.id, formData);
      setUser(data);
      localStorage.setItem('bl_user', JSON.stringify(data));
      alert("Success! Profile details updated.");
    } catch (err) {
      alert("Error: Profile could not be saved.");
    }
  };

  const handlePostOrUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", pForm.title);
    formData.append("price", pForm.price);
    formData.append("category", "General");
    formData.append("sellerId", user.id);
    if (imageFile) formData.append("imageFile", imageFile);

    try {
      if (editingProduct) await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}/products/${editingProduct.id}`, formData);
      else await productApi.add(formData);
      
      loadData();
      alert(editingProduct ? "Listing Updated!" : "Listed Successfully!");
      setPForm({ title: '', price: '' });
      setImageFile(null);
      setEditingProduct(null);
    } catch (err) {
      alert("Failed to upload listing. Check file size.");
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Permanently remove this listing?")) {
      await productApi.delete(id);
      loadData();
    }
  };

  const othersProducts = products.filter(p => {
    const isNotMe = p.seller?.id !== user?.id;
    const term = searchTerm.toLowerCase();
    if (searchMode === 'product') return isNotMe && p.title.toLowerCase().includes(term);
    return isNotMe && p.seller?.username.toLowerCase().includes(term);
  });

  const myListings = products.filter(p => p.seller?.id === user?.id);

  if (!user && view === 'welcome') return <Welcome onNavigate={setView} />;
  
  if (!user) return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo-badge">BL</div>
        {view === 'login' ? <Login onLoginSuccess={handleLogin} /> : <Register />}
        <button onClick={() => setView('welcome')} className="back-btn">← Back to Home</button>
      </div>
    </div>
  );

  if (user.role === 'ADMIN') return <AdminDashboard products={products} loadData={loadData} onLogout={handleLogout} />;

  return (
    <div className="market-page">
      <Navbar view={view} setView={setView} searchMode={searchMode} setSearchMode={setSearchMode} setSearchTerm={setSearchTerm} onLogout={handleLogout} />

      <div className="main-content">
        {view === 'settings' ? (
          <div className="settings-layout">
            <div className="settings-sidebar">
              <button className={`tab-btn ${settingTab === 'profile' ? 'active' : ''}`} onClick={() => setSettingTab('profile')}>Profile & Address</button>
              <button className={`tab-btn ${settingTab === 'posts' ? 'active' : ''}`} onClick={() => setSettingTab('posts')}>Manage My Posts</button>
            </div>
            <div className="settings-card">
              {settingTab === 'profile' ? (
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{ color: '#fbbf24' }}>Public Marketplace Identity</h3>
                  <div style={{ display: 'flex', gap: 20, marginBottom: 20, alignItems: 'center' }}>
                    {user.profileImageData ? 
                      <img src={`data:${user.profileImageType};base64,${user.profileImageData}`} alt="p" className="profile-img-big" /> : 
                      <div className="profile-placeholder-big">{user.username.charAt(0)}</div>
                    }
                    <input type="file" onChange={e => setTempProfileFile(e.target.files[0])} />
                  </div>
                  <label className="label">Your WhatsApp Number (For Buy/Sell)</label>
                  <input id="set-wa" defaultValue={user.whatsappNumber} className="form-input" style={{ width: '100%', marginBottom: 15 }} />
                  <label className="label">Delivery Address (Visible to marketplace friends)</label>
                  <input id="set-address" defaultValue={user.address} className="form-input" style={{ width: '100%', marginBottom: 15 }} />
                  <label className="label">Short Bio / Rules</label>
                  <textarea id="set-about" defaultValue={user.about} className="form-input" style={{ width: '100%', height: 80, paddingTop: 10 }} />
                  <button onClick={handleUpdateProfile} className="save-btn">Save All My Details</button>
                </div>
              ) : (
                myListings.map(p => (
                  <div key={p.id} className="post-item-card">
                    <img src={`data:${p.imageType};base64,${p.imageData}`} alt="p" style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }} />
                    <div style={{ flex: 1, marginLeft: 15, textAlign: 'left' }}>
                      <div style={{ fontWeight: 'bold' }}>{p.title}</div>
                      <div style={{ color: '#fbbf24' }}>₹{p.price}</div>
                    </div>
                    <button 
                      onClick={() => { setEditingProduct(p); setPForm({ title: p.title, price: p.price }); setView('marketplace'); }} 
                      className="post-btn" 
                      style={{ marginRight: 10, padding: '5px 15px' }}>
                      Edit
                    </button>
                    <button onClick={() => deleteProduct(p.id)} className="sidebar-logout" style={{ padding: '5px 15px' }}>Delete</button>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handlePostOrUpdate} className="form-card">
              <h3 style={{ color: '#fbbf24', width: '100%', marginBottom: 15 }}>{editingProduct ? "✏️ Adjust My Listing" : "📢 Sell New Item"}</h3>
              <input placeholder="Title" value={pForm.title} onChange={e => setPForm({ ...pForm, title: e.target.value })} className="form-input" required />
              <input type="number" placeholder="Price (₹)" value={pForm.price} onChange={e => setPForm({ ...pForm, price: e.target.value })} className="form-input" required />
              <input type="file" onChange={e => setImageFile(e.target.files[0])} className="form-input" required={!editingProduct} />
              <button type="submit" className="post-btn">{editingProduct ? "Update Post" : "List Item Now"}</button>
              {editingProduct && <button onClick={() => { setEditingProduct(null); setPForm({ title: '', price: '' }) }} className="sidebar-logout" style={{ marginLeft: 10 }}>Cancel</button>}
            </form>
            <div className="product-grid">
              {othersProducts.map(p => (
                <div key={p.id} className="product-card">
                  <img 
                    src={p.imageData ? `data:${p.imageType};base64,${p.imageData}` : 'https://via.placeholder.com/200'}
                    alt={p.title} 
                    className="card-img" 
                    loading="lazy"
                  />
                  <div className="card-body">
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Seller: {p.seller?.username}</div>
                    <h4 style={{ margin: '5px 0' }}>{p.title}</h4>
                    <p style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '1.4rem' }}>₹{p.price}</p>
                    <a href={`https://wa.me/${p.seller?.whatsappNumber}`} target="_blank" rel="noreferrer" className="wa-btn">WhatsApp</a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;