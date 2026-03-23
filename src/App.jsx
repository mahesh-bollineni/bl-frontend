import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Register from './Register';
import Login from './Login';
import Welcome from './Welcome';
import AdminDashboard from './AdminDashboard';
import Navbar from './components/Navbar';
import './styles/App.css';
import './styles/Marketplace.css';

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8080/api") + "/products";
const USER_API = (import.meta.env.VITE_API_URL || "http://localhost:8080/api") + "/users";

function App() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(() => {
    // PERSISTENCE: Check if user was already logged in
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
      const { data } = await axios.get(API_BASE);
      setProducts(data);
    } catch (err) {
      console.error("Marketplace is currently offline.");
    }
  }, []);

  useEffect(() => { 
    loadData(); 
  }, [loadData]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('bl_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bl_user');
    setView('welcome');
  };

  const othersProducts = products.filter(p => {
    const isNotMe = p.seller?.id !== user?.id;
    const term = searchTerm.toLowerCase();
    if (searchMode === 'product') return isNotMe && p.title.toLowerCase().includes(term);
    return isNotMe && p.seller?.username.toLowerCase().includes(term);
  });

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
      <Navbar 
        view={view} 
        setView={setView} 
        searchMode={searchMode} 
        setSearchMode={setSearchMode} 
        setSearchTerm={setSearchTerm} 
        onLogout={handleLogout} 
      />

      <div className="main-content">
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
      </div>
    </div>
  );
}

export default App;