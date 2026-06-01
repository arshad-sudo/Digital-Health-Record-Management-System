import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaCalendarCheck, FaPills, FaFileMedical, FaSignOutAlt, FaUserMd, FaUsers } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getLinks = () => {
    if (!user) return [];

    if (user.role === 'PATIENT') {
      return [
        { path: '/patient/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
        { path: '/patient/book-appointment', label: 'Book Appointment', icon: <FaCalendarCheck /> },
        { path: '/patient/prescriptions', label: 'Prescriptions', icon: <FaPills /> },
        { path: '/patient/reports', label: 'Medical Reports', icon: <FaFileMedical /> },
      ];
    } else if (user.role === 'DOCTOR') {
      return [
        { path: '/doctor/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
        { path: '/doctor/add-prescription', label: 'Add Prescription', icon: <FaPills /> },
        { path: '/doctor/upload-report', label: 'Upload Report', icon: <FaFileMedical /> },
      ];
    } else if (user.role === 'ADMIN') {
      return [
        { path: '/admin/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
      ];
    }
    return [];
  };

  const links = getLinks();

  return (
    <div className="mt-sidebar">
      <div className="mb-4 px-3">
        <h6 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Menu</h6>
      </div>
      <div className="d-flex flex-column gap-2" style={{ height: 'calc(100% - 40px)', justifyContent: 'space-between' }}>
        <div>
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `mt-sidebar-link ${isActive ? 'active' : ''}`}
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="mt-sidebar-link text-danger w-100 border-0 text-start"
            style={{ background: 'transparent' }}
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
