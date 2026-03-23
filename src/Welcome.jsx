import React from 'react';

function Welcome({ onNavigate }) {
  return (
    <div style={st.scrollPage}>
      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0% { transform: translateY(0px) rotate(-5deg); } 50% { transform: translateY(-10px) rotate(-5deg); } 100% { transform: translateY(0px) rotate(-5deg); } }
        .animate { animation: slideUp 0.8s ease-out forwards; }
        .hover-scale { transition: transform 0.3s ease; cursor: pointer; }
        .hover-scale:hover { transform: scale(1.05); }
      `}</style>

      <section style={st.heroSection}>
        <div className="animate" style={{ textAlign: 'center' }}>
          <div style={{ ...st.logoBadge, animation: 'float 3s infinite ease-in-out' }}>BL</div>
          <h1 style={st.hugeTitle}>BuyLoft</h1>
          <p style={st.heroSubtitle}>Trade smarter. Live better. Give every object a second story.</p>
          <div style={st.heroBtns}>
            <button onClick={() => onNavigate('login')} style={st.primaryBtn}>Enter Loft</button>
            <button onClick={() => onNavigate('register')} style={st.secondaryBtn}>Join Community</button>
          </div>
        </div>
        <div style={st.scrollIndicator}>Explore the Marketplace ↓</div>
      </section>

      <section style={st.featureSection}>
        <h2 style={st.sectionTitle}>Why BuyLoft?</h2>
        <div style={st.featureGrid}>
          <div style={st.featureCard} className="hover-scale">
            <div style={st.icon}>💰</div>
            <h3>Earn & Save</h3>
            <p>Turn your unused items into instant cash. Find high-quality products at a fraction of the retail price.</p>
          </div>
          <div style={st.featureCard} className="hover-scale">
            <div style={st.icon}>🌿</div>
            <h3>Sustainable Choice</h3>
            <p>Reduce waste by giving products a second life. We believe in a circular economy that protects our planet.</p>
          </div>
          <div style={st.featureCard} className="hover-scale">
            <div style={st.icon}>🛡️</div>
            <h3>Safe & Direct</h3>
            <p>Browse detailed listings with images and prices. Contact sellers directly via WhatsApp for a seamless deal.</p>
          </div>
        </div>
      </section>

      <section style={st.impactSection}>
        <div style={st.impactContent}>
          <h2>Ready to make an impact?</h2>
          <p>Join thousands of users contributing to a cost-effective, eco-friendly marketplace.</p>
          <button onClick={() => onNavigate('register')} style={st.hugeBtn}>Create My Account</button>
        </div>
      </section>

      <footer style={st.footer}>
        <p>© 2026 BuyLoft Marketplace. All rights reserved.</p>
      </footer>
    </div>
  );
}

const st = {
  scrollPage: { backgroundColor: '#fff', fontFamily: "'Inter', sans-serif" },
  heroSection: { height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff', textAlign: 'center', padding: '20px', position: 'relative' },
  logoBadge: { width: '90px', height: '90px', background: '#fff', color: '#0f172a', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '1.8rem', fontWeight: '900' },
  hugeTitle: { fontSize: '6rem', fontWeight: '900', margin: 0, letterSpacing: '-4px' },
  heroSubtitle: { fontSize: '1.5rem', color: '#94a3b8', maxWidth: '600px', margin: '20px 0 40px' },
  scrollIndicator: { position: 'absolute', bottom: '30px', color: '#64748b' },
  featureSection: { padding: '100px 50px', textAlign: 'center', backgroundColor: '#f8fafc' },
  sectionTitle: { fontSize: '3rem', fontWeight: '800', marginBottom: '60px', color: '#0f172a' },
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' },
  featureCard: { padding: '40px', background: '#fff', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' },
  icon: { fontSize: '3rem', marginBottom: '20px' },
  impactSection: { padding: '100px 20px', textAlign: 'center', background: '#fbbf24', color: '#000' },
  impactContent: { maxWidth: '800px', margin: '0 auto' },
  hugeBtn: { padding: '20px 50px', background: '#000', color: '#fff', border: 'none', borderRadius: '50px', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', marginTop: '30px' },
  footer: { padding: '40px', textAlign: 'center', background: '#0f172a', color: '#475569' },
  primaryBtn: { padding: '15px 40px', background: '#fbbf24', color: '#000', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' },
  secondaryBtn: { padding: '15px 40px', background: 'transparent', color: '#fff', border: '2px solid #fff', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' },
  heroBtns: { display: 'flex', gap: '20px' }
};

export default Welcome;