import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { doctorAPI, appointmentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FaUserMd, FaCalendarAlt, FaClock, FaStethoscope } from 'react-icons/fa';

const BookAppointment = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    symptoms: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await doctorAPI.getAll();
      setDoctors(res.data);
    } catch (err) {
      toast.error('Failed to load doctors');
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
      await appointmentAPI.book({
        patientId: user.userId,
        doctorId: formData.doctorId,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime + ':00', // appending seconds for LocalTime
        symptoms: formData.symptoms
      });
      toast.success('Appointment booked successfully!');
      setFormData({ doctorId: '', appointmentDate: '', appointmentTime: '', symptoms: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <DashboardLayout><div className="text-center py-5"><span className="spinner-border text-primary" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={{ paddingTop: '50px',fontSize: '32px',fontWeight: '700',color: 'var(--secondary-dark)', }}>
        <h1>Book Appointment</h1>
        <h6 style={{color:'var(--teal-400)'}}>Schedule a consultation with our experts.</h6>
      </div>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="mt-card p-4 p-md-5">
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                <div className="col-md-12">
                  <label className="mt-label">Select Doctor *</label>
                  <div style={{ position: 'relative' }}>
                    <FaUserMd style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <select className="mt-input" style={{ paddingLeft: '40px' }} name="doctorId" value={formData.doctorId} onChange={handleChange} required>
                      <option value="">Choose a specialist...</option>
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>{d.doctorName} - {d.specialization} ({d.department})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="mt-label">Preferred Date *</label>
                  <div style={{ position: 'relative' }}>
                    <FaCalendarAlt style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input type="date" className="mt-input" style={{ paddingLeft: '40px' }} name="appointmentDate" value={formData.appointmentDate} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} />
                  </div>
                </div>
                
                <div className="col-md-6">
                  <label className="mt-label">Preferred Time *</label>
                  <div style={{ position: 'relative' }}>
                    <FaClock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input type="time" className="mt-input" style={{ paddingLeft: '40px' }} name="appointmentTime" value={formData.appointmentTime} onChange={handleChange} required />
                  </div>
                </div>

                <div className="col-12">
                  <label className="mt-label">Symptoms / Reason for Visit *</label>
                  <div style={{ position: 'relative' }}>
                    <FaStethoscope style={{ position: 'absolute', left: '14px', top: '20px', color: 'var(--text-muted)' }} />
                    <textarea className="mt-input" style={{ paddingLeft: '40px', minHeight: '120px' }} placeholder="Please describe your symptoms briefly..." name="symptoms" value={formData.symptoms} onChange={handleChange} required />
                  </div>
                </div>

                <div className="col-12 mt-4 text-end">
                  <button type="button" className="btn-outline-mt me-3" onClick={() => setFormData({ doctorId: '', appointmentDate: '', appointmentTime: '', symptoms: '' })}>Reset</button>
                  <button type="submit" className="btn-primary-mt" disabled={submitting}>
                    {submitting ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                    Confirm Booking
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

export default BookAppointment;
