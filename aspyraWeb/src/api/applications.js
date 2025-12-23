import api from './axiosConfig';

export const getApplications = (params) => api.get('/application', { params }).then(res => res.data);
export const createApplication = (data) => api.post('/application', data).then(res => res.data);
export const updateApplication = (id, data) => api.put(`/application/${id}`, data).then(res => res.data);
export const deleteApplication = (id) => api.delete(`/application/${id}`).then(res => res.data);
