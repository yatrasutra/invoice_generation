import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  register: (name, email, password) => api.post('/api/auth/register', { name, email, password }),
};

// Form APIs
export const formAPI = {
  getSchema: () => api.get('/api/form/schema'),
  submitForm: (data) => api.post('/api/form/submit', { data }),
  getMySubmissions: () => api.get('/api/form/my-submissions'),
  getSubmission: (id) => api.get(`/api/form/${id}`),
};

// Admin APIs
export const adminAPI = {
  getSubmissions: (status = 'all') => api.get(`/api/admin/submissions?status=${status}`),
  approveSubmission: (id) => api.post(`/api/admin/form/${id}/approve`),
  rejectSubmission: (id, message) => api.post(`/api/admin/form/${id}/reject`, { message }),
};

// Itinerary APIs
export const itineraryAPI = {
  getSchema: () => api.get('/api/itinerary/schema'),
  submitItinerary: (data) => api.post('/api/itinerary/submit', { data }),
  getMySubmissions: () => api.get('/api/itinerary/my-submissions'),
  getSubmission: (id) => api.get(`/api/itinerary/${id}`),
  downloadBrochure: (id) => api.get(`/api/itinerary/${id}/download`, { 
    responseType: 'blob' 
  }),
};

// Admin Itinerary APIs
export const adminItineraryAPI = {
  getSubmissions: (status = 'all') => api.get(`/api/admin/itineraries?status=${status}`),
  approveItinerary: (id) => api.post(`/api/admin/itinerary/${id}/approve`),
  rejectItinerary: (id, message) => api.post(`/api/admin/itinerary/${id}/reject`, { message }),
};

export default api;



