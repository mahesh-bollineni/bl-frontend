import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', whatsappNumber: '' });
  const handleRegister = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/users/register', form).then(() => alert("Success! Now Login."));
  };
  return (
    <form onSubmit={handleRegister} style={{display:'flex', flexDirection:'column', gap:10}}>
      <h3>Register</h3>
      <input placeholder="Username" onChange={e => setForm({...form, username: e.target.value})} style={inSt} required />
      <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} style={inSt} required />
      <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} style={inSt} required />
      <input placeholder="WhatsApp" onChange={e => setForm({...form, whatsappNumber: e.target.value})} style={inSt} required />
      <button type="submit" style={btnSt}>Join Loft</button>
    </form>
  );
}
const inSt = { padding: 10, borderRadius: 8, border: '1px solid #ddd' };
const btnSt = { padding: 10, background: '#0f172a', color: '#fff', border: 'none', borderRadius: 8 };
export default Register;