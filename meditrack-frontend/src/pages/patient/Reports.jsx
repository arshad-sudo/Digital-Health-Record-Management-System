import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { reportAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FaFileMedical, FaDownload, FaCalendarAlt } from 'react-icons/fa';

const Reports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await reportAPI.getByPatient(user.userId);
      setReports(res.data);
    } catch (err) {
      toast.error('Failed to load medical reports');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = (path, name) => {
    // In a real app, you would fetch the blob or redirect to the static file.
    // For this demo, we'll just open the API URL.
    window.open(`http://localhost:8080/${path}`, '_blank');
  };

  if (loading) return <DashboardLayout><div className="text-center py-5"><span className="spinner-border text-primary" /></div></DashboardLayout>;

  return (
    <DashboardLayout title="Medical Reports" subtitle="Access your lab results, scans, and documents.">
      {reports.length === 0 ? (
        <div className="mt-card p-5 text-center">
          <div className="mt-avatar mx-auto mb-3" style={{ width: '80px', height: '80px', fontSize: '2rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
            <FaFileMedical />
          </div>
          <h4 style={{ color: 'var(--text-secondary)' }}>No Reports Uploaded</h4>
          <p className="text-muted-mt">Doctors have not uploaded any medical reports for you yet.</p>
        </div>
      ) : (
        <div className="row g-4">
          {reports.map(r => (
            <div className="col-md-6 col-lg-4" key={r.id}>
              <div className="mt-card h-100 p-4">
                <div className="d-flex align-items-start justify-content-between mb-4">
                  <div className="mt-avatar" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--accent)', width: '50px', height: '50px', fontSize: '1.4rem' }}>
                    <FaFileMedical />
                  </div>
                  <span className="mt-badge badge-pending" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)', border: 'none' }}>
                    {r.fileSize}
                  </span>
                </div>
                <h6 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px', wordBreak: 'break-all' }}>{r.fileName}</h6>
                <div className="d-flex align-items-center gap-2 mb-4" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span className="mt-badge badge-confirmed py-1 px-2">{r.reportType}</span>
                  <span><FaCalendarAlt /> {r.uploadDate}</span>
                </div>
                <div className="mt-auto">
                  <button 
                    onClick={() => downloadReport(r.filePath, r.fileName)}
                    className="btn-outline-mt w-100 justify-content-center" 
                    style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)' }}
                  >
                    <FaDownload /> Download File
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Reports;
