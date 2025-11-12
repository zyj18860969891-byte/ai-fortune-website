const axios = require('axios');

// 测试多个人八字分析功能
async function testMultiPersonAnalysis() {
  console.log('🧪 开始测试多个人八字分析功能...\n');
  
  const baseUrl = 'http://localhost:3000/api';
  
  // 测试用例1：单人八字分析（用户自己的出生信息）
  console.log('📝 测试用例1：单人八字分析');
  try {
    const response1 = await axios.post(`${baseUrl}/fortune/chat`, {
      question: '我叫张三，1996.02.10出生，能帮我分析一下今年的运势吗？',
      type: 'bazi',
      context: '用户: 您好！我是八字命理AI占卜师。要进行准确的八字分析，请先提供您的出生日期（格式：1990.05.15 或 1990年5月15日），确认后会为您进行专业分析。\n用户: 我叫张三，1996.02.10出生，能帮我分析一下今年的运势吗？',
      sessionId: 'test-session-001'
    });
    
    console.log('✅ 单人分析成功:', {
      hasBaziData: response1.data.hasBaziData,
      responseLength: response1.data.response?.length || 0
    });
  } catch (error) {
    console.log('❌ 单人分析失败:', error.message);
  }
  
  // 测试用例2：关系分析（询问另一个人）
  console.log('\n📝 测试用例2：关系分析 - 询问另一个人');
  try {
    const response2 = await axios.post(`${baseUrl}/fortune/chat`, {
      question: '我喜欢一个1989.07.18出生的女人，我们合适吗？',
      type: 'bazi',
      context: '用户: 您好！我是八字命理AI占卜师。要进行准确的八字分析，请先提供您的出生日期（格式：1990.05.15 或 1990年5月15日），确认后会为您进行专业分析。\n用户: 我叫张三，1996.02.10出生，能帮我分析一下今年的运势吗？\n占卜师: 根据您的出生日期1996.02.10，我来为您分析今年的运势...\n用户: 我喜欢一个1989.07.18出生的女人，我们合适吗？',
      sessionId: 'test-session-001' // 使用相同的sessionId来测试缓存
    });
    
    console.log('✅ 关系分析成功:', {
      hasBaziData: response2.data.hasBaziData,
      responseLength: response2.data.response?.length || 0
    });
  } catch (error) {
    console.log('❌ 关系分析失败:', error.message);
  }
  
  // 测试用例3：显式发送birthInfos（前端新功能）
  console.log('\n📝 测试用例3：显式发送birthInfos');
  try {
    const response3 = await axios.post(`${baseUrl}/fortune/chat`, {
      question: '我和她合适吗？',
      type: 'bazi',
      birthInfos: {
        self: {
          year: 1996,
          month: 2,
          day: 10,
          hour: 0,
          minute: 0,
          gender: 'male',
          timezone: 'Asia/Shanghai'
        },
        other: {
          year: 1989,
          month: 7,
          day: 18,
          hour: 0,
          minute: 0,
          gender: 'female',
          timezone: 'Asia/Shanghai'
        }
      },
      context: '用户: 我和她合适吗？',
      sessionId: 'test-session-002'
    });
    
    console.log('✅ 显式birthInfos成功:', {
      hasBaziData: response3.data.hasBaziData,
      responseLength: response3.data.response?.length || 0
    });
  } catch (error) {
    console.log('❌ 显式birthInfos失败:', error.message);
  }
  
  console.log('\n🎉 测试完成！');
  console.log('\n📋 预期结果：');
  console.log('- 测试用例1：应该使用用户的出生信息(1996.02.10)进行单人分析');
  console.log('- 测试用例2：应该识别为关系分析，提取对方出生信息(1989.07.18)，同时保留用户原始信息');
  console.log('- 测试用例3：应该直接使用显式提供的birthInfos进行双人分析');
}

// 运行测试
testMultiPersonAnalysis().catch(console.error);