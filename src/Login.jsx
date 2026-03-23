import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Trim values to avoid hidden spaces
    const payload = { 
        email: email.trim(), 
        password: password 
    };

    axios.post('http://localhost:8080/api/users/login', payload)
      .then(res => {
        onLoginSuccess(res.data);
        if(res.data.role === 'ADMIN') {
            alert("God Mode Activated: Welcome Mahesh!");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Login Failed: " + (err.response?.data || "Server Offline"));
      });
  };

  return (
    <form onSubmit={handleLogin} style={st.form}>
      <h3 style={{color: '#0f172a', marginBottom: '10px'}}>Sign In</h3>
      <p style={{fontSize: '0.8rem', color: '#64748b', marginBottom: '15px'}}>Access the BuyLoft Marketplace</p>
      
      <input 
        type="email" 
        placeholder="Email" 
        autoComplete="email"
        onChange={e => setEmail(e.target.value)} 
        style={st.in} 
        required 
      />
      <input 
        type="password" 
        placeholder="Password" 
        autoComplete="current-password"
        onChange={e => setPassword(e.target.value)} 
        style={st.in} 
        required 
      />
      
      <button type="submit" style={st.btn}>Login</button>
    </form>
  );
}

const st = {
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  in: { padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', color: '#000' },
  btn: { padding: '12px', background: '#fbbf24', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }
};

export default Login;