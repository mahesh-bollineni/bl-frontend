import React, { useState } from 'react';
import { userApi } from './services/api';
import './styles/Auth.css';

const Register = () => {
  const [form, setForm] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    whatsappNumber: '' 
  });
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsRegistering(true);

    try {
      await userApi.register(form);
      alert("Success! Now Login and join the Loft.");
      window.location.reload(); // Refresh views
    } catch (err) {
      alert("Registration failed: Check all fields.");
      console.error(err);
    } finally {
      setIsRegistering(false);
    }
  };

  const updateForm = (key, value) => setForm(f => ({ ...f, [key]: value }));

  return (
    <form onSubmit={handleRegister} className="auth-form">
      <h3>Register</h3>
      <input 
        placeholder="Username" 
        onChange={e => updateForm('username', e.target.value)} 
        className="auth-input" 
        required 
      />
      <input 
        placeholder="Email" 
        onChange={e => updateForm('email', e.target.value)} 
        className="auth-input" 
        required 
      />
      <input 
        type="password" 
        placeholder="Password" 
        onChange={e => updateForm('password', e.target.value)} 
        className="auth-input" 
        required 
      />
      <input 
        placeholder="WhatsApp" 
        onChange={e => updateForm('whatsappNumber', e.target.value)} 
        className="auth-input" 
        required 
      />
      <button type="submit" className="auth-btn" disabled={isRegistering}>
        {isRegistering ? "Joining..." : "Join Loft"}
      </button>
    </form>
  );
};

export default Register;