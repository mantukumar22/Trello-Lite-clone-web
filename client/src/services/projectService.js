import api from './api';

const projectService = {

  getAllProjects: async () => {
    const res = await api.get('/projects');
    return res.data;
  },

  getProjectById: async (id) => {
    const res = await api.get(`/projects/${id}`);
    return res.data;
  },

  createProject: async (data) => {
    const res = await api.post('/projects', data);
    return res.data;
  },

  updateProject: async (id, data) => {
    const res = await api.put(`/projects/${id}`, data);
    return res.data;
  },

  deleteProject: async (id) => {
    const res = await api.delete(`/projects/${id}`);
    return res.data;
  },

  addMember: async (id, data) => {
    const res = await api.post(`/projects/${id}/members`, data);
    return res.data;
  },

};

export default projectService;