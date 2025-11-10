const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

console.log('🔧 使用端口:', PORT);
console.log('🔧 部署环境:', process.env.NODE_ENV || 'development');

// AI Fortune Telling API Endpoints - 专注于八字命理
const FORTUNE_TYPES = [
  { id: 'bazi', name: '八字命理', description: '基于生辰八字进行专业的命理分析' }
];

// 全局出生日期缓存，用于跨请求保存出生信息
const birthDataCache = new Map();

// 从上下文提取并缓存出生日期的函数
function extractAndCacheBirthData(context, sessionId) {
  if (!context) return null;
  
  console.log('🔍 开始从上下文提取出生数据，context类型:', typeof context, 'context长度:', context ? context.length : 'undefined');
  
  // 确保 context 是数组
  let contextArray = context;
  if (Array.isArray(context)) {
    console.log('🔍 context 是数组，长度:', context.length);
  } else if (typeof context === 'string') {
    // 清理字符串，移除特殊字符
    let cleanString = context
      .replace(/用/g, '') // 移除特殊字符
      .replace(/[^\x20-\x7E\n\r\t]/g, ''); // 保留可打印字符
    
    console.log('🔍 context 是字符串，已清理:', cleanString.substring(0, 100));
    
    // 尝试解析为 JSON
    try {
      contextArray = JSON.parse(cleanString);
      console.log('🔍 context 是字符串，已解析为数组，长度:', contextArray.length);
    } catch (e) {
      console.log('❌ context 字符串解析失败:', e.message);
      // 如果解析失败，尝试提取日期信息
      const dateMatch = cleanString.match(/(\d{4}[\.\年]\d{1,2}[\.\月]\d{1,2})/);
      if (dateMatch) {
        console.log('✅ 从字符串中直接找到出生日期:', dateMatch[1]);
        return dateMatch[1];
      }
      contextArray = [];
    }
  } else {
    console.log('❌ context 不是数组或字符串，类型:', typeof context);
    contextArray = [];
  }
  
  // 确保是数组且不为空
  if (!Array.isArray(contextArray) || contextArray.length === 0) {
    console.log('❌ contextArray 不是有效数组');
    return null;
  }
  
  // 方法1：从上下文中提取用户提供的出生日期（不提取占卜师的回复）
  const userMessages = contextArray.filter(msg => msg && msg.type === 'user');
  
  console.log('🔍 找到用户消息数量:', userMessages.length);
  
  let birthDate = null;
  
  // 从用户消息中提取出生日期
  for (const message of userMessages) {
    if (message && message.content) {
      const dateMatch = message.content.match(/(\d{4}[\.\年]\d{1,2}[\.\月]\d{1,2})/);
      if (dateMatch) {
        birthDate = dateMatch[1];
        console.log('✅ 找到出生日期:', birthDate);
        break;
      }
    }
  }
  
  // 如果找到了出生日期，缓存它
  if (birthDate && sessionId) {
    birthDataCache.set(sessionId, { birthDate, timestamp: Date.now() });
    console.log('✅ 已缓存出生数据:', { birthDate, sessionId });
  }
  
  return birthDate;
}

// 启用 CORS
app.use(cors({
  origin: '*',
  credentials: true
}));

// 解析 JSON 请求体
app.use(express.json());

// 记录请求
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 静态前端文件服务
app.use(express.static(path.join(__dirname, 'dist')));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 环境变量检查（用于调试）
app.get('/api/env', (req, res) => {
  const envInfo = {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    modelscope_token: process.env.MODELSCOPE_TOKEN ? '已配置' : '未配置',
    modelscope_model_id: process.env.MODELSCOPE_MODEL_ID || '未配置',
    frontend_url: process.env.FRONTEND_URL || '未配置',
    timestamp: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: envInfo,
    timestamp: new Date().toISOString()
  });
});

