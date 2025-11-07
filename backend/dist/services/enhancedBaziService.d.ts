export interface BaziAnalysisRequest {
    question: string;
    context?: string;
    birthDate?: string;
    birthTime?: string;
    gender?: string;
}
export interface BaziAnalysisResult {
    prediction: string;
    advice: string;
    luckyElements: string[];
    confidence: number;
}
export declare class EnhancedBaziService {
    private mcpEndpoint;
    private apiKey?;
    constructor();
    /**
     * 使用八字MCP服务进行分析
     */
    analyzeBazi(request: BaziAnalysisRequest): Promise<BaziAnalysisResult>;
    /**
     * 调用外部MCP服务
     */
    private callExternalMCP;
    /**
     * 生成智能八字分析
     */
    private generateIntelligentBaziAnalysis;
    /**
     * 分析问题类型
     */
    private analyzeQuestionType;
    /**
     * 生成基于上下文的分析
     */
    private generateContextualAnalysis;
    /**
     * 根据上下文调整分析
     */
    private adjustAnalysisForContext;
    /**
     * 添加时间相关的分析
     */
    private addTimeSpecificAnalysis;
    /**
     * 生成个性化建议
     */
    private generatePersonalizedAdvice;
    /**
     * 生成幸运元素
     */
    private generateLuckyElements;
    /**
     * 增强预测内容
     */
    private enhancePrediction;
    /**
     * 评估运势级别
     */
    private assessFortuneLevel;
    /**
     * 解析MCP响应
     */
    private parseMCPResponse;
    /**
     * 格式化幸运元素
     */
    private formatLuckyElements;
    /**
     * 检查服务健康状态
     */
    checkServiceHealth(): Promise<boolean>;
}
//# sourceMappingURL=enhancedBaziService.d.ts.map