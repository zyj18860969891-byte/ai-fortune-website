const axios = require('axios');

// 测试多个人八字分析功能
async function testMultiPersonAnalysis() {
  console.log('🧪 开始测试多个人八字分析功能...\n');
  
  const baseUrl = 'http://localhost:3000/api';
  
  // 测试用例1：单人八字分析（用户自己的出生信息）
  console.log('📝 测试用例1：单人八字分析');
  try {
    const response1 = await axios.post(`${baseUrl}/fortune/chat`, {
      question: '1996.02.10',
      type: 'bazi',
      context: '用户: 您好！我是八字命理AI占卜师。要进行准确的八字分析，请先提供您的出生日期（格式：1990.05.15 或 1990年5月15日），确认后会为您进行专业分析。\n用户: 1996.02.10',
      sessionId: 'test-session-001'
    });
    
    console.log('✅ 单人分析成功:', {
      hasBaziData: response1.data.hasBaziData,
      responseLength: response1.data.response?.length || 0
    });
    
    // 检查是否包含用户出生信息相关的分析
    const responseText = response1.data.response || '';
    if (responseText.includes('1996') || responseText.includes('丁火') || responseText.includes('丙子')) {
      console.log('✅ 响应包含用户出生信息分析');
    } else {
      console.log('⚠️ 响应可能未正确包含用户出生信息');
    }
    
  } catch (error) {
    console.log('❌ 单人分析失败:', error.message);
  }
  
  // 测试用例2：关系分析（询问另一个人）- 关键测试
  console.log('\n📝 测试用例2：关系分析 - 询问另一个人（关键测试）');
  try {
    const response2 = await axios.post(`${baseUrl}/fortune/chat`, {
      question: '我喜欢一个1989.07.18出生的女人，我们合适吗？',
      type: 'bazi',
      context: '用户: 您好！我是八字命理AI占卜师。要进行准确的八字分析，请先提供您的出生日期（格式：1990.05.15 或 1990年5月15日），确认后会为您进行专业分析。\n用户: 1996.02.10\n占卜师: 根据您的出生日期1996.02.10，我来为您分析...\n用户: 我喜欢一个1989.07.18出生的女人，我们合适吗？',
      sessionId: 'test-session-001' // 使用相同的sessionId来测试缓存
    });
    
    console.log('✅ 关系分析成功:', {
      hasBaziData: response2.data.hasBaziData,
      responseLength: response2.data.response?.length || 0
    });
    
    // 检查是否包含双人分析
    const responseText = response2.data.response || '';
    const hasSelfInfo = responseText.includes('1996') || responseText.includes('丁火') || responseText.includes('丙子');
    const hasOtherInfo = responseText.includes('1989') || responseText.includes('己土') || responseText.includes('己巳');
    const hasRelationship = responseText.includes('合婚') || responseText.includes('配对') || responseText.includes('合适') || responseText.includes('关系');
    
    console.log('🔍 分析结果检查:', {
      包含用户信息: hasSelfInfo,
      包含对方信息: hasOtherInfo,
      包含关系分析: hasRelationship
    });
    
    if (hasSelfInfo && hasOtherInfo && hasRelationship) {
      console.log('🎉 双人分析成功！系统正确保留了双方信息并进行了关系分析');
    } else if (hasOtherInfo && !hasSelfInfo) {
      console.log('❌ 问题：只分析了对方信息，丢失了用户原始信息（缓存被清除）');
    } else if (hasSelfInfo && !hasOtherInfo) {
      console.log('❌ 问题：只分析了用户信息，未识别对方信息');
    } else {
      console.log('❌ 问题：未正确进行双人分析');
    }
    
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
    
    const responseText = response3.data.response || '';
    const hasSelfInfo = responseText.includes('1996') || responseText.includes('丁火');
    const hasOtherInfo = responseText.includes('1989') || responseText.includes('己土');
    
    console.log('🔍 显式分析检查:', {
      包含用户信息: hasSelfInfo,
      包含对方信息: hasOtherInfo
    });
    
  } catch (error) {
    console.log('❌ 显式birthInfos失败:', error.message);
  }
  
  console.log('\n🎉 测试完成！');
  console.log('\n📋 预期结果：');
  console.log('- 测试用例1：应该使用用户的出生信息(1996.02.10)进行单人分析');
  console.log('- 测试用例2：应该识别为关系分析，提取对方出生信息(1989.07.18)，同时保留用户原始信息');
  console.log('- 测试用例3：应该直接使用显式提供的birthInfos进行双人分析');
  console.log('\n🔧 修复重点：');
  console.log('- 关系分析时不应清除用户的原始出生信息缓存');
  console.log('- 应该能够同时分析双方的八字信息');
  console.log('- 避免出现"如需进一步合婚分析，请提供你的出生信息"的错误提示');
}

// 运行测试
testMultiPersonAnalysis().catch(console.error);