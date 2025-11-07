export interface RealModelScopeConfig {
    apiKey: string;
    modelId: string;
    baseUrl: string;
    serviceType?: 'modelscope' | 'openai';
    openaiApiKey?: string;
    openaiModel?: string;
}
export interface FortuneAnalysisResult {
    success: boolean;
    prediction: string;
    advice: string;
    luckyElements: string[];
    confidence: number;
    source: string;
    apiStatus: string;
    processingTime: number;
    personality?: any;
}
export declare class RealModelScopeOnlineService {
    private config;
    private conversationHistory;
    private enhancePromptService;
    private lastApiCallTime;
    private readonly MIN_API_INTERVAL;
    constructor(config: RealModelScopeConfig);
    generateFortune(question: string, context?: string, type?: string, systemPrompt?: string): Promise<FortuneAnalysisResult>;
    private formatHumanLikeResponse;
    /**
     * 清理重复的内容
     */
    private removeDuplicates;
    /**
     * 检查内容是否重复（基于相似性）
     */
    private isDuplicateContent;
    /**
     * 计算两个字符串的相似度
     */
    private calculateSimilarity;
    /**
     * 计算Levenshtein距离
     */
    private levenshteinDistance;
    /**
     * 重新组织段落结构
     */
    private reorganizeParagraphs;
    private generateFallbackResponse;
    private callModelScopeAPI;
    /**
     * 直接使用原始提示词，不进行任何增强
     */
    private enhancePromptWithService;
    /**
     * 构建最原始的提示词，完全模仿原生MCP服务
     */
    private buildRawPrompt;
    /**
     * 构建最简单的提示词，完全模仿原生MCP服务
     */
    private buildEnhancedPrompt;
    private simplifyResponse;
    healthCheck(): Promise<{
        healthy: boolean;
        service: string;
        timestamp: string;
        apiStatus: string;
    }>;
    getConversationHistory(): {
        question: string;
        response: string;
    }[];
    clearHistory(): void;
}
export default RealModelScopeOnlineService;
//# sourceMappingURL=realModelScopeOnlineService.d.ts.map