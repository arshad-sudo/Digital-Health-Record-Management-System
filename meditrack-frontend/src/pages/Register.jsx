import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHospital, FaUser, FaEnvelope, FaLock, FaPhone, FaCalendar, FaDroplet, FaLocationDot } from 'react-icons/fa6';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '', age: '', gender: '', dob: '', bloodGroup: '',
    contactNumber: '', email: '', password: '', confirmPassword: '',
    address: '', medicalHistory: '', emergencyContact: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    setLoading(true);
    try {
      await authAPI.registerPatient(formData);
      toast.success('Registration successful! Please login.');
      navigate('/login?role=patient');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };
  const TRUST = [
  ["shield-check",   "HIPAA & HL7 FHIR Compliant"],
  ["lock-fill",      "256-bit AES Encryption"],
  ["cloud-check",    "99.9% Uptime Guaranteed"],
  ["award",          "ISO 27001 Certified"],
];

  return (
    
    <div style={{ minHeight: '100vh',    background: 'linear-gradient(160deg, var(--teal-800) 0%, var(--slate-900) 100%)'
, padding: '40px 20px',display:'flex' }}>
      
      <div className="mv-login-left">
        <div className="mv-ll-inner">
          <div className="mv-left-bottom">
            <h2 className="mv-tagline">
              <span className="hi">Healthcare</span><br />
              at the speed of<br />information.
            </h2>
            <p className="mv-left-sub">
              Secure access to complete medical histories,<br/> real-time collaboration between care teams,<br/> and intelligent health tracking — all in one platform.
            </p>
            <div className="mv-trust">
              {TRUST.map(([ ,text]) => (
                <div className="mv-trust-item" key={text}>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container" style={{ maxWidth: '800px'}}>
        <div className="text-center mb-4">
          <Link to="/" className="brand d-inline-flex align-items-center gap-2" style={{ textDecoration: 'none', fontSize: '1.8rem', fontWeight: 800, background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            <FaHospital style={{ color: '#0ea5e9', WebkitTextFillColor: '#0ea5e9' }} />
            MediTrack
          </Link>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>Create your patient account</p>
        </div>

        <div className="mt-card p-4 p-md-5">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-md-6">
                <label className="mt-label">Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <FaUser style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" className="mt-input" style={{ paddingLeft: '40px' }} name="fullName" value={formData.fullName} onChange={handleChange} required />
                </div>
              </div>
              <div className="col-md-6">
                <label className="mt-label">Email Address *</label>
                <div style={{ position: 'relative' }}>
                  <FaEnvelope style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="email" className="mt-input" style={{ paddingLeft: '40px' }} name="email" value={formData.email} onChange={handleChange} required />
                </div>
              </div>
              
              <div className="col-md-6">
                <label className="mt-label">Password *</label>
                <div style={{ position: 'relative' }}>
                  <FaLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="password" className="mt-input" style={{ paddingLeft: '40px' }} name="password" value={formData.password} onChange={handleChange} required minLength="6" />
                </div>
              </div>
              <div className="col-md-6">
                <label className="mt-label">Confirm Password *</label>
                <div style={{ position: 'relative' }}>
                  <FaLock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="password" className="mt-input" style={{ paddingLeft: '40px' }} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required minLength="6" />
                </div>
              </div>

              <div className="col-md-4">
                <label className="mt-label">Date of Birth</label>
                <div style={{ position: 'relative' }}>
                  <FaCalendar style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="date" className="mt-input" style={{ paddingLeft: '40px' }} name="dob" value={formData.dob} onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-4">
                <label className="mt-label">Age</label>
                <input type="number" className="mt-input" name="age" value={formData.age} onChange={handleChange} />
              </div>
              <div className="col-md-4">
                <label className="mt-label">Gender</label>
                <select className="mt-input" name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="mt-label">Blood Group</label>
                <div style={{ position: 'relative' }}>
                  <FaDroplet style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-900)' }} />
                  <select className="mt-input" style={{ paddingLeft: '40px' }} name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="A+">A+</option><option value="A-">A-</option>
                    <option value="B+">B+</option><option value="B-">B-</option>
                    <option value="O+">O+</option><option value="O-">O-</option>
                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                  </select>
                </div>
              </div>
              <div className="col-md-4">
                <label className="mt-label">Contact Number *</label>
                <div style={{ position: 'relative' }}>
                  <FaPhone style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" className="mt-input" style={{ paddingLeft: '40px' }} name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
                </div>
              </div>
              <div className="col-md-4">
                <label className="mt-label">Emergency Contact</label>
                <input type="text" className="mt-input" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} />
              </div>

              <div className="col-12">
                <label className="mt-label">Address</label>
                <div style={{ position: 'relative' }}>
                  <FaLocationDot style={{ position: 'absolute', left: '14px', top: '20px', color: 'var(--text-muted)' }} />
                  <textarea className="mt-input" style={{ paddingLeft: '40px', minHeight: '80px' }} name="address" value={formData.address} onChange={handleChange} />
                </div>
              </div>

              <div className="col-12">
                <label className="mt-label">Medical History (Optional)</label>
                <textarea className="mt-input" style={{ minHeight: '80px' }} placeholder="Any chronic diseases, allergies, past surgeries..." name="medicalHistory" value={formData.medicalHistory} onChange={handleChange} />
              </div>

              <div className="col-12 mt-4">
                <button type="submit" className="btn-primary-mt w-100 justify-content-center py-3" disabled={loading} style={{ fontSize: '1.1rem' }}>
                  {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                  Complete Registration
                </button>
              </div>
            </div>
          </form>

          <div className="text-center mt-4 pt-3 border-top border-secondary opacity-75">
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>


      
    </div>
  );
};

export default Register;