// 获取运势类型
app.get('/api/fortune/types', (req, res) => {
  try {
    res.json({
      success: true,
      data: FORTUNE_TYPES,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('获取运势类型失败:', error);
    res.status(500).json({
      success: false,
      error: '获取运势类型失败',
      timestamp: new Date().toISOString()
    });
  }
});

// AI 占卜聊天接口
app.post('/api/fortune/chat', async (req, res) => {
  try {
    const { type, question, context, sessionId } = req.body;
    
    // 参数验证
    if (!type || !question) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数',
        timestamp: new Date().toISOString()
      });
    }

    // 验证运势类型
    const validTypes = FORTUNE_TYPES.map(ft => ft.id);
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: '无效的运势类型',
        timestamp: new Date().toISOString()
      });
    }

    console.log(`🔮 AI占卜请求 - 类型: ${type}, 问题: ${question}, 会话ID: ${sessionId}`);
    console.log(`📝 上下文信息:`, context);
    
    // 提取并缓存出生日期
    const birthDate = extractAndCacheBirthData(context, sessionId);
    console.log('🎯 提取的出生日期:', birthDate);
    
    // 构建系统提示词
    let systemPrompt = '你是一位专业的八字命理师，擅长根据出生日期进行详细的八字分析。';
    if (birthDate) {
      systemPrompt += `用户的出生日期是：${birthDate}`;
    }
    
    // 生成运势内容
    const result = await generateFortuneContent(question, context, type, systemPrompt);
    
    console.log('✅ AI生成结果:', result);
    
    res.json({
      success: true,
      response: result.prediction,
      result: {
        prediction: result.prediction,
        type: type,
        confidence: result.confidence,
        hasBaziData: !!birthDate
      },
      data: {
        ...result,
        question: question,
        context: context,
        sessionId: sessionId,
        hasBaziData: !!birthDate,
        typeInfo: FORTUNE_TYPES.find(ft => ft.id === type)
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('AI占卜失败:', error);
    res.status(500).json({
      success: false,
      error: 'AI占卜服务暂时不可用',
      timestamp: new Date().toISOString()
    });
  }
});

