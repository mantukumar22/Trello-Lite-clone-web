import api from './api';

const adminService = {

  getAllUsers: async () => {
    const res = await api.get('/admin/users');
    return res.data;
  },

  updateUserRole: async (id, role) => {
    const res = await api.put(`/admin/users/${id}/role`, { role });
    return res.data;
  },

  getStats: async () => {
    const res = await api.get('/admin/stats');
    return res.data;
  },

};

export default adminService;