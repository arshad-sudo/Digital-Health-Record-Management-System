import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHospital, FaUserMd, FaUser, FaShieldAlt, FaCalendarAlt, FaFileMedical, FaPills, FaHeartbeat } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import im from '../assets/hosback.jpg';

const Welcome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    if (user.role === 'PATIENT') navigate('/patient/dashboard');
    else if (user.role === 'DOCTOR') navigate('/doctor/dashboard');
    else if (user.role === 'ADMIN') navigate('/admin/dashboard');
  }

  const features = [
    { icon: <FaCalendarAlt />, title: 'Smart Scheduling', desc: 'Book appointments with top doctors instantly, 24/7.' },
    { icon: <FaPills />, title: 'Digital Prescriptions', desc: 'Access your prescriptions anytime, anywhere securely.' },
    { icon: <FaFileMedical />, title: 'Medical Reports', desc: 'Store and retrieve all your medical reports in one place.' },
    { icon: <FaShieldAlt />, title: 'Secure & Private', desc: 'Your health data is protected with enterprise-grade security.' },
    { icon: <FaUserMd />, title: 'Expert Doctors', desc: 'Connect with specialists across multiple departments.' },
    { icon: <FaHeartbeat />, title: 'Health Tracking', desc: 'Monitor your health history and treatment progress.' },
  ];


  return (
      <div style={{ minHeight: '100vh', background: 'var(--dark-bg)' }}>
      {/* Navbar */}
      <nav className="mt-navbar">
        <div className="container-fluid px-4 d-flex justify-content-between align-items-center">
          <a href="/" className="brand d-flex align-items-center gap-2">
            <FaHospital style={{ fontSize: '1.4rem', color: '#0ea5e9' }} />
            MediTrack
          </a>
          <div className="d-flex gap-3">
            <Link to="/login" className="btn-outline-mt">Login</Link>
            <Link to="/register" className="btn-primary-mt">Register</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="hero-section d-flex align-items-center"
      style={{
                minHeight: '90vh',
                backgroundImage: `linear-gradient(rgba(38, 68, 114, 0.58), rgb(38, 68, 113)), url(${im})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
             }}>
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="animate-fadeInUp" style={{ opacity: 0 }}>
                <div className="d-inline-flex align-items-center gap-2 mb-4 px-3 py-2" style={{
                  background: 'rgba(15, 150, 212, 0.76)', border: '1px solid rgba(14,165,233,0.2)',
                  borderRadius: '20px', fontSize: '0.85rem', color: 'rgb(255, 255, 255)'
                }}>
                  <FaHeartbeat /> Digital Health Revolution
                </div>
                 <h1 className="mv-hero-title">
                     Your Health Records,<br />
                    <span className="accent" style={{color:'#14B8A6'}}>Unified</span> &amp;<br />
                    <span className="dim" style={{color:'#3B82F6'}}>Accessible.</span>
                   </h1>
                {/* <h1 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px' }}>
                  Your Health Records,{' '}
                  <span className="text-gradient">Digitally Secure</span>
                </h1> */}
                 <p className="mv-hero-sub">
                    MediVault is a next-generation digital health record platform connecting patients and doctors — securely, efficiently, and intelligently. Access your complete medical history from anywhere, anytime.
                 </p>
                 {/* <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.7 }}>
                  MediTrack is a comprehensive Digital Health Record Management System
                  that connects patients, doctors, and administrators in one secure platform.
                 </p> */}
                 <div className="d-flex gap-3 flex-wrap">
                  <Link to="/register" className="btn-primary-mt" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                    <FaUser /> Patient Portal
                  </Link>
                  <Link to="/login?role=doctor" className="btn-outline-mt" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                    <FaUserMd /> Doctor Login
                  </Link>
                  <Link to="/login?role=admin" className="btn-outline-mt" style={{ fontSize: '1rem', padding: '14px 32px', borderColor: 'var(--secondary', color: 'white',background:'#334155' }}>
                    <FaShieldAlt /> Admin
                  </Link>
                </div>
              </div>
            </div>

            <div className="mv-hero-right">
          {/* Patient card */}
          <div className="mv-hcard mv-hcard-main">
            <div className="mv-card-lbl">&nbsp; Patient Record</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: ".9rem" }}>
              <div className="mv-avatar">AK</div>
              <div>
                <div style={{ fontSize: ".9rem", fontWeight: 500,color:"var(--white)" }}>Arun Kumar</div>
                <div style={{ fontSize: ".72rem", color: "var(--slate-400)" }}>ID: #MV-2024-00871</div>
              </div>
            </div>
            <div className="mv-info-grid">
              {[["Age", "34 years"], ["Blood Type", "O+"], ["Last Visit", "May 10, 2025"], ["Doctor", "Dr. Priya S."]].map(([l, v]) => (
                <div key={l}><div className="mv-info-lbl">{l}</div><div className="mv-info-val">{v}</div></div>
              ))}
            </div>
          </div>
          {/* Vitals */}
          <div className="mv-hcard mv-hcard-vitals">
            <div className="mv-card-lbl">&nbsp; Live Vitals</div>
            {[["Heart Rate","74 bpm"],["Blood Pressure","118/76"],["SpO₂","98%"],["Temperature","98.4°F"]].map(([k,v]) => (
              <div className="mv-vital-row" key={k}>
                <span>{k}</span><span className="mv-vital-val">{v}</span>
              </div>
            ))}
          </div>
          {/* Alert */}
          <div className="mv-hcard mv-hcard-alert">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="mv-alert-dot" />
              <div>
                <div style={{ fontSize: ".82rem", fontWeight: 500,color:"var(--teal-400)" }}>Prescription Renewal Due</div>
                <div style={{ fontSize: ".72rem", color: "var(--white)", marginTop: 2 }}>
                  Metformin 500mg — expires in 3 days
                </div>
              </div>
            </div>
          </div>
        </div>
            


             </div>
             </div>  
      </section>

      <section>
                  
      </section>
      
      
      
        
      
      

      {/* Features Section */}
      <section style={{ padding: '80px 0', background: 'rgba(30,41,59,0.3)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{color:'var(--teal-200)', fontSize: '2.2rem', marginBottom: '12px' }}>
              Everything You Need, <span className="text-gradient">In One Place</span>
            </h2>
            <p style={{ color: 'var(--white)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
              Streamline hospital operations and improve patient care with our comprehensive platform.
            </p>
          </div>
          <div className="row g-4">
            {features.map((f, i) => (
              <div key={i} className="col-md-4 animate-fadeInUp" style={{ opacity: 0, animationDelay: `${i * 0.1}s` }}>
                <div className="feature-card h-100">
                  <div className="feature-icon">{f.icon}</div>
                  <h5 style={{ fontWeight: 700, marginBottom: '10px',color:"var(--teal-400)" }}>{f.title}</h5>
                  <p style={{ color: 'var(--white)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 0' }}>
        <div className="container text-center">
          <h2 style={{ fontSize: '2rem', marginBottom: '16px',color:"var(--teal-400)" }}>
            Ready to Go <span className="text-gradient">Digital?</span>
          </h2>
          <p style={{ color: 'var(--white)', marginBottom: '32px', fontSize: '1rem' }}>
            Join thousands of patients and doctors already using MediTrack.
          </p>
          <Link to="/register" className="btn-primary-mt" style={{ fontSize: '1.05rem', padding: '14px 36px' }}>
            Get Started Today →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--dark-surface)', borderTop: '1px solid var(--dark-border)', padding: '32px 0' }}>
        <div className="container text-center">
          <div className="brand mb-2" style={{ fontSize: '1.4rem', display: 'inline-block', color:'var(--secondary-dark)' }}>
            MediTrack
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            © 2024 MediTrack – Digital Health Record Management System
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
