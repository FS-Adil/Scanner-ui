import axios from 'axios';
import { useOfflineStore } from '../store/useOfflineStore';
import { mockOrders } from './mockData';

// Проверяем, используется ли мок-режим
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_API_URL;

// Создаем экземпляр axios с базовым URL
const client = axios.create({
  baseURL: USE_MOCK ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:8000/api'),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Флаг для отслеживания мок-режима
export const isMockMode = USE_MOCK;

// Перехватчик запросов - добавляем токен авторизации
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Перехватчик ответов - обрабатываем ошибки
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // В мок-режиме не обрабатываем сетевые ошибки
    if (USE_MOCK) {
      return Promise.reject(error);
    }
    
    // Если нет сети - сохраняем запрос в офлайн-очередь
    if (!error.response && error.code === 'ERR_NETWORK') {
      const offlineStore = useOfflineStore.getState();
      offlineStore.addToQueue({
        url: error.config.url,
        method: error.config.method,
        data: error.config.data,
        timestamp: Date.now()
      });
      return Promise.reject(new Error('OFFLINE'));
    }
    
    // Если 401 - разлогиниваем
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default client;