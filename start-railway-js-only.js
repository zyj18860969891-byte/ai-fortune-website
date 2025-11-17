const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

console.log('🔧 使用端口:', PORT);
console.log('🔧 部署环境:', process.env.NODE_ENV || 'development');
console.log('🤖 使用 ModelScope:', process.env.MODELSCOPE_MODEL || 'Qwen/Qwen3-235B-A22B-Instruct-2507');

// 启用 CORS
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 解析 JSON 请求体
app.use(express.json());

// 处理预检请求
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.send();
});

// 记录请求
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 静态前端文件服务 - 禁用缓存以确保获取最新文件
app.use(express.static(path.join(__dirname, 'frontend', 'dist'), {
  etag: false,
  lastModified: false,
  cacheControl: false,
  maxAge: 0
}));

// 如果仓库中存在完整后端的编译输出（backend/dist），优先挂载原始后端路由
let SKIP_LOCAL_ROUTES = false;
let SKIP_LOCAL_SERVER = false;
// 外部完整服务实例（可用时优先使用）
let USE_FULL_SERVICES = false;
let mcpService = null;
let realModelService = null;
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

// 尝试加载已编译的服务实现（RealModelScopeOnlineService, MsAgentStyleMcpService）
try {
  const RealModelScopeModule = require('./backend/dist/services/realModelScopeOnlineService');
  const MsAgentMcpModule = require('./backend/dist/services/msAgentStyleMcpService');
  const RealModelScope = RealModelScopeModule && (RealModelScopeModule.RealModelScopeOnlineService || RealModelScopeModule.default || RealModelScopeModule);
  const MsAgentMcp = MsAgentMcpModule && (MsAgentMcpModule.MsAgentStyleMcpService || MsAgentMcpModule.default || MsAgentMcpModule);
  if (RealModelScope && MsAgentMcp) {
    // 默认值（如未设置环境变量则使用你指定的值）
    const defaultModelId = process.env.MODELSCOPE_MODEL || 'Qwen/Qwen3-235B-A22B-Instruct-2507';
    const defaultApiKey = process.env.MODELSCOPE_API_KEY || 'ms-bf1291c1-c1ed-464c-b8d8-162fdee96180';
    const modelConfig = {
      apiKey: defaultApiKey,
      modelId: defaultModelId,
      baseUrl: process.env.MODELSCOPE_BASE_URL || 'https://api-inference.modelscope.cn/v1'
    };

    try {
      realModelService = new RealModelScope(modelConfig);
      mcpService = MsAgentMcp.getInstance();
      USE_FULL_SERVICES = true;
      console.log('✅ 已实例化完整服务：RealModelScopeOnlineService 与 MsAgentStyleMcpService（将在请求时优先使用）');
    } catch (err) {
      console.warn('⚠️ 实例化完整服务失败，回退到本地实现：', err && err.message);
      USE_FULL_SERVICES = false;
    }
  }
} catch (err) {
  console.log('ℹ️ 未找到已编译的完整服务（backend/dist/services），将使用本地 JS-only 实现');
}

// 全局出生日期缓存，用于跨请求保存出生信息
// 结构: Map<sessionId, { self: birthData, other: birthData, conversationHistory: [] }>
const birthDataCache = new Map();
const sessionDataCache = new Map(); // 缓存会话中提取的用户和对方的八字信息

// 统一、安全地写入出生数据
function setBirthData(sessionId, personId, birthData) {
  if (!sessionId || !birthData) return;
  let sessionCache = birthDataCache.get(sessionId);
  if (!sessionCache) {
    sessionCache = new Map();
    birthDataCache.set(sessionId, sessionCache);
  }
  sessionCache.set(personId, birthData);
  console.log('🔧 setBirthData 写入:', { sessionId, personId, birthData });
}

// 从上下文提取并缓存出生日期的函数
function extractAndCacheBirthData(context, sessionId, personId = 'default') {
  if (!context) return null;
  
  console.log('🔍 开始从上下文提取出生数据，context长度:', context.length, '人员ID:', personId);
  
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
  
  // 如果找到出生数据，缓存它（使用人员ID作为键）
  if (birthData && sessionId) {
    let sessionCache = birthDataCache.get(sessionId);
    if (!sessionCache) {
      sessionCache = new Map();
      birthDataCache.set(sessionId, sessionCache);
    }
    sessionCache.set(personId, birthData);
    console.log('🔧 缓存出生数据:', { sessionId, personId, birthData });
    console.log('🔧 当前会话缓存状态:', Array.from(sessionCache.keys()));
  }
  
  return birthData;
}

