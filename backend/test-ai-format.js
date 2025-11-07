// 测试AI输出格式化效果
const { RealModelScopeOnlineService } = require('./dist/services/realModelScopeOnlineService.js');

async function testAIFormatting() {
  console.log('🔍 开始测试AI输出格式化效果...\n');
  
  const service = new RealModelScopeOnlineService({
    apiKey: process.env.MODELSCOPE_API_KEY || 'ms-bf1291c1-c1ed-464c-b8d8-162fdee96180',
    modelId: process.env.MODELSCOPE_MODEL || 'ZhipuAI/GLM-4.6',
    baseUrl: process.env.MODELSCOPE_BASE_URL || 'https://api-inference.modelscope.cn/v1'
  });

  try {
    const result = await service.generateFortune('1996.02.10', '', 'bazi');
    
    console.log('=== AI输出测试结果 ===');
    console.log('✅ 成功:', result.success);
    console.log('📊 预测内容长度:', result.prediction.length, '字符');
    console.log('🎯 置信度:', result.confidence);
    console.log('📍 来源:', result.source);
    console.log('\n=== 预测内容 ===');
    console.log(result.prediction);
    
    // 检查是否包含思考过程标记
    const thinkingMarkers = ['让我想想', '我需要分析', '根据我的分析', '考虑到', '从...来看', '分析过程'];
    const hasThinkingProcess = thinkingMarkers.some(marker => result.prediction.includes(marker));
    
    console.log('\n=== 格式化检查 ===');
    console.log('包含思考过程标记:', hasThinkingProcess ? '❌ 是' : '✅ 否');
    
    if (hasThinkingProcess) {
      console.log('⚠️ AI输出仍包含思考过程，需要进一步优化');
    } else {
      console.log('✅ AI输出格式化良好，未包含思考过程');
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 运行测试
testAIFormatting();