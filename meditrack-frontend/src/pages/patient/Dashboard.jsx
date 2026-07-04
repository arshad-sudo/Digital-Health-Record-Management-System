import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarPlus, FaFilePrescription, FaNotesMedical, FaClock } from 'react-icons/fa';
import DashboardLayout from '../../components/DashboardLayout';
import { patientAPI, appointmentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user.userId]);

  const fetchData = async () => {
    try {
      const [profileRes, apptRes] = await Promise.all([
        patientAPI.getById(user.userId),
        appointmentAPI.getByPatient(user.userId)
      ]);
      setProfile(profileRes.data);
      setAppointments(apptRes.data || []);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = status.toLowerCase();
    return <span className={`mt-badge badge-${s}`}>{status}</span>;
  };

  if (loading) return <DashboardLayout><div className="text-center py-5" ><span className="spinner-border text-primary" /></div></DashboardLayout>;

  return (
    <DashboardLayout >
      <div style={{ paddingTop: '50px',fontSize: '32px',fontWeight: '700',color: 'var(--secondary-dark)', }}>
        <h2>{`Welcome, ${profile?.fullName?.split(' ')[0]}!`}</h2>
      </div>
          

      
      {/* Quick Actions */}
      <div className="row g-4 mb-5" >
        <div className="col-md-4">
          <div className="mt-card p-4 text-center h-100">
            <div className="mt-avatar mx-auto mb-3" style={{ width: '60px', height: '60px', fontSize: '1.5rem', background: 'rgba(14,165,233,0.1)', color: 'var(--primary)' }}>
              <FaCalendarPlus />
            </div>
            <h5 className="mb-2" style={{ color: 'var(--secondary-dark)'}}>Book Appointment</h5>
            <p className=" mb-3" style={{ fontSize: '0.85rem',color: 'var(--accent)'}}>Schedule a visit with our experts</p>
            <Link to="/patient/book-appointment" className="btn-primary-mt w-100 justify-content-center">Book Now</Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className="mt-card p-4 text-center h-100">
            <div className="mt-avatar mx-auto mb-3" style={{ width: '60px', height: '60px', fontSize: '1.5rem', background: 'rgba(99,102,241,0.1)', color: 'var(--secondary)' }}>
              <FaFilePrescription />
            </div>
            <h5 className="mb-2"  style={{ color: 'var(--secondary-dark)'}}>My Prescriptions</h5>
            <p className=" mb-3" style={{ fontSize: '0.85rem',color: 'var(--accent)'}}>View your past and current meds</p>
            <Link to="/patient/prescriptions" className="btn-outline-mt w-100 justify-content-center">View Details</Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className="mt-card p-4 text-center h-100">
            <div className="mt-avatar mx-auto mb-3" style={{ width: '60px', height: '60px', fontSize: '1.5rem', background: 'rgba(16,185,129,0.1)', color: 'var(--accent)' }}>
              <FaNotesMedical />
            </div>
            <h5 className="mb-2"  style={{ color: 'var(--secondary-dark)'}}>Medical Reports</h5>
            <p className=" mb-3" style={{ fontSize: '0.85rem',color: 'var(--accent)' }}>Access your test results & scans</p>
            <Link to="/patient/reports" className="btn-outline-mt w-100 justify-content-center" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>View Reports</Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="row g-4">
        {/* Recent Appointments */}
        <div className="col-lg-8">
          <div className="mt-card p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="m-0 d-flex align-items-center gap-2" style={{ color: 'var(--secondary-dark)'}}><FaClock className="text-primary" /> Recent Appointments</h5>
              <Link to="/patient/book-appointment" style={{ fontSize: '0.85rem',  color: 'var(--secondary-dark)', textDecoration: 'none', fontWeight: 600 }}>See All</Link>
            </div>
            
            {appointments.length === 0 ? (
              <div className="text-center py-4" style={{ color: 'var(--accent)' }}>
                <p>No recent appointments found.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="mt-table">
                  <thead>
                    <tr>
                      <th>Doctor</th>
                      <th>Date & Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.slice(0, 5).map(app => (
                      <tr key={app.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{app.doctor.doctorName}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.doctor.department}</div>
                        </td>
                        <td>
                          <div style={{ color: 'var(--text-primary)' }}>{app.appointmentDate}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.appointmentTime || 'TBD'}</div>
                        </td>
                        <td>{getStatusBadge(app.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Profile Summary */}
        <div className="col-lg-4">
          <div className="mt-card p-4 h-100">
            <h5 className="mb-4" style={{ color: 'var(--secondary-dark)'}}>Profile Summary</h5>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex justify-content-between border-bottom border-secondary pb-2 border-opacity-50">
                <span style={{ color: 'var(--teal-400)', fontSize: '0.9rem' }}>Age/Gender</span>
                <span style={{ fontWeight: 500, color:'var(--primary-light)'}}>{profile?.age || 'N/A'} / {profile?.gender || 'N/A'}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom border-secondary pb-2 border-opacity-50">
                <span style={{ color: 'var(--teal-400)', fontSize: '0.9rem' }}>Blood Group</span>
                <span style={{ fontWeight: 500, color: 'var(--danger)' }}>{profile?.bloodGroup || 'N/A'}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom border-secondary pb-2 border-opacity-50">
                <span style={{ color: 'var(--teal-400)', fontSize: '0.9rem' }}>Contact</span>
                <span style={{ fontWeight: 500,color:'var(--primary-light)' }}>{profile?.contactNumber || 'N/A'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--teal-400)', fontSize: '0.9rem', display: 'block', marginBottom: '4px' }}>Medical History</span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', margin: 0, padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  {profile?.medicalHistory || 'No history recorded.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
     
    </DashboardLayout>
  );
};

export default PatientDashboard;
