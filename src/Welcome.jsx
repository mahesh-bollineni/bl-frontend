import React from 'react';
import './styles/Welcome.css';

const Welcome = ({ onNavigate }) => {
  return (
    <div className="scroll-page">
      <section className="hero-section">
        <div className="animate">
          <div className="logo-badge-big">BL</div>
          <h1 className="huge-title">BuyLoft</h1>
          <p className="hero-subtitle">Trade smarter. Live better. Give every object a second story.</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <button onClick={() => onNavigate('login')} className="primary-btn">Enter Loft</button>
            <button onClick={() => onNavigate('register')} className="secondary-btn">Join Community</button>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '30px', color: '#64748b' }}>Explore the Marketplace ↓</div>
      </section>

      <section className="feature-section">
        <h2 className="section-title">Why BuyLoft?</h2>
        <div className="feature-grid">
          <FeatureCard 
            icon="💰" 
            title="Earn & Save" 
            text="Turn your unused items into instant cash. Find high-quality products at a fraction of the retail price." 
          />
          <FeatureCard 
            icon="🌿" 
            title="Sustainable Choice" 
            text="Reduce waste by giving products a second life. We believe in a circular economy that protects our planet." 
          />
          <FeatureCard 
            icon="🛡️" 
            title="Safe & Direct" 
            text="Browse detailed listings with images and prices. Contact sellers directly via WhatsApp for a seamless deal." 
          />
        </div>
      </section>

      <section style={{ padding: '100px 20px', textAlign: 'center', background: '#fbbf24', color: '#000' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2>Ready to make an impact?</h2>
          <p>Join thousands of users contributing to a cost-effective, eco-friendly marketplace.</p>
          <button 
            onClick={() => onNavigate('register')} 
            style={{ padding: '20px 50px', background: '#000', color: '#fff', border: 'none', borderRadius: '50px', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', marginTop: '30px' }}>
            Create My Account
          </button>
        </div>
      </section>

      <footer style={{ padding: '40px', textAlign: 'center', background: '#0f172a', color: '#475569' }}>
        <p>© 2026 BuyLoft Marketplace. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, text }) => (
  <div className="feature-card">
    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{icon}</div>
    <h3>{title}</h3>
    <p>{text}</p>
  </div>
);

export default Welcome;