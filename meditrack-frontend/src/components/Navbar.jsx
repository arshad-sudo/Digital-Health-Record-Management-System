import React from 'react';
import { Link } from 'react-router-dom';
import { FaHospital, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="mt-navbar" style={{ position: 'fixed', width: '100%', top: 0, zIndex: 1000 }}>
      <div className="container-fluid px-4 d-flex justify-content-between align-items-center">
        <Link to="/" className="brand d-flex align-items-center gap-2" style={{ textDecoration: 'none' }}>
          <FaHospital style={{ color: '#0ea5e9' }} />
          MediTrack
        </Link>
        <div className="d-flex align-items-center gap-3">
          {user && (
            <div className="d-flex align-items-center gap-2">
              <div className="text-end d-none d-sm-block">
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.role}</div>
              </div>
              <div className="mt-avatar" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
                {user.name ? user.name.charAt(0).toUpperCase() : <FaUserCircle />}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
