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

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.setItem('loginExpired', 'Your login session has expired. Please log in again.');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


const api = {
  // Auth
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data)
  .then(res => res.data)
  .catch(err => {
    throw err.response?.data || err;
  }),

  // Releases
  searchReleases: (query) => API.get(`/releases/search?q=${query}`),
  autoSaveRelease: (data) => API.post('/releases/auto', data),
  getRelease: (id) => API.get(`/releases/${id}`),

  // Reviews
  addReview: (data) => API.post('/reviews', data),
  getReviews: (releaseId) => API.get(`/reviews/release/${releaseId}`),
  getUserReviews: (userId) => API.get(`/reviews/user/${userId}`),
  getCurrentUserReviews: () => API.get('/reviews/me'),
  updateReview: (reviewId, data) => API.patch(`/reviews/${reviewId}`, data),
  deleteReview: (reviewId) => API.delete(`/reviews/${reviewId}`),

  // Comments
  addComment: (data) => API.post('/comments', data),
  getCommentsByReview: (reviewId) => API.get(`/comments/review/${reviewId}`),

  // Users
  getUserProfile: (userId) => API.get(`/users/${userId}`),
  getCurrentUserProfile: () => API.get('/users/me'),
  updateUserProfile: (data) => API.patch('/users/me', data),
  updateAdmin: (userId, data) => API.patch(`/users/admin/${userId}`, data),
};

export default api;