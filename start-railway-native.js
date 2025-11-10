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
  
  console.log('🔍 开始从上下文提取出生数据，context长度:', context.length);
  
  // 方法1：从上下文中提取用户提供的出生日期（不提取占卜师的回复）
  const userMessages = context.filter(msg => msg.type === 'user');
  
  let birthDate = null;
  
  // 从用户消息中提取出生日期
  for (const message of userMessages) {
    const dateMatch = message.content.match(/(\d{4}[\.\年]\d{1,2}[\.\月]\d{1,2})/);
    if (dateMatch) {
      birthDate = dateMatch[1];
      console.log('✅ 找到出生日期:', birthDate);
      break;
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

// ModelScope API 测试端点
app.get('/api/test-modelscope', async (req, res) => {
  try {
    console.log('🧪 开始测试 ModelScope API...');
    
    const result = await testModelScopeAPI();
    
    res.json({
      success: true,
      testResult: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('ModelScope API 测试失败:', error);
    res.status(500).json({
      success: false,
      error: error.message,
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
    
    // 尝试多个 API 配置 - 按照ModelScope官方文档优先
    const apiConfigs = [
      {
        name: 'ModelScope API-Inference (官方)',
        url: 'https://api-inference.modelscope.cn/v1/chat/completions',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; BaziBot/1.0)'
        }
      },
      {
        name: 'DashScope 文本生成',
        url: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; BaziBot/1.0)'
        }
      },
      {
        name: 'DashScope 兼容模式',
        url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; BaziBot/1.0)'
        }
      },
      {
        name: 'DashScope Chat',
        url: 'https://dashscope.aliyuncs.com/api/v1/chat/completions',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; BaziBot/1.0)'
        }
      }
    ];
    
    // 尝试每个API端点
    for (const config of apiConfigs) {
      try {
        console.log(`🔗 尝试连接: ${config.name} - ${config.url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时
        
        const response = await fetch(config.url, {
          method: 'POST',
          headers: config.headers,
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.log(`❌ ${config.name} 返回错误 ${response.status}: ${errorText}`);
          continue; // 尝试下一个配置
        }
        
        const responseData = await response.json();
        const aiResponse = responseData.choices[0].message.content;
        
        console.log(`✅ ${config.name} 调用成功!`);
        console.log('🔑 Token 长度:', aiResponse.length);
        
        // 格式化响应
        const formattedResponse = {
          prediction: aiResponse,
          confidence: 0.95,
          type: type,
          timestamp: new Date().toISOString(),
          model: modelId,
          tokenCount: aiResponse.length,
          apiSource: config.name
        };
        
        console.log('✅ AI生成结果:', formattedResponse);
        
        return formattedResponse;
        
      } catch (error) {
        console.log(`❌ ${config.name} 失败:`, error.message);
        continue; // 尝试下一个配置
      }
    }
    
    // 如果所有API都失败，抛出错误
    throw new Error('所有 ModelScope API 端点都失败');
    
  } catch (error) {
    console.error('❌ AI调用失败:', error.message);
    console.error('❌ 错误堆栈:', error.stack);
    
    // 使用智能本地生成作为最终降级
    const birthDate = extractAndCacheBirthData(context, 'fallback-session');
    const intelligentResponse = generateIntelligentBaziResponse(question, birthDate);
    
    const fallbackResponse = {
      prediction: intelligentResponse,
      confidence: birthDate ? 0.8 : 0.6,
      type: type,
      timestamp: new Date().toISOString(),
      model: 'intelligent-fallback',
      error: error.message,
      note: '由于网络限制，提供了基于出生日期的智能分析'
    };
    
    console.log('� 使用智能本地生成响应');
    return fallbackResponse;
  }
}

// 智能本地八字分析生成
function generateIntelligentBaziResponse(question, birthDate) {
  if (!birthDate) {
    return `🔮 八字命理分析

您好！要进行准确的八字分析，请提供您的出生日期（格式：1990.05.15 或 1990年5月15日），这样我才能为您进行专业的命理分析。

🌟 **性格特质**：
根据您的描述，您性格温和，待人友善，具有很强的直觉力和洞察力。您善于思考，做事认真负责。

💼 **事业运势**：
您的事业运势较为平稳，适合从事教育、咨询、艺术等相关工作。

*注：以上分析基于您提供的信息，仅供参考娱乐。*`;
  }
  
  // 解析出生日期
  const year = parseInt(birthDate.match(/^(\d{4})/)[1]);
  const month = parseInt(birthDate.match(/[\.\年](\d{1,2})/)[1]);
  const day = parseInt(birthDate.match(/[\.\月](\d{1,2})/)[1]);
  
  // 基于日期的特征分析
  const yearParity = year % 2;
  const monthSeason = month <= 3 ? '春' : month <= 6 ? '夏' : month <= 9 ? '秋' : '冬';
  const dayParity = day % 2;
  
  // 生成个性化分析
  const personalityTraits = [
    '您性格温和，待人友善',
    '具有很强的直觉力和洞察力',
    '您善于思考，做事认真负责',
    '在团队中往往能发挥协调作用',
    '您思维敏捷，学习能力强',
    '具有创新精神和艺术天赋'
  ];
  
  const careerOptions = [
    '教育、咨询、艺术等相关工作',
    '需要沟通和协调的工作',
    '创意和技术类职位',
    '需要专业技能的服务业',
    '管理和组织类工作',
    '需要耐心和细致的工作'
  ];
  
  const fortuneAspects = [
    '今年是您的发展机遇期',
    '近期有机会获得贵人相助',
    '建议制定明确的目标，积极进取',
    '要注意劳逸结合，保持身心健康',
    '适合在秋季（9-11月）做重要决策',
    '年底前有望获得重要机会'
  ];
  
  // 根据问题类型定制回答
  let focusedAnalysis = '';
  if (question.includes('本月') || question.includes('本月运势')) {
    focusedAnalysis = `💫 **本月运势特点**：
根据您的八字分析，本月整体运势平稳向上。特别在${monthSeason}季出生的您，${fortuneAspects[Math.floor(Math.random() * fortuneAspects.length)]}。

🎯 **具体建议**：
- 适合开展新的项目或计划
- 保持积极乐观的心态
- 多与朋友和同事交流合作
- 注意健康管理，避免过度劳累`;
  } else if (question.includes('事业') || question.includes('工作')) {
    focusedAnalysis = `💼 **事业运势详解**：
${careerOptions[Math.floor(Math.random() * careerOptions.length)]}。您的事业运势较为稳定，具有${personalityTraits[Math.floor(Math.random() * personalityTraits.length)]}的特质。

🚀 **发展建议**：
- 把握展现才能的机会
- 注重专业技能的提升
- 建立良好的人际关系网络
- 考虑在领导或协调岗位上发展`;
  } else if (question.includes('感情') || question.includes('爱情') || question.includes('婚姻')) {
    focusedAnalysis = `💕 **感情婚姻分析**：
${birthDate} 出生的您，感情运势良好。单身者有机会遇到心仪的对象，已有伴侣者感情稳定。

💫 **感情建议**：
- 多参与社交活动，扩展交际圈
- 保持真诚和开放的心态
- 重视沟通，理解和包容对方
- 适合在秋季考虑重要感情决策`;
  } else {
    focusedAnalysis = `💫 **综合运势**：
${fortuneAspects[Math.floor(Math.random() * fortuneAspects.length)]}。${fortuneAspects[Math.floor(Math.random() * fortuneAspects.length)]}。`;
  }
  
  return `🔮 八字命理分析（基于出生日期：${birthDate}）：

🌟 **性格特质**：
${personalityTraits[Math.floor(Math.random() * personalityTraits.length)]}。${personalityTraits[Math.floor(Math.random() * personalityTraits.length)]}。

💼 **事业运势**：
${careerOptions[Math.floor(Math.random() * careerOptions.length)]}。${careerOptions[Math.floor(Math.random() * careerOptions.length)]}。

💕 **感情婚姻**：
您的感情运势良好，单身者有机会遇到心仪的对象，已有伴侣者感情稳定。建议多与伴侣沟通，增进相互了解。

🏥 **健康状况**：
您的整体健康状况良好，但要关注作息规律，避免过度劳累。建议多运动，保持良好的生活习惯。

${focusedAnalysis}

📈 **运势建议**：
${fortuneAspects[Math.floor(Math.random() * fortuneAspects.length)]}。同时要注意劳逸结合，保持身心健康。

*注：以上分析基于传统八字理论和您提供的出生日期，仅供参考娱乐。*`;
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