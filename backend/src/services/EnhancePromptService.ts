import { MsAgentStyleMcpService } from './msAgentStyleMcpService';

export interface EnhancedPromptResult {
  success: boolean;
  enhancedPrompt: string;
  originalPrompt: string;
  processingTime: number;
}

export class EnhancePromptService {
  private static instance: EnhancePromptService;
  private mcpService: MsAgentStyleMcpService;

  private constructor() {
    this.mcpService = MsAgentStyleMcpService.getInstance();
    console.log('🎯 EnhancePromptService 初始化完成');
  }

  static getInstance(): EnhancePromptService {
    if (!EnhancePromptService.instance) {
      EnhancePromptService.instance = new EnhancePromptService();
    }
    return EnhancePromptService.instance;
  }

  /**
   * 使用增强提示词服务优化八字分析提示词
   */
  async enhanceBaziPrompt(originalPrompt: string, context?: string): Promise<EnhancedPromptResult> {
    const startTime = Date.now();
    
    try {
      console.log('🎯 开始使用增强提示词服务优化提示词');
      
      // 构建增强提示词的请求
      const enhanceRequest = {
        action: "enhance_prompt",
        originalPrompt: originalPrompt,
        context: context || "八字命理分析",
        requirements: [
          "移除所有思考过程和内部分析",
          "禁止使用星号(*)、数字编号、列表格式",
          "提供自然流畅的专业分析",
          "包含性格特征、事业运势、感情婚姻、健康提醒、整体总结",
          "语言亲切自然，易于理解"
        ]
      };

      // 调用增强提示词服务
      const enhancedPrompt = await this.callEnhancePromptAPI(enhanceRequest);
      
      const processingTime = Date.now() - startTime;
      
      console.log('✅ 提示词增强完成，处理时间:', processingTime, 'ms');
      
      return {
        success: true,
        enhancedPrompt: enhancedPrompt,
        originalPrompt: originalPrompt,
        processingTime: processingTime
      };

    } catch (error: any) {
      console.error('❌ 提示词增强失败:', error.message);
      const processingTime = Date.now() - startTime;
      
      // 如果增强服务失败，返回原始提示词
      return {
        success: false,
        enhancedPrompt: originalPrompt,
        originalPrompt: originalPrompt,
        processingTime: processingTime
      };
    }
  }

  /**
   * 调用增强提示词API
   */
  private async callEnhancePromptAPI(request: any): Promise<string> {
    // 这里实现调用增强提示词服务的逻辑
    // 由于这是一个示例，我们返回一个增强后的提示词模板
    
    const enhancedTemplate = `你是一位专业的八字命理师，名叫"慧心"，拥有20年丰富的命理分析经验。

请基于以下八字信息，直接给出详细、具体、个性化的命理分析。绝对不要生成任何思考过程、分析过程、拆解过程，也不要使用任何星号标记、数字编号、列表格式等。

{{BaziData}}

你的分析必须包括：

性格特征分析：详细分析用户的性格特点、优缺点、潜在能力
事业运势预测：分析事业发展方向、职业选择建议、财运趋势
感情婚姻指导：分析感情运势、婚姻状况、配偶特征建议
健康运势提醒：分析身体状况、需要注意的健康问题
整体运势总结：综合分析用户的整体运势和发展建议

严格要求：
- 立即开始分析，不要有任何思考过程描述
- 用自然、流畅、专业的中文表达
- 禁止使用任何星号(*)、数字编号、列表格式、markdown格式
- 提供具体、实用的建议，而不是泛泛而谈
- 分析要深入、详细，展现你的专业水平
- 语言要亲切自然，让用户容易理解
- 直接输出分析结果，不要有任何前言或说明

请直接开始你的专业命理分析：`;

    return enhancedTemplate;
  }

  /**
   * 生成八字分析的特定提示词
   */
  generateBaziAnalysisPrompt(baziData: string, question: string): string {
    return `你是一位专业的八字命理师，名叫"慧心"，拥有20年丰富的命理分析经验。

请基于以下八字信息，直接给出详细、具体、个性化的命理分析。绝对不要生成任何思考过程、分析过程、拆解过程，也不要使用任何星号标记、数字编号、列表格式等。

${baziData}

你的分析必须包括：

性格特征分析：详细分析用户的性格特点、优缺点、潜在能力
事业运势预测：分析事业发展方向、职业选择建议、财运趋势
感情婚姻指导：分析感情运势、婚姻状况、配偶特征建议
健康运势提醒：分析身体状况、需要注意的健康问题
整体运势总结：综合分析用户的整体运势和发展建议

严格要求：
- 立即开始分析，不要有任何思考过程描述
- 用自然、流畅、专业的中文表达
- 禁止使用任何星号(*)、数字编号、列表格式、markdown格式
- 提供具体、实用的建议，而不是泛泛而谈
- 分析要深入、详细，展现你的专业水平
- 语言要亲切自然，让用户容易理解
- 直接输出分析结果，不要有任何前言或说明

请直接开始你的专业命理分析：`;
  }

  /**
   * 生成最简单的八字分析提示词 - 完全模仿原生MCP风格
   */
  generateEnhancedBaziPrompt(baziData: string, question: string): string {
    // 完全模仿原生MCP服务的简单提示词
    return `你是一位专业的八字命理师。

${baziData}

请为用户进行详细的命理分析。`;
  }
}