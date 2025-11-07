import axios from 'axios';
import { FortuneRequest, FortuneResponse } from '../types';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fortuneApi = {
  // 生成算命结果
  generateFortune: async (request: FortuneRequest): Promise<FortuneResponse> => {
    const response = await api.post('/fortune/generate', request);
    return response.data;
  },

  // 获取算命类型
  getFortuneTypes: async () => {
    const response = await api.get('/fortune/types');
    return response.data;
  },

  // 聊天功能
  chat: async (data: { question: string; type: string; context?: string }) => {
    const response = await api.post('/fortune/chat', data);
    return response.data;
  },

  // 获取对话历史
  getHistory: async () => {
    const response = await api.get('/fortune/history');
    return response.data;
  },

  // 健康检查
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;