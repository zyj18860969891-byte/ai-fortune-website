import axios from 'axios';
import { FortuneRequest, FortuneResponse } from '../types';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || '/api';

// 生成或获取会话ID（保持对话上下文）
export function getSessionId(): string {
  let sessionId = sessionStorage.getItem('fortune_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('fortune_session_id', sessionId);
  }
  return sessionId;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000, // 增加到45秒，因为AI分析可能需要更长时间
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

  // 聊天功能 - 自动管理会话ID以保持对话上下文
  chat: async (data: { question: string; type: string; context?: string }) => {
    const sessionId = getSessionId();
    const requestData = {
      ...data,
      sessionId, // 添加sessionId以保持会话连贯性
    };
    const response = await api.post('/fortune/chat', requestData);
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

  // 清除会话（开始新对话时使用）
  clearSession: () => {
    sessionStorage.removeItem('fortune_session_id');
  },
};

export default api;