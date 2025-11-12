const axios = require('axios');

async function testBaziAPI() {
  console.log('🧪 测试修复后的八字API...');
  
  try {
    const response = await axios.post('http://localhost:3001/api/fortune/chat', {
      question: '1990年5月15日 上午10点 男',
      type: 'bazi',
      context: '',
      sessionId: 'test-session-' + Date.now()
    });
    
    console.log('✅ API测试成功!');
    console.log('📄 响应数据:', JSON.stringify(response.data, null, 2));
    
    // 检查响应结构
    if (response.data.hasBaziData === false) {
      console.log('🔍 检测到缺少八字数据，引导用户输入');
    } else if (response.data.response) {
      console.log('🔮 收到八字分析响应');
    }
    
  } catch (error) {
    console.error('❌ API测试失败:', error.message);
    if (error.response) {
      console.error('📄 错误响应:', error.response.data);
    }
  }
}

testBaziAPI();