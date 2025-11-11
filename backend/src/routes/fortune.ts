import { Router, Request, Response } from 'express';
import { FortuneRequest, FortuneResponse } from '../types';
import { RealModelScopeOnlineService } from '../services/realModelScopeOnlineService';
import { MsAgentStyleMcpService } from '../services/msAgentStyleMcpService';

const router = Router();

const mcpService = MsAgentStyleMcpService.getInstance();

// 全局出生日期缓存，用于跨请求保存出生信息
const birthDataCache = new Map<string, any>();

// 从上下文提取并缓存出生日期的函数
function extractAndCacheBirthData(context: string, sessionId?: string): any {
  if (!context) return null;
  
  console.log('🔍 开始从上下文提取出生数据，context长度:', context.length);
  
  let birthData = null;
  
  // 方法1：从上下文中提取用户提供的出生日期
  const userMessages = context.split('\n').filter(line => 
    line.startsWith('用户:') && !line.includes('占卜师:')
  );
  
  console.log('🔍 提取到的用户消息:', userMessages);
  
  // 首先尝试从用户消息中提取
  for (const message of userMessages) {
    const match = message.match(/用户:\s*(.+)/);
    if (match) {
      const question = match[1];
      console.log('🔍 尝试从消息提取出生日期:', question);
      const extractedData = extractBirthDataFromQuestion(question);
      if (extractedData) {
        birthData = extractedData;
        console.log('✅ 从用户消息成功提取出生数据:', birthData);
        break;
      }
    }
  }
  
  // 方法2：如果从用户消息中没有找到，尝试从整个context中搜索
  if (!birthData) {
    console.log('🔍 从用户消息中未找到出生数据，尝试从整个context搜索');
    const extractedData = extractBirthDataFromQuestion(context);
    if (extractedData) {
      birthData = extractedData;
      console.log('✅ 从整个context成功提取出生数据:', birthData);
    }
  }
  
  // 方法3：尝试从占卜师的回复中提取（如果用户在回复中提到了出生日期）
  if (!birthData) {
    console.log('🔍 从context和用户消息中未找到出生数据，尝试从占卜师回复中提取');
    const fortuneMessages = context.split('\n').filter(line => 
      line.includes('八字') || line.includes('阳历') || line.includes('农历')
    );
    
    for (const message of fortuneMessages) {
      const extractedData = extractBirthDataFromQuestion(message);
      if (extractedData) {
        birthData = extractedData;
        console.log('✅ 从占卜师回复成功提取出生数据:', birthData);
        break;
      }
    }
  }
  
  // 如果找到出生数据，缓存它
  if (birthData && sessionId) {
    birthDataCache.set(sessionId, birthData);
    console.log('🔧 缓存出生数据:', { sessionId, birthData });
  }
  
  return birthData;
}

