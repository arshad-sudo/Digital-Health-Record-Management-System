import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FaUsers, FaUserMd, FaCalendarCheck, FaFileMedical, FaPills, FaTrash, FaUserPlus } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, doctors, patients
  
  // New doctor form
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    doctorName: '', email: '', password: '', specialization: '', department: '', contact: '', availableTime: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, doctorsRes, patientsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getDoctors(),
        adminAPI.getPatients()
      ]);
      setStats(statsRes.data);
      setDoctors(doctorsRes.data);
      setPatients(patientsRes.data);
    } catch (err) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.addDoctor(doctorForm);
      toast.success('Doctor added successfully');
      setShowAddDoctor(false);
      setDoctorForm({ doctorName: '', email: '', password: '', specialization: '', department: '', contact: '', availableTime: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add doctor');
    }
  };

  const handleDeleteDoctor = async (id) => {
    if(window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await adminAPI.deleteDoctor(id);
        toast.success('Doctor deleted');
        fetchData();
      } catch (err) {
        toast.error('Failed to delete doctor');
      }
    }
  };

  const handleDeletePatient = async (id) => {
    if(window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await adminAPI.deletePatient(id);
        toast.success('Patient deleted');
        fetchData();
      } catch (err) {
        toast.error('Failed to delete patient');
      }
    }
  };

  if (loading) return <DashboardLayout><div className="text-center py-5"><span className="spinner-border text-primary" /></div></DashboardLayout>;

  return (
    <DashboardLayout title="System Administration" subtitle="Monitor and manage the entire MediTrack platform.">
      {/* Tabs */}
      <div className="d-flex gap-3 mb-4 border-bottom border-secondary pb-3">
        <button onClick={() => setActiveTab('overview')} className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-outline-secondary'}`}>Overview</button>
        <button onClick={() => setActiveTab('doctors')} className={`btn ${activeTab === 'doctors' ? 'btn-primary' : 'btn-outline-secondary'}`}>Manage Doctors</button>
        <button onClick={() => setActiveTab('patients')} className={`btn ${activeTab === 'patients' ? 'btn-primary' : 'btn-outline-secondary'}`}>Manage Patients</button>
      </div>

      {activeTab === 'overview' && (
        <div className="row g-4 animate-fadeIn">
          <div className="col-md-4 col-sm-6">
            <div className="stat-card p-4">
              <FaUsers className="stat-icon text-primary" />
              <div className="stat-number">{stats?.totalPatients || 0}</div>
              <div className="stat-label">Total Patients</div>
            </div>
          </div>
          <div className="col-md-4 col-sm-6">
            <div className="stat-card p-4">
              <FaUserMd className="stat-icon text-success" />
              <div className="stat-number">{stats?.totalDoctors || 0}</div>
              <div className="stat-label">Total Doctors</div>
            </div>
          </div>
          <div className="col-md-4 col-sm-6">
            <div className="stat-card p-4">
              <FaCalendarCheck className="stat-icon text-warning" />
              <div className="stat-number">{stats?.totalAppointments || 0}</div>
              <div className="stat-label">Appointments</div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="stat-card p-4">
              <FaPills className="stat-icon text-info" />
              <div className="stat-number">{stats?.totalPrescriptions || 0}</div>
              <div className="stat-label">Prescriptions Issued</div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="stat-card p-4">
              <FaFileMedical className="stat-icon text-danger" />
              <div className="stat-number">{stats?.totalReports || 0}</div>
              <div className="stat-label">Medical Reports</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'doctors' && (
        <div className="animate-fadeIn">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="m-0">Registered Doctors</h5>
            <button onClick={() => setShowAddDoctor(!showAddDoctor)} className="btn-primary-mt">
              <FaUserPlus /> {showAddDoctor ? 'Cancel' : 'Add New Doctor'}
            </button>
          </div>

          {showAddDoctor && (
            <div className="mt-card p-4 mb-4 border-primary">
              <form onSubmit={handleAddDoctor} className="row g-3">
                <div className="col-md-6"><input type="text" className="mt-input" placeholder="Full Name" value={doctorForm.doctorName} onChange={(e) => setDoctorForm({...doctorForm, doctorName: e.target.value})} required /></div>
                <div className="col-md-6"><input type="email" className="mt-input" placeholder="Email Address" value={doctorForm.email} onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})} required /></div>
                <div className="col-md-6"><input type="password" className="mt-input" placeholder="Temporary Password" value={doctorForm.password} onChange={(e) => setDoctorForm({...doctorForm, password: e.target.value})} required /></div>
                <div className="col-md-6"><input type="text" className="mt-input" placeholder="Department (e.g., Cardiology)" value={doctorForm.department} onChange={(e) => setDoctorForm({...doctorForm, department: e.target.value})} required /></div>
                <div className="col-md-6"><input type="text" className="mt-input" placeholder="Specialization" value={doctorForm.specialization} onChange={(e) => setDoctorForm({...doctorForm, specialization: e.target.value})} required /></div>
                <div className="col-md-6"><input type="text" className="mt-input" placeholder="Contact Number" value={doctorForm.contact} onChange={(e) => setDoctorForm({...doctorForm, contact: e.target.value})} required /></div>
                <div className="col-md-12"><input type="text" className="mt-input" placeholder="Available Time (e.g., Mon-Fri 9AM-5PM)" value={doctorForm.availableTime} onChange={(e) => setDoctorForm({...doctorForm, availableTime: e.target.value})} required /></div>
                <div className="col-12 text-end"><button type="submit" className="btn-success-mt">Save Doctor</button></div>
              </form>
            </div>
          )}

          <div className="mt-card p-0 overflow-hidden">
            <table className="mt-table m-0">
              <thead><tr><th>ID</th><th>Name</th><th>Department</th><th>Email</th><th>Contact</th><th>Actions</th></tr></thead>
              <tbody>
                {doctors.map(d => (
                  <tr key={d.id}>
                    <td>#{d.id}</td><td>{d.doctorName}</td><td><span className="mt-badge badge-confirmed">{d.department}</span></td>
                    <td>{d.email}</td><td>{d.contact}</td>
                    <td><button onClick={() => handleDeleteDoctor(d.id)} className="btn btn-sm btn-danger p-1 px-2"><FaTrash /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'patients' && (
        <div className="animate-fadeIn">
          <div className="mt-card p-0 overflow-hidden">
            <table className="mt-table m-0">
              <thead><tr><th>ID</th><th>Name</th><th>Age/Gender</th><th>Email</th><th>Contact</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody>
                {patients.map(p => (
                  <tr key={p.id}>
                    <td>#{p.id}</td><td>{p.fullName}</td><td>{p.age} / {p.gender}</td>
                    <td>{p.email}</td><td>{p.contactNumber}</td>
                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td><button onClick={() => handleDeletePatient(p.id)} className="btn btn-sm btn-danger p-1 px-2"><FaTrash /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
