import api from './api';

export const advisoryService = {
  getAll: (params) => api.get('/advisory', { params }).then((res) => res.data),
  getById: (id) => api.get(`/advisory/${id}`).then((res) => res.data),
};
