// 使用Node.js内置的fetch API
async function testNewBaziMcpService() {
  console.log('🔮 测试新的@cantian-ai/Bazi-MCP服务...');
  
  const baseUrl = 'https://mcp.api-inference.modelscope.net/6a57768488dc47/mcp';
  
  try {
    console.log('📡 尝试连接新的在线服务:', baseUrl);
    
    // 测试健康检查
    const healthResponse = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'health_check',
        params: {}
      }),
      timeout: 10000
    });
    
    console.log('📊 健康检查响应状态:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ 新在线服务健康:', healthData);
      
      // 测试八字计算
      console.log('\n🔮 测试八字计算功能...');
      
      const testBirthData = {
        year: 1990,
        month: 5,
        day: 15,
        hour: 10,
        minute: 30,
        gender: 'male',
        timezone: 'Asia/Shanghai'
      };
      
      const calculateResponse = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'calculate_bazi',
          params: {
            birth_data: testBirthData,
            analysis_type: 'complete'
          }
        })
      });
      
      if (calculateResponse.ok) {
        const calculateData = await calculateResponse.json();
        console.log('✅ 新八字计算成功:', JSON.stringify(calculateData, null, 2));
        
        return { available: true, result: calculateData };
      } else {
        const errorText = await calculateResponse.text();
        console.error('❌ 新八字计算失败:', calculateResponse.status, errorText);
        return { available: false, error: 'calculate-failed', status: calculateResponse.status };
      }
      
    } else {
      const errorText = await healthResponse.text();
      console.error('❌ 新在线服务不可用:', healthResponse.status, errorText);
      return { available: false, error: errorText, status: healthResponse.status };
    }
    
  } catch (error) {
    console.error('❌ 新在线服务连接失败:', error.message);
    return { available: false, error: error.message };
  }
}

async function runTest() {
  try {
    const result = await testNewBaziMcpService();
    if (result.available) {
      console.log('\n🎉 新的@cantian-ai/Bazi-MCP服务可用！');
      console.log('✅ 现在可以集成到fortune.ts中了');
    } else {
      console.log('\n❌ 新的@cantian-ai/Bazi-MCP服务仍然不可用');
      console.log('💡 请检查服务配置或联系服务提供商');
    }
  } catch (error) {
    console.error('❌ 测试过程出现错误:', error.message);
  }
}

runTest();