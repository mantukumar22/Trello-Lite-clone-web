import api from './api';

const authService = {

  register: async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    return res.data;
  },

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data; // { accessToken, user }
  },

  logout: async () => {
    await api.post('/auth/logout');
  },

  refreshToken: async () => {
    const res = await api.post('/auth/refresh');
    return res.data; // { accessToken }
  },

};

export default authService;