import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productApi = {
  getAll: () => api.get('/products'),
  add: (formData) => api.post('/products', formData, { 
    headers: { 'Content-Type': 'multipart/form-data' } 
  }),
  delete: (id) => api.delete(`/products/${id}`),
};

export const userApi = {
  login: (credentials) => api.post('/users/login', credentials),
  register: (userData) => api.post('/users/register', userData),
  getAll: () => api.get('/users/all'),
  delete: (id) => api.delete(`/users/${id}`),
  updateProfile: (id, formData) => api.put(`/users/${id}/update`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export default api;
