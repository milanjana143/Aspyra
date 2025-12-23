import api from './axiosConfig';

export const getJobs = (params) => api.get('/job', { params }).then(res => res.data);
export const createJob = (data) => api.post('/job', data).then(res => res.data);
export const updateJob = (id, data) => api.put(`/job/${id}`, data).then(res => res.data);
export const deleteJob = (id) => api.delete(`/job/${id}`).then(res => res.data);