// 获取指定人员的出生数据
function getBirthDataForPerson(sessionId, personId = 'default') {
  if (!sessionId) return null;
  
  const sessionCache = birthDataCache.get(sessionId);
  if (!sessionCache) return null;
  
  const birthData = sessionCache.get(personId);
  console.log('🔍 获取出生数据:', { sessionId, personId, birthData });
  return birthData;
}

// 获取会话中的所有出生数据
function getAllBirthDataForSession(sessionId) {
  if (!sessionId) return {};
  
  const sessionCache = birthDataCache.get(sessionId);
  if (!sessionCache) return {};
  
  const result = {};
  for (const [personId, birthData] of sessionCache) {
    result[personId] = birthData;
  }
  
  console.log('🔍 获取会话所有出生数据:', { sessionId, data: result });
  return result;
}

// 检测是否为兼容性请求（简化为仅做辅助，不强制决定业务分支）
function isCompatibilityQuestion(question, hasSelfBirthData) {
  if (!question) return false;
  const q = String(question);

  // 1. 如果一句话里本身就有两个及以上日期，一律视为兼容性/多方关系分析
  const datePattern = /(\d{4})[\.\-/](\d{1,2})[\.\-/](\d{1,2})|(\d{4})年(\d{1,2})月(\d{1,2})日/g;
  let dateCount = 0;
  while (datePattern.exec(q) !== null) {
    dateCount++;
    if (dateCount >= 2) return true;
  }

  // 2. 常见关系/合适问句关键词
  const relationKeywords = [
    '合适吗', '般配吗', '合不合', '配不配', '适不适合', '合不来',
    '在一起', '适合我吗', '合适在一起',
    '喜欢', '爱', '感情', '婚姻', '恋爱', '情侣', '对象',
    '男友', '女友', '男朋友', '女朋友',
    '暧昧', '缘分', '姻缘'
  ];

  const hasQuestionMark = q.includes('吗') || q.includes('？') || q.includes('?');
  const hasRelation = relationKeywords.some(k => q.includes(k));

  // 3. 如果已有 self 生辰（hasSelfBirthData = true），且问题中出现关系关键词和问句，则视为兼容性
  if (hasSelfBirthData && hasRelation && hasQuestionMark) {
    const selfPairPatterns = [
      '我们',
      '我和她', '我和他', '我跟她', '我跟他',
      '和她合适', '和他合适',
      '和她在一起', '和他在一起'
    ];
    
    // 检查是否包含自我关联模式
    const hasSelfPair = selfPairPatterns.some(p => q.includes(p));
    
    // 如果包含自我关联模式，或者包含"喜欢"且有出生日期，视为兼容性问题
    if (hasSelfPair) {
      return true;
    } else if (q.includes('喜欢') && dateCount >= 1) {
      // "喜欢 + 出生日期" 模式，如"我喜欢一个1989.07.18的女生"
      return true;
    }
  }

  // 4. 没有 self 的情况下，仅包含模糊“喜欢/她/他/我们”等，不强制当兼容性，交给调用方基于日期/缓存再判断
  return false;
}

