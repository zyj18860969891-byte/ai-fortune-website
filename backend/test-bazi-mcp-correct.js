// 正确的MCP服务调用方式：需要先初始化
async function testNewBaziMcpService() {
  console.log('🔮 测试新的@cantian-ai/Bazi-MCP服务...');
  
  const baseUrl = 'https://mcp.api-inference.modelscope.net/6a57768488dc47/mcp';
  
  try {
    console.log('📡 尝试连接新的在线服务:', baseUrl);
    
    // 第一步：MCP初始化
    const initResponse = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: {
            name: 'test-client',
            version: '1.0.0'
          }
        }
      }),
      timeout: 10000
    });
    
    console.log('📊 MCP初始化响应状态:', initResponse.status);
    
    if (!initResponse.ok) {
      const errorText = await initResponse.text();
      console.error('❌ MCP初始化失败:', initResponse.status, errorText);
      return { available: false, error: 'init-failed', status: initResponse.status };
    }
    
    const initData = await initResponse.json();
    console.log('✅ MCP初始化成功:', initData);
    
    // 获取mcp-session-id
    const mcpSessionId = initData.result?.serverInfo?.id || 'mcp-session-' + Date.now();
    console.log('🔑 获取MCP会话ID:', mcpSessionId);
    
    // 第二步：使用MCP会话调用工具
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
    
    const toolsResponse = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'mcp-session-id': mcpSessionId
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name: 'calculate_bazi',
          arguments: {
            birth_data: testBirthData,
            analysis_type: 'complete'
          }
        }
      })
    });
    
    if (toolsResponse.ok) {
      const toolsData = await toolsResponse.json();
      console.log('✅ 八字计算成功:', JSON.stringify(toolsData, null, 2));
      
      return { available: true, result: toolsData, sessionId: mcpSessionId };
    } else {
      const errorText = await toolsResponse.text();
      console.error('❌ 八字计算失败:', toolsResponse.status, errorText);
      return { available: false, error: 'calculate-failed', status: toolsResponse.status };
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
      console.log('✅ MCP会话ID:', result.sessionId);
      console.log('✅ 现在可以集成到fortune.ts中了');
      
      // 保存会话ID供后续使用
      console.log('\n💡 MCP集成要点:');
      console.log('1. 必须先调用initialize方法');
      console.log('2. 使用返回的sessionId进行后续调用');
      console.log('3. 每次调用都要带上mcp-session-id头部');
      console.log('4. 使用tools/call方法调用具体功能');
      
    } else {
      console.log('\n❌ 新的@cantian-ai/Bazi-MCP服务仍然不可用');
      console.log('💡 请检查服务配置或联系服务提供商');
    }
  } catch (error) {
    console.error('❌ 测试过程出现错误:', error.message);
  }
}

runTest();