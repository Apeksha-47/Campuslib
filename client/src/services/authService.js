import api from './api';
export const login = (email, password) => api.post('/auth/login', { email, password });
export const getMe  = () => api.get('/auth/me');
export const changePassword = (current, newPass) => api.put('/auth/password', { current, newPass });
