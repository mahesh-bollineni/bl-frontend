import React, { useState, useEffect } from 'react';
import { productApi, userApi } from './services/api';
import './styles/Admin.css';

const AdminDashboard = ({ products, loadData, onLogout }) => {
  const [view, setView] = useState('inventory'); 
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const { data } = await userApi.getAll();
      setUsers(data);
    } catch (err) {
      console.error("Critical: Could not connect to User Management Database.");
    }
  };

  useEffect(() => {
    if (view === 'users') fetchUsers();
    else loadData();
  }, [view, loadData]);

  const deleteProduct = async (id) => {
    if (window.confirm("GOD MODE: Delete this listing?")) {
      await productApi.delete(id);
      loadData();
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("GOD MODE: Permanently delete this user?")) {
      await userApi.delete(id);
      fetchUsers();
    }
  };

  return (
    <div className="admin-page">
      <div className="sidebar">
        <h2 className="sidebar-title">BL ADMIN</h2>
        <button 
          className={`nav-btn ${view === 'inventory' ? 'active' : ''}`} 
          onClick={() => setView('inventory')}>
          📦 Inventory
        </button>
        <button 
          className={`nav-btn ${view === 'users' ? 'active' : ''}`} 
          onClick={() => setView('users')}>
          👥 Users
        </button>
        <button onClick={onLogout} className="sidebar-logout">Logout</button>
      </div>

      <div className="main-admin">
        <h1 style={{ color: '#fbbf24', fontSize: '2.5rem' }}>
          {view === 'inventory' ? "Inventory Console" : "Intelligence Portal"}
        </h1>
        <div className="table-card">
          <table className="admin-table">
            <thead>
              <tr>
                {view === 'inventory' ? (
                  <><th>Preview</th><th>Item Name</th><th>Price</th><th>Seller</th><th style={{textAlign:'center'}}>Action</th></>
                ) : (
                  <><th>Avatar</th><th>Username</th><th>Email</th><th>Auth Role</th><th style={{textAlign:'center'}}>Action</th></>
                )}
              </tr>
            </thead>
            <tbody>
              {view === 'inventory' ? (
                products.map(p => (
                  <tr key={p.id}>
                    <td>
                      <img 
                        src={`data:${p.imageType};base64,${p.imageData}`} 
                        alt="p" 
                        style={{width: 50, height: 50, borderRadius: 10, objectFit:'cover', border: '1px solid #fbbf24'}} 
                      />
                    </td>
                    <td>{p.title}</td>
                    <td style={{ color: '#fbbf24', fontWeight: 'bold' }}>₹{p.price}</td>
                    <td>{p.seller?.username}</td>
                    <td style={{textAlign:'center'}}><button onClick={() => deleteProduct(p.id)} className="admin-del-btn">Remove</button></td>
                  </tr>
                ))
              ) : (
                users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{width: 40, height: 40, borderRadius: '50%', background: '#fbbf24', color: '#000', display: 'flex', alignItems: 'center', justifyContent:'center', fontWeight:'bold'}}>
                        {u.username.charAt(0)}
                      </div>
                    </td>
                    <td><b>{u.username}</b></td>
                    <td>{u.email}</td>
                    <td style={{ color: '#94a3b8' }}>{u.role}</td>
                    <td style={{textAlign:'center'}}>
                      {u.role !== 'ADMIN' && <button onClick={() => deleteUser(u.id)} className="admin-del-btn">Expel</button>}
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
};

export default AdminDashboard;