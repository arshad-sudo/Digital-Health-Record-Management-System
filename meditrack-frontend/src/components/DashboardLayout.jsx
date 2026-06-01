import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children, title, subtitle }) => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark-bg)' }}>
      <Navbar />
      <Sidebar />
      <div className="mt-main-content">
        {(title || subtitle) && (
          <div className="page-header animate-fadeInUp">
            {title && <h1>{title}</h1>}
            {subtitle && <p>{subtitle}</p>}
          </div>
        )}
        <div className="animate-fadeInUp delay-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
