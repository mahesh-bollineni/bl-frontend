import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = "http://localhost:8080/api/products";
const USER_API = "http://localhost:8080/api/users";

function AdminDashboard({ products, loadData, onLogout }) {
  const [view, setView] = useState('inventory'); 
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    axios.get(`${USER_API}/all`).then(res => setUsers(res.data));
  };

  useEffect(() => {
    if (view === 'users') fetchUsers();
    else loadData();
  }, [view, loadData]);

  const deleteProduct = (id) => {
    if (window.confirm("GOD MODE: Delete this listing?")) {
      axios.delete(`${API_BASE}/${id}`).then(() => loadData());
    }
  };

  const deleteUser = (id) => {
    if (window.confirm("GOD MODE: Permanently delete this user?")) {
      axios.delete(`${USER_API}/${id}`).then(() => fetchUsers());
    }
  };

  return (
    <div style={st.adminPage}>
      <div style={st.sidebar}>
        <h2 style={{color:'#fbbf24'}}>BL ADMIN</h2>
        <button style={view === 'inventory' ? st.navBtnActive : st.navBtn} onClick={() => setView('inventory')}>📦 Inventory</button>
        <button style={view === 'users' ? st.navBtnActive : st.navBtn} onClick={() => setView('users')}>👥 Users</button>
        <button onClick={onLogout} style={st.logoutBtn}>Logout</button>
      </div>

      <div style={st.main}>
        <h1 style={{color:'#fbbf24'}}>{view === 'inventory' ? "Global Inventory" : "User Management"}</h1>
        <div style={st.tableCard}>
          <table style={st.table}>
            <thead>
              <tr style={st.tableHead}>
                {view === 'inventory' ? (
                  <><th>ID</th><th>Item</th><th>Price</th><th>Seller</th><th>Action</th></>
                ) : (
                  <><th>ID</th><th>Username</th><th>Email</th><th>Password</th><th>Action</th></>
                )}
              </tr>
            </thead>
            <tbody>
              {view === 'inventory' ? (
                products.map(p => (
                  <tr key={p.id} style={st.tableRow}>
                    <td>{p.id}</td><td>{p.title}</td><td style={{color:'#fbbf24'}}>₹{p.price}</td><td>{p.seller?.username}</td>
                    <td><button onClick={() => deleteProduct(p.id)} style={st.delBtn}>Remove</button></td>
                  </tr>
                ))
              ) : (
                users.map(u => (
                  <tr key={u.id} style={st.tableRow}>
                    <td>{u.id}</td>
                    <td><b>{u.username}</b></td>
                    <td>{u.email}</td>
                    <td 
                      style={{color:'#fbbf24', cursor:'pointer'}} 
                      onClick={(e) => e.target.innerText = u.password}
                    >
                      ********
                    </td>
                    <td>
                      {u.role !== 'ADMIN' && <button onClick={() => deleteUser(u.id)} style={st.delBtn}>Delete</button>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const st = {
  adminPage: { display:'flex', minHeight:'100vh', background:'#0f172a', color:'#fff', fontFamily:"'Inter', sans-serif" },
  sidebar: { width:'250px', background:'#1e293b', padding:'30px', borderRight:'2px solid #fbbf24', display:'flex', flexDirection:'column', gap:'15px' },
  navBtn: { padding:'12px', background:'transparent', color:'#94a3b8', border:'none', textAlign:'left', cursor:'pointer', fontWeight:'bold' },
  navBtnActive: { padding:'12px', background:'#fbbf24', color:'#000', border:'none', borderRadius:'8px', textAlign:'left', cursor:'pointer', fontWeight:'bold' },
  logoutBtn: { marginTop:'auto', padding:'12px', background:'#ef4444', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold' },
  main: { flex:1, padding:'40px' },
  tableCard: { background:'#1e293b', padding:'20px', borderRadius:'15px', border:'1px solid #334155' },
  table: { width:'100%', borderCollapse:'collapse', textAlign:'left' },
  tableHead: { borderBottom:'2px solid #334155', color:'#94a3b8' },
  tableRow: { borderBottom:'1px solid #334155', height:'50px' },
  delBtn: { background:'#ef4444', color:'#fff', border: 'none', padding: '5px 10px', borderRadius: 5, cursor: 'pointer' }
};

export default AdminDashboard;