// 聊天接口
router.post('/chat', async (req: Request, res: Response) => {
  const startTime = Date.now();
  
  try {
    const requestData: FortuneRequest = req.body;
    
    if (!requestData.question || !requestData.type) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数：question 和 type',
        timestamp: new Date().toISOString()
      });
    }

    console.log('💬 收到八字MCP + ModelScope AI聊天请求:', { 
      question: requestData.question, 
      type: requestData.type,
      context: requestData.context,
      hasBirthInfo: !!requestData.birthInfo,
      body: req.body
    });

    let baziData = null;
    let birthData = requestData.birthInfo || extractBirthDataFromQuestion(requestData.question || '');
    let analysisType = 'general';
    
    console.log('🔍 初始birthData提取结果:', birthData);
    console.log('🔧 birthData类型检查:', {
      hasBirthData: !!birthData,
      birthDataKeys: birthData ? Object.keys(birthData) : null,
      hasYear: !!birthData?.year,
      hasMonth: !!birthData?.month,
      hasDay: !!birthData?.day
    });
    console.log('🔧 birthData类型检查:', {
      hasBirthData: !!birthData,
      birthDataKeys: birthData ? Object.keys(birthData) : null,
      hasYear: !!birthData?.year,
      hasMonth: !!birthData?.month,
      hasDay: !!birthData?.day
    });
    
    // 尝试从上下文提取出生日期并缓存
    if (requestData.context) {
      const contextBirthData = extractAndCacheBirthData(requestData.context, requestData.sessionId);
      if (contextBirthData) {
        birthData = contextBirthData;
        console.log('🔍 从上下文提取到出生数据:', birthData);
      }
    }
    
    // 优先使用当前请求的birthInfo，仅在缺少时尝试从缓存获取
    if (!birthData && requestData.birthInfo) {
      birthData = requestData.birthInfo;
      console.log('✅ 使用当前请求的birthInfo:', birthData);
    } else if (!birthData && requestData.sessionId) {
      // 仅在没有birthInfo时，才从缓存获取
      const cachedBirthData = birthDataCache.get(requestData.sessionId);
      if (cachedBirthData) {
        birthData = cachedBirthData;
        console.log('🔧 从缓存获取出生数据:', { sessionId: requestData.sessionId, birthData });
      }
    }
    
    // 只要用户请求八字分析（type: 'bazi'），就调用八字MCP服务
    if (requestData.type === 'bazi') {
      try {
        console.log('🔮 调用@cantian-ai/Bazi-MCP服务（聊天模式）...');
        console.log('🔍 当前birthData:', birthData);
        
        // birthData已经通过上面的逻辑提取过了，不需要重复提取
        if (!birthData) {
          console.log('⚠️ 再次尝试提取出生数据');
          birthData = requestData.birthInfo || extractBirthDataFromQuestion(requestData.question || '');
        }
        
        console.log('🔍 最终birthData:', birthData);
        
        // 如果没有找到出生信息，仅尝试从缓存获取（禁用context提取）
        if (!birthData) {
          // 尝试从缓存获取（但仅在没有当前birthInfo的情况下）
          if (requestData.sessionId) {
            const cachedBirthData = birthDataCache.get(requestData.sessionId);
            if (cachedBirthData) {
              birthData = cachedBirthData;
              console.log('🔧 从缓存获取出生数据:', { sessionId: requestData.sessionId, birthData });
            }
          }
          
          // 注意：不再从context中提取数据，避免污染
        }
        
        console.log('🔍 最终出生数据:', birthData);
        
        // 如果没有找到出生信息，不调用八字MCP服务
        if (!birthData) {
          console.log('⚠️ 用户请求八字分析但未提供出生信息，需要用户提供出生日期');
          analysisType = 'bazi-requested-no-birthdata';
        }
        
        if (birthData) {
          console.log('🔮 准备调用MCP服务，出生数据:', birthData);
          try {
            const baziResult = await mcpService.calculateBazi(birthData);
            console.log('📊 MCP服务调用结果:', baziResult);
            
            if (baziResult.success) {
              // 解析MCP返回的八字数据 - 增强解析逻辑处理格式异常
              try {
                console.log('📄 MCP原始响应:', baziResult);
                console.log('🔍 检查baziResult.data:', baziResult.data);
                console.log('🔍 检查baziResult.content:', baziResult.content);
                
                // MCP服务返回的数据结构：{ success: true, data: { 八字, 生肖, 日主, ... } }
                console.log('🔍 详细检查baziResult.data:', {
                  '存在': !!baziResult.data,
                  '类型': typeof baziResult.data,
                  '是否为对象': typeof baziResult.data === 'object',
                  '是否为数组': Array.isArray(baziResult.data),
                  '是否为null': baziResult.data === null,
                  '是否为undefined': baziResult.data === undefined,
                  '是否有八字属性': baziResult.data && ('八字' in baziResult.data || '八字' in (baziResult.data.八字 || {})),
                  '是否有生肖属性': baziResult.data && '生肖' in baziResult.data,
                  '是否有日主属性': baziResult.data && '日主' in baziResult.data
                });
                
                // 增强的条件检查 - 处理格式异常情况
                if (baziResult.data && 
                    typeof baziResult.data === 'object' && 
                    !Array.isArray(baziResult.data)) {
                  
                  // 检查是否有八字相关数据（支持多种格式）- 修复检查逻辑
                  const hasBaziData = (
                    baziResult.data && ('八字' in baziResult.data || baziResult.data.八字 || baziResult.data['八字']) ||
                    (baziResult.data && baziResult.data.八字) ||
                    (baziResult.data && baziResult.data.data && ('八字' in baziResult.data.data || baziResult.data.data.八字)) ||
                    (baziResult.data && baziResult.data.content && typeof baziResult.data.content === 'string' && (baziResult.data.content.includes('八字') || baziResult.data.content.includes('生肖') || baziResult.data.content.includes('日主')))
                  );
                  
                  if (hasBaziData) {
                    // 处理嵌套数据结构
                    if (baziResult.data.data && baziResult.data.data.八字) {
                      baziData = baziResult.data.data;
                    } else if (baziResult.data.content && typeof baziResult.data.content === 'string') {
                      try {
                        // 尝试解析content中的JSON
                        const parsedContent = JSON.parse(baziResult.data.content);
                        baziData = parsedContent;
                      } catch {
                        // 如果解析失败，直接使用原始data
                        baziData = baziResult.data;
                      }
                    } else {
                      baziData = baziResult.data;
                    }
                    
                    analysisType = 'bazi-enhanced';
                    console.log('✅ 聊天模式八字MCP计算成功');
                    console.log('📊 八字数据:', {
                      '八字': baziData.八字,
                      '生肖': baziData.生肖,
                      '日主': baziData.日主,
                      '阳历': baziData.阳历
                    });
                  } else {
                    console.log('⚠️ MCP返回数据中没有找到八字相关信息');
                    baziData = null;
                  }
                } else if (baziResult.content) {
                  // 如果content字段存在，尝试解析为JSON
                  try {
                    baziData = JSON.parse(baziResult.content);
                    console.log('✅ 从content字段解析成功');
                    console.log('🔍 解析后的baziData:', baziData);
                  } catch (contentError) {
                    console.log('⚠️ content字段JSON解析失败:', contentError);
                    baziData = null;
                  }
                } else {
                  console.log('⚠️ MCP返回数据格式异常，尝试直接使用data字段:', baziResult);
                  // 备用逻辑：如果检查失败，直接尝试使用data字段
                  if (baziResult.data && typeof baziResult.data === 'object') {
                    baziData = baziResult.data;
                    analysisType = 'bazi-enhanced';
                    console.log('✅ 使用备用逻辑成功设置八字数据');
                    console.log('📊 备用八字数据:', {
                      '八字': baziData.八字,
                      '生肖': baziData.生肖,
                      '日主': baziData.日主,
                      '阳历': baziData.阳历
                    });
                  } else {
                    baziData = null;
                  }
                }
                
                console.log('🔍 最终baziData值:', baziData);
                console.log('🔍 baziData类型:', typeof baziData);
                console.log('🔍 baziData是否为null:', baziData === null);
              } catch (parseError) {
                console.log('⚠️ 八字数据解析失败:', parseError);
                baziData = null;
              }
            } else {
              console.log('⚠️ 八字MCP计算失败:', baziResult.message);
            }
          } catch (serviceError) {
            console.log('❌ MCP服务调用异常:', serviceError);
          }
        } else {
          console.log('⚠️ 未找到有效的生辰数据');
        }
      } catch (error: any) {
        console.warn('⚠️ 聊天模式八字MCP调用失败:', error);
      }
    } else {
      console.log('⚠️ 非八字分析请求，使用通用分析');
      analysisType = 'general';
    }
    
    const modelConfig = {
      apiKey: process.env.MODELSCOPE_API_KEY || 'ms-bf1291c1-c1ed-464c-b8d8-162fdee96180',
      modelId: process.env.MODELSCOPE_MODEL || 'Qwen/Qwen3-235B-A22B-Instruct-2507',
      baseUrl: process.env.MODELSCOPE_BASE_URL || 'https://api-inference.modelscope.cn/v1'
    };
    
    console.log('🔧 模型配置:', {
      '环境变量 MODELSCOPE_MODEL': process.env.MODELSCOPE_MODEL,
      '实际使用的模型': modelConfig.modelId,
      'API Key前缀': modelConfig.apiKey.substring(0, 10) + '...',
      '基础URL': modelConfig.baseUrl
    });

    const realModelService = new RealModelScopeOnlineService(modelConfig);

    let enhancedQuestion = requestData.question;
    let systemPrompt = '占卜师: 您好！我是八字命理AI占卜师。请输入您的问题，我会为您提供专业的占卜分析和建议。';
    
    if (!birthData && requestData.type === 'bazi') {
      // 用户请求八字分析但未提供出生信息 - 明确要求用户提供
      enhancedQuestion = requestData.question;
      systemPrompt = '占卜师: 您好！我是八字命理AI占卜师。要进行准确的八字分析，请先提供您的出生日期（如：1990.05.15 或 1990年5月15日），然后再告诉我您想了解什么问题。';
    } else if (baziData) {
      // 构建精简但完整的八字分析数据给AI
      const completeBaziInfo = `
=== 八字专业分析数据 ===
八字：${baziData.八字 || '未知'}
日主：${baziData.日主 || '未知'}（${baziData.日柱?.天干?.五行 || '未知'}）
生肖：${baziData.生肖 || '未知'}
阳历：${baziData.阳历 || '未知'}
农历：${baziData.农历 || '未知'}
纳音：${baziData.年柱?.纳音 || '未知'}

=== 核心柱信息 ===
年柱：${baziData.年柱?.天干?.天干}${baziData.年柱?.地支?.地支}（${baziData.年柱?.天干?.五行}）${baziData.年柱?.天干?.十神}
月柱：${baziData.月柱?.天干?.天干}${baziData.月柱?.地支?.地支}（${baziData.月柱?.天干?.五行}）${baziData.月柱?.天干?.十神}
日柱：${baziData.日柱?.天干?.天干}${baziData.日柱?.地支?.地支}（${baziData.日柱?.天干?.五行}）${baziData.日柱?.天干?.十神}
时柱：${baziData.时柱?.天干?.天干}${baziData.时柱?.地支?.地支}（${baziData.时柱?.天干?.五行}）${baziData.时柱?.天干?.十神}

=== 重要大运（当前及未来） ===
${baziData.大运?.大运?.slice(0, 3).map((d: any) => 
  `${d.干支}（${d.开始年龄}-${d.结束年龄}岁）：${d.天干十神}`
).join('\n') || '暂无大运信息'}

=== 刑冲合会要点 ===
${Object.entries(baziData.刑冲合会 || {}).map(([key, value]: [string, any]) => {
  const issues = [];
  if (value?.地支?.冲) issues.push(`${key}柱冲`);
  if (value?.地支?.刑) issues.push(`${key}柱刑`);
  if (value?.地支?.半合) issues.push(`${key}柱半合`);
  if (value?.伏吟) issues.push(`${key}柱伏吟`);
  return issues.length > 0 ? `${key}柱：${issues.join('、')}` : '';
}).filter(Boolean).join('\n') || '暂无刑冲合会信息'}

=== 神煞要点 ===
${Object.entries(baziData.神煞 || {}).map(([key, value]: [string, any]) => 
  `${key}：${Array.isArray(value) ? value.slice(0, 3).join('、') : value}`
).join('\n') || '暂无神煞信息'}

=== 命宫身宫 ===
胎元：${baziData.胎元 || '未知'} | 胎息：${baziData.胎息 || '未知'}
命宫：${baziData.命宫 || '未知'} | 身宫：${baziData.身宫 || '未知'}
`;

      // 修改策略：平衡简化与完整性，让AI自然发挥但提供足够信息
      enhancedQuestion = `${requestData.question}\n\n八字：${baziData.八字 || '未知'}\n日主：${baziData.日主 || '未知'}\n生肖：${baziData.生肖 || '未知'}\n农历：${baziData.农历 || '未知'}\n阳历：${baziData.阳历 || '未知'}\n\n请基于以上八字信息，给出自然流畅的命理分析。`;
      systemPrompt = '占卜师: 您好！我是八字命理AI占卜师。请基于八字数据给出自然流畅的命理分析。';
    } else if (requestData.type === 'bazi') {
      // 智能判断：确实没有出生信息时的处理
      const hasAnyBirthInfo = extractBirthDataFromQuestion(requestData.question);
      if (!hasAnyBirthInfo && !birthData) {
        // 明确没有出生信息时，要求用户提供
        enhancedQuestion = requestData.question;
        systemPrompt = '占卜师: 您好！我是八字命理AI占卜师。\n\n要进行准确的八字分析，需要您的出生信息。请提供：\n1. 出生日期（如：1996年2月10日 或 1996.02.10）\n2. 出生时间（如：上午10点 或 下午2点，如不知道可默认子时）\n3. 性别（男/女）\n\n提供这些信息后，我会为您进行专业的命理分析。';
      } else {
        // 有部分信息或不确定时，提供通用建议
        enhancedQuestion = `${requestData.question}\n\n注意：您请求的是八字分析，但可能未提供完整的出生信息。我将为您提供一般性的占卜分析，建议您提供完整的出生日期、时间以获得更精准的八字分析。`;
        systemPrompt = '占卜师: 您好！我是八字命理AI占卜师。您请求的是八字分析，但可能未提供完整出生信息。我将为您提供一般性的占卜分析，建议您提供完整出生信息以获得更精准的八字分析。';
      }
    }
    
    console.log('🔍 调试信息:', {
      enhancedQuestion,
      context: requestData.context?.substring(0, 200) + '...',
      type: requestData.type,
      systemPrompt,
      baziData: !!baziData
    });

    // 限制上下文长度，避免超长请求
    const limitedContext = requestData.context ? 
      requestData.context.substring(0, 2000) : '';
    
    const result = await realModelService.generateFortune(
      enhancedQuestion,
      limitedContext,
      requestData.type,
      systemPrompt
    );

    const endTime = Date.now();
    
    console.log('🎯 AI分析结果详情:', {
      'success': result.success,
      'prediction长度': result.prediction?.length || 0,
      'prediction预览': result.prediction?.substring(0, 100) + '...',
      'source': result.source,
      'confidence': result.confidence,
      'processingTime': `${endTime - startTime}ms`
    });
    
    console.log('✅ 八字MCP + ModelScope AI聊天分析完成:', {
      success: result.success,
      source: result.source,
      hasBaziData: !!baziData,
      processingTime: `${endTime - startTime}ms`
    });

    const responseData = {
      success: true,
      response: result.prediction,
      source: result.source,
      hasBaziData: !!(baziData && (
        baziData.八字 || 
        baziData['八字'] || 
        baziData.生肖 || 
        baziData.日主 ||
        baziData.阳历 ||
        baziData.农历 ||
        (baziData.data && (baziData.data.八字 || baziData.data.生肖 || baziData.data.日主)) ||
        (typeof baziData === 'object' && Object.keys(baziData).length > 0) // 只要baziData是包含内容的对象就为true
      )), // 只要包含八字相关信息就为true
      timestamp: new Date().toISOString()
    };
    
    console.log('📤 返回给前端的响应数据:', {
      'response长度': responseData.response?.length || 0,
      'response预览': responseData.response?.substring(0, 100) + '...'
    });

    res.json(responseData);

  } catch (error: any) {
    console.error('❌ 八字MCP + ModelScope AI聊天失败:', error);
    res.status(500).json({
      success: false,
      error: error.message || '聊天服务暂时不可用，请稍后再试',
      timestamp: new Date().toISOString()
    });
  }
});

