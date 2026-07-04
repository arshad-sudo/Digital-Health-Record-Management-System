import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaHospital, FaEnvelope, FaLock, FaUserMd, FaUser, FaShieldAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import logo from '../assets/hosback.jpg';

const Login = () => {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(searchParams.get('role')?.toUpperCase() || 'PATIENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'PATIENT') navigate('/patient/dashboard');
      else if (user.role === 'DOCTOR') navigate('/doctor/dashboard');
      else if (user.role === 'ADMIN') navigate('/admin/dashboard');
    }
  }, [user]);

  const roleOptions = [
    { value: 'PATIENT', icon: <FaUser />, label: 'Patient' },
    { value: 'DOCTOR', icon: <FaUserMd />, label: 'Doctor' },
    { value: 'ADMIN', icon: <FaShieldAlt />, label: 'Admin' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      const res = await authAPI.login({ email, password, role });
      const data = res.data;
      login({ userId: data.userId, name: data.name, email: data.email, role: data.role }, data.token);
      toast.success(`Welcome back, ${data.name}!`);
      if (data.role === 'PATIENT') navigate('/patient/dashboard');
      else if (data.role === 'DOCTOR') navigate('/doctor/dashboard');
      else navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{  backgroundImage: `url(${logo})`, backgroundSize: 'cover', 
       backgroundSize: 'cover', 
      height: '700px' , display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px' }}>
      {/* Background orbs */}
      <div style={{ position: 'fixed', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)', top: '-100px', right: '-100px', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', bottom: '-100px', left: '-100px', pointerEvents: 'none' }} />

      <div className="animate-fadeInUp" style={{ width: '100%', maxWidth: '460px', opacity: 0 }}>
        {/* Logo */}
        <div className="text-center mb-4">
          <Link to="/" className="brand d-inline-flex align-items-center gap-2" style={{ textDecoration: 'none', fontSize: '1.8rem', fontWeight: 800, background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            <FaHospital style={{ color: '#0ea5e9', WebkitTextFillColor: '#0ea5e9' }} />
            MediTrack
          </Link>
          <p style={{ color: 'var(--slate-900)', fontSize: '0.9rem', marginTop: '8px' }}>Sign in to your account</p>
        </div>

        <div className="mt-card p-4">
          {/* Role selector */}
          <div className="d-flex gap-2 mb-4 p-1" style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px' }}>
            {roleOptions.map(r => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className="flex-1 d-flex align-items-center justify-content-center gap-2"
                style={{
                  padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                  background: role === r.value ? 'linear-gradient(135deg, #0ea5e9, #6366f1)' : 'transparent',
                  color: role === r.value ? 'white' : 'var(--text-muted)',
                  fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s'
                }}
              >
                {r.icon} {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mt-form-group">
              <label className="mt-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <FaEnvelope style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  className="mt-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mt-form-group">
              <label className="mt-label">Password</label>
              <div style={{ position: 'relative' }}>
                <FaLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="mt-input"
                  style={{ paddingLeft: '40px', paddingRight: '44px' }}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* {role === 'ADMIN' && (
              <div className="mb-3 p-3" style={{ background: 'rgba(99,102,241,0.1)', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.2)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <strong>Demo Admin:</strong> admin@meditrack.com / admin123
              </div>
            )} */}

            <button type="submit" className="btn-primary-mt w-100 justify-content-center" disabled={loading} style={{ marginTop: '8px' }}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2" />Signing in...</> : `Sign in as ${role.charAt(0) + role.slice(1).toLowerCase()}`}
            </button>
          </form>

          <div className="divider" />
          <p className="text-center" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              Register as Patient
            </Link>
          </p>
          <p className="text-center mt-2">
            <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none' }}>
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
