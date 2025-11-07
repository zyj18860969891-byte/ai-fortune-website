const express = require('express');
const { RealModelScopeOnlineService } = require('../services/realModelScopeOnlineService');
const { MsAgentStyleMcpService } = require('../services/msAgentStyleMcpService');

const router = express.Router();

const mcpService = MsAgentStyleMcpService.getInstance();

// 全局出生日期缓存，用于跨请求保存出生信息
const birthDataCache = new Map();

// 从上下文提取并缓存出生日期的函数
function extractAndCacheBirthData(context, sessionId) {
  if (!context) return null;
  
  console.log('🔍 开始从上下文提取出生数据，context长度:', context.length);
  
  // 方法1：从上下文中提取用户提供的出生日期（不提取占卜师的回复）
  const userMessages = context.split('\n').filter(line => 
    line.startsWith('用户:') && !line.includes('占卜师:')
  );
  
  let birthDate = null;
  let zodiac = null;
  
  // 从用户消息中提取出生日期
  for (const message of userMessages) {
    const dateMatch = message.match(/(\d{4}年\d{1,2}月\d{1,2}日)/);
    if (dateMatch) {
      birthDate = dateMatch[1];
      console.log('✅ 找到出生日期:', birthDate);
      break;
    }
  }
  
  // 从用户消息中提取星座
  for (const message of userMessages) {
    const zodiacMatch = message.match(/(水瓶座|白羊座|金牛座|双子座|巨蟹座|狮子座|处女座|天秤座|天蝎座|射手座|摩羯座|双鱼座)/);
    if (zodiacMatch) {
      zodiac = zodiacMatch[1];
      console.log('✅ 找到星座:', zodiac);
      break;
    }
  }
  
  // 如果找到了出生日期，缓存它
  if (birthDate && sessionId) {
    birthDataCache.set(sessionId, { birthDate, zodiac, timestamp: Date.now() });
    console.log('✅ 已缓存出生数据:', { birthDate, zodiac });
  }
  
  return { birthDate, zodiac };
}

// 生成八字命理分析
router.post('/generate', async (req, res) => {
  try {
    const { birthDate, zodiac, context } = req.body;
    
    if (!birthDate) {
      return res.status(400).json({
        error: 'Missing birth date',
        message: '请提供出生日期（格式：YYYY年MM月DD日）'
      });
    }
    
    console.log('🎯 收到八字命理请求:', { birthDate, zodiac });
    
    // 提取并缓存出生数据
    const sessionId = req.sessionID || Date.now().toString();
    const extractedData = extractAndCacheBirthData(context, sessionId);
    
    // 使用 ModelScope 服务进行 AI 分析
    const modelScopeService = new RealModelScopeOnlineService();
    const result = await modelScopeService.generateFortune(birthDate, zodiac, context);
    
    console.log('✅ 八字命理分析完成');
    
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ 八字命理分析失败:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: '八字分析失败，请稍后重试'
    });
  }
});

// AI 聊天功能
router.post('/chat', async (req, res) => {
  try {
    const { message, context, birthDate, zodiac } = req.body;
    
    if (!message) {
      return res.status(400).json({
        error: 'Missing message',
        message: '请提供聊天消息'
      });
    }
    
    console.log('💬 收到聊天请求:', { message, birthDate, zodiac });
    
    // 提取并缓存出生数据
    const sessionId = req.sessionID || Date.now().toString();
    const extractedData = extractAndCacheBirthData(context, sessionId);
    
    // 使用 ModelScope 服务进行 AI 聊天
    const modelScopeService = new RealModelScopeOnlineService();
    const result = await modelScopeService.chatWithAI(message, context, birthDate, zodiac);
    
    console.log('✅ AI 聊天完成');
    
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ AI 聊天失败:', error);
    res.status(500).json({
      error: 'Chat failed',
      message: '聊天失败，请稍后重试'
    });
  }
});

// 获取服务状态
router.get('/status', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'ai-fortune-backend',
    timestamp: new Date().toISOString(),
    features: {
      fortuneAnalysis: true,
      aiChat: true,
      baziCalculation: true
    }
  });
});

module.exports = router;