import api from './api';
export const checkout     = (data) => api.post('/circulation/checkout', data);
export const returnBook   = (loan_id) => api.post('/circulation/return', { loan_id });
export const renewLoan    = (loan_id) => api.post('/circulation/renew', { loan_id });
export const getActive    = ()     => api.get('/circulation/active');
export const getOverdue   = ()     => api.get('/circulation/overdue');
export const getMyLoans   = ()     => api.get('/circulation/my-loans');
