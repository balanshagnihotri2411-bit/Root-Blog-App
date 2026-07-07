import api from './axios.js';

export const signupApi   = (data) => api.post('/auth/signup', data);
export const loginApi    = (data) => api.post('/auth/login', data);
export const getMeApi    = ()     => api.get('/auth/me');
