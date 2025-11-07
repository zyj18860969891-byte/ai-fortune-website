// 测试完整的聊天接口，包括MCP + AI格式化
const axios = require('axios');

async function testCompleteChat() {
  console.log('🔍 测试完整的聊天接口...\n');
  
  try {
    const response = await axios.post('http://localhost:3001/api/fortune/chat', {
      question: '1996.02.10',
      type: 'bazi',
      context: '',
      birthInfo: {
        year: 1996,
        month: 2,
        day: 10,
        hour: 0,
        minute: 0,
        gender: 'male',
        timezone: 'Asia/Shanghai'
      }
    }, {
      timeout: 45000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('=== 完整聊天接口测试结果 ===');
    console.log('✅ HTTP状态:', response.status);
    console.log('✅ 成功状态:', response.data.success);
    console.log('📊 响应长度:', response.data.response?.length || 0, '字符');
    console.log('🎯 来源:', response.data.source);
    console.log('📅 是否有八字数据:', response.data.hasBaziData);
    console.log('\n=== 响应内容 ===');
    console.log(response.data.response);
    
    // 检查是否包含思考过程标记
    const thinkingMarkers = ['让我想想', '我需要分析', '根据我的分析', '考虑到', '从...来看', '分析过程', '拆解请求'];
    const hasThinkingProcess = thinkingMarkers.some(marker => response.data.response?.includes(marker));
    
    console.log('\n=== 格式化检查 ===');
    console.log('包含思考过程标记:', hasThinkingProcess ? '❌ 是' : '✅ 否');
    
    if (hasThinkingProcess) {
      console.log('⚠️ AI输出仍包含思考过程，需要进一步优化');
    } else {
      console.log('✅ AI输出格式化良好，未包含思考过程');
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ 连接被拒绝，请确保后端服务正在运行');
      console.log('请先启动服务：cd backend && npm start');
    } else if (error.response) {
      console.error('❌ HTTP错误:', error.response.status);
      console.error('❌ 错误详情:', error.response.data);
    } else {
      console.error('❌ 请求失败:', error.message);
    }
  }
}

// 运行测试
testCompleteChat();