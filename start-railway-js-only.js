const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

console.log('🔧 使用端口:', PORT);
console.log('🔧 部署环境:', process.env.NODE_ENV || 'development');
console.log('🤖 使用 ModelScope:', process.env.MODELSCOPE_MODEL_ID || 'Qwen/Qwen3-235B-A22B-Instruct-2507');

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

// 如果仓库中存在完整后端的编译输出（backend/dist），优先挂载原始后端路由
let SKIP_LOCAL_ROUTES = false;
let SKIP_LOCAL_SERVER = false;
try {
  const useCompleteBackend = process.env.USE_REAL_BACKEND === 'true' || process.env.USE_COMPLETE_BACKEND === 'true' || process.env.USE_BACKEND === 'true';
  if (useCompleteBackend) {
    try {
      // 尝试加载已编译的后端路由（JS）并挂载到当前 express 实例上
      const fortuneRouterModule = require('./backend/dist/routes/fortune');
      const fortuneRouter = fortuneRouterModule && (fortuneRouterModule.default || fortuneRouterModule);
      if (fortuneRouter) {
        app.use('/api/fortune', fortuneRouter);
        SKIP_LOCAL_ROUTES = true;
        console.log('✅ 已挂载完整后端路由: ./backend/dist/routes/fortune (/api/fortune)');
      }
    }
    catch (err) {
      console.error('⚠️ 尝试挂载完整后端路由失败，回退到本地 JS-only 实现:', err && err.message);
    }
  }
} catch (err) {
  console.warn('⚠️ 检查是否使用完整后端时发生错误:', err && err.message);
}

// 如果明确要求使用完整后端应用（backend/dist/app.js），尝试直接启动它并退出当前轻量服务
try {
  const useCompleteBackend = process.env.USE_REAL_BACKEND === 'true' || process.env.USE_COMPLETE_BACKEND === 'true' || process.env.USE_BACKEND === 'true';
  if (useCompleteBackend) {
    try {
      const backendAppModule = require('./backend/dist/app');
      const backendApp = backendAppModule && (backendAppModule.default || backendAppModule);
      if (backendApp && typeof backendApp.listen === 'function') {
        const backendPort = process.env.PORT || PORT;
        backendApp.listen(backendPort, '0.0.0.0', () => {
          console.log(`✅ 已启动完整后端应用 (backend/dist/app)，监听端口 ${backendPort}`);
        });
        SKIP_LOCAL_SERVER = true;
        console.log('ℹ️ 当前进程已切换到完整后端应用，跳过本地 JS-only 路由与监听');
      }
    }
    catch (err) {
      console.error('⚠️ 启动完整后端应用失败，继续使用本地 JS-only 实现:', err && err.message);
    }
  }
} catch (err) {
  console.warn('⚠️ 检查启动完整后端时发生错误:', err && err.message);
}

// 全局出生日期缓存，用于跨请求保存出生信息
const birthDataCache = new Map();

