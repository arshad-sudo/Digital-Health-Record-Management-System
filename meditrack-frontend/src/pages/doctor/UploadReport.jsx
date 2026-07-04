import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { patientAPI, reportAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FaUserInjured, FaFileUpload, FaTags } from 'react-icons/fa';

const UploadReport = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    reportType: '',
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await patientAPI.getAll();
      setPatients(res.data);
    } catch (err) {
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    setSubmitting(true);
    
    const data = new FormData();
    data.append('patientId', formData.patientId);
    data.append('doctorId', user.userId);
    data.append('reportType', formData.reportType);
    data.append('file', file);

    try {
      await reportAPI.upload(data);
      toast.success('Report uploaded successfully!');
      setFormData({ patientId: '', reportType: '' });
      setFile(null);
      // Reset file input visually
      document.getElementById('reportFileInput').value = '';
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to upload report');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <DashboardLayout><div className="text-center py-5"><span className="spinner-border text-primary" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div >
        <h2 style={{ paddingTop: '50px',fontSize: '32px',fontWeight: '700',color: 'var(--secondary-dark)', }}>Upload Medical Report</h2>
        <h4 style={{color:'var(--teal-400)'}}>Securely upload test results, scans, and documents.</h4>
      </div>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="mt-card p-4 p-md-5">
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                <div className="col-md-12">
                  <label className="mt-label" style={{color:'var(--teal-200)'}}>Select Patient *</label>
                  <div style={{ position: 'relative' }}>
                    <FaUserInjured style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <select className="mt-input" style={{ paddingLeft: '40px' }} name="patientId" value={formData.patientId} onChange={handleChange} required>
                      <option value="">Choose a patient...</option>
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>{p.fullName} (ID: {p.id})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-md-12">
                  <label className="mt-label" style={{color:'var(--teal-200)'}}>Report Type *</label>
                  <div style={{ position: 'relative' }}>
                    <FaTags style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <select className="mt-input" style={{ paddingLeft: '40px' }} name="reportType" value={formData.reportType} onChange={handleChange} required>
                      <option value="">Select type...</option>
                      <option value="Blood Test">Blood Test</option>
                      <option value="X-Ray">X-Ray</option>
                      <option value="MRI Scan">MRI Scan</option>
                      <option value="CT Scan">CT Scan</option>
                      <option value="Urine Test">Urine Test</option>
                      <option value="ECG">ECG</option>
                      <option value="Prescription PDF">Prescription PDF</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-12">
                  <label className="mt-label"  style={{color:'var(--teal-200)'}}>Upload File *</label>
                  <div 
                    style={{ 
                      border: '2px dashed var(--dark-border)', 
                      borderRadius: 'var(--radius-sm)', 
                      padding: '40px', 
                      textAlign: 'center',
                      background: 'rgba(255,255,255,0.02)',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--dark-border)'}
                  >
                    <FaFileUpload style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '16px' }} />
                    <h6 style={{ color: 'var(--text-primary)' }}>Drag and drop file here or click to browse</h6>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Max file size: 10MB. Supported formats: PDF, JPG, PNG.</p>
                    <input 
                      id="reportFileInput"
                      type="file" 
                      className="form-control mt-3 bg-dark text-light border-secondary" 
                      onChange={handleFileChange} 
                      required 
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>
                </div>

                <div className="col-12 mt-4 text-end">
                  <button type="submit" className="btn-primary-mt w-100 justify-content-center" disabled={submitting}>
                    {submitting ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                    Upload Document
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UploadReport;
