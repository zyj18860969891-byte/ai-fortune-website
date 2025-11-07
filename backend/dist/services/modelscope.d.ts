export declare class ModelScopeService {
    private apiKey;
    private baseUrl;
    private modelId;
    private datasetService;
    private modelscopeMcpService;
    private promptsConfig;
    private conversationHistory;
    constructor(config: {
        apiKey: string;
        modelId: string;
        baseUrl: string;
    });
    private loadPromptsConfig;
    private getDefaultPromptsConfig;
    private preloadDatasets;
    generateFortune(prompt: string, type: string, context?: string): Promise<{
        prediction: string;
        advice: string;
        luckyElements: string[];
        confidence: number;
    }>;
    private getDatasetContent;
    private extractKeywords;
    private buildFortunePrompt;
    private getDefaultFortunePrompt;
    private buildSystemPrompt;
    private getDefaultSystemPrompt;
    private parseFortuneResponse;
    private getDefaultPrediction;
    private getDefaultAdvice;
    private getDefaultLuckyElements;
    private generateFallbackFortune;
    getConversationHistory(): {
        question: string;
        response: string;
    }[];
}
//# sourceMappingURL=modelscope.d.ts.map