// 状态接口
router.get('/status', (req: Request, res: Response) => {
  const config = mcpService.getMcpConfig();
  
  res.json({
    success: true,
    status: 'active',
    services: {
      baziAnalysis: {
        enabled: true,
        service: '@cantian-ai/Bazi-MCP (ms-agent风格)',
        endpoint: 'https://mcp.api-inference.modelscope.net/6a57768488dc47/mcp',
        protocol: 'ModelContextProtocol'
      },
      modelScope: {
        enabled: true,
        model: 'ZhipuAI/GLM-4.6'
      }
    },
    capabilities: [
      '八字命理分析',
      'MCP协议集成',
      '实时聊天',
      '生辰数据提取'
    ],
    timestamp: new Date().toISOString()
  });
});

// 获取算命类型
router.get('/types', (req: Request, res: Response) => {
  res.json({
    success: true,
    types: [
      {
        id: 'bazi',
        name: '八字命理',
        description: '基于传统八字命理学，分析您的命运走向和人生运势',
        icon: '🔮',
        color: 'purple'
      },
      {
        id: 'tarot',
        name: '塔罗占卜',
        description: '使用神秘塔罗牌，揭示您当前的状况和未来指引',
        icon: '📜',
        color: 'gold'
      },
      {
        id: 'zodiac',
        name: '星座运势',
        description: '根据您的星座，分析今日、本周、本月运势变化',
        icon: '⭐',
        color: 'blue'
      },
      {
        id: 'numerology',
        name: '数字命理',
        description: '通过数字能量，解读您的性格特点和命运密码',
        icon: '🔢',
        color: 'green'
      }
    ],
    timestamp: new Date().toISOString()
  });
});

