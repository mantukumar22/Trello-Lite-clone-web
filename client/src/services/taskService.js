import api from './api';

const taskService = {

  getTasksByProject: async (projectId) => {
    const res = await api.get(`/projects/${projectId}/tasks`);
    return res.data;
  },

  createTask: async (projectId, data) => {
    const res = await api.post(`/projects/${projectId}/tasks`, data);
    return res.data;
  },

  updateTask: async (id, data) => {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data;
  },

  moveTask: async (id, data) => {
    const res = await api.put(`/tasks/${id}/move`, data);
    return res.data;
  },

  deleteTask: async (id) => {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  },

};

export default taskService;