import api from './axiosConfig';

export const getUsers = (params) => api.get('/user', { params }).then(res => res.data);
export const createUser = (data) => api.post('/user', data).then(res => res.data);
export const updateUser = (id, data) => api.put(`/user/${id}`, data).then(res => res.data);
export const deleteUser = (id) => api.delete(`/user/${id}`).then(res => res.data);
