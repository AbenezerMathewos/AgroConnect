import api from './api';
export const orderService = {
  create: (data) => api.post('/orders', data).then((res) => res.data),
  getMine: () => api.get('/orders/my').then((res) => res.data),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }).then((res) => res.data),
};