// 从上下文提取并缓存出生日期的函数
function extractAndCacheBirthData(context, sessionId) {
  if (!context) return null;
  
  console.log('🔍 开始从上下文提取出生数据，context长度:', context.length);
  
  // 方法1：从上下文中提取用户提供的出生日期（不提取占卜师的回复）
  const userMessages = Array.isArray(context) ? context.filter(msg => msg && msg.type === 'user') : [];
  
  console.log('🔍 提取到的用户消息数量:', userMessages.length);
  
  let birthData = null;
  
  // 首先尝试从用户消息中提取
  for (const message of userMessages) {
    if (message && message.content) {
      const extractedData = extractBirthDataFromQuestion(message.content);
      if (extractedData) {
        birthData = extractedData;
        console.log('✅ 从用户消息成功提取出生数据:', birthData);
        break;
      }
    }
  }
  
  // 方法2：如果从用户消息中没有找到，尝试从整个context中搜索
  if (!birthData && typeof context === 'string') {
    console.log('🔍 从用户消息中未找到出生数据，尝试从整个context搜索');
    const extractedData = extractBirthDataFromQuestion(context);
    if (extractedData) {
      birthData = extractedData;
      console.log('✅ 从整个context成功提取出生数据:', birthData);
    }
  }
  
  // 方法3：尝试从占卜师的回复中提取（如果用户在回复中提到了出生日期）
  if (!birthData && Array.isArray(context)) {
    console.log('🔍 从context和用户消息中未找到出生数据，尝试从占卜师回复中提取');
    const fortuneMessages = context.filter(msg => 
      msg && msg.content && (msg.content.includes('八字') || msg.content.includes('阳历') || msg.content.includes('农历'))
    );
    
    for (const message of fortuneMessages) {
      if (message && message.content) {
        const extractedData = extractBirthDataFromQuestion(message.content);
        if (extractedData) {
          birthData = extractedData;
          console.log('✅ 从占卜师回复成功提取出生数据:', birthData);
          break;
        }
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

// 从问题中提取出生日期
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
      
      // 驗证日期的合理性
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

// 从问题中提取出生日期
function extractBirthDate(question) {
  if (!question) return null;
  
  const patterns = [
    // 标准格式：1996.02.10 或 1996-02-10 或 1996/02/10
    /(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,
    // 中文格式：1996年2月10日
    /(\d{4})年(\d{1,2})月(\d{1,2})日/g,
    // 紧凑格式：19960210 (8位数字)
    /(\d{4})(\d{2})(\d{2})/g,
  ];
  
  for (const pattern of patterns) {
    const match = pattern.exec(question);
    if (match) {
      let year, month, day;
      
      if (pattern.source.includes('(\d{4})(\d{2})(\d{2})')) {
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
        return `${year}.${month.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')}`;
      }
    }
  }
  
  return null;
}

// 智能本地八字分析生成
function generateIntelligentBaziResponse(question, birthData) {
  if (!birthData) {
    return `🔮 八字命理分析

您好！要进行准确的八字分析，请提供您的出生日期（格式：1990.05.15 或 1990年5月15日），这样我才能为您进行专业的命理分析。

🌟 **性格特质**：
根据您的描述，您性格温和，待人友善，具有很强的直觉力和洞察力。您善于思考，做事认真负责。

💼 **事业运势**：
您的事业运势较为平稳，适合从事教育、咨询、艺术等相关工作。

*注：以上分析基于您提供的信息，仅供参考娱乐。*`;
  }
  
  // 解析出生日期
  const year = birthData.year;
  const month = birthData.month;
  const day = birthData.day;
  
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
    focused游戏副本 = `💼 **事业运势详解**：
${careerOptions[Math.floor(Math.random() * careerOptions.length)]}。您的事业运势较为稳定，具有${personalityTraits[Math.floor(Math.random() * personalityTraits.length)]}的特质。

🚀 **发展建议**：
- 把握展现才能的机会
- 注重专业技能的提升
- 建立良好的人际关系网络
- 考虑在领导或协调岗位上发展`;
  } else if (question.includes('感情') || question.includes('爱情') || question.includes('婚姻')) {
    focusedAnalysis = `💕 **感情婚姻分析**：
${birthData.year}年${birthData.month}月${birthData.day}日出生的您，感情运势良好。单身者有机会遇到心仪的对象，已有伴侣者感情稳定。

💫 **感情建议**：
- 多参与社交活动，扩展交际圈
- 保持真诚和开放的心态
- 重视沟通，理解和包容对方
- 适合在秋季考虑重要感情决策`;
  } else {
    focusedAnalysis = `💫 **综合运势**：
${fortuneAspects[Math.floor(Math.random() * fortuneAspects.length)]}。${fortuneAspects[Math.floor(Math.random() * fortuneAspects.length)]}。`;
  }
  
  return `🔮 八字命理分析（基于出生日期：${birthData.year}.${birthData.month.toString().padStart(2, '0')}.${birthData.day.toString().padStart(2, '0')}）：

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

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'js-only-app',
    hasBackend: false 
  });
});

// 环境变量检查
app.get('/api/env', (req, res) => {
  const envInfo = {
    node_env: process.env.NODE_ENV,
    port: PORT,
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

if (!SKIP_LOCAL_ROUTES) {
  // AI 占卜聊天接口 - 使用纯JavaScript智能分析
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

    console.log(`🔮 AI占卜请求 - 类型: ${type}, 问题: ${question}, 会话ID: ${sessionId}`);
    console.log(`📝 上下文信息:`, context);
    
    // 尝试从上下文提取出生日期并缓存
    let birthData = null;
    if (context) {
      const contextBirthData = extractAndCacheBirthData(context, sessionId);
      if (contextBirthData) {
        birthData = contextBirthData;
        console.log('✅ 从上下文提取出生数据:', birthData);
      }
    }
    
    // 如果当前请求没有出生数据，尝试从缓存获取
    if (!birthData && sessionId) {
      const cachedBirthData = birthDataCache.get(sessionId);
      if (cachedBirthData) {
        birthData = cachedBirthData;
        console.log('🔧 从缓存获取出生数据:', { sessionId, birthData });
      }
    }
    
    // 如果还没有出生数据，尝试从当前问题中提取
    if (!birthData) {
      birthData = extractBirthDataFromQuestion(question);
      if (birthData) {
        console.log('✅ 从问题中提取出生数据:', birthData);
        // 如果从问题中提取到，也缓存它
        if (sessionId) {
          birthDataCache.set(sessionId, birthData);
          console.log('🔧 缓存从问题中提取的出生数据:', { sessionId, birthData });
        }
      }
    }
    
    console.log('🎯 最终出生数据:', birthData);
    
    // 直接生成智能本地响应
    const intelligentResponse = generateIntelligentBaziResponse(question, birthData);
    
    res.json({
      success: true,
      response: intelligentResponse,
      source: 'intelligent-js-analyzer',
      hasBaziData: !!birthData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ AI占卜失败:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'AI占卜服务暂时不可用',
      timestamp: new Date().toISOString()
    });
  }
  });

  // 获取运势类型
  app.get('/api/fortune/types', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'bazi', name: '八字命理', description: '基于生辰八字进行专业的命理分析' }
    ],
    timestamp: new Date().toISOString()
  });
});

// SPA 路由支持
app.get('*', (req, res) => {
  console.log(`📄 Serving frontend: ${req.url}`);
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

if (!SKIP_LOCAL_SERVER) {
  app.listen(PORT, '0.0.0.0', () => {
    const hostname = process.env.RAILWAY_DEPLOYMENT_ID || 'your-app.railway.app';
    const baseUrl = process.env.RAILWAY_PUBLIC_DOMAIN || `https://${hostname}.railway.app`;
    
    console.log(`🎉 AI Fortune Website running on port ${PORT}`);
    console.log(`🌐 Frontend: ${baseUrl}`);
    console.log(`🔍 Health Check: ${baseUrl}/health`);
    console.log(`🔧 Environment Check: ${baseUrl}/api/env`);
    console.log(`🤖 Using ModelScope: ${process.env.MODELSCOPE_MODEL_ID || 'Qwen/Qwen3-235B-A22B-Instruct-2507'}`);
    console.log(`📝 纯JavaScript版本，智能本地分析`);
  });
}

} // end if (!SKIP_LOCAL_ROUTES)