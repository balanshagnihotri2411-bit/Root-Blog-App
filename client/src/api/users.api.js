import api from './axios.js';

export const getUserProfileApi = (username) => api.get(`/users/${username}`);
export const getTopWritersApi  = ()         => api.get('/users/top-writers');
export const updateMeApi       = (data)     => api.put('/users/me', data);
export const uploadAvatarApi   = (formData) =>
  api.post('/users/me/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const subscribeNewsletterApi = (email) => api.post('/newsletter', { email });
export const submitContactApi  = (data)     => api.post('/contact', data);
