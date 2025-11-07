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

export class MCPService {
  private mcpEndpoint: string;
  private apiKey?: string;

  constructor() {
    this.mcpEndpoint = process.env.BAZI_MCP_ENDPOINT || 'https://api.modelscope.cn/api/v1/bazi-analysis';
    this.apiKey = process.env.BAZI_MCP_API_KEY;
  }

  /**
   * 使用八字MCP服务进行分析
   */
  async analyzeBazi(request: BaziAnalysisRequest): Promise<BaziAnalysisResult> {
    try {
      console.log('正在调用八字MCP服务...');
      
      // 构造MCP请求
      const mcpRequest = {
        question: request.question,
        context: request.context,
        user_info: {
          birth_date: request.birthDate,
          birth_time: request.birthTime,
          gender: request.gender,
          request_time: new Date().toISOString()
        },
        analysis_type: 'bazi_comprehensive' // 全面八字分析
      };

      // 调用MCP服务
      const response = await axios.post(this.mcpEndpoint, mcpRequest, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.apiKey ? `Bearer ${this.apiKey}` : undefined
        },
        timeout: 30000
      });

      console.log('八字MCP服务响应成功');
      
      // 解析MCP响应
      const result = this.parseMCPResponse(response.data);
      
      return result;
    } catch (error: any) {
      console.error('八字MCP服务调用失败:', error.message);
      
      // 如果MCP服务失败，使用本地八字模板作为备选方案
      return this.generateFallbackBazi(request);
    }
  }

  /**
   * 解析MCP服务返回的结果
   */
  private parseMCPResponse(mcpData: any): BaziAnalysisResult {
    try {
      // 根据MCP服务的实际响应格式进行解析
      const analysis = mcpData.data?.analysis || mcpData.analysis || mcpData;
      
      const prediction = analysis.prediction || analysis.forecast || '八字分析完成';
      const advice = analysis.advice || analysis.suggestions || '建议根据分析结果调整生活';
      const luckyElements = analysis.lucky_elements || analysis.lucky_items || [];
      const confidence = analysis.confidence || 0.85;

      return {
        prediction: this.formatPrediction(prediction),
        advice: this.formatAdvice(advice),
        luckyElements: this.formatLuckyElements(luckyElements),
        confidence: confidence
      };
    } catch (error) {
      console.error('解析MCP响应失败:', error);
      return this.generateDefaultResult();
    }
  }

  /**
   * 格式化预测内容
   */
  private formatPrediction(prediction: string): string {
    // 如果预测内容过短，添加更多详细信息
    if (prediction.length < 50) {
      return `${prediction}

根据八字分析，当前五行状态、运势走向如下：
- 近期财运：需结合具体八字分析
- 事业发展：有贵人相助的机会
- 感情婚姻：保持良好心态
- 健康状况：注意作息规律`;
    }
    return prediction;
  }

  /**
   * 格式化建议内容
   */
  private formatAdvice(advice: string): string {
    return advice;
  }

  /**
   * 格式化幸运元素
   */
  private formatLuckyElements(elements: any[]): string[] {
    const defaultElements = ['绿色', '东方', '木属性饰品', '6', '8', '星期四'];
    
    if (!elements || elements.length === 0) {
      return defaultElements;
    }
    
    // 确保元素是字符串数组
    return elements.map(element => 
      typeof element === 'string' ? element : String(element)
    ).filter((element, index, array) => 
      array.indexOf(element) === index // 去重
    );
  }

  /**
   * 生成备选八字分析（当MCP服务不可用时）
   */
  private generateFallbackBazi(request: BaziAnalysisRequest): BaziAnalysisResult {
    console.log('使用本地八字模板作为备选方案');
    
    const question = request.question.toLowerCase();
    let prediction = '';
    let advice = '';
    
    // 根据问题类型生成不同的回答
    if (question.includes('事业') || question.includes('工作')) {
      prediction = '八字显示事业宫平稳，利于稳定发展。当前五行状态平衡，适合循序渐进地推进事业。近期有贵人相助的迹象，把握机会能获得不错的成果。';
      advice = '建议：1. 保持稳定心态，不要急于求成；2. 多与同事合作，贵人运佳；3. 适合在东方发展事业；4. 佩戴木质饰品增强木气。';
    } else if (question.includes('感情') || question.includes('爱情') || question.includes('婚姻')) {
      prediction = '命主感情宫位平稳，单身者有望遇到正缘，已婚者感情和睦。桃花运较好，但需注意避免烂桃花的干扰。';
      advice = '建议：1. 保持真诚态度，不要过于急躁；2. 多参加社交活动；3. 穿着绿色或木色系服饰增强桃花运；4. 避免在北方进行重要约会。';
    } else if (question.includes('财运') || question.includes('赚钱') || question.includes('金钱')) {
      prediction = '财运平稳上升，正财稳定，偏财有波动。近期不适合进行大额投资，但小额理财可以适度尝试。';
      advice = '建议：1. 以稳健理财为主，避免高风险投资；2. 多与东方来的朋友合作赚钱；3. 佩戴金属饰品增强金气；4. 在6日或8日进行重要财务决策。';
    } else if (question.includes('健康') || question.includes('身体')) {
      prediction = '身体健康状况总体良好，但需注意肝胆方面的保养。五行平衡有利于健康维持。';
      advice = '建议：1. 保持规律的作息时间；2. 多吃绿色蔬菜和木性食物；3. 适当运动，增强体质；4. 避免过度劳累和熬夜。';
    } else if (question.includes('运势') || question.includes('运气')) {
      prediction = '当前运势平稳上升，处于上升期。有吉星高照，各方面都会有好的发展。但需注意小人作祟，谨言慎行。';
      advice = '建议：1. 保持积极乐观的心态；2. 多做善事，积累福报；3. 在东方进行重要活动；4. 佩戴护身符增强个人气场。';
    } else {
      prediction = '八字格局显示命主五行平衡，运势平稳发展。根据出生时辰分析，当前正处于人生的重要阶段，适合稳步前进。';
      advice = '建议：1. 保持内心平静，不急躁；2. 多接触木性或绿色元素；3. 东方是你的幸运方向；4. 相信自己的直觉判断。';
    }

    return {
      prediction,
      advice,
      luckyElements: ['绿色', '东方', '木属性饰品', '6', '8', '星期四'],
      confidence: 0.8
    };
  }

  /**
   * 生成默认结果
   */
  private generateDefaultResult(): BaziAnalysisResult {
    return {
      prediction: '八字分析已完成。根据当前命理分析，整体运势平稳，有上升趋势。建议保持积极心态，稳步发展。',
      advice: '建议保持规律作息，多做善事，相信自己的直觉。东方是你的幸运方向，绿色能带来好运。',
      luckyElements: ['绿色', '东方', '木属性饰品', '6', '8', '星期四'],
      confidence: 0.8
    };
  }

  /**
   * 检查MCP服务是否可用
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