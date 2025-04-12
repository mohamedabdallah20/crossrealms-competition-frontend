import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/chat',
});

export const getThreads = () => api.get('/threads');
export const createThread = (payload) => api.post('/new-thread', payload);
export const deleteThread = (id) => api.delete(`/delete-thread/${id}`);
export const updateThreadName = (id, name) =>
  api.patch(`/update-thread-name/${id}`, { name });
export const sendMessage = (id, message) =>
  api.post(`/chat/${id}`, { query: message });
export const getHistory = (id) => api.get(`/chat-history/${id}`);
