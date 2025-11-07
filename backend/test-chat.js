const axios = require('axios');

async function testChat() {
  console.log('开始测试聊天界面...');
  
  const url = 'http://localhost:3001/fortune/chat';
  const testData = [
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
  
  for (const data of testData) {
    console.log(`\n=== 测试 ${data.type} 聊天 ===`);
    console.log(`问题: ${data.question}`);
    
    try {
      const response = await axios.post(url, data);
      console.log('预测结果:', response.data.prediction);
      console.log('建议:', response.data.advice);
      console.log('幸运元素:', response.data.luckyElements);
      console.log('置信度:', response.data.confidence);
      console.log('---');
    } catch (error) {
      console.error('测试失败:', error.message);
    }
  }
}

testChat().catch(console.error);