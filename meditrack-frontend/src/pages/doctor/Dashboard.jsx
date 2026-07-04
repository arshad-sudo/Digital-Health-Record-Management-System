import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { doctorAPI, appointmentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FaUserInjured, FaCalendarCheck, FaCheck, FaTimes, FaStethoscope } from 'react-icons/fa';

const DoctorDashboard = () => {
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
        doctorAPI.getById(user.userId),
        appointmentAPI.getByDoctor(user.userId)
      ]);
      setProfile(profileRes.data);
      setAppointments(apptRes.data || []);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await appointmentAPI.updateStatus(id, status);
      toast.success(`Appointment ${status.toLowerCase()}`);
      fetchData(); // refresh list
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const pendingAppointments = appointments.filter(a => a.status === 'PENDING');
  const todaysAppointments = appointments.filter(a => {
    const today = new Date().toISOString().split('T')[0];
    return a.appointmentDate === today && a.status === 'CONFIRMED';
  });

  const getStatusBadge = (status) => {
    const s = status.toLowerCase();
    return <span className={`mt-badge badge-${s}`}>{status}</span>;
  };

  if (loading) return <DashboardLayout><div className="text-center py-5"><span className="spinner-border text-primary" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div >
        <h2 style={{ paddingTop: '50px',fontSize: '32px',fontWeight: '700',color: 'var(--secondary-dark)', }}>{`Dr. ${profile?.doctorName}`}</h2>
        <h4 style={{color:'var(--teal-400)'}}>{`Department of ${profile?.department} • ${profile?.specialization}`}</h4>
      </div>
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="stat-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <FaCalendarCheck className="text-primary fs-3" />
              <span className="fs-2 fw-bold"  style={{color:'var(--accent)'}}>{todaysAppointments.length}</span>
            </div>
            <h6 className="m-0" style={{color:'var(--primary-light)'}}>Today's Patients</h6>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <FaStethoscope className="text-warning fs-3" />
              <span className="fs-2 fw-bold"  style={{color:'var(--accent)'}}>{pendingAppointments.length}</span>
            </div>
            <h6 className=" m-0 "  style={{color:'var(--primary-light)'}}>Pending Requests</h6>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <FaUserInjured className="text-success fs-3" />
              <span className="fs-2 fw-bold" style={{color:'var(--accent)'}}>{appointments.length}</span>
            </div>
            <h6 className="m-0" style={{color:'var(--primary-light)'}}>Total Appointments</h6>
          </div>
        </div>
      </div>

      <div className="mt-card p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="m-0" style={{color:'var(--primary-light)'}}>Appointment Management</h5>
        </div>
        
        {appointments.length === 0 ? (
          <div className="text-center py-5" style={{ color: 'var(--text-muted)' }}>
            <FaCalendarCheck size={40} className="mb-3 opacity-50" />
            <p>No appointments found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="mt-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Date & Time</th>
                  <th>Symptoms</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(app => (
                  <tr key={app.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{app.patient.fullName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Age: {app.patient.age} | {app.patient.gender}</div>
                    </td>
                    <td>
                      <div style={{ color: 'var(--text-primary)' }}>{app.appointmentDate}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.appointmentTime || 'TBD'}</div>
                    </td>
                    <td>
                      <div style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={app.symptoms}>
                        {app.symptoms}
                      </div>
                    </td>
                    <td>{getStatusBadge(app.status)}</td>
                    <td>
                      {app.status === 'PENDING' && (
                        <div className="d-flex gap-2">
                          <button onClick={() => handleUpdateStatus(app.id, 'CONFIRMED')} className="btn btn-sm btn-success p-1 px-2"><FaCheck /></button>
                          <button onClick={() => handleUpdateStatus(app.id, 'CANCELLED')} className="btn btn-sm btn-danger p-1 px-2"><FaTimes /></button>
                        </div>
                      )}
                      {app.status === 'CONFIRMED' && (
                        <button onClick={() => handleUpdateStatus(app.id, 'COMPLETED')} className="btn btn-sm btn-outline-primary" style={{ fontSize: '0.8rem' }}>Mark Completed</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