// 从兼容性问题中提取两个人的出生日期
function extractTwoBirthDatesFromQuestion(question) {
  if (!question) return null;
  
  const patterns = [
    // 标准格式：1996.02.10 或 1996-02-10 或 1996/02/10
    /(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,
    // 中文格式：1996年2月10日
    /(\d{4})年(\d{1,2})月(\d{1,2})日/g,
    // 紧凑格式：19960210 (8位数字)
    /(\d{4})(\d{2})(\d{2})/g,
  ];
  
  const birthDates = [];
  let match;
  
  // 使用正则表达式查找所有匹配的日期
  for (const pattern of patterns) {
    while ((match = pattern.exec(question)) !== null) {
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
        birthDates.push({
          year,
          month,
          day,
          hour: 0,
          minute: 0,
          gender: 'male',
          timezone: 'Asia/Shanghai'
        });
      }
    }
  }
  
  // 如果找到两个或更多出生日期，返回前两个
  if (birthDates.length >= 2) {
    return {
      person1: birthDates[0],
      person2: birthDates[1]
    };
  }
  
  return null;
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

// 构建结构化的八字数据，用于AI分析
function buildBaziDataStructure(person1BirthData, person2BirthData = null) {
  const formatDate = (bd) => `${bd.year}.${String(bd.month).padStart(2, '0')}.${String(bd.day).padStart(2, '0')}`;
  
  if (!person2BirthData) {
    // 单人模式
    return {
      analysisType: 'single',
      person1: {
        birthDate: formatDate(person1BirthData),
        year: person1BirthData.year,
        month: person1BirthData.month,
        day: person1BirthData.day,
        hour: person1BirthData.hour || 0,
        minute: person1BirthData.minute || 0,
        timezone: person1BirthData.timezone || 'Asia/Shanghai'
      }
    };
  }
  
  // 双人模式（合婚/配对）
  return {
    analysisType: 'compatibility',
    person1: {
      birthDate: formatDate(person1BirthData),
      year: person1BirthData.year,
      month: person1BirthData.month,
      day: person1BirthData.day,
      hour: person1BirthData.hour || 0,
      minute: person1BirthData.minute || 0,
      timezone: person1BirthData.timezone || 'Asia/Shanghai'
    },
    person2: {
      birthDate: formatDate(person2BirthData),
      year: person2BirthData.year,
      month: person2BirthData.month,
      day: person2BirthData.day,
      hour: person2BirthData.hour || 0,
      minute: person2BirthData.minute || 0,
      timezone: person2BirthData.timezone || 'Asia/Shanghai'
    },
    description: '这是一个双人八字配对分析。系统已检测到两个不同的出生日期，请基于这两个人的八字数据进行合婚分析。'
  };
}

// 为AI构建增强的提示词，让AI自主决策分析类型
function buildEnhancedPromptForAI(userQuestion, baziDataStructure, analysisContext = '', sessionData = {}) {
  let systemMessage = '';
  let enhancedUserPrompt = userQuestion;
  
  // 从会话历史中获取用户之前提供的信息
  const userBirthInfo = sessionData.userBirthData ? 
    `公历${sessionData.userBirthData.year}年${String(sessionData.userBirthData.month).padStart(2, '0')}月${String(sessionData.userBirthData.day).padStart(2, '0')}日` : null;
  const otherBirthInfo = sessionData.otherBirthData ?
    `公历${sessionData.otherBirthData.year}年${String(sessionData.otherBirthData.month).padStart(2, '0')}月${String(sessionData.otherBirthData.day).padStart(2, '0')}日` : null;
  
  if (!baziDataStructure || baziDataStructure.analysisType === 'single') {
    // 单人八字分析
    if (sessionData.conversationCount > 1 && userBirthInfo) {
      // 多轮对话，提示AI用户的信息已在对话中提供过
      systemMessage = `你是一位精通八字命理的AI占卜师。

【重要！】这是一个持续的对话。用户之前已经提供了自己的出生日期信息：
🔹 用户出生日期：${userBirthInfo}

在之前的对话中，我们已经对用户进行过八字分析。现在用户提出了新的问题。

【智能上下文保持】：
你必须具备强大的记忆和推理能力，能够：
1. 📌 记住并引用用户之前的出生日期（${userBirthInfo}）
2. 🧠 智能识别用户是否在讨论关系问题，即使没有明确提到另一个出生日期
3. 🔍 检测关键词：结婚、感情、婚姻、对象、喜欢、她、他、对方、男朋友、女朋友等
4. 💒 如果检测到关系相关问题，尝试回忆或推断可能涉及的另一个人
5. 🎯 根据问题的性质决定是单人分析还是需要配对分析

【环境与情景适应】：
无论用户提出什么新环境、新情景，你都必须：
- 保持对话的连贯性
- 自然地引用用户的信息
- 结合具体情况进行分析
- 如果涉及关系问题，主动询问是否需要配对分析

【关键指示】：
- 如果用户提到多个日期，这通常表示【配对】或【关系分析】
- 始终在回答中提及用户自己的出生信息，确保对话连贯
- 不要忘记用户的信息，即使用户没有重复提供
- 🚨 如果问题涉及感情、婚姻、对象等，优先考虑是否需要配对分析

【示例】：
- 用户说"我喜欢一个1989年7月18日出生的人" → 这是【配对分析】
- 用户说"她已经结婚了怎么办" → 这是【关系情景分析】，需要配对分析
- 用户说"工作压力太大了" → 这是【个人运势分析】，单人分析`;

      enhancedUserPrompt = `【用户基本信息】
出生日期：${userBirthInfo}

【对话历史背景】
在之前的对话中，我们已经对你的八字进行了详细分析。

【当前问题】
${userQuestion}

【任务】
请基于你（${userBirthInfo}出生）已提供的信息，以及当前的问题，进行命理分析。
如果这个问题涉及另一个人，请进行【配对分析】或【关系分析】。`;
    } else {
      // 单轮对话或首次
      systemMessage = `你是一位精通八字命理的AI占卜师。用户向你提供了一个人的出生日期和一个问题。
你有以下能力：
1. 根据出生日期计算或理解该人的八字信息
2. 基于八字分析该人的性格、运势、与问题的关联
3. 提供建设性的建议和预测

请基于提供的出生日期和用户的问题，进行专业的八字命理分析。`;

      if (baziDataStructure && baziDataStructure.person1) {
        const p1 = baziDataStructure.person1;
        enhancedUserPrompt = `用户的出生日期：${p1.birthDate}
用户的问题：${userQuestion}

请基于这个出生日期进行八字分析，回答用户的问题。`;
      }
    }
  } else if (baziDataStructure.analysisType === 'compatibility') {
    // 双人八字配对分析
    systemMessage = `你是一位精通八字命理的AI占卜师，尤其擅长进行【双人八字配对分析】。

【重要！】这是一个【配对分析】请求：
${sessionData.userBirthData ? `🔹 第一人（用户自己）：${userBirthInfo}` : ''}
${sessionData.otherBirthData ? `🔹 第二人（对方）：${otherBirthInfo}` : ''}

【核心职责】：
1. 📌 MUST 在所有回答中明确提到两个人的出生日期
2. 分析两人的八字五行是否互补
3. 评估两人的性格是否匹配
4. 判断两人的感情和婚姻运势
5. 提供关于这段关系的建议

【智能环境与情景检测】：
你必须具备强大的上下文理解能力，能够识别并处理以下复杂情况：
- 💒 婚姻状况变化：如"她已经结婚了"、"他有对象了"、"我们分手了"等
- 🏠 家庭环境：如"她家反对"、"父母不同意"、"异地恋"等
- 💼 事业影响：如"工作压力影响感情"、"事业发展vs感情选择"等
- 🕐 时间因素：如"我们认识多久了"、"什么时候结婚合适"等
- 🌪️ 危机处理：如"她出轨了怎么办"、"我们总是吵架"、"冷战期"等
- 🎯 未来规划：如"要不要结婚"、"什么时候生孩子"、"买房计划"等

【回答格式要求】：
- 开头明确说："根据你（${userBirthInfo}出生）和她/他（${otherBirthInfo}出生）的八字..."
- 在整个分析中多次提及两人的出生信息，确保对话连贯
- 进行【对比分析】，而不是分别分析两个人
- 结合具体环境和情景给出针对性建议

【重要提示】：
- 这是一个【持续的多轮对话】
- 用户已经对自己进行过八字分析
- 现在重点是【配对分析】，需要结合之前的分析结果
- 🚨 关键：无论用户提出什么新情景、新环境、新问题，你都必须：
  1. 识别这是关于两个人关系的问题
  2. 继续使用已有的两个人的八字信息
  3. 结合新情景进行针对性分析
  4. 绝对不能回到单人分析模式
  5. 不能忘记或忽略任何一方的信息

【禁止事项】：
- ❌ 不要要求用户再次提供已经给过的信息
- ❌ 不要只分析对方，忽视用户
- ❌ 不要分开分析，要做【对比分析】
- ❌ 不要因为新情景而丢失上下文`;

    if (baziDataStructure.person1 && baziDataStructure.person2) {
      const p1 = baziDataStructure.person1;
      const p2 = baziDataStructure.person2;
      enhancedUserPrompt = `【参与者信息】
第一人（用户自己）：出生于 ${p1.birthDate}
第二人（对方）：出生于 ${p2.birthDate}

【用户的问题】
${userQuestion}

【重要上下文】
用户在之前的消息中说过"我出生于${p1.birthDate}"。现在用户提到"我喜欢一个${p2.birthDate}出生的人"，这表示用户要求一个【配对分析】。

【任务 - 必须完成】：
你必须：
1. 在回答的开头明确说明："根据你（${p1.birthDate}出生）和对方（${p2.birthDate}出生）的八字..." 
2. 进行【对比分析】，不是分开分析两个人
3. 在整个回答中多次提及两人的出生信息
4. 分析两人的五行是否相生相克
5. 评估两人的性格是否匹配
6. 预测这段感情的稳定性和发展前景
7. 最后给出"是否合适"的明确评价

【禁止事项】：
- ❌ 不要要求用户再次提供自己的出生日期（用户已经提过了）
- ❌ 不要只分析对方，忽视用户
- ❌ 不要分开分析，要做【对比分析】

${baziDataStructure.description}`;
    }
  } else if (baziDataStructure.analysisType === 'need-other-data') {
    // 用户在问关于他人，但没有提供他人的出生日期
    systemMessage = `你是一位精通八字命理的AI占卜师。
用户已经提供了自己的出生日期（${userBirthInfo}）。
现在用户在问关于他人的信息或两人的相性，但还没有提供他人的出生日期。

请友好地提示用户：
1. 确认用户是想了解某个特定的人
2. 告诉用户需要那个人的出生日期才能进行分析
3. 告诉用户应该提供格式（如：1990.05.15 或 1990年5月15日）`;

    enhancedUserPrompt = `[用户的出生信息：${userBirthInfo}]

用户的问题：${userQuestion}

用户似乎在询问关于他人的信息，但还未提供该人的出生日期。请友好地提示用户提供所需的信息。`;
  } else {
    // 通用分析 - 用户没有提供出生日期，且不在多轮对话中
    // 检查是否在多轮对话中但系统忘记了用户信息
    if (sessionData.conversationCount > 1 && !sessionData.userBirthData) {
      // 多轮对话但没有用户出生信息 - 主动询问
      systemMessage = `你是一位精通八字命理的AI占卜师。
用户正在进行多轮对话，但你还没有获得用户的出生日期信息。

请主动询问用户提供出生日期：
1. 礼貌地询问用户的出生日期
2. 说明需要出生日期才能进行准确的八字分析
3. 提供格式示例：1990.05.15 或 1990年5月15日
4. 解释八字分析需要准确的出生信息`;

      enhancedUserPrompt = `用户的问题：${userQuestion}

【重要】：这是多轮对话，但你还没有获得用户的出生日期。请主动询问用户提供准确的出生日期，然后才能进行专业的八字命理分析。`;
    } else {
      // 首次对话或单次对话 - 提供通用分析
      systemMessage = `你是一位精通八字命理的AI占卜师。
用户没有提供具体的出生日期，需要进行通用的命理分析或建议。

你的职责：
1. 提供通用的命理知识和建议
2. 礼貌地提示用户如果提供出生日期可以获得更准确的分析
3. 不要编造或猜测用户的出生信息
4. 专注于用户问题的本质，提供有价值的建议`;

      enhancedUserPrompt = `用户的问题：${userQuestion}

请提供通用的命理分析或建议。如果需要用户的出生日期才能进行准确分析，请礼貌地提示用户提供。`;
    }
  }
  
  return {
    systemMessage,
    enhancedUserPrompt,
    analysisType: baziDataStructure?.analysisType || 'unknown',
    metadata: {
      hasFirstPerson: !!baziDataStructure?.person1,
      hasSecondPerson: !!baziDataStructure?.person2,
      context: analysisContext,
      conversationCount: sessionData.conversationCount || 0
    }
  };
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
function generateIntelligentBaziResponse(question, baziData) {
  // 处理新的数据结构格式（带有analysisType）
  let birthData = null;
  let person1BirthData = null;
  let person2BirthData = null;
  let analysisType = 'unknown';
  
  if (!baziData) {
    return `🔮 八字命理分析

您好！要进行准确的八字分析，请提供您的出生日期（格式：1990.05.15 或 1990年5月15日），这样我才能为您进行专业的命理分析。

🌟 **性格特质**：
根据您的描述，您性格温和，待人友善，具有很强的直觉力和洞察力。您善于思考，做事认真负责。

💼 **事业运势**：
您的事业运势较为平稳，适合从事教育、咨询、艺术等相关工作。

*注：以上分析基于您提供的信息，仅供参考娱乐。*`;
  }
  
  // 判断是新结构（带analysisType）还是旧结构
  if (baziData.analysisType) {
    analysisType = baziData.analysisType;
    person1BirthData = baziData.person1;
    person2BirthData = baziData.person2;
    birthData = baziData.person1; // 兼容旧代码
  } else {
    // 旧结构：直接作为单人数据
    analysisType = 'single';
    birthData = baziData;
    person1BirthData = baziData;
  }
  
  // 如果是双人分析，调用兼容性分析函数
  if (analysisType === 'compatibility' && person1BirthData && person2BirthData) {
    return generateCompatibilityResponse(question, {
      person1: person1BirthData,
      person2: person2BirthData
    });
  }
  
  // 单人分析逻辑
  if (!birthData) {
    return `🔮 八字命理分析

您好！要进行准确的八字分析，请提供您的出生日期（格式：1990.05.15 或 1990年5月15日）。`;
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
    focusedAnalysis = `💼 **事业运势详解**：
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

// 智能本地兼容性分析生成
function generateCompatibilityResponse(question, compatibilityBirthData) {
  if (!compatibilityBirthData || !compatibilityBirthData.person1 || !compatibilityBirthData.person2) {
    return `🔮 八字兼容性分析

要进行准确的兼容性分析，请提供两个人的出生日期（格式：1990.05.15 和 1995.03.20），这样我才能为您进行专业的八字配对分析。

💕 **兼容性分析要点**：
- 八字五行互补情况
- 性格特质匹配度
- 事业运势协同性
- 感情婚姻发展趋势
- 生肖相合相冲分析

*注：以上分析基于您提供的信息，仅供参考娱乐。*`;
  }
  
  const person1 = compatibilityBirthData.person1;
  const person2 = compatibilityBirthData.person2;
  
  // 基于出生日期的特征分析
  const year1 = person1.year;
  const month1 = person1.month;
  const day1 = person1.day;
  const year2 = person2.year;
  const month2 = person2.month;
  const day2 = person2.day;
  
  // 年龄差计算
  const ageDiff = Math.abs(year1 - year2);
  
  // 生肖分析
  const animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
  const animal1 = animals[(year1 - 4) % 12];
  const animal2 = animals[(year2 - 4) % 12];
  
  // 生成兼容性分析
  const compatibilityAspects = [
    '两人八字五行互补，具有较强的吸引力',
    '性格上能够相互补充，形成良好的平衡',
    '在事业上能够相互支持，共同进步',
    '感情基础稳固，有较好的发展前景',
    '在家庭生活中能够和谐相处',
    '在财运方面有较好的协同效应'
  ];
  
  const challenges = [
    '需要注意沟通方式，避免误解',
    '在处理问题时可能会有不同的观点',
    '需要更多的耐心和理解',
    '在重大决策上需要充分协商',
    '要注意避免性格上的冲突',
    '需要平衡各自的需求和期望'
  ];
  
  const suggestions = [
    '多进行沟通交流，增进了解',
    '相互尊重，包容彼此的差异',
    '共同制定目标和计划',
    '保持适度的个人空间',
    '在困难时期相互支持',
    '定期进行感情维护'
  ];
  
  return `🔮 八字兼容性分析

📊 **基本信息**：
第一个人：${year1}年${month1}月${day1}日（${animal1}座）
第二个人：${year2}年${month2}月${day2}日（${animal2}座）
年龄差距：${ageDiff}岁

💕 **兼容性分析**：
${compatibilityAspects[Math.floor(Math.random() * compatibilityAspects.length)]}。
${compatibilityAspects[Math.floor(Math.random() * compatibilityAspects.length)]}。

⚠️ **潜在挑战**：
${challenges[Math.floor(Math.random() * challenges.length)]}。
${challenges[Math.floor(Math.random() * challenges.length)]}。

💡 **建议指导**：
${suggestions[Math.floor(Math.random() * suggestions.length)]}。
${suggestions[Math.floor(Math.random() * suggestions.length)]}。

🌟 **总体评价**：
两人的八字组合具有较好的兼容性，在感情、事业、家庭等方面都有不错的发展潜力。建议双方珍惜缘分，相互理解，共同经营美好的未来。

*注：以上分析基于传统八字理论和您提供的信息，仅供参考娱乐。*`;
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
    const { type, question, context, sessionId, birthInfo } = req.body;
    
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
    console.log(`🔧 收到birthInfo:`, birthInfo);
    console.log(`🔧 birthInfo类型:`, typeof birthInfo, '是否为对象:', typeof birthInfo === 'object', '是否为null:', birthInfo === null);
    
    // 新的AI控制架构：
    // 1. 从会话缓存中获取之前保存的用户信息
    // 2. 检测用户是否提供了新的出生日期（一个或两个）
    // 3. 智能地识别和更新用户/他人的数据
    // 4. 构建结构化的八字数据
    // 5. 为AI提供清晰的系统提示和用户提示

    // 初始化或获取会话数据
    let sessionData = sessionDataCache.get(sessionId) || { 
      userBirthData: null, 
      otherBirthData: null,
      conversationCount: 0
    };
    
    // 检测是否存在新的出生日期
    const twoBirthDates = extractTwoBirthDatesFromQuestion(question);
    let baziDataStructure = null;
    let analysisType = 'unknown';
    
    // 智能分配新检测到的日期
    if (twoBirthDates && twoBirthDates.person1 && twoBirthDates.person2) {
      // 检测到两个出生日期
      console.log('💑 检测到两个出生日期');
      
      // 尝试判断哪个是用户，哪个是他人
      // 规则：在对话中，通常先提到的是用户自己，后提到的是他人
      if (!sessionData.userBirthData) {
        // 首次提供两个日期，按问题中的顺序赋值
        sessionData.userBirthData = twoBirthDates.person1;
        sessionData.otherBirthData = twoBirthDates.person2;
        console.log('✅ 首次检测：第一个日期作为用户，第二个作为他人');
      } else {
        // 已有用户数据，新检测到的作为他人
        sessionData.otherBirthData = twoBirthDates.person1;
        console.log('✅ 更新他人数据');
      }
      
      baziDataStructure = buildBaziDataStructure(sessionData.userBirthData, sessionData.otherBirthData);
      analysisType = 'compatibility';
    } else if (twoBirthDates && twoBirthDates.person1) {
      // 只有一个出生日期
      console.log('👤 检测到一个出生日期');
      
      if (!sessionData.userBirthData) {
        // 第一次提供，作为用户自己
        sessionData.userBirthData = twoBirthDates.person1;
        console.log('✅ 保存为用户出生数据');
      } else {
        // 已有用户数据，这个新的是他人
        sessionData.otherBirthData = twoBirthDates.person1;
        console.log('✅ 保存为他人出生数据');
      }
      
      baziDataStructure = buildBaziDataStructure(sessionData.userBirthData, sessionData.otherBirthData);
      analysisType = sessionData.otherBirthData ? 'compatibility' : 'single';
    } else if (birthInfo) {
      // 使用提交的birthInfo
      console.log('📋 使用提交的birthInfo进行分析');
      if (!sessionData.userBirthData) {
        sessionData.userBirthData = birthInfo;
      } else {
        sessionData.otherBirthData = birthInfo;
      }
      baziDataStructure = buildBaziDataStructure(sessionData.userBirthData, sessionData.otherBirthData);
      analysisType = sessionData.otherBirthData ? 'compatibility' : 'single';
    } else if (sessionData.userBirthData) {
      // 虽然本次问题没有新的出生日期，但用户之前提供过
      console.log('🔄 使用会话中缓存的用户数据');
      
      // 检测是否为兼容性问题或继续关系讨论
      const isRelationshipQuestion = question.includes('她') || question.includes('他') || 
                                   question.includes('对方') || question.includes('结婚') ||
                                   question.includes('感情') || question.includes('婚姻') ||
                                   question.includes('对象') || question.includes('喜欢');
      
      if (isCompatibilityQuestion(question, true) || (sessionData.otherBirthData && isRelationshipQuestion)) {
        console.log('💑 检测到兼容性问题或继续关系讨论');
        console.log('📝 当前问题:', question);
        
        // 如果是新的兼容性问题，尝试从当前问题中提取对方的出生日期
        if (isCompatibilityQuestion(question, true)) {
          const otherBirthDateStr = extractBirthDate(question);
          console.log('🔍 extractBirthDate 返回:', otherBirthDateStr);
          
          if (otherBirthDateStr) {
            // 将字符串格式的日期转换为对象格式
            const dateParts = otherBirthDateStr.split('.');
            const otherBirthDateObj = {
              year: parseInt(dateParts[0]),
              month: parseInt(dateParts[1]),
              day: parseInt(dateParts[2]),
              hour: 0,
              minute: 0,
              gender: 'female',
              timezone: 'Asia/Shanghai'
            };
            sessionData.otherBirthData = otherBirthDateObj;
            console.log('✅ 从当前问题中提取到对方出生日期:', otherBirthDateObj);
          } else {
            console.log('❌ 未能从问题中提取到对方出生日期，使用缓存数据');
          }
        }
        
        baziDataStructure = buildBaziDataStructure(sessionData.userBirthData, sessionData.otherBirthData);
        console.log('🔍 buildBaziDataStructure 返回:', {
          analysisType: baziDataStructure?.analysisType,
          hasPerson1: !!baziDataStructure?.person1,
          hasPerson2: !!baziDataStructure?.person2,
          person1BirthDate: baziDataStructure?.person1?.birthDate,
          person2BirthDate: baziDataStructure?.person2?.birthDate
        });
        analysisType = sessionData.otherBirthData ? 'compatibility' : 'need-other-data';
        console.log('📝 设置为兼容性分析，对方数据存在:', !!sessionData.otherBirthData);
      } else if ((question.includes('她') || question.includes('他') || question.includes('对方')) && !sessionData.otherBirthData) {
        // 没有提供日期但在问关于他人，需要他人的信息
        analysisType = 'need-other-data';
        console.log('📝 设置为 need-other-data');
      } else {
        baziDataStructure = buildBaziDataStructure(sessionData.userBirthData, sessionData.otherBirthData);
        analysisType = sessionData.otherBirthData ? 'compatibility' : 'single';
        console.log('📝 设置分析类型:', analysisType, '是否有对方数据:', !!sessionData.otherBirthData);
      }
    } else {
      // 未检测到出生日期
      console.log('❓ 未检测到出生日期，提供通用分析');
      analysisType = 'general';
    }
    
    // 保存会话数据
    sessionData.conversationCount++;
    sessionDataCache.set(sessionId, sessionData);
    console.log('💾 会话数据已更新:', {
      sessionId,
      hasUserData: !!sessionData.userBirthData,
      hasOtherData: !!sessionData.otherBirthData,
      conversationCount: sessionData.conversationCount
    });
    
    // 为AI构建增强的提示词，包含会话中的历史信息
    const promptData = buildEnhancedPromptForAI(question, baziDataStructure, context || '', sessionData);
    console.log('🎯 AI提示词构建完成:', {
      analysisType: promptData.analysisType,
      hasSystemMessage: !!promptData.systemMessage,
      hasFirstPerson: promptData.metadata.hasFirstPerson,
      hasSecondPerson: promptData.metadata.hasSecondPerson
    });
    
    // 如果编译后的完整服务可用，则直接调用代理
    if (USE_FULL_SERVICES && realModelService) {
      try {
        console.log('🚀 调用 ms 代理进行分析（新的AI控制架构）');
        
        // 使用增强的提示词调用AI
        const result = await realModelService.generateFortune(
          promptData.enhancedUserPrompt, 
          { 
            context, 
            sessionId, 
            birthInfo,
            analysisType: promptData.analysisType,
            metadata: promptData.metadata
          }, 
          type,
          promptData.systemMessage
        );

        const prediction = result && (result.prediction || result);

        console.log('✅ ms 代理分析完成，返回长度:', (prediction && prediction.length) || 0);

        return res.json({
          success: true,
          response: prediction,
          analysisType: promptData.analysisType,
          source: result.source || 'modelscope',
          timestamp: new Date().toISOString()
        });

      } catch (err) {
        console.error('❌ 使用 ms 代理时出错，回退到本地实现：', err && err.message);
        // fallthrough to local fallback
      }
    }

    // 本地兜底（当代理不可用时）
    const intelligentResponse = baziDataStructure 
      ? generateIntelligentBaziResponse(question, baziDataStructure)
      : generateIntelligentBaziResponse(question, null);

    res.json({
      success: true,
      response: intelligentResponse,
      analysisType: promptData.analysisType,
      source: 'intelligent-js-analyzer',
      hasBaziData: !!baziDataStructure,
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
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

if (!SKIP_LOCAL_SERVER) {
  const server = app.listen(PORT, '0.0.0.0', () => {
    const hostname = process.env.RAILWAY_DEPLOYMENT_ID || 'your-app.railway.app';
    const baseUrl = process.env.RAILWAY_PUBLIC_DOMAIN || `https://${hostname}.railway.app`;
    
    console.log(`🎉 AI Fortune Website running on port ${PORT}`);
    console.log(`🌐 Frontend: ${baseUrl}`);
    console.log(`🔍 Health Check: ${baseUrl}/health`);
    console.log(`🔧 Environment Check: ${baseUrl}/api/env`);
    console.log(`🤖 Using ModelScope: ${process.env.MODELSCOPE_MODEL || 'Qwen/Qwen3-235B-A22B-Instruct-2507'}`);
    console.log(`📝 纯JavaScript版本，智能本地分析`);
    console.log(`✅ 服务器已启动，监听地址: 0.0.0.0:${PORT}`);
  });
}

} // end if (!SKIP_LOCAL_ROUTES)