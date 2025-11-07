export interface EnhancedPromptResult {
    success: boolean;
    enhancedPrompt: string;
    originalPrompt: string;
    processingTime: number;
}
export declare class EnhancePromptService {
    private static instance;
    private mcpService;
    private constructor();
    static getInstance(): EnhancePromptService;
    /**
     * 使用增强提示词服务优化八字分析提示词
     */
    enhanceBaziPrompt(originalPrompt: string, context?: string): Promise<EnhancedPromptResult>;
    /**
     * 调用增强提示词API
     */
    private callEnhancePromptAPI;
    /**
     * 生成八字分析的特定提示词
     */
    generateBaziAnalysisPrompt(baziData: string, question: string): string;
    /**
     * 生成最简单的八字分析提示词 - 完全模仿原生MCP风格
     */
    generateEnhancedBaziPrompt(baziData: string, question: string): string;
}
//# sourceMappingURL=EnhancePromptService.d.ts.map