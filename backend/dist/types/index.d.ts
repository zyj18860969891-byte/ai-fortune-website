export interface FortuneRequest {
    question: string;
    type?: 'tarot' | 'bazi' | 'astrology' | 'numerology';
    context?: string;
    birthInfo?: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
    };
    userId?: string;
    sessionId?: string;
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
        baziMcpData?: any;
    };
    timestamp: string;
    processingTime: number;
}
export interface ModelConfig {
    modelId: string;
    apiKey: string;
    baseUrl: string;
}
//# sourceMappingURL=index.d.ts.map