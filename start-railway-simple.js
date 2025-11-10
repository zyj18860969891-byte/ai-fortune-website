const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// AI Fortune Telling API Endpoints - 专注于八字命理
const FORTUNE_TYPES = [
  { id: 'bazi', name: '八字命理', description: '基于生辰八字进行专业的命理分析' }
];

// 模拟 AI 生成八字命理内容（实际项目中应调用真实的 AI API）
async function generateFortuneContent(type, question) {
  // 只支持八字命理
  if (type !== 'bazi') {
    throw new Error('仅支持八字命理分析');
  }

  // 检查是否包含日期信息
  const datePattern = /\d{4}[\.\年]\d{1,2}[\.\月]\d{1,2}/;
  const hasDate = datePattern.test(question);
  
  if (hasDate) {
    // 有日期信息，进行完整的八字分析
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          type: 'bazi',
          content: `🔮 八字命理分析：根据您提供的出生信息，我将为您进行专业的八字分析。

🌟 **性格特质**：
您的八字显示您性格温和，待人友善，具有很强的直觉力和洞察力。您善于思考，做事认真负责，在团队中往往能发挥协调作用。

💼 **事业运势**：
您的事业运势较为平稳，适合从事教育、咨询、艺术等相关工作。近期有机会获得贵人相助，建议把握机会展现自己的才能。

💕 **感情婚姻**：
您的感情运势良好，单身者有机会遇到心仪的对象，已有伴侣者感情稳定。建议多与伴侣沟通，增进相互了解。

🏥 **健康状况**：
您的整体健康状况良好，但要关注作息规律，避免过度劳累。建议多运动，保持良好的生活习惯。

📈 **运势建议**：
今年是您的发展机遇期，建议制定明确的目标，积极进取。同时要注意劳逸结合，保持身心健康。

*注：以上分析基于传统八字理论，仅供参考娱乐。*`,
          timestamp: new Date().toISOString(),
          confidence: 85
        });
      }, 1000);
    });
  } else {
    // 没有日期信息，提示用户提供
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          type: 'bazi',
          content: "要进行准确的八字分析，请提供您的出生日期（格式：1990.05.15 或 1990年5月15日），这样我才能为您进行专业的命理分析。",
          timestamp: new Date().toISOString(),
          confidence: 0
        });
      }, 500);
    });
  }
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
    
    // 生成运势内容
    const result = await generateFortuneContent(type, question);
    
    // 特殊处理八字命理
    let response = result.content;
    let hasBaziData = false;
    
    if (type === 'bazi') {
      // 检查问题中是否包含日期信息
      const datePattern = /\d{4}[\.\年]\d{1,2}[\.\月]\d{1,2}/;
      if (datePattern.test(question)) {
        hasBaziData = true;
        response = `🔮 八字命理分析：根据您提供的出生信息，我将为您进行专业的八字分析。${result.content}`;
      } else {
        response = "要进行准确的八字分析，请提供您的出生日期（格式：1990.05.15 或 1990年5月15日），这样我才能为您进行专业的命理分析。";
      }
    }
    
    res.json({
      success: true,
      response: result.content,
      result: {
        prediction: result.content,
        type: type,
        confidence: result.confidence,
        hasBaziData: hasBaziData
      },
      data: {
        ...result,
        question: question,
        context: context,
        sessionId: sessionId,
        hasBaziData: hasBaziData,
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