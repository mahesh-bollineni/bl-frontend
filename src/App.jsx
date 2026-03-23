import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Register from './Register';
import Login from './Login';
import Welcome from './Welcome';
import AdminDashboard from './AdminDashboard';

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8080/api") + "/products";
const USER_API = (import.meta.env.VITE_API_URL || "http://localhost:8080/api") + "/users";

function App() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [view, setView] = useState('welcome');
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMode, setSearchMode] = useState("product"); 
  const [pForm, setPForm] = useState({ title: '', price: '' });
  const [imageFile, setImageFile] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [tempProfileFile, setTempProfileFile] = useState(null);
  const [settingTab, setSettingTab] = useState('profile');

  const loadData = useCallback(() => {
    axios.get(API_BASE).then(res => setProducts(res.data)).catch(() => console.log("Offline"));
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Filters: My items vs Others
  const myListings = products.filter(p => p.seller?.id === user?.id);
  const othersProducts = products.filter(p => {
    const isNotMe = p.seller?.id !== user?.id;
    const term = searchTerm.toLowerCase();
    if (searchMode === 'product') return isNotMe && p.title.toLowerCase().includes(term);
    return isNotMe && p.seller?.username.toLowerCase().includes(term);
  });

  const handleUpdateProfile = () => {
    const formData = new FormData();
    formData.append("whatsapp", document.getElementById("set-wa").value);
    formData.append("address", document.getElementById("set-address").value);
    formData.append("about", document.getElementById("set-about").value);
    if (tempProfileFile) formData.append("image", tempProfileFile);
    
    axios.put(`${USER_API}/${user.id}/update`, formData).then(res => {
      setUser(res.data); 
      alert("Profile & Address Updated!");
    }).catch(err => alert("Update failed: " + err.response?.status));
  };

  const handlePostOrUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", pForm.title);
    formData.append("price", pForm.price);
    formData.append("category", "General");
    formData.append("sellerId", user.id);
    if (imageFile) formData.append("imageFile", imageFile);

    const request = editingProduct 
      ? axios.put(`${API_BASE}/${editingProduct.id}`, formData)
      : axios.post(API_BASE, formData);

    request.then(() => {
      loadData();
      alert(editingProduct ? "Updated Successfully!" : "Listed Successfully!");
      setPForm({ title: '', price: '' });
      setImageFile(null);
      setEditingProduct(null);
    }).catch(err => alert("Error 400: Check form fields and file size."));
  };

  // View Logic
  if (!user && view === 'welcome') return <Welcome onNavigate={setView} />;
  
  if (!user) return (
    <div style={st.authPage}><div style={st.authCard}>
      <div style={st.logoBadge}>BL</div>
      {view === 'login' ? <Login onLoginSuccess={setUser} /> : <Register />}
      <button onClick={() => setView('welcome')} style={st.backBtn}>← Back to Home</button>
    </div></div>
  );

  // God Mode Redirect
  if (user.role === 'ADMIN') return <AdminDashboard products={products} loadData={loadData} onLogout={() => setUser(null)} />;

  return (
    <div style={st.marketPage}>
      <nav style={st.nav}>
        <h2 style={{color:'#fbbf24', margin:0}}>BuyLoft</h2>
        <div style={st.searchWrapper}>
          <select value={searchMode} onChange={e => setSearchMode(e.target.value)} style={st.modeSelect}>
            <option value="product">Items</option>
            <option value="seller">Users</option>
          </select>
          <input placeholder="Search Marketplace..." onChange={e => setSearchTerm(e.target.value)} style={st.searchIn} />
        </div>
        <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
          <button onClick={() => setView(view === 'settings' ? 'marketplace' : 'settings')} style={st.iconBtn}>
            {view === 'settings' ? '🏠' : '⚙️'}
          </button>
          <button onClick={() => setUser(null)} style={st.logoutBtn}>Logout</button>
        </div>
      </nav>

      <div style={st.content}>
        {view === 'settings' ? (
          <div style={st.settingsLayout}>
            <div style={st.settingsSidebar}>
              <button style={settingTab === 'profile' ? st.tabActive : st.tab} onClick={() => setSettingTab('profile')}>Profile & Address</button>
              <button style={settingTab === 'posts' ? st.tabActive : st.tab} onClick={() => setSettingTab('posts')}>Manage My Posts</button>
            </div>
            <div style={st.settingsCard}>
              {settingTab === 'profile' ? (
                <div style={{textAlign:'left'}}>
                  <h3 style={{color:'#fbbf24'}}>Public Profile</h3>
                  <p style={{color:'#94a3b8'}}>Gmail: <b>{user.email}</b></p>
                  <div style={{display:'flex', gap:20, marginBottom:20, alignItems:'center'}}>
                    {user.profileImageData ? 
                      <img src={`data:${user.profileImageType};base64,${user.profileImageData}`} alt="p" style={st.profileImgBig} /> : 
                      <div style={st.profilePlaceholderBig}>{user.username.charAt(0)}</div>
                    }
                    <input type="file" onChange={e => setTempProfileFile(e.target.files[0])} />
                  </div>
                  <label style={st.label}>WhatsApp Number</label>
                  <input id="set-wa" defaultValue={user.whatsappNumber} style={st.in} />
                  <label style={st.label}>Full Address</label>
                  <input id="set-address" defaultValue={user.address} placeholder="Street, City, Zip" style={st.in} />
                  <label style={st.label}>About Me</label>
                  <textarea id="set-about" defaultValue={user.about} placeholder="Bio..." style={{...st.in, height:80, paddingTop:10}} />
                  <button onClick={handleUpdateProfile} style={st.saveBtn}>Save All Details</button>
                </div>
              ) : (
                myListings.map(p => (
                  <div key={p.id} style={st.postItemCard}>
                    <img src={`data:${p.imageType};base64,${p.imageData}`} alt="p" style={{width:60, height:60, borderRadius:8, objectFit:'cover'}} />
                    <div style={{flex:1, marginLeft:15, textAlign:'left'}}>
                      <div style={{fontWeight:'bold'}}>{p.title}</div>
                      <div style={{color:'#fbbf24'}}>₹{p.price}</div>
                    </div>
                    <button onClick={() => {setEditingProduct(p); setPForm({title:p.title, price:p.price}); setView('marketplace');}} style={st.editBtnSmall}>Edit</button>
                    <button onClick={() => axios.delete(`${API_BASE}/${p.id}`).then(loadData)} style={st.delBtn}>Delete</button>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handlePostOrUpdate} style={st.formCard}>
              <h3 style={{color:'#fbbf24', width:'100%', marginBottom:15}}>{editingProduct ? "✏️ Edit Item" : "📢 Sell Item"}</h3>
              <input placeholder="Title" value={pForm.title} onChange={e => setPForm({...pForm, title: e.target.value})} style={st.in} required />
              <input type="number" placeholder="Price (₹)" value={pForm.price} onChange={e => setPForm({...pForm, price: e.target.value})} style={st.in} required />
              <input type="file" onChange={e => setImageFile(e.target.files[0])} style={st.in} required={!editingProduct} />
              <button type="submit" style={st.listBtn}>{editingProduct ? "Update" : "Post"}</button>
              {editingProduct && <button onClick={() => {setEditingProduct(null); setPForm({title:'', price:''})}} style={st.cancelBtn}>Cancel</button>}
            </form>
            <div style={st.grid}>{othersProducts.map(p => (
              <div key={p.id} style={st.card}>
                <img src={`data:${p.imageType};base64,${p.imageData}`} alt="p" style={st.img} />
                <div style={st.cardBody}>
                  <div style={st.sellerRow}>Seller: {p.seller?.username}</div>
                  <h4 style={{margin:'5px 0'}}>{p.title}</h4>
                  <p style={{color:'#fbbf24', fontWeight:'bold', fontSize:'1.4rem'}}>₹{p.price}</p>
                  <a href={`https://wa.me/${p.seller?.whatsappNumber}`} target="_blank" rel="noreferrer" style={st.waBtn}>WhatsApp</a>
                </div>
              </div>
            ))}</div>
          </>
        )}
      </div>
    </div>
  );
}

const st = {
  marketPage: { background: '#0f172a', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#fff' },
  nav: { display: 'flex', justifyContent: 'space-between', padding: '15px 5%', background: '#1e293b', borderBottom: '2px solid #fbbf24', position:'sticky', top:0, zIndex:100, alignItems:'center' },
  searchWrapper: { display:'flex', border:'1px solid #fbbf24', borderRadius:'50px', overflow:'hidden', width:'400px', background:'#fff' },
  modeSelect: { background:'#f1f5f9', border:'none', padding:'0 15px', fontWeight:'bold', color: '#0f172a' },
  searchIn: { flex:1, border:'none', padding:'12px', outline:'none', color: '#000' },
  content: { padding: '40px 5%' },
  formCard: { background: '#1e293b', padding: '25px', borderRadius: '20px', display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '40px', border: '1px solid #334155' },
  in: { padding: '12px', borderRadius: '10px', border: '1px solid #334155', flex: 1, minWidth: '200px', background: '#0f172a', color: '#fff' },
  listBtn: { background: '#fbbf24', color: '#000', padding: '12px 25px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
  cancelBtn: { background: '#64748b', color: '#fff', padding: '12px 20px', border: 'none', borderRadius: '10px', cursor: 'pointer', marginLeft:10 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' },
  card: { background: '#1e293b', borderRadius: '20px', overflow: 'hidden', border: '1px solid #334155' },
  img: { width: '100%', height: '200px', objectFit: 'cover' },
  cardBody: { padding: '20px', textAlign: 'left' },
  waBtn: { display: 'block', textAlign: 'center', background: '#22c55e', color: '#fff', padding: '12px', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold' },
  sellerRow: { fontSize: '0.8rem', color: '#94a3b8' },
  settingsLayout: { display: 'flex', gap: '30px' },
  settingsSidebar: { width: '250px', display: 'flex', flexDirection: 'column', gap: '10px' },
  tab: { padding: '15px', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', cursor: 'pointer', color: '#94a3b8', textAlign:'left' },
  tabActive: { padding: '15px', background: '#fbbf24', color: '#000', borderRadius: '12px', border: 'none', fontWeight: 'bold', textAlign:'left' },
  settingsCard: { flex: 1, background: '#1e293b', padding: '35px', borderRadius: '25px', border: '1px solid #334155' },
  saveBtn: { width: '100%', padding: '14px', background: '#fbbf24', color: '#000', border: 'none', borderRadius: '12px', marginTop: '20px', fontWeight: 'bold' },
  label: { display: 'block', marginTop: '15px', color: '#94a3b8', fontSize: '0.9rem', textAlign: 'left' },
  postItemCard: { display: 'flex', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #334155' },
  editBtnSmall: { background: '#fbbf24', color: '#000', border: 'none', padding: '5px 15px', borderRadius: '5px', marginRight: 10, cursor: 'pointer' },
  delBtn: { background: '#ef4444', color: '#fff', border: 'none', padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' },
  logoutBtn: { background: '#ef4444', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold' },
  iconBtn: { background: '#334155', border: 'none', width: '45px', height: '45px', borderRadius: '12px', fontSize: '1.2rem', cursor: 'pointer' },
  logoBadge: { background: '#fbbf24', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#000', fontWeight: 'bold' },
  authPage: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0f172a' },
  authCard: { padding: '50px', background: '#fff', borderRadius: '30px', width: '400px', textAlign: 'center' },
  backBtn: { marginTop: '20px', background: 'none', border: 'none', color: '#64748b', textDecoration: 'underline', cursor: 'pointer' },
  profileImgBig: { width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' },
  profilePlaceholderBig: { width: '100px', height: '100px', borderRadius: '50%', background: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: '#000' }
};

export default App;