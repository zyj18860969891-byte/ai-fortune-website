console.log('🚀 完整AI算命服务器启动中...');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// 确保在导入其他模块之前加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 全局出生日期缓存，用于跨请求保存出生信息
const birthDataCache = new Map();

// 中间件配置
app.use(helmet()); // 安全头
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(morgan('combined')); // 请求日志
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 从上下文中提取用户消息中的出生日期
function extractUserMessagesFromContext(context) {
  if (!context) return [];
  
  const userMessages = context.split('\n').filter(line => 
    line.startsWith('用户:') && !line.includes('占卜师:')
  );
  
  return userMessages;
}

function extractBirthDataFromQuestion(question) {
  if (!question) return null;
  
  const patterns = [
    // 标准格式：1996.02.10 或 1996-02-10 或 1996/02/10
    /(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,
    // 中文格式：1996年2月10日
    /(\d{4})年(\d{1,2})月(\d{1,2})日/g,
    // 紧凑格式：19960210 (8位数字)
    /(\d{4})(\d{2})(\d{2})/g,
    // 出生于格式
    /出生于.*?(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,
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
  
  return null;
}

// 从上下文提取并缓存出生日期的函数
function extractAndCacheBirthData(context, sessionId) {
  if (!context) return null;
  
  console.log('🔍 开始从上下文提取出生数据，context长度:', context.length);
  
  // 从上下文中提取用户提供的出生日期（不提取占卜师的回复）
  const userMessages = extractUserMessagesFromContext(context);
  
  console.log('🔍 提取到的用户消息:', userMessages);
  
  let birthData = null;
  
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
  
  // 如果从用户消息中没有找到，尝试从整个context中搜索
  if (!birthData) {
    console.log('🔍 从用户消息中未找到出生数据，尝试从整个context搜索');
    const extractedData = extractBirthDataFromQuestion(context);
    if (extractedData) {
      birthData = extractedData;
      console.log('✅ 从整个context成功提取出生数据:', birthData);
    }
  }
  
  // 如果找到出生数据，缓存它
  if (birthData && sessionId) {
    birthDataCache.set(sessionId, birthData);
    console.log('🔧 缓存出生数据:', { sessionId, birthData });
  }
  
  return birthData;
}

// ModelScope AI服务
class ModelScopeAIService {
  constructor() {
    this.config = {
      apiKey: process.env.MODELSCOPE_API_KEY || 'ms-bf1291c1-c1ed-464c-b8d8-162fdee96180',
      modelId: process.env.MODELSCOPE_MODEL || 'ZhipuAI/GLM-4.6',
      baseUrl: process.env.MODELSCOPE_BASE_URL || 'https://api-inference.modelscope.cn/v1'
    };
  }

  async callAIAPI(question, systemPrompt) {
    const fetch = require('node-fetch');
    
    const messages = [
      {
        role: 'system',
        content: systemPrompt || '您是一位专业的占卜师，精通八字命理、塔罗、星座等传统占卜术。请为用户提供专业、深入的占卜分析。'
      },
      {
        role: 'user',
        content: question
      }
    ];

    const requestBody = {
      model: this.config.modelId,
      messages: messages,
      max_tokens: 2000,
      temperature: 0.7,
      top_p: 0.9
    };

    console.log('🔧 AI服务配置:', {
      '模型': this.config.modelId,
      'API Key前缀': this.config.apiKey.substring(0, 10) + '...',
      '基础URL': this.config.baseUrl
    });

    try {
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content;
      } else {
        throw new Error('AI响应格式异常');
      }
    } catch (error) {
      console.error('❌ AI API调用失败:', error);
      throw error;
    }
  }
}

// 八字MCP服务
class BaziMCPService {
  async calculateBazi(birthData) {
    const fetch = require('node-fetch');
    
    try {
      console.log('🔮 调用八字MCP服务...', birthData);
      
      const requestBody = {
        jsonrpc: '2.0',
        id: uuidv4(),
        method: 'tools/call',
        params: {
          name: 'calculate_bazi',
          arguments: {
            birth_data: birthData
          }
        }
      };

      const response = await fetch('https://mcp.api-inference.modelscope.net/6a57768488dc47/mcp', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MODELSCOPE_API_KEY || 'ms-bf1291c1-c1ed-464c-b8d8-162fdee96180'}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`MCP服务请求失败: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data.result
      };
    } catch (error) {
      console.error('❌ 八字MCP服务失败:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }
}

const modelScopeAI = new ModelScopeAIService();
const baziMCP = new BaziMCPService();

// 聊天接口
app.post('/api/fortune/chat', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const requestData = req.body;
    
    if (!requestData.question || !requestData.type) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数：question 和 type',
        timestamp: new Date().toISOString()
      });
    }

    console.log('💬 收到算命聊天请求:', { 
      question: requestData.question, 
      type: requestData.type,
      context: requestData.context,
      sessionId: requestData.sessionId
    });

    let baziData = null;
    let birthData = requestData.birthInfo;
    let systemPrompt = '您是一位专业的占卜师，精通八字命理、塔罗、星座等传统占卜术。请为用户提供专业、深入的占卜分析。';
    
    // 八字分析
    if (requestData.type === 'bazi') {
      console.log('🔮 处理八字命理分析...');
      
      // 尝试从请求体中提取出生数据
      if (!birthData) {
        birthData = extractBirthDataFromQuestion(requestData.question || '');
      }
      
      // 尝试从上下文提取出生日期并缓存
      if (!birthData && requestData.context) {
        const contextBirthData = extractAndCacheBirthData(requestData.context, requestData.sessionId);
        if (contextBirthData) {
          birthData = contextBirthData;
        }
      }
      
      // 如果当前请求没有出生数据，尝试从缓存获取
      if (!birthData && requestData.sessionId) {
        const cachedBirthData = birthDataCache.get(requestData.sessionId);
        if (cachedBirthData) {
          birthData = cachedBirthData;
          console.log('🔧 从缓存获取出生数据:', { sessionId: requestData.sessionId });
        }
      }
      
      // 如果找到了出生数据，调用八字MCP服务
      if (birthData) {
        try {
          const baziResult = await baziMCP.calculateBazi(birthData);
          
          if (baziResult.success) {
            try {
              const mcpContent = baziResult.data?.content?.[0]?.text;
              if (mcpContent) {
                baziData = JSON.parse(mcpContent);
                console.log('✅ 八字MCP计算成功:', {
                  '八字': baziData.八字,
                  '生肖': baziData.生肖,
                  '日主': baziData.日主
                });
              } else {
                console.log('⚠️ MCP返回数据格式异常');
              }
            } catch (parseError) {
              console.log('⚠️ 八字数据JSON解析失败:', parseError);
              baziData = baziResult.data;
            }
          } else {
            console.log('⚠️ 八字MCP计算失败:', baziResult.message);
          }
        } catch (error) {
          console.warn('⚠️ 八字MCP调用失败:', error);
        }
      }
      
      if (!birthData) {
        systemPrompt = '您是八字命理AI占卜师。要进行准确的八字分析，需要用户先提供出生日期（如：1990.05.15）。请友善地提示用户提供出生信息。';
      } else if (baziData) {
        systemPrompt = '您是八字命理AI占卜师。请基于以下八字信息给出专业的命理分析，请保持自然流畅的表达。';
      }
    }
    
    // 构建完整的问题
    let enhancedQuestion = requestData.question;
    
    if (baziData) {
      enhancedQuestion = `${requestData.question}\n\n八字信息：
八字：${baziData.八字 || '未知'}
日主：${baziData.日主 || '未知'}
生肖：${baziData.生肖 || '未知'}
农历：${baziData.农历 || '未知'}
阳历：${baziData.阳历 || '未知'}\n请基于以上八字信息给出专业的命理分析。`;
    } else if (requestData.type === 'bazi' && !birthData) {
      enhancedQuestion = `${requestData.question}\n\n注意：您请求八字分析，但未提供出生信息。我将为您提供一般性的占卜建议，建议您提供出生信息以获得更精准的八字分析。`;
    }

    console.log('🔍 调用AI服务...', { 
      enhancedQuestion: enhancedQuestion.substring(0, 100) + '...',
      systemPrompt: systemPrompt.substring(0, 100) + '...'
    });

    const aiResponse = await modelScopeAI.callAIAPI(enhancedQuestion, systemPrompt);

    const endTime = Date.now();
    
    console.log('✅ AI算命分析完成:', {
      success: true,
      source: 'ModelScope AI',
      hasBaziData: !!baziData,
      processingTime: `${endTime - startTime}ms`
    });

    res.json({
      success: true,
      response: aiResponse,
      source: 'ModelScope AI',
      hasBaziData: !!baziData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ 算命服务失败:', error);
    res.status(500).json({
      success: false,
      error: error.message || '算命服务暂时不可用，请稍后再试',
      timestamp: new Date().toISOString()
    });
  }
});

// 获取算命类型
app.get('/api/fortune/types', (req, res) => {
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
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'ai-fortune-complete-backend',
    features: ['八字MCP', 'ModelScope AI', '实时分析']
  });
});

app.get('/api/fortune/health', (req, res) => {
  res.json({
    healthy: true,
    service: 'AI算命服务 (完整版)',
    version: '3.0.0',
    features: ['八字MCP', 'ModelScope AI', '实时分析', '缓存机制'],
    timestamp: new Date().toISOString()
  });
});

// 状态接口
app.get('/api/fortune/status', (req, res) => {
  res.json({
    success: true,
    status: 'active',
    services: {
      baziAnalysis: {
        enabled: true,
        service: '八字MCP服务',
        endpoint: 'https://mcp.api-inference.modelscope.net/6a57768488dc47/mcp'
      },
      modelScope: {
        enabled: true,
        model: 'ZhipuAI/GLM-4.6'
      }
    },
    capabilities: [
      '八字命理分析',
      '实时聊天',
      '生辰数据提取',
      'AI智能分析'
    ],
    timestamp: new Date().toISOString()
  });
});

// 错误处理中间件
app.use((error, req, res, next) => {
  console.error('服务器错误:', error);
  res.status(500).json({
    error: '内部服务器错误',
    message: process.env.NODE_ENV === 'development' ? error.message : '请稍后再试'
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    error: '接口不存在',
    path: req.originalUrl
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log('✅ 完整AI算命服务器启动成功！');
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`🔍 健康检查: http://localhost:${PORT}/health`);
  console.log(`🎯 算命接口: http://localhost:${PORT}/api/fortune/chat`);
  console.log(`💬 状态接口: http://localhost:${PORT}/api/fortune/status`);
  console.log(`🔧 算命类型: http://localhost:${PORT}/api/fortune/types`);
  console.log(`🌐 使用ModelScope AI: ${process.env.MODELSCOPE_MODEL || 'ZhipuAI/GLM-4.6'}`);
  console.log(`🕐 启动时间: ${new Date().toISOString()}`);
});