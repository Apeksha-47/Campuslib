import api from './api';
export const getMembers   = (params) => api.get('/members', { params });
export const getMember    = (id)     => api.get(`/members/${id}`);
export const createMember = (data)   => api.post('/members', data);
export const updateMember = (id, d)  => api.put(`/members/${id}`, d);
