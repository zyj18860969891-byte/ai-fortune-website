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
export declare class MCPService {
    private mcpEndpoint;
    private apiKey?;
    constructor();
    /**
     * 使用八字MCP服务进行分析
     */
    analyzeBazi(request: BaziAnalysisRequest): Promise<BaziAnalysisResult>;
    /**
     * 解析MCP服务返回的结果
     */
    private parseMCPResponse;
    /**
     * 格式化预测内容
     */
    private formatPrediction;
    /**
     * 格式化建议内容
     */
    private formatAdvice;
    /**
     * 格式化幸运元素
     */
    private formatLuckyElements;
    /**
     * 生成备选八字分析（当MCP服务不可用时）
     */
    private generateFallbackBazi;
    /**
     * 生成默认结果
     */
    private generateDefaultResult;
    /**
     * 检查MCP服务是否可用
     */
    checkServiceHealth(): Promise<boolean>;
}
//# sourceMappingURL=mcpService.d.ts.map