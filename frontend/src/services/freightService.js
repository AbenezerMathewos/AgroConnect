import api from './api';

export const freightService = {
  getAll: (params) => api.get('/freight', { params }).then((res) => res.data),
  create: (data) => api.post('/freight', data).then((res) => res.data),
  book: (id, quintals) => api.patch(`/freight/${id}/book`, { quintals }).then((res) => res.data),
};