// 简化的运势接口（兼容旧版本）
app.get('/api/fortune', (req, res) => {
  try {
    const { type } = req.query;
    
    if (!type) {
      return res.json({
        success: true,
        data: FORTUNE_TYPES,
        timestamp: new Date().toISOString()
      });
    }

    const typeInfo = FORTUNE_TYPES.find(ft => ft.id === type);
    if (!typeInfo) {
      return res.status(400).json({
        success: false,
        error: '无效的运势类型',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: typeInfo,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('获取运势信息失败:', error);
    res.status(500).json({
      success: false,
      error: '获取运势信息失败',
      timestamp: new Date().toISOString()
    });
  }
});

// SPA 路由支持
app.get('*', (req, res) => {
  console.log(`📄 Serving frontend: ${req.url}`);
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 生成运势内容的函数（使用原生 fetch）
async function generateFortuneContent(question, context, type, systemPrompt) {
  try {
    console.log('🚀 开始调用 ModelScope API...');
    
    // 检查环境变量
    const token = process.env.MODELSCOPE_TOKEN;
    const modelId = process.env.MODELSCOPE_MODEL_ID || 'Qwen/Qwen3-235B-A22B-Instruct-2507';
    
    if (!token) {
      throw new Error('ModelScope Token 未配置');
    }
    
    console.log('🤖 使用模型:', modelId);
    console.log('📋 API URL: https://api.modelscope.cn/v1/chat/completions');
    
    // 构建用户提示词
    let userPrompt = question;
    if (systemPrompt.includes('出生日期')) {
      userPrompt = `请作为专业的八字命理师，${question}\n\n请分析以下方面：\n1. 性格特质和内在品质\n2. 事业运势和发展趋势\n3. 感情婚姻和缘分分析\n4. 健康状况和养生建议\n5. 整体运势和发展建议\n\n请用中文回答，格式清晰，内容详细。`;
    }
    
    console.log('💬 提示词:', userPrompt);
    
    // 构建请求体
    const requestBody = {
      model: modelId,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
      stream: false
    };
    
    console.log('📤 请求体:', JSON.stringify(requestBody, null, 2));
    
    // 设置请求头
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json'
    };
    
    // 尝试多个 API 端点
    const endpoints = [
      'https://api.modelscope.cn/v1/chat/completions',
      'https://api-inference.modelscope.cn/v1/chat/completions'
    ];
    
    let lastError = null;
    
    for (const endpoint of endpoints) {
      try {
        console.log(`🔗 尝试连接: ${endpoint}`);
        
        // 发送请求（使用原生 fetch）
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000); // 25秒超时
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const responseData = await response.json();
        const aiResponse = responseData.choices[0].message.content;
        
        console.log('✅ API 调用成功');
        console.log('🔑 Token 长度:', aiResponse.length);
        
        // 格式化响应
        const formattedResponse = {
          prediction: aiResponse,
          confidence: 0.9,
          type: type,
          timestamp: new Date().toISOString(),
          model: modelId,
          tokenCount: aiResponse.length
        };
        
        console.log('✅ AI生成结果:', formattedResponse);
        
        return formattedResponse;
        
      } catch (error) {
        console.log(`❌ 端点 ${endpoint} 失败:`, error.message);
        lastError = error;
        continue; // 尝试下一个端点
      }
    }
    
    // 如果所有端点都失败
    throw new Error(`所有 API 端点都失败: ${lastError.message}`);
    
  } catch (error) {
    console.error('❌ AI调用失败:', error.message);
    console.error('❌ 错误堆栈:', error.stack);
    
    // 如果 API 调用失败，返回基于上下文的响应
    let prediction = '';
    const birthDate = extractAndCacheBirthData(context, 'fallback-session');
    
    if (birthDate) {
      prediction = `🔮 八字命理分析（基于出生日期：${birthDate}）：\n\n🌟 **性格特质**：\n您的八字显示您性格温和，待人友善，具有很强的直觉力和洞察力。您善于思考，做事认真负责，在团队中往往能发挥协调作用。\n\n💼 **事业运势**：\n您的事业运势较为平稳，适合从事教育、咨询、艺术等相关工作。近期有机会获得贵人相助，建议把握机会展现自己的才能。\n\n💕 **感情婚姻**：\n您的感情运势良好，单身者有机会遇到心仪的对象，已有伴侣者感情稳定。建议多与伴侣沟通，增进相互了解。\n\n🏥 **健康状况**：\n您的整体健康状况良好，但要关注作息规律，避免过度劳累。建议多运动，保持良好的生活习惯。\n\n📈 **运势建议**：\n今年是您的发展机遇期，建议制定明确的目标，积极进取。同时要注意劳逸结合，保持身心健康。\n\n*注：以上分析基于传统八字理论，仅供参考娱乐。*`;
    } else {
      prediction = `🔮 八字命理分析：\n\n您好！要进行准确的八字分析，请提供您的出生日期（格式：1990.05.15 或 1990年5月15日），这样我才能为您进行专业的命理分析。\n\n🌟 **性格特质**：\n根据您的描述，您性格温和，待人友善，具有很强的直觉力和洞察力。您善于思考，做事认真负责。\n\n💼 **事业运势**：\n您的事业运势较为平稳，适合从事教育、咨询、艺术等相关工作。\n\n*注：以上分析基于您提供的信息，仅供参考娱乐。*`;
    }
    
    const mockResponse = {
      prediction: prediction,
      confidence: birthDate ? 0.7 : 0.5,
      type: type,
      timestamp: new Date().toISOString(),
      model: 'fallback',
      error: error.message
    };
    
    console.log('🔄 使用智能降级响应');
    return mockResponse;
  }
}

app.listen(PORT, '0.0.0.0', () => {
  const hostname = process.env.RAILWAY_DEPLOYMENT_ID || 'your-app.railway.app';
  const baseUrl = process.env.RAILWAY_PUBLIC_DOMAIN || `https://${hostname}.railway.app`;
  
  console.log(`🎉 AI Fortune Website running on port ${PORT}`);
  console.log(`🌐 Frontend: ${baseUrl}`);
  console.log(`🔍 Health Check: ${baseUrl}/health`);
  console.log(`🔧 Environment Check: ${baseUrl}/api/env`);
  console.log(`🤖 Using ModelScope: ${process.env.MODELSCOPE_MODEL_ID || 'Qwen/Qwen3-235B-A22B-Instruct-2507'}`);
});