// 健康检查
router.get('/health', (req: Request, res: Response) => {
  res.json({
    healthy: true,
    service: 'AI算命服务 (MCP + ModelScope)',
    version: '2.0.0',
    features: ['八字MCP', 'ModelScope AI', '实时分析'],
    timestamp: new Date().toISOString()
  });
});

// 工具函数
function extractBirthDataFromContext(context: string): any {
  if (!context) return null;
  
  console.log('🔍 智能解析上下文，查找真实用户出生数据...');
  
  // 智能策略：优先从最新的用户消息中提取，排除AI格式说明中的示例
  const lines = context.split('\n');
  
  // 方法1：从明确标记的"用户:"消息中提取
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    
    // 只处理明确标记的用户消息行
    if (line.startsWith('用户:') && !line.includes('占卜师:')) {
      const match = line.match(/用户:\s*(.+)/);
      if (match) {
        const question = match[1].trim();
        
        // 排除明显的非真实出生信息
        const excludePatterns = [
          '出生日期（格式', '格式：', '格式:', '示例', '例子',
          '1990.05.15', '1990年5月15日', '提供您的', '先提供'
        ];
        
        const isExcluded = excludePatterns.some(pattern => 
          line.includes(pattern) || question.includes(pattern)
        );
        
        if (!isExcluded && question.length < 50) { // 真实生辰信息通常较短
          const birthData = extractBirthDataFromQuestion(question);
          if (birthData) {
            console.log('✅ 从用户消息智能提取出生数据:', birthData);
            return birthData;
          }
        }
      }
    }
  }
  
  // 方法2：从AI回复中提取（当用户明确回复了出生信息时）
  const aiMessages = context.split('\n').filter(line => 
    line.startsWith('占卜师:') && (
      line.includes('确认出生日期') || 
      line.includes('已确认') || 
      line.includes('好的，') ||
      line.includes('明白了，')
    )
  );
  
  for (const message of aiMessages) {
    // 尝试从AI确认消息中提取后续的真实出生数据
    const nextLines = lines.slice(lines.indexOf(message) + 1);
    for (const nextLine of nextLines) {
      if (nextLine.trim().startsWith('用户:')) {
        const birthData = extractBirthDataFromQuestion(nextLine.replace(/^用户:\s*/, ''));
        if (birthData) {
          console.log('✅ 从AI确认对话中智能提取出生数据:', birthData);
          return birthData;
        }
      }
    }
  }
  
  console.log('⚠️ 上下文智能解析未找到有效用户出生数据');
  return null;
}

