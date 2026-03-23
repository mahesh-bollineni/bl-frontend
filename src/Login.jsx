import React, { useState } from 'react';
import { userApi } from './services/api';
import './styles/Auth.css';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = { 
        email: email.trim(), 
        password: password 
      };

      const { data } = await userApi.login(payload);
      
      onLoginSuccess(data);
      if (data.role === 'ADMIN') {
        alert("God Mode Activated: Welcome Mahesh!");
      }
    } catch (err) {
      console.error("Login attempt failed:", err);
      alert("Login Failed: " + (err.response?.data?.message || err.response?.data || "Server Offline"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="auth-form">
      <h3 style={{ color: '#0f172a', marginBottom: '10px' }}>Sign In</h3>
      <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '15px' }}>Access the BuyLoft Marketplace</p>
      
      <input 
        type="email" 
        placeholder="Email" 
        autoComplete="email"
        value={email}
        onChange={e => setEmail(e.target.value)} 
        className="auth-input"
        required 
      />
      <input 
        type="password" 
        placeholder="Password" 
        autoComplete="current-password"
        value={password}
        onChange={e => setPassword(e.target.value)} 
        className="auth-input"
        required 
      />
      
      <button type="submit" className="auth-btn" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Login"}
      </button>
    </form>
  );
};

export default Login;