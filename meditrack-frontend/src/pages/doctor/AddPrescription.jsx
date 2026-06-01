import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { patientAPI, prescriptionAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FaUserInjured, FaPills, FaNotesMedical, FaRegClock, FaInfoCircle } from 'react-icons/fa';

const AddPrescription = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    diagnosis: '',
    medicineName: '',
    dosage: '',
    duration: '',
    instructions: ''
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      // In a real scenario, doctors might only see their own patients. For demo, fetch all.
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await prescriptionAPI.add({
        ...formData,
        doctorId: user.userId
      });
      toast.success('Prescription added successfully!');
      setFormData({ patientId: '', diagnosis: '', medicineName: '', dosage: '', duration: '', instructions: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add prescription');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <DashboardLayout><div className="text-center py-5"><span className="spinner-border text-primary" /></div></DashboardLayout>;

  return (
    <DashboardLayout title="Add Prescription" subtitle="Prescribe medications to your patients.">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="mt-card p-4 p-md-5">
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                <div className="col-md-12">
                  <label className="mt-label">Select Patient *</label>
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
                  <label className="mt-label">Diagnosis *</label>
                  <div style={{ position: 'relative' }}>
                    <FaNotesMedical style={{ position: 'absolute', left: '14px', top: '20px', color: 'var(--text-muted)' }} />
                    <textarea className="mt-input" style={{ paddingLeft: '40px', minHeight: '80px' }} placeholder="E.g., Viral Fever, Hypertension..." name="diagnosis" value={formData.diagnosis} onChange={handleChange} required />
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="divider my-2"></div>
                  <h6 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>Medication Details</h6>
                </div>

                <div className="col-md-6">
                  <label className="mt-label">Medicine Name *</label>
                  <div style={{ position: 'relative' }}>
                    <FaPills style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input type="text" className="mt-input" style={{ paddingLeft: '40px' }} placeholder="E.g., Paracetamol 500mg" name="medicineName" value={formData.medicineName} onChange={handleChange} required />
                  </div>
                </div>
                
                <div className="col-md-3">
                  <label className="mt-label">Dosage *</label>
                  <input type="text" className="mt-input" placeholder="E.g., 1-0-1" name="dosage" value={formData.dosage} onChange={handleChange} required />
                </div>

                <div className="col-md-3">
                  <label className="mt-label">Duration *</label>
                  <div style={{ position: 'relative' }}>
                    <FaRegClock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input type="text" className="mt-input" style={{ paddingLeft: '40px' }} placeholder="E.g., 5 days" name="duration" value={formData.duration} onChange={handleChange} required />
                  </div>
                </div>

                <div className="col-12">
                  <label className="mt-label">Special Instructions</label>
                  <div style={{ position: 'relative' }}>
                    <FaInfoCircle style={{ position: 'absolute', left: '14px', top: '20px', color: 'var(--text-muted)' }} />
                    <textarea className="mt-input" style={{ paddingLeft: '40px', minHeight: '80px' }} placeholder="E.g., Take after meals..." name="instructions" value={formData.instructions} onChange={handleChange} />
                  </div>
                </div>

                <div className="col-12 mt-4 text-end">
                  <button type="submit" className="btn-primary-mt w-100 justify-content-center" disabled={submitting}>
                    {submitting ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                    Save Prescription
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

export default AddPrescription;
