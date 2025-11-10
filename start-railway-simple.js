const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// AI Fortune Telling API Endpoints
const FORTUNE_TYPES = [
  { id: 'love', name: '爱情运势', description: '分析你的爱情运势和感情发展' },
  { id: 'career', name: '事业运势', description: '预测你的事业发展和职业前景' },
  { id: 'wealth', name: '财运分析', description: '分析你的财运和投资机会' },
  { id: 'health', name: '健康运势', description: '关注你的健康状况和养生建议' },
  { id: 'study', name: '学业运势', description: '分析学习运势和考试表现' },
  { id: 'overall', name: '综合运势', description: '全面分析各方面运势' }
];

// 模拟 AI 生成运势内容（实际项目中应调用真实的 AI API）
async function generateFortuneContent(type, question) {
  const prompts = {
    love: '请以专业的命理师身份，分析这个人的爱情运势。请给出详细的分析和建议。',
    career: '请以职业规划师的身份，分析这个人的事业发展前景。请给出具体的建议。',
    wealth: '请以理财顾问的身份，分析这个人的财运状况。请给出投资和理财建议。',
    health: '请以健康顾问的身份，分析这个人的健康状况。请给出养生和健康建议。',
    study: '请以教育专家的身份，分析这个人的学习运势。请给出学习建议。',
    overall: '请以全面的命理师身份，分析这个人的整体运势。请给出各方面的发展建议。'
  };

  const prompt = prompts[type] || prompts.overall;
  
  // 模拟 AI 响应（实际项目中应调用 ModelScope 或其他 AI API）
  return new Promise((resolve) => {
    setTimeout(() => {
      const responses = {
        love: [
          '💕 爱情运势：近期你的桃花运不错，有机会遇到心仪的对象。单身者要多参加社交活动，已有伴侣者要珍惜眼前的缘分。',
          '💖 感情分析：你的感情运势较为平稳，适合深入发展。建议多与伴侣沟通，增进相互了解。',
          '💝 爱情建议：近期是表白的好时机，但要真诚待人。感情需要双方共同经营，单方面的付出难以长久。'
        ],
        career: [
          '🚀 事业运势：你的事业运正在上升期，适合把握机会展现自己的才能。工作中会遇到贵人相助。',
          '💼 职业发展：你的职业前景良好，近期可能会有晋升或加薪的机会。建议继续努力，不要松懈。',
          '🎯 工作建议：近期适合制定长期职业规划，明确自己的发展方向。要善于学习新技能，提升竞争力。'
        ],
        wealth: [
          '💰 财运分析：你的财运正在好转，投资理财会有不错的收益。但要谨慎决策，避免盲目投资。',
          '📈 投资建议：近期适合稳健投资，避免高风险项目。储蓄和理财规划要同步进行。',
          '💎 财富积累：你的财富运势正在上升，但要理性消费，避免不必要的支出。合理规划资金使用。'
        ],
        health: [
          '🏥 健康状况：你的整体健康状况良好，但要关注作息规律，避免过度劳累。',
          '🧘 养生建议：建议多运动，保持良好的作息习惯。饮食要均衡，避免暴饮暴食。',
          '💪 健康运势：近期精力充沛，适合开始新的健身计划。要注意劳逸结合，保持身心健康。'
        ],
        study: [
          '📚 学习运势：你的学习运势很好，记忆力增强，适合学习新知识。',
          '🎓 学业分析：近期学习效率高，适合制定学习计划并严格执行。考试会有不错的表现。',
          '📖 学习建议：建议多思考，多总结，形成自己的知识体系。要劳逸结合，避免过度疲劳。'
        ],
        overall: [
          '🌟 综合运势：你的整体运势很好，各方面都有不错的发展机会。要把握时机，积极进取。',
          '🎯 运势分析：近期是你的上升期，事业、财运、感情都会有好的发展。要保持积极的心态。',
          '💫 发展建议：建议制定全面的人生规划，平衡各方面的发展。要珍惜机会，努力奋斗。'
        ]
      };

      const typeResponses = responses[type] || responses.overall;
      const randomResponse = typeResponses[Math.floor(Math.random() * typeResponses.length)];
      
      resolve({
        type: type,
        content: randomResponse,
        timestamp: new Date().toISOString(),
        confidence: Math.floor(Math.random() * 30) + 70 // 70-100 的置信度
      });
    }, 1000); // 模拟 AI 响应时间
  });
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
    const { type, question } = req.body;
    
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

    console.log(`🔮 AI占卜请求 - 类型: ${type}, 问题: ${question}`);
    
    // 生成运势内容
    const result = await generateFortuneContent(type, question);
    
    res.json({
      success: true,
      data: {
        ...result,
        question: question,
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎉 AI Fortune Website running on port ${PORT}`);
  console.log(`🌐 Frontend: https://your-app.railway.app`);
  console.log(`🔍 Health Check: https://your-app.railway.app/health`);
});