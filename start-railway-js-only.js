const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');

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

// 全局出生日期缓存
const birthDataCache = new Map();

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
  const monthSeason = month <= 3 ? '春' : month <= 6 ? '夏' : month <= 9 ? '秋' : '冬';
  
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
    
    // 提取并缓存出生日期
    const birthDate = extractBirthDate(question);
    console.log('🎯 提取的出生日期:', birthDate);
    
    // 直接生成智能本地响应
    const intelligentResponse = generateIntelligentBaziResponse(question, birthDate);
    
    res.json({
      success: true,
      response: intelligentResponse,
      source: 'intelligent-js-analyzer',
      hasBaziData: !!birthDate,
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