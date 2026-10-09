import axios from 'axios';
import { getToken, logout } from './auth';

export const api = axios.create({
  baseURL: \`\${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api\`,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logout();
    }
    return Promise.reject(error);
  }
);
