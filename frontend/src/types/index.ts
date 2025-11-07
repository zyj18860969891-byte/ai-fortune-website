export interface FortuneRequest {
  question: string;
  type: 'tarot' | 'bazi' | 'astrology' | 'numerology';
  birthInfo?: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
  };
  userId?: string;
}

export interface FortuneResponse {
  id: string;
  question: string;
  type: string;
  result: {
    prediction: string;
    advice: string;
    luckyElements: string[];
    confidence: number;
  };
  timestamp: string;
  processingTime: number;
}

export interface FortuneType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}