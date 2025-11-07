const { RealModelScopeOnlineService } = require('./dist/services/realModelScopeOnlineService');

async function testIntelligentChat() {
  console.log('🧪 开始测试智能对话能力...');
  
  const service = new RealModelScopeOnlineService({
    apiKey: process.env.MODELSCOPE_API_KEY || 'ms-bf1291cf6541b27f1b8e4d41a7b4b5c6d7e8f9g0',
    modelId: process.env.MODELSCOPE_MODEL || 'qwen/Qwen2.5-Coder-32B-Instruct',
    baseUrl: process.env.MODELSCOPE_BASE_URL || 'https://api-inference.modelscope.cn/v1'
  });

  // 测试不同类型的问题
  const questions = [
    '本月财运如何？',
    '我的事业运势怎么样？', 
    '感情方面有什么建议？',
    '什么时候能遇到合适的人？',
    '健康需要注意什么？'
  ];

  console.log('🎯 测试配置:', {
    modelId: service.config.modelId,
    baseUrl: service.config.baseUrl,
    apiKeyPrefix: service.config.apiKey.substring(0, 10) + '...'
  });

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    console.log(`\n❓ 测试 ${i+1}/${questions.length}: ${question}`);
    console.log('─'.repeat(50));
    
    try {
      const result = await service.generateFortune(question);
      
      console.log('📊 结果分析:', {
        success: result.success,
        confidence: result.confidence,
        processingTime: `${result.processingTime}ms`,
        source: result.source,
        apiStatus: result.apiStatus
      });
      
      console.log('🎯 AI回答预览:');
      console.log('='.repeat(50));
      console.log(result.prediction.substring(0, 300) + (result.prediction.length > 300 ? '...' : ''));
      console.log('='.repeat(50));
      
      console.log('💡 建议:');
      console.log(result.advice.substring(0, 150) + (result.advice.length > 150 ? '...' : ''));
      
      console.log('🍀 幸运元素:', result.luckyElements.join(', '));
      
      // 等待2秒避免API限制
      if (i < questions.length - 1) {
        console.log('⏳ 等待2秒...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
    } catch (error) {
      console.error('❌ 测试失败:', error.message);
    }
  }

  console.log('\n🎉 测试完成!');
  
  // 测试健康检查
  console.log('\n🏥 测试健康检查...');
  const health = await service.healthCheck();
  console.log('📋 健康状态:', health);
}

testIntelligentChat().catch(console.error);