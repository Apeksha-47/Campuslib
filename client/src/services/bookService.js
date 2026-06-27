import api from './api';
export const getBooks   = (params) => api.get('/books', { params });
export const getBook    = (id)     => api.get(`/books/${id}`);
export const createBook = (data)   => api.post('/books', data);
export const updateBook = (id, data) => api.put(`/books/${id}`, data);
export const deleteBook = (id)     => api.delete(`/books/${id}`);
