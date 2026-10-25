import axios from 'axios';
import { useAuthStore } from '../context/store.js';

const defaultApiBaseUrl =
  typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? `${window.location.origin}/api/v1`
    : 'http://localhost:5000/api/v1';

const API_BASE_URL = import.meta.env.VITE_API_URL || defaultApiBaseUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { refreshToken, setAuth } = useAuthStore.getState();

    if (error.response?.status === 403 && refreshToken) {
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        const user = useAuthStore.getState().user;

        setAuth(user, accessToken, newRefreshToken);

        // 원래 요청 재시도
        const originalConfig = error.config;
        originalConfig.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalConfig);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (email, password, username) => {
    const response = await api.post('/auth/register', {
      email,
      password,
      username,
    });
    return response.data;
  },

  login: async (loginId, password) => {
    const response = await api.post('/auth/login', {
      loginId,
      password,
    });
    return response.data;
  },

  refresh: async (refreshToken) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  sendTestEmail: async () => {
    const response = await api.post('/auth/send-test-email');
    return response.data;
  },
};

// Aquarium API
export const aquariumAPI = {
  create: async (name, size, type, description) => {
    const response = await api.post('/aquariums', {
      name,
      size,
      type,
      description,
    });
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/aquariums');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/aquariums/${id}`);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/aquariums/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/aquariums/${id}`);
    return response.data;
  },
};

// Schedule API
export const scheduleAPI = {
  create: async (aquariumId, type, timeOfDay, frequency, nextScheduledAt) => {
    const response = await api.post('/schedules', {
      aquarium_id: aquariumId,
      type,
      time_of_day: timeOfDay,
      frequency,
      next_scheduled_at: nextScheduledAt,
    });
    return response.data;
  },

  getByAquarium: async (aquariumId) => {
    const response = await api.get('/schedules', {
      params: { aquarium_id: aquariumId },
    });
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/schedules/${id}`, data);
    return response.data;
  },

  complete: async (id) => {
    const response = await api.post(`/schedules/${id}/complete`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/schedules/${id}`);
    return response.data;
  },
};

export default api;
