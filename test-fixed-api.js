const axios = require('axios');

async function testFixedBaziAPI() {
  console.log('🧪 测试修复后的八字API...');
  
  // 测试1: 输入单个数字（应该不识别为出生信息）
  try {
    console.log('📋 测试1: 输入单个数字 "1"');
    const response1 = await axios.post('http://localhost:3001/api/fortune/chat', {
      question: '1',
      type: 'bazi',
      context: '',
      sessionId: 'test-session-1'
    }, { timeout: 15000 });
    
    console.log('✅ 测试1成功!');
    console.log('📄 hasBaziData:', response1.data.hasBaziData);
    console.log('📄 响应预览:', response1.data.response?.substring(0, 100) + '...');
    
  } catch (error) {
    console.error('❌ 测试1失败:', error.message);
    if (error.response) {
      console.error('📄 状态码:', error.response.status);
    }
  }
  
  // 测试2: 输入完整的出生信息
  try {
    console.log('\n📋 测试2: 输入完整出生信息');
    const response2 = await axios.post('http://localhost:3001/api/fortune/chat', {
      question: '1996年2月10日 上午10点 男',
      type: 'bazi',
      context: '',
      sessionId: 'test-session-2'
    }, { timeout: 20000 });
    
    console.log('✅ 测试2成功!');
    console.log('📄 hasBaziData:', response2.data.hasBaziData);
    console.log('📄 响应长度:', response2.data.response?.length);
    
  } catch (error) {
    console.error('❌ 测试2失败:', error.message);
    if (error.response) {
      console.error('📄 状态码:', error.response.status);
      console.error('📄 错误信息:', error.response.data);
    }
  }
}

testFixedBaziAPI();