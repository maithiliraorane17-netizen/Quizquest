import axios from 'axios';
const api = axios.create({ baseURL: 'https://quizquest-backend-fmts.onrender.com/api', headers: { 'Content-Type': 'application/json' }, timeout: 10000 });
api.interceptors.request.use(c => {
  const t = localStorage.getItem('qq_token');
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});
api.interceptors.response.use(r => r, e => {
  if (e.response?.status === 401) {
    localStorage.removeItem('qq_token');
    localStorage.removeItem('qq_user');
    if (!window.location.pathname.includes('/login')) window.location.href = '/login';
  }
  return Promise.reject(e);
});
export default api;
