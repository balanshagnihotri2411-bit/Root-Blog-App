import api from './axios.js';

export const getPostsApi      = (params) => api.get('/posts', { params });
export const getPostBySlugApi = (slug)   => api.get(`/posts/${slug}`);
export const getArchiveApi    = ()       => api.get('/posts/archive');
export const getCategoriesApi = ()       => api.get('/posts/categories');

export const createPostApi = (formData) =>
  api.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const updatePostApi = (id, formData) =>
  api.put(`/posts/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const deletePostApi = (id) => api.delete(`/posts/${id}`);
