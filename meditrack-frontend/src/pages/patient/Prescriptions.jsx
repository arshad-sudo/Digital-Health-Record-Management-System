import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { prescriptionAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FaPills, FaUserMd, FaNotesMedical, FaRegClock } from 'react-icons/fa';

const Prescriptions = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await prescriptionAPI.getByPatient(user.userId);
      setPrescriptions(res.data);
    } catch (err) {
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <DashboardLayout><div className="text-center py-5"><span className="spinner-border text-primary" /></div></DashboardLayout>;

  return (
    <DashboardLayout title="My Prescriptions" subtitle="View and manage your digital prescriptions.">
      {prescriptions.length === 0 ? (
        <div className="mt-card p-5 text-center">
          <div className="mt-avatar mx-auto mb-3" style={{ width: '80px', height: '80px', fontSize: '2rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
            <FaPills />
          </div>
          <h4 style={{ color: 'var(--text-secondary)' }}>No Prescriptions Yet</h4>
          <p className="text-muted-mt">You haven't been prescribed any medications yet.</p>
        </div>
      ) : (
        <div className="row g-4">
          {prescriptions.map(p => (
            <div className="col-md-6 col-lg-4" key={p.id}>
              <div className="mt-card h-100" style={{ padding: '24px' }}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="mt-avatar" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--secondary)' }}>
                      <FaPills />
                    </div>
                    <div>
                      <h6 className="m-0" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{p.medicineName}</h6>
                      <span className="mt-badge badge-confirmed" style={{ fontSize: '0.7rem' }}>{p.dosage}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 mb-4" style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FaNotesMedical className="text-muted-mt" /> <span style={{ color: 'var(--text-secondary)' }}>Diagnosis:</span> <strong className="text-light">{p.diagnosis}</strong>
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FaRegClock className="text-muted-mt" /> <span style={{ color: 'var(--text-secondary)' }}>Duration:</span> <strong className="text-light">{p.duration}</strong>
                  </div>
                  <div className="d-flex align-items-start gap-2">
                    <span style={{ color: 'var(--text-secondary)' }}>Instructions:</span> <span className="text-light">{p.instructions || 'None'}</span>
                  </div>
                </div>

                <div className="border-top border-secondary border-opacity-50 pt-3 mt-auto">
                  <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <FaUserMd /> Prescribed by Dr. {p.doctor.doctorName}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Prescriptions;
