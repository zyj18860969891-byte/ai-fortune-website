export interface BirthInfo {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender?: string;
  timezone?: string;
}

export interface FortuneRequest {
  question: string;
  type: 'tarot' | 'bazi' | 'astrology' | 'numerology';
  birthInfo?: BirthInfo;
  birthInfos?: {
    self?: BirthInfo;
    other?: BirthInfo;
  };
  userId?: string;
  sessionId?: string;
  context?: string;
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