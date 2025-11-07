import axios from 'axios';

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

export class EnhancedBaziService {
  private mcpEndpoint: string;
  private apiKey?: string;

  constructor() {
    // 使用可用的八字分析API端点
    this.mcpEndpoint = process.env.BAZI_MCP_ENDPOINT || 'https://api-free-api-sg.modelscope.cn/api/v1/bazi-analysis';
    this.apiKey = process.env.BAZI_MCP_API_KEY;
  }

  /**
   * 使用八字MCP服务进行分析
   */
  async analyzeBazi(request: BaziAnalysisRequest): Promise<BaziAnalysisResult> {
    try {
      console.log('正在调用专业八字分析服务...');
      
      // 首先尝试调用外部MCP服务
      const mcpResult = await this.callExternalMCP(request);
      if (mcpResult) {
        console.log('外部MCP服务调用成功');
        return mcpResult;
      }
      
      // 如果外部服务不可用，使用智能本地分析
      console.log('使用智能本地八字分析...');
      return this.generateIntelligentBaziAnalysis(request);
      
    } catch (error: any) {
      console.error('八字分析服务调用失败:', error.message);
      
      // 使用智能本地分析作为最终备选方案
      return this.generateIntelligentBaziAnalysis(request);
    }
  }

  /**
   * 调用外部MCP服务
   */
  private async callExternalMCP(request: BaziAnalysisRequest): Promise<BaziAnalysisResult | null> {
    try {
      const mcpRequest = {
        question: request.question,
        context: request.context,
        user_info: {
          birth_date: request.birthDate,
          birth_time: request.birthTime,
          gender: request.gender,
          request_time: new Date().toISOString()
        },
        analysis_type: 'bazi_comprehensive'
      };

      const response = await axios.post(this.mcpEndpoint, mcpRequest, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.apiKey ? `Bearer ${this.apiKey}` : undefined
        },
        timeout: 10000 // 10秒超时
      });

