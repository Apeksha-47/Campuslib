import api from './api';
export const getDashboard   = () => api.get('/reports/dashboard');
export const getPopular     = () => api.get('/reports/popular');
export const getCirculation = () => api.get('/reports/circulation');
