const { ModelScopeService } = require('./dist/services/modelscope');

async function testPrompts() {
  console.log('开始测试优化后的提示词...');
  
  const modelService = new ModelScopeService({
    apiKey: process.env.MODELSCOPE_TOKEN || 'your-token',
    modelId: process.env.MODELSCOPE_MODEL_ID || 'Qwen/Qwen2.5-Coder-32B-Instruct',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1'
  });

  const testQuestions = [
    {
      question: '我最近事业不顺，想知道什么时候会好转？',
      type: 'bazi'
    },
    {
      question: '我想了解我的感情运势如何？',
      type: 'tarot'
    },
    {
      question: '我的星座运势怎么样？',
      type: 'astrology'
    },
    {
      question: '我的生命数字是什么意思？',
      type: 'numerology'
    }
  ];

  for (const test of testQuestions) {
    console.log(`\n=== 测试 ${test.type} 占卜 ===`);
    console.log(`问题: ${test.question}`);
    
    try {
      const result = await modelService.generateFortune(test.question, test.type);
      console.log('预测结果:', result.prediction);
      console.log('建议:', result.advice);
      console.log('幸运元素:', result.luckyElements);
      console.log('置信度:', result.confidence);
      console.log('---');
    } catch (error) {
      console.error('测试失败:', error.message);
    }
  }
}

testPrompts().catch(console.error);