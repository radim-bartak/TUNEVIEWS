import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  // Auth
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),

  // Releases
  searchReleases: (query) => API.get(`/releases/search?q=${query}`),
  getRelease: (id) => API.get(`/releases/${id}`),

  // Reviews
  addReview: (data) => API.post('/reviews', data),
  getReviews: (releaseId) => API.get(`/reviews/release/${releaseId}`),

  // Comments
  addComment: (data) => API.post('/comments', data),

  // Users
  getProfile: () => API.get('/users/me'),
  getUserReviews: () => API.get('/reviews/user'),
};