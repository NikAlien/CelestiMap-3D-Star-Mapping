import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8080/api/v1' });

export const fetchFavorites = (token) =>
    api.get('/favorite', { headers: { Authorization: `Bearer ${token}` } });

export const removeFavorite = (token, projectId) =>
    api.delete(`/favorite/${projectId}`, { headers: { Authorization: `Bearer ${token}` } });

export const fetchPublicProjects = (params) =>
    api.get('/project/public', { params });

export const addFavorite = (token, projectId) =>
    api.post(`/favorite/${projectId}`, {}, { headers: { Authorization: `Bearer ${token}` } });

export const fetchMyProjects = (token) =>
    api.get('/project/myProjects', { headers: { Authorization: `Bearer ${token}` } });

export const removeMyProject = (token, projectId) =>
    api.delete(`/project/delete/${projectId}`, { headers: { Authorization: `Bearer ${token}` } });

export const loginUser = (username, password) =>
    api.post('/auth/login', { username, password });

export const registerUser = (username, password) =>
    api.post('/auth/register', { username, password });

export const getUserInfo = (token) =>
    api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });

export const saveProject = (token, projectData) =>
    api.post('/project/save', projectData, { headers: { Authorization: `Bearer ${token}` } });

export const updateProject = (token, projectData) =>
    api.put('/project/update', projectData, { headers: { Authorization: `Bearer ${token}` } });

export const getProject = (token, projectId) =>
    api.get(`/project/${projectId}`, { headers: { Authorization: `Bearer ${token}` } });