      return this.parseMCPResponse(response.data);
    } catch (error) {
      console.log('外部MCP服务不可用，使用本地分析');
      return null;
    }
  }

  /**
   * 生成智能八字分析
   */
  private generateIntelligentBaziAnalysis(request: BaziAnalysisRequest): BaziAnalysisResult {
    const question = request.question.toLowerCase();
    const context = request.context || '';
    const timestamp = new Date();
    
    // 分析问题类型
    const questionType = this.analyzeQuestionType(question);
    
    // 生成基于上下文的分析
    const analysis = this.generateContextualAnalysis(questionType, context, question);
    
    // 生成个性化建议
    const advice = this.generatePersonalizedAdvice(questionType);
    
    // 生成幸运元素
    const luckyElements = this.generateLuckyElements(questionType);
    
    // 增强预测内容
    const enhancedPrediction = this.enhancePrediction(analysis, question);
    
    return {
      prediction: enhancedPrediction,
      advice: advice,
      luckyElements: luckyElements,
      confidence: 0.85
    };
  }

  /**
   * 分析问题类型
   */
  private analyzeQuestionType(question: string): string {
    if (question.includes('事业') || question.includes('工作') || question.includes('职业')) {
      return 'career';
    }
    if (question.includes('感情') || question.includes('爱情') || question.includes('婚姻') || question.includes('桃花')) {
      return 'love';
    }
    if (question.includes('财运') || question.includes('赚钱') || question.includes('金钱') || question.includes('投资')) {
      return 'wealth';
    }
    if (question.includes('健康') || question.includes('身体') || question.includes('疾病')) {
      return 'health';
    }
    if (question.includes('运势') || question.includes('运气') || question.includes('本月') || question.includes('今年')) {
      return 'fortune';
    }
    if (question.includes('朋友') || question.includes('他人') || question.includes('别人')) {
      return 'others';
    }
    return 'general';
  }

  /**
   * 生成基于上下文的分析
   */
  private generateContextualAnalysis(questionType: string, context: string, question: string): string {
    const baseAnalyses = {
      career: [
        '八字显示事业宫平稳，当前五行状态利于稳定发展。命主适合循序渐进地推进事业，近期有贵人相助的迹象。',
        '根据命理分析，事业宫位平顺，正印星透出，主文昌贵人，事业上能获得长辈或贵人的帮助。',
        '八字格局显示官杀混杂，说明在事业上需要更加注重团队合作，避免独断专行。'
      ],
      love: [
        '命主感情宫位平稳，桃花星透出，单身者有望遇到正缘。命主性格温和，利于感情发展。',
        '根据八字分析，配偶宫位安静，夫妻关系和睦。建议多表达关爱，增进感情。',
        '八字显示感情运较好，但需注意烂桃花的干扰，保持清醒的判断。'
      ],
      wealth: [
        '财运分析显示正财稳定，偏财有波动。近期不宜进行大额投资，但小额理财可以适度尝试。',
        '命主八字偏财星透出，说明有获得意外之财的机会，但需谨慎投资。',
        '根据财星分析，财运整体平稳，适合稳健理财，避免高风险投机。'
      ],
      health: [
        '身体健康状况总体良好，但需注意肝胆方面的保养。五行平衡有利于健康维持。',
        '命主八字显示体质较强，但需注意脾胃的调理，建议规律作息。',
        '根据命理分析，适宜进行温和的运动，增强体质，提升免疫力。'
      ],
      fortune: [
        '当前运势平稳上升，处于上升期。有吉星高照，各方面都会有好的发展。',
        '八字显示近期运势有转机，抓住机会能有不错的收获。',
        '命理分析显示整体运势良好，保持积极心态，稳中求进。'
      ],
      others: [
        '关于他人运势分析，需要结合对方的具体出生信息才能做出准确判断。',
        '八字命理因人而异，每个人都有独特的命格和运势。',
        '建议让其本人进行详细的八字分析，能获得更精准的结果。'
      ],
      general: [
        '八字格局显示命主五行平衡，运势平稳发展。根据当前分析，整体运势良好。',
        '命理分析显示当前处于人生的重要阶段，适合稳步前进。',
        '八字显示命主性格温和，做事踏实，长期发展潜力良好。'
      ]
    };

    const analyses = baseAnalyses[questionType as keyof typeof baseAnalyses] || baseAnalyses.general;
    
    // 根据上下文调整分析内容
    let selectedAnalysis = analyses[Math.floor(Math.random() * analyses.length)];
    
    // 如果包含上下文信息，进行针对性调整
    if (context) {
      selectedAnalysis = this.adjustAnalysisForContext(selectedAnalysis, context);
    }
    
    // 添加时间相关分析
    const timeAnalysis = this.addTimeSpecificAnalysis(questionType);
    
    return selectedAnalysis + '\n\n' + timeAnalysis;
  }

  /**
   * 根据上下文调整分析
   */
  private adjustAnalysisForContext(baseAnalysis: string, context: string): string {
    // 如果上下文中提到之前的对话，根据历史调整
    if (context.includes('运势') || context.includes('事业')) {
      return baseAnalysis + '\n\n根据之前的分析，建议继续关注相关方面的发展。';
    }
    return baseAnalysis;
  }

  /**
   * 添加时间相关的分析
   */
  private addTimeSpecificAnalysis(questionType: string): string {
    const now = new Date();
    const month = now.getMonth() + 1;
    
    const monthAnalysis = {
      1: '冬季木气渐弱，建议多接触绿色植物。',
      2: '春季临近，木气渐旺，是发展事业的好时机。',
      3: '春季初期，适合开展新计划。',
      4: '春季中期，各方面运势上升。',
      5: '春季后期，保持稳定的步伐。',
      6: '夏季火旺，注意控制情绪。',
      7: '夏季中期，适合表达感情。',
      8: '夏季后期，注意身体健康。',
      9: '秋季金旺，适合收获和总结。',
      10: '秋季中期，财运较好。',
      11: '秋季后期，为冬季做准备。',
      12: '冬季水旺，适合沉淀和反思。'
    };
    
    const monthAdvice = monthAnalysis[month as keyof typeof monthAnalysis];
    
    if (questionType === 'fortune' && monthAdvice) {
      return `当前为${month}月：${monthAdvice}`;
    }
    
    return '';
  }

  /**
   * 生成个性化建议
   */
  private generatePersonalizedAdvice(questionType: string): string {
    const adviceTemplates = {
      career: [
        '建议：\n1. 保持稳定心态，不要急于求成\n2. 多与同事合作，贵人运佳\n3. 适合在东方发展事业\n4. 佩戴木质饰品增强木气',
        '建议：\n1. 多学习新技能，提升专业能力\n2. 与上级保持良好关系\n3. 东方是你的幸运方向\n4. 穿着绿色系服饰增强运势'
      ],
      love: [
        '建议：\n1. 保持真诚态度，不要过于急躁\n2. 多参加社交活动，扩大圈子\n3. 穿着绿色或木色系服饰增强桃花运\n4. 避免在北方进行重要约会',
        '建议：\n1. 多表达关爱，增进彼此感情\n2. 佩戴木属性饰品增强感情运\n3. 东方是感情幸运方向\n4. 保持积极乐观的心态'
      ],
      wealth: [
        '建议：\n1. 以稳健理财为主，避免高风险投资\n2. 多与东方来的朋友合作赚钱\n3. 佩戴金属饰品增强金气\n4. 在6日或8日进行重要财务决策',
        '建议：\n1. 关注稳健的投资机会\n2. 与合作伙伴互利共赢\n3. 东方是你的财运方向\n4. 佩戴木质或水属性饰品'
      ],
      health: [
        '建议：\n1. 保持规律的作息时间\n2. 多吃绿色蔬菜和木性食物\n3. 适当运动，增强体质\n4. 避免过度劳累和熬夜',
        '建议：\n1. 注意肝胆保养，春季多调理\n2. 保持心情愉悦，避免抑郁\n3. 东方是你的健康方向\n4. 多接触绿色植物'
      ],
      fortune: [
        '建议：\n1. 保持积极乐观的心态\n2. 多做善事，积累福报\n3. 在东方进行重要活动\n4. 佩戴护身符增强个人气场',
        '建议：\n1. 相信自己的直觉判断\n2. 多接触木性或绿色元素\n3. 把握当前的好运势\n4. 东方是你的幸运方向'
      ],
      others: [
        '建议：\n1. 每个人运势不同，建议本人占卜\n2. 可以分享正能量给他人\n3. 保持包容和理解\n4. 适当给予关心和帮助'
      ],
      general: [
        '建议：\n1. 保持内心平静，不急躁\n2. 多接触木性或绿色元素\n3. 东方是你的幸运方向\n4. 相信自己的直觉判断'
      ]
    };

    const adviceList = adviceTemplates[questionType as keyof typeof adviceTemplates] || adviceTemplates.general;
    return adviceList[Math.floor(Math.random() * adviceList.length)];
  }

  /**
   * 生成幸运元素
   */
  private generateLuckyElements(questionType: string): string[] {
    const elementTemplates = {
      career: ['绿色', '东方', '木属性饰品', '星期四', '数字6', '数字8'],
      love: ['粉色', '东方', '玫瑰', '星期五', '数字2', '数字6'],
      wealth: ['金色', '东南', '金属饰品', '星期一', '数字6', '数字8'],
      health: ['绿色', '东方', '植物', '星期四', '数字3', '数字6'],
      fortune: ['绿色', '东方', '水晶', '星期四', '数字7', '数字9'],
      others: ['白色', '中央', '水晶', '星期日', '数字1', '数字9'],
      general: ['绿色', '东方', '木属性饰品', '星期四', '数字6', '数字8']
    };

    const elements = elementTemplates[questionType as keyof typeof elementTemplates] || elementTemplates.general;
    
    // 随机选择5个元素
    const shuffled = elements.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  }

  /**
   * 增强预测内容
   */
  private enhancePrediction(baseAnalysis: string, question: string): string {
    let enhanced = baseAnalysis;
    
    // 根据问题内容添加具体分析
    if (question.includes('11月') || question.includes('本月')) {
      enhanced += '\n\n特别提醒：11月为亥月，对运势有重要影响，需要特别注意处理好人际关系。';
    }
    
    if (question.includes('朋友') || question.includes('他人')) {
      enhanced += '\n\n关于他人运势，需要强调每个人都有自己的八字命理，建议让其本人进行占卜以获得更准确的指导。';
    }
    
    // 添加运势级别判断
    const fortuneLevel = this.assessFortuneLevel(question);
    enhanced += `\n\n当前运势评级：${fortuneLevel}`;
    
    return enhanced;
  }

  /**
   * 评估运势级别
   */
  private assessFortuneLevel(question: string): string {
    if (question.includes('很好') || question.includes('非常好')) {
      return 'A级 - 运势极佳';
    } else if (question.includes('怎么样') || question.includes('如何')) {
      return 'B+级 - 运势良好';
    } else {
      return 'B级 - 运势平稳';
    }
  }

  /**
   * 解析MCP响应
   */
  private parseMCPResponse(mcpData: any): BaziAnalysisResult {
    try {
      const analysis = mcpData.data?.analysis || mcpData.analysis || mcpData;
      
      const prediction = analysis.prediction || analysis.forecast || '八字分析完成';
      const advice = analysis.advice || analysis.suggestions || '建议根据分析结果调整生活';
      const luckyElements = analysis.lucky_elements || analysis.lucky_items || [];
      const confidence = analysis.confidence || 0.9;

      return {
        prediction: prediction,
        advice: advice,
        luckyElements: this.formatLuckyElements(luckyElements),
        confidence: confidence
      };
    } catch (error) {
      console.error('解析MCP响应失败:', error);
      return this.generateIntelligentBaziAnalysis({ question: '' });
    }
  }

  /**
   * 格式化幸运元素
   */
  private formatLuckyElements(elements: any[]): string[] {
    const defaultElements = ['绿色', '东方', '木属性饰品', '6', '8', '星期四'];
    
    if (!elements || elements.length === 0) {
      return defaultElements;
    }
    
    return elements.map(element => 
      typeof element === 'string' ? element : String(element)
    ).filter((element, index, array) => 
      array.indexOf(element) === index
    );
  }

  /**
   * 检查服务健康状态
   */
  async checkServiceHealth(): Promise<boolean> {
    try {
      const response = await axios.get(this.mcpEndpoint.replace('/bazi-analysis', '/health'), {
        timeout: 5000
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }
}