function extractBirthDataFromQuestion(question: string): any {
  if (!question) return null;
  
  console.log('🔍 开始从问题中提取出生日期:', question);
  
  // 过滤掉明显不是出生信息的输入 - 修复过于严格的过滤
  const invalidInputs = ['', ' ', '测试', '随便', '随便看看', '算命', '占卜', '你好', '您好', 'hi', 'hello'];
  const trimmedQuestion = question.trim();
  if (invalidInputs.includes(trimmedQuestion)) {
    console.log('⚠️ 输入内容不是有效的出生信息:', trimmedQuestion);
    return null;
  }
  
  const patterns = [
    // 标准格式：1996.02.10 或 1996-02-10 或 1996/02/10
    /(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,
    // 中文格式：1996年2月10日
    /(\d{4})年(\d{1,2})月(\d{1,2})日/g,
    // 紧凑格式：19960210 (8位数字)
    /(\d{4})(\d{2})(\d{2})/g,
    // 出生于格式
    /出生于.*?(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,
    // 其他可能的格式
    /(\d{4})年(\d{1,2})月(\d{1,2})/g,
    /(\d{4})年(\d{1,2})月(\d{1,2})时/g,
    /(\d{4})年(\d{1,2})月(\d{1,2})分/g,
  ];
  
  for (const pattern of patterns) {
    const match = pattern.exec(question);
    if (match) {
      let year, month, day;
      
      if (pattern.source.includes('出生于')) {
        // 出生于格式的处理
        year = parseInt(match[1]);
        month = parseInt(match[2]);
        day = parseInt(match[3]);
      } else if (pattern.source.includes('(\d{4})(\d{2})(\d{2})')) {
        // 紧凑格式的处理：19960210
        year = parseInt(match[1]);
        month = parseInt(match[2]);
        day = parseInt(match[3]);
      } else {
        // 标准格式的处理
        year = parseInt(match[1]);
        month = parseInt(match[2]);
        day = parseInt(match[3]);
      }
      
      // 验证日期的合理性
      if (year >= 1900 && year <= 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        console.log('✅ 成功提取出生日期:', { year, month, day });
        return {
          year,
          month,
          day,
          hour: 0,
          minute: 0,
          gender: 'male',
          timezone: 'Asia/Shanghai'
        };
      }
    }
  }
  
  console.log('⚠️ 未从问题中找到有效的出生日期');
  return null;
}

export default router;