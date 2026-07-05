import axios from 'axios';

// Use environment variable for production, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  registerPatient: (data) => api.post('/auth/register/patient', data),
  login: (data) => api.post('/auth/login', data),
};

// Patient APIs
export const patientAPI = {
  getById: (id) => api.get(`/patients/${id}`),
  update: (id, data) => api.put(`/patients/${id}`, data),
  getAll: () => api.get('/patients'),
  delete: (id) => api.delete(`/patients/${id}`),
};

// Doctor APIs
export const doctorAPI = {
  getAll: () => api.get('/doctors'),
  getById: (id) => api.get(`/doctors/${id}`),
  add: (data) => api.post('/doctors', data),
  update: (id, data) => api.put(`/doctors/${id}`, data),
  delete: (id) => api.delete(`/doctors/${id}`),
};

// Appointment APIs
export const appointmentAPI = {
  book: (data) => api.post('/appointments', data),
  getAll: () => api.get('/appointments'),
  getByPatient: (id) => api.get(`/appointments/patient/${id}`),
  getByDoctor: (id) => api.get(`/appointments/doctor/${id}`),
  updateStatus: (id, status) => api.put(`/appointments/${id}/status`, { status }),
  cancel: (id) => api.put(`/appointments/${id}/cancel`),
};

// Prescription APIs
export const prescriptionAPI = {
  add: (data) => api.post('/prescriptions', data),
  getAll: () => api.get('/prescriptions'),
  getByPatient: (id) => api.get(`/prescriptions/patient/${id}`),
  getByDoctor: (id) => api.get(`/prescriptions/doctor/${id}`),
};

// Medical Report APIs
export const reportAPI = {
  upload: (formData) => api.post('/reports/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getAll: () => api.get('/reports'),
  getByPatient: (id) => api.get(`/reports/patient/${id}`),
  delete: (id) => api.delete(`/reports/${id}`),
};

// Admin APIs
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getPatients: () => api.get('/admin/patients'),
  getDoctors: () => api.get('/admin/doctors'),
  getAppointments: () => api.get('/admin/appointments'),
  addDoctor: (data) => api.post('/admin/doctors', data),
  deletePatient: (id) => api.delete(`/admin/patients/${id}`),
  deleteDoctor: (id) => api.delete(`/admin/doctors/${id}`),
};

export default api;
