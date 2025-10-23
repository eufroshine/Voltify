import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Appliances API
export const applianceAPI = {
  getAll: () => api.get('/appliances'),
  getById: (id) => api.get(`/appliances/${id}`),
  create: (data) => api.post('/appliances', data),
  update: (id, data) => api.put(`/appliances/${id}`, data),
  delete: (id) => api.delete(`/appliances/${id}`),
};

// Usage API - TAMBAHKAN delete functions
export const usageAPI = {
  getAll: (params) => api.get('/usage', { params }),
  calculate: (data) => api.post('/usage/calculate', data),
  getSummary: (days) => api.get('/usage/summary', { params: { days } }),
  delete: (id) => api.delete(`/usage/${id}`),           // BARU
  deleteAll: () => api.delete('/usage'),                 // BARU
};

// Settings API
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};

export default api;