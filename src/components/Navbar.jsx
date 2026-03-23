import React from 'react';
import '../styles/App.css';

const Navbar = ({ view, setView, searchMode, setSearchMode, setSearchTerm, onLogout }) => (
  <nav className="navbar">
    <h2 style={{ color: '#fbbf24', margin: 0 }}>BuyLoft</h2>
    <div className="search-wrapper">
      <select 
        value={searchMode} 
        onChange={e => setSearchMode(e.target.value)} 
        className="mode-select">
        <option value="product">Items</option>
        <option value="seller">Users</option>
      </select>
      <input 
        placeholder="Search Marketplace..." 
        onChange={e => setSearchTerm(e.target.value)} 
        className="search-input" 
      />
    </div>
    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
      <button onClick={() => setView(view === 'settings' ? 'marketplace' : 'settings')} className="icon-btn">
        {view === 'settings' ? '🏠' : '⚙️'}
      </button>
      <button onClick={onLogout} className="logout-btn">Logout</button>
    </div>
  </nav>
);

export default Navbar;
