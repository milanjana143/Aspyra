import api from './axiosConfig';

export const getCompanies = (params) => api.get('/company', { params }).then(res => res.data);
export const createCompany = (data) => api.post('/company', data).then(res => res.data);
export const updateCompany = (id, data) => api.put(`/company/${id}`, data).then(res => res.data);
export const deleteCompany = (id) => api.delete(`/company/${id}`).then(res => res.data);
